import { Request, Response } from "express";
import AWS from "aws-sdk";

const s3 = new AWS.S3();

/**
 * Extract the S3 key from a full CloudFront or S3 URL.
 */
function extractS3KeyFromUrl(url: string): string {
  const urlObj = new URL(url);
  // Strip ALL leading slashes, not just one — a trailing slash on
  // CLOUDFRONT_DOMAIN (e.g. courseController.ts's getUploadVideoUrl
  // doesn't trim it) produces a double-slash path like
  // "//videos/hls/...", and slicing off only one slash would leave a
  // leading "/" that doesn't match the real S3 key, silently
  // targeting the wrong (nonexistent) object.
  const rawKey = urlObj.pathname.replace(/^\/+/, "");
  return decodeURIComponent(rawKey); // 💥 decode %20 to space
}

/**
 * Controller to delete any S3 object by its full URL.
 * POST /api/delete-object
 * Body: { url: "https://cdn.example.com/path/to/file.mp4" }
 */
export const deleteS3ObjectByUrl = async (req: Request, res: Response): Promise<void> => {
  const { url } = req.body;

  if (!url) {
    res.status(400).json({ message: "URL is required" });
  }

  try {
    const key = extractS3KeyFromUrl(url);
    console.log("Extracted S3 Key:", key);
    console.log(key)

    await s3
      .deleteObject({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
      })
      .promise();

    res.status(200).json({ message: "Object deleted successfully", data: { key } });
  } catch (error) {
    console.error("Error deleting S3 object:", error);
    res.status(500).json({ message: "Failed to delete object", error });
  }
};

/**
 * Derive the videoId from an HLS master playlist URL:
 * .../videos/hls/{videoId}/{videoId}.m3u8
 */
function extractVideoIdFromHlsUrl(url: string): string | undefined {
  const key = extractS3KeyFromUrl(url);
  const match = key.match(/^videos\/hls\/([^/]+)\//);
  return match?.[1];
}

/**
 * Delete every object under an S3 prefix, handling pagination
 * (listObjectsV2 and deleteObjects both cap at 1000 keys per call).
 */
async function deletePrefix(Bucket: string, Prefix: string, deletedKeys: string[]): Promise<void> {
  let ContinuationToken: string | undefined;

  do {
    const listed = await s3
      .listObjectsV2({ Bucket, Prefix, ContinuationToken })
      .promise();

    const objects = (listed.Contents ?? [])
      .map((obj) => obj.Key)
      .filter((key): key is string => !!key)
      .map((Key) => ({ Key }));

    if (objects.length > 0) {
      const { Deleted } = await s3
        .deleteObjects({ Bucket, Delete: { Objects: objects, Quiet: false } })
        .promise();

      deletedKeys.push(...(Deleted ?? []).map((d) => d.Key).filter((k): k is string => !!k));
    }

    ContinuationToken = listed.IsTruncated ? listed.NextContinuationToken : undefined;
  } while (ContinuationToken);
}

/**
 * Controller to delete all S3 assets for a video: the raw source
 * (videos/raw/{videoId}.*) and the entire HLS output prefix
 * (videos/hls/{videoId}/ — master playlist, variant playlists, and
 * every segment), not just the single master playlist key.
 *
 * POST /s3objects/delete-video-assets
 * Body: { videoId: "abc123" } OR { url: "https://cdn.example.com/videos/hls/abc123/abc123.m3u8" }
 */
export const deleteVideoAssets = async (req: Request, res: Response): Promise<void> => {
  const { videoId, url } = req.body;

  const id = videoId || (url ? extractVideoIdFromHlsUrl(url) : undefined);

  if (!id && !url) {
    res.status(400).json({ message: "videoId or a valid url is required" });
    return;
  }

  const Bucket = process.env.S3_BUCKET_NAME!;
  const deletedKeys: string[] = [];

  try {
    if (id) {
      // Entire HLS output folder: master + variant playlists + all segments
      await deletePrefix(Bucket, `videos/hls/${id}/`, deletedKeys);

      // Raw source — prefix match since the original extension isn't known here
      await deletePrefix(Bucket, `videos/raw/${id}`, deletedKeys);
    } else {
      // Legacy chapter uploaded before the HLS migration: `url` doesn't
      // match videos/hls/{id}/... or videos/raw/{id}, it's just a single
      // object at its own key (e.g. videos/{uuid}/{filename}.mp4).
      // Delete that object directly instead of 400ing — otherwise every
      // pre-migration chapter/section becomes permanently undeletable.
      const key = extractS3KeyFromUrl(url);
      await s3.deleteObject({ Bucket, Key: key }).promise();
      deletedKeys.push(key);
    }

    res.status(200).json({
      message: "Video assets deleted successfully",
      data: { videoId: id ?? null, deletedCount: deletedKeys.length, deletedKeys },
    });
  } catch (error) {
    console.error("Error deleting video assets:", error);
    res.status(500).json({ message: "Failed to delete video assets", error });
  }
};
