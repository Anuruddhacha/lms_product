import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as z from "zod";
import { api } from "../state/api";
import { toast } from "sonner";
import { useState } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert cents to formatted currency string (e.g., 4999 -> "$49.99")
export function formatPrice(cents: number | undefined): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format((cents || 0) / 100);
}



// Convert dollars to cents (e.g., "49.99" -> 4999)
export function dollarsToCents(dollars: string | number): number {
  const amount = typeof dollars === "string" ? parseFloat(dollars) : dollars;
  return Math.round(amount * 100);
}

// Convert cents to dollars (e.g., 4999 -> "49.99")
export function centsToDollars(cents: number | undefined): string {
  return ((cents || 0) / 100).toString();
}

// Zod schema for price input (converts dollar input to cents)
export const priceSchema = z.string().transform((val) => {
  const dollars = parseFloat(val);
  if (isNaN(dollars)) return "0";
  return dollarsToCents(dollars).toString();
});

export const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Congo-Brazzaville)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor (Timor-Leste)",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar (formerly Burma)",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

export const customStyles = "text-gray-300 placeholder:text-gray-500";

export function convertToSubCurrency(amount: number, factor = 100) {
  return Math.round(amount * factor);
}

export const NAVBAR_HEIGHT = 48;

export const courseCategories = [
  { value: "Computer Science", label: "Computer Science" },
  { value: "Artificial Intelligence", label: "Artificial Intelligence" },
  { value: "Web Development", label: "Web Development" },
  { value: "Data Science", label: "Data Science" },
  { value: "Mobile Development", label: "Mobile Development" },
] as const;

export const customDataGridStyles = {
  border: "none",
  backgroundColor: "#ffffff",
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#f8fafc",
    color: "#475569",
    "& [role='row'] > *": {
      backgroundColor: "#f8fafc !important",
      border: "none !important",
    },
  },
  "& .MuiDataGrid-cell": {
    color: "#334155",
    border: "none !important",
    borderBottom: "1px solid #e2e8f0 !important",
  },
  "& .MuiDataGrid-row": {
    backgroundColor: "#ffffff",
    "&:hover": {
      backgroundColor: "#f1f5f9",
    },
  },
  "& .MuiDataGrid-footerContainer": {
    backgroundColor: "#ffffff",
    color: "#475569",
    border: "none !important",
    borderTop: "1px solid #e2e8f0 !important",
  },
  "& .MuiDataGrid-filler": {
    border: "none !important",
    backgroundColor: "#ffffff !important",
    borderTop: "none !important",
    "& div": {
      borderTop: "none !important",
    },
  },
  "& .MuiTablePagination-root": {
    color: "#475569",
  },
  "& .MuiTablePagination-actions .MuiIconButton-root": {
    color: "#475569",
  },
};

export const createCourseFormData2 = (
  data: CourseFormData,
  sections: Section[],
  updatedResources: UploadedResource[],
  zoomLinks: CustomLink[],
  youtubeLinks: CustomLink[]
): FormData => {
  const formData = new FormData();
  formData.append("title", data.courseTitle);
  formData.append("description", data.courseDescription);
  formData.append("category", data.courseCategory);
  formData.append("price", data.coursePrice.toString());
  formData.append("status", data.courseStatus ? "Published" : "Draft");

  const sectionsWithVideos = sections.map((section) => ({
    ...section,
    chapters: section.chapters.map((chapter) => ({
      ...chapter,
      video: chapter.video,
    })),
  }));

  formData.append("sections", JSON.stringify(sectionsWithVideos));
  
  //Append resources to form data
  formData.append("uploadedResources", JSON.stringify(updatedResources));
  formData.append("zoomLinks", JSON.stringify(zoomLinks));
  formData.append("youtubeLinks", JSON.stringify(youtubeLinks));


  return formData;
};



export const createCourseFormData = (
  data: CourseFormData,
  sections: Section[],
  updatedResources: UploadedResource[], // course-wide resources (not inside sections)
  zoomLinks: CustomLink[],
  youtubeLinks: CustomLink[]
): FormData => {
  const formData = new FormData();

  formData.append("title", data.courseTitle);
  formData.append("description", data.courseDescription);
  formData.append("category", data.courseCategory);
  formData.append("price", data.coursePrice.toString());
  formData.append("status", data.courseStatus ? "Published" : "Draft");

  // Map sections preserving their own resources and removing raw File objects in videos
  const sectionsWithResources = sections.map((section) => ({
    ...section,
    chapters: section.chapters.map((chapter) => {
      const chapterCopy = { ...chapter };
      if (chapterCopy.video instanceof File) {
        delete chapterCopy.video; // Remove raw File if not replaced with URL
      }
      return chapterCopy;
    }),
    // Keep uploaded resources attached to each section as-is
    resources: section.resources?.map((res) => ({
      fileName: res.fileName,
      fileType: res.fileType,
      fileUrl: res.fileUrl,
    })) || [],
  }));

  formData.append("sections", JSON.stringify(sectionsWithResources));

  // Append course-wide uploaded resources separately
  formData.append("uploadedResources", JSON.stringify(updatedResources));

  formData.append("zoomLinks", JSON.stringify(zoomLinks));
  formData.append("youtubeLinks", JSON.stringify(youtubeLinks));

  return formData;
};




export const uploadAllResources = async (
  resources: Resource[],
  courseId: string,
  getUploadUrlFn: any, // usually RTK Query mutation trigger
  onProgress?: (progress: number) => void,
  onFile?: (fileName: string) => void
): Promise<UploadedResource[]> => {
  const uploaded: UploadedResource[] = [];

  for (const element of resources) {
    const { file, fileName, fileType } = element;

    try {
      onFile?.(fileName);

      // get signed URL for current file
      const response = await getUploadUrlFn({
        courseId,
        fileName: `${courseId}_${Date.now()}_${fileName}`,
        fileType,
      }).unwrap();

      console.log("Upload Resource URL response:", response);

      const { uploadUrl, resourceUrl: fileUrl } = response;

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            onProgress?.(percent);
          }
        });

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status < 300) {
              resolve();
            } else {
              reject(`Upload failed for ${fileName}`);
            }
          }
        };

        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader("Content-Type", fileType);
        xhr.send(file);
      });

      uploaded.push({ fileName, fileType, fileUrl });
    } catch (err) {
      console.error(`Failed to upload resource "${fileName}":`, err);
    }
  }

  return uploaded;
};


export const uploadAllVideos = async (
  localSections: Section[],
  courseId: string,
  getUploadVideoUrl: any,
  onProgress?: (progress: number) => void,
  onChapter?: (chapterTitle: string) => void
) => {
  const updatedSections = localSections.map((section) => ({
    ...section,
    chapters: section.chapters.map((chapter) => ({
      ...chapter,
    })),
  }));

  for (let i = 0; i < updatedSections.length; i++) {
    for (let j = 0; j < updatedSections[i].chapters.length; j++) {
      const chapter = updatedSections[i].chapters[j];
      if (chapter.video instanceof File && chapter.video.type === "video/mp4") {
        try {

          const updatedChapter = await uploadVideoXMLHTTP(
            chapter,
            courseId,
            updatedSections[i].sectionId,
            getUploadVideoUrl,
            onProgress,
            onChapter
          )
          updatedSections[i].chapters[j] = updatedChapter;
        } catch (error) {
          console.error(
            `Failed to upload video for chapter ${chapter.chapterId}:`,
            error
          );
        }
      }
    }
  }

  return updatedSections;
};

async function uploadVideo(//upload to s3
  chapter: Chapter,
  courseId: string,
  sectionId: string,
  getUploadVideoUrl: any
) {
  const file = chapter.video as File;
  console.log("Uploading video to S3:", file.name);
  try {
    const { uploadUrl, videoUrl } = await getUploadVideoUrl({
      courseId,
      sectionId,
      chapterId: chapter.chapterId,
      fileName: file.name,
      fileType: file.type,
    }).unwrap();
  
    console.log("upload file size " + file.size)
    console.log("Video Url ======= ", videoUrl);

    await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });
    toast.success(
      `Video uploaded successfully for chapter ${chapter.chapterId}`
    );

    return { ...chapter, video: videoUrl };
  } catch (error) {
    console.error(
      `Failed to upload video for chapter ${chapter.chapterId}:`,
      error
    );
    throw error;
  }
}

/*async function uploadVideoXMLHTTP(
  chapter: Chapter,
  courseId: string,
  sectionId: string,
  getUploadVideoUrl: any,
  onProgress?: (progress: number) => void, // optional callback
  onChapter?: (chapterTitle: string) => void // optional callback
) {
  const file = chapter.video as File;
  console.log("Uploading video to S3:", file.name);

  try {
    const { uploadUrl, videoUrl } = await getUploadVideoUrl({
      courseId,
      sectionId,
      chapterId: chapter.chapterId,
      fileName: file.name,
      fileType: file.type,
    }).unwrap();

    console.log("Upload file size:", file.size);
    if (onChapter) {
      onChapter(chapter.title);
    }

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl, true);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error("Upload failed"));
      xhr.send(file);
    });

    toast.success(
      `Video uploaded successfully for chapter ${chapter.chapterId}`
    );

    return { ...chapter, video: videoUrl };
  } catch (error) {
    console.error(
      `Failed to upload video for chapter ${chapter.chapterId}:`,
      error
    );
    throw error;
  }
}*/

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;


type GetMultipartStart = (args: {
  courseId: string;
  sectionId: string;
  chapterId: string;
  fileName: string;
  fileType: string;
}) => Promise<{ uploadId: string; key: string }>;

type GetMultipartPartUrls = (args: {
  uploadId: string;
  key: string;
  partNumbers: number[];
  fileType: string;
}) => Promise<{ urls: Record<number, string> }>;

type CompleteMultipart = (args: {
  uploadId: string;
  key: string;
  parts: { PartNumber: number; ETag: string }[];
}) => Promise<{ videoUrl: string }>;

type AbortMultipart = (args: { uploadId: string; key: string }) => Promise<void>;

interface MultipartApi {
  start: GetMultipartStart;
  getPartUrls: GetMultipartPartUrls;
  complete: CompleteMultipart;
  abort?: AbortMultipart;
}

/**
 * Same signature + one optional param for multipart.
 * - <= 5GB: single PUT using your existing presigned URL endpoint
 * - >  5GB: multipart with progress aggregation
 */
// 5 GB in bytes (S3 single-PUT max size)
const FIVE_GB = 5 * 1024 * 1024 * 1024;

async function uploadVideoXMLHTTP(
  chapter: Chapter,
  courseId: string,
  sectionId: string,
  getUploadVideoUrl: any, // single-PUT presigner (your existing one)
  onProgress?: (progress: number) => void,
  onChapter?: (chapterTitle: string) => void
) {
  const file = chapter.video as File;
  if (!file) throw new Error("No file to upload");

  console.log("Uploading video to S3:", file.name, "size:", file.size);
  if (onChapter) onChapter(chapter.title);

  // ---------- Single PUT path (<= 5GB) ----------
  if (file.size <= FIVE_GB) {
    try {
      const { uploadUrl, videoUrl } = await getUploadVideoUrl({
        courseId,
        sectionId,
        chapterId: chapter.chapterId,
        fileName: file.name,
        fileType: file.type,
      }).unwrap();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader("Content-Type", file.type);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        };

        xhr.onload = () =>
          xhr.status >= 200 && xhr.status < 300
            ? resolve()
            : reject(new Error(`Upload failed with status ${xhr.status}`));

        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.send(file);
      });

      toast.success(`Video uploaded successfully for chapter ${chapter.chapterId}`);
      return { ...chapter, video: videoUrl };
    } catch (error) {
      console.error(`Failed to upload video for chapter ${chapter.chapterId}:`, error);
      throw error;
    }
  } 

  // ---------- Multipart path (> 5GB) ----------
  try {
    // 1) Start multipart
    const startRes = await fetch(`${API_BASE}/api/multipart/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        sectionId,
        chapterId: chapter.chapterId,
        fileName: file.name,
        fileType: file.type,
      }),
    });
    const { uploadId, key } = await startRes.json();

    const PART_SIZE = 16 * 1024 * 1024; // 16MB
    const parts: { PartNumber: number; start: number; end: number }[] = [];
    for (let part = 1, start = 0; start < file.size; part++) {
      const end = Math.min(start + PART_SIZE, file.size);
      parts.push({ PartNumber: part, start, end });
      start = end;
    }

    // 2) Get presigned part URLs
    const urlRes = await fetch(`${API_BASE}/api/multipart/part-urls`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uploadId,
        key,
        partNumbers: parts.map((p) => p.PartNumber),
        fileType: file.type,
      }),
    });
    const { urls } = await urlRes.json();

    let uploadedBytes = 0;
    const completed: { PartNumber: number; ETag: string }[] = [];

    // Upload parts sequentially/concurrently with progress
    for (const p of parts) {
      await new Promise<void>((resolve, reject) => {
        const blob = file.slice(p.start, p.end);
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", urls[p.PartNumber], true);
        xhr.setRequestHeader("Content-Type", file.type);

        xhr.upload.onprogress = (evt) => {
          if (!evt.lengthComputable || !onProgress) return;
          const total = uploadedBytes + evt.loaded;
          onProgress(Math.round((total / file.size) * 100));
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const eTag = (xhr.getResponseHeader("ETag") || "").replace(/"/g, "");
            completed.push({ PartNumber: p.PartNumber, ETag: eTag });
            uploadedBytes += p.end - p.start;
            if (onProgress) onProgress(Math.round((uploadedBytes / file.size) * 100));
            resolve();
          } else {
            reject(new Error(`Part ${p.PartNumber} failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error(`Part ${p.PartNumber} network error`));
        xhr.send(blob);
      });
    }

    // 3) Complete multipart
    const completeRes = await fetch(`${API_BASE}/api/multipart/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uploadId, key, parts: completed }),
    });
    const { videoUrl } = await completeRes.json();
    toast.success(`Video uploaded successfully for chapter ${chapter.chapterId}`);
    return { ...chapter, video: videoUrl };
  } catch (error) {
    console.error(`Multipart upload failed for chapter ${chapter.chapterId}:`, error);
    throw error;
  }
}


