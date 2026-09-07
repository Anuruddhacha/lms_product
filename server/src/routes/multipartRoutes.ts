import { Request, Response } from "express";
import AWS from "aws-sdk";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// --- add these imports ---
import { S3Client, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import express from "express";

// --- add this S3 client + bucket name (envs must be set) ---
const s3Cli = new S3Client({ region: process.env.AWS_REGION });
const Bucket = process.env.S3_BUCKET_NAME as string;

const router = express.Router();

// --- add these three routes ---

// POST /api/multipart/start
router.post("/multipart/start", async (req: Request, res: Response) => {
  try {
    const { fileName, fileType } = req.body;
    const videoId = uuidv4();
    const ext = path.extname(fileName);
    const Key = `videos/raw/${videoId}${ext}`;
    const out = await s3Cli.send(
      new CreateMultipartUploadCommand({
        Bucket,
        Key,
        ContentType: fileType,
      })
    );
    res.json({ uploadId: out.UploadId, key: Key });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "start_failed" });
  }
});

// POST /api/multipart/part-urls
router.post("/multipart/part-urls", async (req: Request, res: Response) => {
  try {
    const { uploadId, key, partNumbers } = req.body;
    const urls: Record<number, string> = {};
    await Promise.all(
      partNumbers.map(async (PartNumber: number) => {
        const cmd = new UploadPartCommand({
          Bucket,
          Key: key,
          UploadId: uploadId,
          PartNumber,
        });
        urls[PartNumber] = await getSignedUrl(s3Cli, cmd, { expiresIn: 3600 });
      })
    );
    res.json({ urls });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "urls_failed" });
  }
});

// POST /api/multipart/complete
router.post("/multipart/complete", async (req: Request, res: Response) => {
  try {
    const { uploadId, key, parts } = req.body;
    const out = await s3Cli.send(
      new CompleteMultipartUploadCommand({
        Bucket,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: parts.map((p: any) => ({
            ETag: p.ETag,
            PartNumber: p.PartNumber,
          })),
        },
      })
    );
    // out.Location is the S3 URL for the raw upload; use your CDN if you prefer

    //res.json({ videoUrl: out.Location });

    // Prefer CloudFront URL over S3 URL
    const cdn = process.env.CLOUDFRONT_DOMAIN?.replace(/\/+$/, ""); // trim trailing '/'

    // `key` is videos/raw/{videoId}{ext}; an external pipeline transcodes
    // the raw upload to HLS and writes it to
    // videos/hls/{videoId}/{videoId}.m3u8 (master playlist). Point the
    // returned videoUrl at that future HLS location instead of the raw file.
    const videoId = path.basename(String(key), path.extname(String(key)));
    const hlsKeyPath = `videos/hls/${videoId}/${videoId}.m3u8`;

    // encodeURI keeps '/' but safely encodes spaces and other characters
    const cdnUrl = cdn ? `${cdn}/${encodeURI(hlsKeyPath)}` : undefined;

    res.json({
      videoUrl: cdnUrl ?? out.Location, // fallback to S3 if env not set
    });
    
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "complete_failed" });
  }
});

export default router;