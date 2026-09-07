"use client";

import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ReactPlayer from "react-player";
import Loading from "@/components/Loading";
import { useCourseProgressData } from "@/hooks/useCourseProgressData";
import { useGetCommentsByChapterIdQuery, useAddCommentMutation } from "@/state/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import CommentItem from "@/components/CommentItem";
import { shouldForceHls } from "@/lib/utils";


const Course = () => {
  const {
    user,
    course,
    userProgress,
    currentSection,
    currentChapter,
    isLoading,
    isChapterCompleted,
    updateChapterProgress,
    hasMarkedComplete,
    setHasMarkedComplete,
  } = useCourseProgressData();

  const playerRef = useRef<ReactPlayer>(null);

const [newComment, setNewComment] = useState("");
const {
  data:commentData,
  isLoading: isCommentsLoading,
  refetch,
} = useGetCommentsByChapterIdQuery(currentChapter?.chapterId || "", {
  skip: !currentChapter,
});


const comments = commentData?.comments || [];

const [addComment] = useAddCommentMutation();


  const handleProgress = ({ played }: { played: number }) => {
    if (
      played >= 0.8 &&
      !hasMarkedComplete &&
      currentChapter &&
      currentSection &&
      userProgress?.sections &&
      !isChapterCompleted()
    ) {
      setHasMarkedComplete(true);
      updateChapterProgress(
        currentSection.sectionId,
        currentChapter.chapterId,
        true
      );
    }
  };

  if (isLoading) return <Loading />;
  if (!user) return <div>Please sign in to view this course.</div>;
  if (!course || !userProgress) return <div>Error loading course</div>;

  return (
    <div className="course">
      <div className="course__container">
        <div className="course__breadcrumb">
          <div className="course__path text-black">
            {course.title} / {currentSection?.sectionTitle} /{" "}
            <span className="course__current-chapter">
              {currentChapter?.title}
            </span>
          </div>
          <h2 className="course__title text-black">{currentChapter?.title}</h2>
          <div className="course__header">
            <div className="course__instructor">
              <Avatar className="course__avatar">
                <AvatarImage alt={course.teacherName} />
                <AvatarFallback className="course__avatar-fallback">
                  {course.teacherName[0]}
                </AvatarFallback>
              </Avatar>
              <span className="course__instructor-name">
                {course.teacherName}
              </span>
            </div>
          </div>
        </div>

        <Card className="course__video">
          <CardContent className="course__video-container">
            {currentChapter?.video ? (
              <ReactPlayer
                ref={playerRef}
                url= {currentChapter.video as string}
                controls
                width="100%"
                height="100%"
                onProgress={handleProgress}
                onContextMenu={(e: { preventDefault: () => any; }) => e.preventDefault()} // Disable right-click
                config={{
                  file: {
                    // videos/hls/{id}/{id}.m3u8 URLs need to be played via
                    // hls.js instead of being handed to a plain <video> tag,
                    // except on iOS/WebKit, which plays HLS natively and
                    // doesn't reliably support hls.js.
                    forceHLS: shouldForceHls(currentChapter.video as string),
                    attributes: {
                      controlsList: "nodownload",
                      disablePictureInPicture: true,
                      style: {
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }
                    },
                  },
                }}
              />
            ) : (
              <div className="course__no-video">
                No video available for this chapter.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="course__content">
          <Tabs defaultValue="Notes" className="course__tabs">
            <TabsList className="course__tabs-list">
              <TabsTrigger className="course__tab px-2" value="Notes">
                <h4 className="text-black px-2">Description</h4>
              </TabsTrigger>
            </TabsList>

            <TabsContent className="course__tab-content" value="Notes">
              <Card className="course__tab-card">
                <CardContent className="course__tab-body text-black">
                  {currentChapter?.content}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>


        <Card className="mt-6">
  <CardHeader>
    <CardTitle className="text-black text-lg">Comments</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Add New Comment */}
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        await addComment({
          comment: newComment,
          chapterId: currentChapter!.chapterId,
          userId: user.id, // assuming `user.id` is available
        });
        setNewComment("");
        refetch(); // refresh comment list
      }}
      className="flex gap-2 text-black"
    >
      <Input
        type="text"
        placeholder="Add a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <Button type="submit">Post</Button>
    </form>

    {/* Display Comments */}
    {isCommentsLoading ? (
      <p>Loading comments...</p>
    ) : comments?.length > 0 ? (
      comments.map((comment: { id: string; comment: string; date: string; userId: string; reply?: string }) => (
        <CommentItem key={comment.id} comment={comment} />
      ))
    ) : (
      <p className="text-sm text-muted-foreground">No comments yet.</p>
    )}
  </CardContent>
</Card>






      </div>
    </div>
  );
};

export default Course;
