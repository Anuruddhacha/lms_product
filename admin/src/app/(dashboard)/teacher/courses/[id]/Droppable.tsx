"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Plus, GripVertical } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import {
  setSections,
  deleteSection,
  deleteChapter,
  openSectionModal,
  openChapterModal,
} from "@/state";
import { useDeleteObjectByUrlMutation, useDeleteVideoAssetsMutation } from "@/state/api";
import { toast } from "sonner";
import { useState } from "react";

export default function DroppableComponent() {
  const dispatch = useAppDispatch();
  const { sections } = useAppSelector((state) => state.global.courseEditor);

  const handleSectionDragEnd = (result: any) => {
    if (!result.destination) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    const updatedSections = [...sections];
    const [reorderedSection] = updatedSections.splice(startIndex, 1);
    updatedSections.splice(endIndex, 0, reorderedSection);
    dispatch(setSections(updatedSections));
  };

  const handleChapterDragEnd = (result: any, sectionIndex: number) => {
    if (!result.destination) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    const updatedSections = [...sections];
    const updatedChapters = [...updatedSections[sectionIndex].chapters];
    const [reorderedChapter] = updatedChapters.splice(startIndex, 1);
    updatedChapters.splice(endIndex, 0, reorderedChapter);
    updatedSections[sectionIndex].chapters = updatedChapters;
    dispatch(setSections(updatedSections));
  };

  return (
    <DragDropContext onDragEnd={handleSectionDragEnd}>
      <Droppable droppableId="sections">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {sections.map((section: Section, sectionIndex: number) => (
              <Draggable
                key={section.sectionId}
                draggableId={section.sectionId}
                index={sectionIndex}
              >
                {(draggableProvider) => (
                  <div
                    ref={draggableProvider.innerRef}
                    {...draggableProvider.draggableProps}
                    className={`droppable-section ${
                      sectionIndex % 2 === 0
                        ? "droppable-section--even"
                        : "droppable-section--odd"
                    }`}
                  >
                    <SectionHeader
                      section={section}
                      sectionIndex={sectionIndex}
                      dragHandleProps={draggableProvider.dragHandleProps}
                    />

                    <DragDropContext
                      onDragEnd={(result) =>
                        handleChapterDragEnd(result, sectionIndex)
                      }
                    >
                      <Droppable droppableId={`chapters-${section.sectionId}`}>
                        {(droppableProvider) => (
                          <div
                            ref={droppableProvider.innerRef}
                            {...droppableProvider.droppableProps}
                          >
                            {section.chapters.map(
                              (chapter: Chapter, chapterIndex: number) => (
                                <Draggable
                                  key={chapter.chapterId}
                                  draggableId={chapter.chapterId}
                                  index={chapterIndex}
                                >
                                  {(draggableProvider) => (
                                    <ChapterItem
                                      chapter={chapter}
                                      chapterIndex={chapterIndex}
                                      sectionIndex={sectionIndex}
                                      draggableProvider={draggableProvider}
                                    />
                                  )}
                                </Draggable>
                              )
                            )}
                            {droppableProvider.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        dispatch(
                          openChapterModal({
                            sectionIndex,
                            chapterIndex: null,
                          })
                        )
                      }
                      className="add-chapter-button group"
                    >
                      <Plus className="add-chapter-button__icon" />
                      <span className="add-chapter-button__text">
                        Add Chapter
                      </span>
                    </Button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

const SectionHeader = ({
  section,
  sectionIndex,
  dragHandleProps,
}: {
  section: Section;
  sectionIndex: number;
  dragHandleProps: any;
}) => {
  const dispatch = useAppDispatch();
  const [deleteObject] = useDeleteObjectByUrlMutation();
  const [deleteVideoAssets] = useDeleteVideoAssetsMutation();
  const [isDeleting, setIsDeleting] = useState(false);


    const handleDeleteSection = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this entire section?")) {
        return;
      }

      setIsDeleting(true);

  const resourceDeletePromises = section.resources
  ?.filter((resource): resource is UploadedResource =>
    typeof resource === "object" && resource !== null && "fileUrl" in resource && typeof resource.fileUrl === "string"
  )
  .map((resource) =>
    deleteObject({ url: resource.fileUrl })
      .unwrap()
      .then(() => {
        toast.success(`Deleted the resource`);
        return true;
      })
      .catch(() => {
        toast.error("Error deleting resource");
        return false;
      })
  ) ?? [];

      const videoDeletePromises = section.chapters
        .filter((chapter) => typeof chapter.video === "string" && chapter.video)
        .map((chapter) =>
          // Deletes the raw source AND the entire HLS output prefix
          // (all variant playlists + segments), not just the master playlist.
          deleteVideoAssets({ url: chapter.video as string })
            .unwrap()
            .then(() => {
              toast.success(`Deleted the video`);
              return true;
            })
            .catch((err) => {
              toast.error("Error deleting video:");
              return false;
            })
        );

      // Wait for all deletions (resources + videos) and check whether
      // any of them actually failed before removing the section — a
      // failed deletion must not be silently treated as success.
      const results: boolean[] = await Promise.all([...resourceDeletePromises, ...videoDeletePromises]);
      const hasFailure = results.some((succeeded: boolean) => !succeeded);

      if (hasFailure) {
        toast.error(
          "Some assets failed to delete from the server. Section was NOT removed — please retry."
        );
        return;
      }

      dispatch(deleteSection(sectionIndex));
      toast.success("Section and its videos deleted.");
    } catch (err) {
      console.error("Failed to delete section or chapter videos:", err);
      toast.error("Error deleting section or videos.");
    }
    finally {
      setIsDeleting(false); 
    }
  };


  

  return (
    <>
    <div className="droppable-section__header" {...dragHandleProps}>
      <div className="droppable-section__title-wrapper">
        <div className="droppable-section__title-container">
          <div className="droppable-section__title">
            <GripVertical className="h-6 w-6 mb-1" />
            <h3 className="text-lg font-medium">{section.sectionTitle}</h3>
          </div>
          <div className="droppable-chapter__actions">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="p-0"
              onClick={() => dispatch(openSectionModal({ sectionIndex }))}
            >
              <Edit className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="p-0"
              //onClick={() => dispatch(deleteSection(sectionIndex))}
              onClick={handleDeleteSection}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {section.sectionDescription && (
          <p className="droppable-section__description">
            {section.sectionDescription}
          </p>
        )}
      </div>
    </div>

      {isDeleting && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white px-6 py-4 rounded shadow text-center text-lg font-semibold">
      Deleting section...
    </div>
  </div>
)}

    </>
  );
};

const ChapterItem = ({
  chapter,
  chapterIndex,
  sectionIndex,
  draggableProvider,
}: {
  chapter: Chapter;
  chapterIndex: number;
  sectionIndex: number;
  draggableProvider: any;
}) => {
  const dispatch = useAppDispatch();
  const [deleteVideoAssets] = useDeleteVideoAssetsMutation();
  const [isDeleting, setIsDeleting] = useState(false);


const handleDeleteChapter = async () => {
  try {
    if (!window.confirm("Are you sure you want to delete this chapter?")) {
      return;
    }

    setIsDeleting(true);

    if (typeof chapter.video === "string" && chapter.video) {
      // Deletes the raw source (videos/raw/{videoId}.*) AND the entire
      // HLS output prefix (videos/hls/{videoId}/ — master + variant
      // playlists + every segment), not just the master playlist.
      await deleteVideoAssets({ url: chapter.video }).unwrap();
      toast.success("Video deleted from server.");
    }

    dispatch(
      deleteChapter({
        sectionIndex,
        chapterIndex,
      })
    );
  } catch (err) {
    console.error("Failed to delete video or chapter:", err);
    toast.error("Error deleting video or chapter.");
  }
  finally {
    setIsDeleting(false); 
  }
};


  return (
    <>
    <div
      ref={draggableProvider.innerRef}
      {...draggableProvider.draggableProps}
      {...draggableProvider.dragHandleProps}
      className={`droppable-chapter ${
        chapterIndex % 2 === 1
          ? "droppable-chapter--odd"
          : "droppable-chapter--even"
      }`}
    >
      <div className="droppable-chapter__title">
        <GripVertical className="h-4 w-4 mb-[2px]" />
        <p className="text-sm">{`${chapterIndex + 1}. ${chapter.title}`}</p>
      </div>
      <div className="droppable-chapter__actions">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="droppable-chapter__button"
          onClick={() =>
            dispatch(
              openChapterModal({
                sectionIndex,
                chapterIndex,
              })
            )
          }
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="droppable-chapter__button"
          onClick={handleDeleteChapter}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>

    {isDeleting && (
   <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white px-6 py-4 rounded shadow text-center text-lg font-semibold">
      Deleting chapter...
    </div>
  </div>
)}
    </>
  );
};
