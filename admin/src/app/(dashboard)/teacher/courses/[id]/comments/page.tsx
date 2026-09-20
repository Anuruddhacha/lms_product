"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  useGetCourseQuery,
  useGetCommentsByChapterIdQuery,
  useAddCommentMutation,
  useReplyToCommentMutation,
  useDeleteCommentMutation,
} from "@/state/api";

interface ChapterWithNotificationProps {
  chapter: { chapterId: string; title: string };
  filter: "all" | "replied" | "unreplied";
}

const ChapterWithNotification = ({ chapter, filter }: ChapterWithNotificationProps) => {
  const { user } = useUser();

  const { data: commentData, refetch } = useGetCommentsByChapterIdQuery(chapter.chapterId, {
    skip: !chapter.chapterId,
  });

  const [addComment] = useAddCommentMutation();
  const [replyToComment] = useReplyToCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const [replyMap, setReplyMap] = React.useState<Record<string, string>>({});
  const [newComment, setNewComment] = React.useState("");

  const allComments = commentData?.comments || [];

  const unrepliedCount = allComments.filter((c) => {
    const isAdmin = user ? c.userId === user.id : false;
    return !isAdmin && (!c.reply || c.reply.trim() === "");
  }).length;

  // Filter comments based on global filter prop
  const filteredComments = allComments.filter((comment) => {
  const isAdmin = user ? comment.userId === user.id : false;

  if (filter === "replied") {
    return !!comment.reply?.trim();
  }

  if (filter === "unreplied") {
    return !isAdmin && (!comment.reply?.trim());
  }

  return true;
});


  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!user) {
      alert("You must be logged in to add a comment.");
      return;
    }
    try {
      await addComment({
        comment: newComment,
        chapterId: chapter.chapterId,
        userId: user.id,
      }).unwrap();
      setNewComment("");
      refetch();
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleReply = async (commentId: string) => {
    const reply = replyMap[commentId];
    if (!reply?.trim()) return;

    try {
      await replyToComment({ id: commentId, reply }).unwrap();
      setReplyMap((prev) => ({ ...prev, [commentId]: "" }));
      refetch();
    } catch (err) {
      console.error("Failed to reply:", err);
    }
  };

  const handleDelete = async (commentId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmed) return;

    try {
      await deleteComment(commentId).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  return (
    <div className="mb-6 p-4 rounded border border-gray-300 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <span className="text-lg font-semibold text-gray-900">{chapter.title}</span>
        {unrepliedCount > 0 && (
          <span className="bg-red-500 text-white text-sm rounded-full px-3 py-1">
            {unrepliedCount}
          </span>
        )}
      </div>

      {/* Comments */}
      <div
        className="space-y-4 overflow-y-auto"
        style={{ maxHeight: "400px", minHeight: "300px" }}
      >
        {filteredComments.map((comment) => (
          <div
            key={comment.id}
            className="bg-gray-50 p-4 rounded border border-gray-200 relative"
          >
            <div className="mb-2 text-base text-gray-800">{comment.comment}</div>

            <div className="ml-6 mt-2">
              {comment.reply && (
                <div className="text-blue-600 text-sm mb-1">
                  <strong>Current Reply:</strong> {comment.reply}
                </div>
              )}

              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Write or update reply..."
                  className="flex-grow rounded px-3 py-2 text-sm bg-white text-black border border-gray-300"
                  onChange={(e) =>
                    setReplyMap((prev) => ({ ...prev, [comment.id]: e.target.value }))
                  }
                  value={replyMap[comment.id] || ""}
                />
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold"
                  onClick={() => handleReply(comment.id)}
                >
                  {comment.reply ? "Update Reply" : "Reply"}
                </button>
              </div>
            </div>

            <button
              onClick={() => handleDelete(comment.id)}
              className="absolute top-2 right-2 text-red-500 hover:underline text-xs"
              title="Delete Comment"
            >
              Delete
            </button>
          </div>
        ))}
        {filteredComments.length === 0 && (
          <div className="text-sm text-gray-500">No comments found for selected filter.</div>
        )}
      </div>

      {/* Add Comment Input */}
      <div className="mt-6 flex gap-3 items-center">
        <input
          type="text"
          placeholder="Add a new comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-grow rounded px-4 py-3 text-base text-black bg-white border border-gray-300"
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded text-base font-semibold"
        >
          Post
        </button>
      </div>
    </div>
  );
};

const CourseCommentsPage = () => {
  const params = useParams();
  const courseId = params.id as string;

  const { data: course, isLoading, error } = useGetCourseQuery(courseId);

  // Lift filter state here
  const [filter, setFilter] = React.useState<"all" | "replied" | "unreplied">("all");

  if (isLoading) return <div>Loading course...</div>;
  if (error || !course) return <div>Course not found</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">{course.title}</h1>

      {/* Global filter buttons */}
      <div className="flex gap-3 mb-8">
        {["all", "replied", "unreplied"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-3 py-1 text-sm rounded-full border ${
              filter === f
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {course.sections?.map((section) => (
        <div key={section.sectionId} className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">{section.sectionTitle}</h2>
          <ul className="space-y-4">
            {section.chapters?.map((chapter) => (
              <li key={chapter.chapterId}>
                {/* Pass filter down */}
                <ChapterWithNotification chapter={chapter} filter={filter} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CourseCommentsPage;
