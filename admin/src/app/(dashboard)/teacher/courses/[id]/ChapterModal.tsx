import CommentsSection from "@/components/CommentsSection";
import { CustomFormField } from "@/components/CustomFormField";
import CustomModal from "@/components/CustomModal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChapterFormData, chapterSchema } from "@/lib/schemas";
import { addChapter, closeChapterModal, editChapter } from "@/state";
import { useDeleteObjectByUrlMutation } from "@/state/api";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const ChapterModal = () => {
  const dispatch = useAppDispatch();
  const {
    isChapterModalOpen,
    selectedSectionIndex,
    selectedChapterIndex,
    sections,
  } = useAppSelector((state) => state.global.courseEditor);

  const [deleteObject, { isLoading: isDeleting }] = useDeleteObjectByUrlMutation();

  const chapter: Chapter | undefined =
    selectedSectionIndex !== null && selectedChapterIndex !== null
      ? sections[selectedSectionIndex].chapters[selectedChapterIndex]
      : undefined;

  const methods = useForm<ChapterFormData>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: "",
      content: "",
      video: "",
    },
  });

  useEffect(() => {
    if (chapter) {
      methods.reset({
        title: chapter.title,
        content: chapter.content,
        video: chapter.video || "",
      });
    } else {
      methods.reset({
        title: "",
        content: "",
        video: "",
      });
    }
  }, [chapter, methods]);

  const onClose = () => {
    dispatch(closeChapterModal());
  };

  const onSubmit = (data: ChapterFormData) => {
    if (selectedSectionIndex === null) return;

    const newChapter: Chapter = {
      chapterId: chapter?.chapterId || uuidv4(),
      title: data.title,
      content: data.content,
      type: data.video ? "Video" : "Text",
      video: data.video,
    };

    if (selectedChapterIndex === null) {
      dispatch(
        addChapter({
          sectionIndex: selectedSectionIndex,
          chapter: newChapter,
        })
      );
    } else {
      dispatch(
        editChapter({
          sectionIndex: selectedSectionIndex,
          chapterIndex: selectedChapterIndex,
          chapter: newChapter,
        })
      );
    }

    toast.success(
      `Chapter added/updated successfully but you need to save the course to apply the changes`
    );
    onClose();
  };

 async function deleteVideoFromServer(url: string) {
  if (!url) return;

   if (!window.confirm("Are you sure you want to delete this video?")) {
      return;
    }

  try {
    const result = await deleteObject({ url }).unwrap();
    toast.success("Video deleted from server.");
    return result;
  } catch (error) {
    console.error("Delete failed:", error);
    toast.error("Failed to delete video from server.");
    throw error;
  }
}


  return (
    <>
    <CustomModal isOpen={isChapterModalOpen} onClose={onClose}>
      <div className="chapter-modal">
        <div className="chapter-modal__header">
          <h2 className="chapter-modal__title">Add/Edit Chapter</h2>
          <button onClick={onClose} className="chapter-modal__close">
            <X className="w-6 h-6" />
          </button>
        </div>

        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="chapter-modal__form"
          >
            <CustomFormField
              name="title"
              label="Chapter Title"
              placeholder="Write chapter title here"
            />

            <CustomFormField
              name="content"
              label="Chapter Content"
              type="textarea"
              placeholder="Write chapter content here"
            />

            <FormField
              control={methods.control}
              name="video"
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormLabel className="text-customgreys-dirtyGrey text-sm">
                    Chapter Video
                  </FormLabel>
                  <FormControl>
  <div>
    <Input
      type="file"
      accept="video/*"
      onChange={(e) => {

        const file = e.target.files?.[0];

        if (file) {
          const allowedNamePattern = /^[a-zA-Z0-9 _.-]+$/;
          if (!allowedNamePattern.test(file.name)) {
          toast.error("Invalid file name. Only letters, numbers, spaces, underscores, dashes, and dots are allowed.");
          return;
         }
          onChange(file);
        }


      }}
      className="border-none bg-customgreys-darkGrey py-2 cursor-pointer"
    />

    {/* Display current video (from server) */}
    {typeof value === "string" && value && (
      <div className="my-2 text-sm text-white-100 flex items-center gap-4">
        <span>Current video: {value.split("/").pop()}</span>
        <button
        type="button"
        onClick={async () => {
       try {
       await deleteVideoFromServer(value);
       onChange(""); // Clear video field
       } catch {}
      }}
     disabled={isDeleting}
     className="px-3 py-1 text-white bg-red-600 hover:bg-red-700 rounded text-xs disabled:opacity-50"
     >
    {isDeleting ? "Deleting..." : "Delete"}
     </button>

      </div>
    )}

    {/* Display selected file (File object) */}
    {value instanceof File && (
      <div className="my-2 text-sm text-gray-600">
        Selected file: {value.name}
      </div>
    )}
  </div>
</FormControl>

                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {chapter?.chapterId && <CommentsSection chapterId={chapter.chapterId} />}


            <div className="chapter-modal__actions">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary-700">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </CustomModal>

    {isDeleting && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white px-6 py-4 rounded shadow text-center text-lg font-semibold">
      Deleting...
    </div>
  </div>
)}
    </>
  );
};

export default ChapterModal;
