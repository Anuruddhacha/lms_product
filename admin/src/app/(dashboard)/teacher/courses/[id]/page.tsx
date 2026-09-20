"use client";

import { CustomFormField } from "@/components/CustomFormField";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { courseSchema } from "@/lib/schemas";
import {
  centsToDollars,
  courseCategories,
  createCourseFormData,
  uploadAllResources,
  uploadAllVideos,
} from "@/lib/utils";
import { openSectionModal, setSections } from "@/state";
import {
  useGetCourseQuery,
  useUpdateCourseMutation,
  useGetUploadVideoUrlMutation,
  useGetUploadResourseUrlMutation,
  useDeleteResourceFromS3Mutation,
} from "@/state/api";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DroppableComponent from "./Droppable";
import ChapterModal from "./ChapterModal";
import SectionModal from "./SectionModal";
import { progress } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress"




const CourseEditor = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { data: course, isLoading, refetch } = useGetCourseQuery(id);
  const [updateCourse] = useUpdateCourseMutation();
  const [getUploadVideoUrl] = useGetUploadVideoUrlMutation();
  const [getUploadResourceUrl] = useGetUploadResourseUrlMutation();
  const [deleteResourceFromS3] = useDeleteResourceFromS3Mutation();
  
  const [resources, setResources] = useState<
  { fileName: string; fileType: string; file: File }[]
>([]);

const [zoomLinks, setZoomLinks] = useState<CustomLink[]>([]);
const [youtubeLinks, setYoutubeLinks] = useState<CustomLink[]>([]);
const [uploadedResources, setUploadedResources] = useState<UploadedResource[]>([]);

  const dispatch = useAppDispatch();
  const { sections } = useAppSelector((state) => state.global.courseEditor);

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [chapterTitle, setChapterTitle] = useState<string>('');

  const methods = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseTitle: "",
      courseDescription: "",
      courseCategory: "",
      coursePrice: "20",
      courseStatus: false,
    },
  });

  useEffect(() => {
    if (course) {
      methods.reset({
        courseTitle: course.title,
        courseDescription: course.description,
        courseCategory: course.category,
        coursePrice: centsToDollars(course.price),
        courseStatus: course.status === "Published",
      });
      dispatch(setSections(course.sections || []));

      setZoomLinks(course.zoomLinks || []);
      setYoutubeLinks(course.youtubeLinks || []);
      setUploadedResources(course.uploadedResources || []);
    }
  }, [course, methods]); // eslint-disable-line react-hooks/exhaustive-deps

  const [deletingResourceUrl, setDeletingResourceUrl] = useState<string | null>(null);



  const handleDeleteResource = async (resToDelete: UploadedResource) => {
    setDeletingResourceUrl(resToDelete.fileUrl);

  try {

    const resourceUrl = resToDelete.fileUrl;
     
    await deleteResourceFromS3({ resourceUrl }).unwrap();
    alert("Resource deleted successfully. please update the published course to reflect the changes.");
    setUploadedResources(prev =>
    prev.filter(res => res.fileUrl !== resToDelete.fileUrl)
    );
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setDeletingResourceUrl(null); 
    }

};


  const handleLinkChange = (
  index: number,
  field: keyof CustomLink,
  value: string,
  type: 'zoom' | 'youtube'
) => {
  const links = type === 'zoom' ? [...zoomLinks] : [...youtubeLinks];
  links[index][field] = value;

  type === 'zoom' ? setZoomLinks(links) : setYoutubeLinks(links);
};

const addLink = (type: 'zoom' | 'youtube') => {
  const newLink: CustomLink = { title: '', description: '', link: '' };
  type === 'zoom'
    ? setZoomLinks([...zoomLinks, newLink])
    : setYoutubeLinks([...youtubeLinks, newLink]);
};

const removeLink = (index: number, type: 'zoom' | 'youtube') => {
  const links = type === 'zoom' ? [...zoomLinks] : [...youtubeLinks];
  links.splice(index, 1);
  type === 'zoom' ? setZoomLinks(links) : setYoutubeLinks(links);
};


  const onSubmit = async (data: CourseFormData) => {
    try {

      const updatedSections = await uploadAllVideos(
        sections,
        id,
        getUploadVideoUrl,
        (progress) => {
           console.log(`Uploading progress: ${progress}%`);
          // optionally update state/UI here
          setUploadProgress(progress);
        },
        (chapterTitle) => {
          console.log(`Uploading chapter: ${chapterTitle}`);
          setChapterTitle(chapterTitle);
       },
      );


      const updatedResources = await uploadAllResources(
      resources, // This should be an array of Resource objects
      id,
      getUploadResourceUrl, // RTK Query mutation trigger (e.g., useGetUploadResourceUrlMutation)
      (progress) => {
      console.log(`Resource Upload Progress: ${progress}%`);
      setUploadProgress(progress); // update UI if needed
      },
      (fileName) => {
      console.log(`Uploading file: ${fileName}`);
      //setCurrentUploadingFile(fileName); // for UI feedback
      }
      );

  
      console.log("updatedResources:", updatedResources);

      const allResources = [...uploadedResources, ...updatedResources];


      const formData = createCourseFormData(data, updatedSections, allResources, zoomLinks, youtubeLinks);

      await updateCourse({
        courseId: id,
        formData,
      }).unwrap();
      setResources([]);
      refetch();
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-5 mb-5">
        <button
          className="flex items-center border border-customgreys-dirtyGrey rounded-lg p-2 gap-2 cursor-pointer hover:bg-customgreys-dirtyGrey hover:text-white-100 text-customgreys-dirtyGrey"
          onClick={() => router.push("/teacher/courses", { scroll: false })}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </button>
      </div>

      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Header
            title="Course Setup"
            subtitle="Complete all fields and save your course"
            rightElement={
              <div className="flex items-center space-x-4">
                <CustomFormField
                  name="courseStatus"
                  label={methods.watch("courseStatus") ? "Published" : "Draft"}
                  type="switch"
                  className="flex items-center space-x-2"
                  labelClassName={`text-sm font-medium ${
                    methods.watch("courseStatus")
                      ? "text-blue-500"
                      : "text-yellow-500"
                  }`}
                  inputClassName="data-[state=checked]:bg-blue-500"
                />
                <Button
                  type="submit"
                  className="bg-primary-700 hover:bg-primary-600"
                >
                  {methods.watch("courseStatus")
                    ? "Update Published Course"
                    : "Save Draft"}
                </Button>
              </div>
            }
          />

          <div className="flex justify-between md:flex-row flex-col gap-10 mt-5 font-dm-sans">
            <div className="basis-1/2">
              <div className="space-y-4">
                <CustomFormField
                  name="courseTitle"
                  label="Course Title"
                  type="text"
                  placeholder="Write course title here"
                  className="border-none"
                  initialValue={course?.title}
                />

                <CustomFormField
                  name="courseDescription"
                  label="Course Description"
                  type="textarea"
                  placeholder="Write course description here"
                  initialValue={course?.description}
                />

                <CustomFormField
                  name="courseCategory"
                  label="Course Category"
                  type="select"
                  placeholder="Select category here"
                  options={courseCategories as unknown as { value: string; label: string }[]}
                  initialValue={course?.category}
                />

                {/*<CustomFormField
                  name="coursePrice"
                  label="Course Price"
                  type="number"
                  placeholder="0"
                  initialValue={course?.price}
                />*/}
              </div>



{uploadedResources.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-medium">Uploaded Resources</h3>
          <ul className="mt-2 space-y-2">
            {uploadedResources.map((res) => (
              <li
                key={res.fileUrl}
                className="bg-muted p-2 rounded-md text-sm text-muted-foreground flex justify-between items-center"
              >
                <a
                  href={res.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {res.fileName}
                </a>
                <button
                  type="button"
                  onClick={() => handleDeleteResource(res)}
                  className="text-red-500 hover:underline text-sm ml-4 flex items-center"
                  disabled={deletingResourceUrl === res.fileUrl}
                >
                  {deletingResourceUrl === res.fileUrl ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 mr-1 text-red-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}



<div className="bg-customgreys-darkGrey mt-4 p-4 rounded-lg">
  <h2 className="text-lg font-semibold text-secondary-foreground mb-4">
    Upload Resources (PDF/DOC)
  </h2>

  <input
    type="file"
    accept=".pdf,.doc,.docx"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const newResource = {
        fileName: file.name,
        fileType: file.type,
        file,
      };

      setResources((prev) => [...prev, newResource]);
      e.target.value = ""; // reset input
    }}
    className="block mb-4"
  />

  {resources.length > 0 && (
    <ul className="space-y-2">
      {resources.map((res, index) => (
        <li
          key={index}
          className="flex justify-between items-center bg-muted p-2 rounded-md"
        >
          <span className="text-sm text-muted-foreground">
            {res.fileName}
          </span>
          <button
            type="button"
            onClick={() =>
              setResources((prev) =>
                prev.filter((_, i) => i !== index)
              )
            }
            className="text-red-500 hover:underline text-sm"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )}
</div>




<div className="space-y-6">
  {/* Zoom Links */}
  <div>
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-semibold text-lg">Zoom Links</h3>
      <button
        type="button"
        onClick={() => addLink('zoom')}
        className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
      >
        + Add Zoom Link
      </button>
    </div>

    {zoomLinks.map((item, idx) => (
      <div key={idx} className="grid grid-cols-3 gap-2 items-end mb-3">
        <input
          type="text"
          placeholder="Title"
          value={item.title}
          onChange={(e) => handleLinkChange(idx, 'title', e.target.value, 'zoom')}
          className="border rounded px-2 py-1 text-sm text-black"
        />
        <input
          type="text"
          placeholder="Description"
          value={item.description}
          onChange={(e) => handleLinkChange(idx, 'description', e.target.value, 'zoom')}
          className="border rounded px-2 py-1 text-sm text-black"
        />
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://zoom.us/..."
            value={item.link}
            onChange={(e) => handleLinkChange(idx, 'link', e.target.value, 'zoom')}
            className="border rounded px-2 py-1 text-sm w-full text-black"
          />
          <button
            type="button"
            onClick={() => removeLink(idx, 'zoom')}
            className="text-red-500 text-xs"
          >
            Remove
          </button>
        </div>
      </div>
    ))}
  </div>

  {/* YouTube Links */}
  <div>
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-semibold text-lg">YouTube Links</h3>
      <button
        type="button"
        onClick={() => addLink('youtube')}
        className="text-sm bg-red-500 text-white px-3 py-1 rounded"
      >
        + Add YouTube Link
      </button>
    </div>

    {youtubeLinks.map((item, idx) => (
      <div key={idx} className="grid grid-cols-3 gap-2 items-end mb-3">
        <input
          type="text"
          placeholder="Title"
          value={item.title}
          onChange={(e) => handleLinkChange(idx, 'title', e.target.value, 'youtube')}
          className="border rounded px-2 py-1 text-sm text-black"
        />
        <input
          type="text"
          placeholder="Description"
          value={item.description}
          onChange={(e) => handleLinkChange(idx, 'description', e.target.value, 'youtube')}
          className="border rounded px-2 py-1 text-sm text-black"
        />
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://youtube.com/watch?v=..."
            value={item.link}
            onChange={(e) => handleLinkChange(idx, 'link', e.target.value, 'youtube')}
            className="border rounded px-2 py-1 text-sm w-full text-black"
          />
          <button
            type="button"
            onClick={() => removeLink(idx, 'youtube')}
            className="text-red-500 text-xs"
          >
            Remove
          </button>
        </div>
      </div>
    ))}
  </div>
</div>



            </div>

            <div className="bg-customgreys-darkGrey mt-4 md:mt-0 p-4 rounded-lg basis-1/2">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-semibold text-secondary-foreground">
                  Sections
                </h2>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    dispatch(openSectionModal({ sectionIndex: null }))
                  }
                  className="border-none text-primary-700 group"
                >
                  <Plus className="mr-1 h-4 w-4 text-primary-700 group-hover:white-100" />
                  <span className="text-primary-700 group-hover:white-100">
                    Add Section
                  </span>
                </Button>
              </div>

              {isLoading ? (
                <p>Loading course content...</p>
              ) : sections.length > 0 ? (
                <DroppableComponent />
              ) : (
                <p>No sections available</p>
              )}
            </div>
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && (
     <div>

     <Dialog open={uploadProgress > 0 && uploadProgress < 100}>
    <DialogContent className="sm:max-w-md text-center">
    <DialogHeader>
      <DialogTitle>Uploading Video</DialogTitle>
    </DialogHeader>
    <div className="mt-4">
      <Progress value={uploadProgress} className="bg-muted">
        <div
          className="h-full bg-blue-600 transition-all"
          style={{ width: `${uploadProgress}%` }}
        />
      </Progress>
      <p className="text-sm text-muted-foreground mt-2">
        Uploading {chapterTitle}
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        Uploading video... {uploadProgress}%
      </p>
    </div>
  </DialogContent>
</Dialog>

     </div>
       )}
        </form>
      </Form>

    


      <ChapterModal />
      <SectionModal />
    </div>
  );
};

export default CourseEditor;
