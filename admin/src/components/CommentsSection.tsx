import { useGetCommentsByChapterIdQuery, useAddCommentMutation, useReplyToCommentMutation, useGetUserByIdQuery, useDeleteCommentMutation } from "@/state/api"; // adjust path
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";

const CommentsSection = ({ chapterId }: { chapterId: string }) => {
  const { data: commentData, refetch } = useGetCommentsByChapterIdQuery(chapterId, {
  skip: !chapterId, // avoid firing before ID is ready
});
  const [addComment] = useAddCommentMutation();
  const [replyToComment] = useReplyToCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const [newComment, setNewComment] = React.useState("");
  const [replyMap, setReplyMap] = React.useState<Record<string, string>>({});

  const comments = commentData?.comments || [];

  const { user } = useUser();

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    await addComment({ comment: newComment, chapterId, userId: "admin" });
    setNewComment("");
   // refetch();
  };


  const handleDeleteComment = async (commentId: string) => {
  const confirmed = window.confirm("Are you sure you want to delete this comment?");
  if (!confirmed) return;

  try {
    await deleteComment(commentId).unwrap();
    //refetch(); // ✅ refresh comments after deletion
  } catch (err) {
    console.error("Failed to delete comment:", err);
  }
};


   

  const handleReply = async (commentId: string) => {
    const reply = replyMap[commentId];
    if (!reply?.trim()) return;
    await replyToComment({ id:commentId, reply });
    setReplyMap((prev) => ({ ...prev, [commentId]: "" }));
    //refetch();
  };

  return (
    <div className="mt-6 bg-customgreys-secondarybg border border-customgreys-darkerGrey rounded p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Comments</h3>

      <div className="space-y-4 max-h-60 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white border border-customgreys-darkerGrey p-3 rounded">
            <CommentItem comment={comment} onDelete={() => handleDeleteComment(comment.id)} />
            {comment.reply && (
              <div className="ml-4 mt-2 text-sm text-blue-600">
                <strong>Reply:</strong> {comment.reply}
              </div>
            )}

            <div className="mt-2 flex flex-col gap-2">
              <Input
                placeholder="Write a reply..."
                value={replyMap[comment.id] || ""}
                onChange={(e) =>
                  setReplyMap((prev) => ({ ...prev, [comment.id]: e.target.value }))
                }
                className="text-sm"
              />
              <Button size="sm" onClick={() => handleReply(comment.id)}>
                Send Reply
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Input
          placeholder="Add a new comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button onClick={handleAddComment} className="mt-2">Post Comment</Button>
      </div>
    </div>
  );
};

const CommentItem = ({
  comment,
  onDelete,
}: {
  comment: any;
  onDelete?: () => void;
}) => {
  const isAdmin = comment.userId === "admin";

  const hardcodedAdmin = {
    name: "Admin",
    profileImage: "/logo.svg",
  };

  const { data: userDataApi } = useGetUserByIdQuery(comment.userId, {
    skip: isAdmin,
  });

  const userData = isAdmin ? hardcodedAdmin : userDataApi;

  const avatarSrc = userData?.profileImage || "/default-avatar.png";
  const avatarRemote =
    avatarSrc.startsWith("http://") || avatarSrc.startsWith("https://");

  return (
    <div className="flex items-start gap-3 text-gray-900 justify-between">
      <div className="flex gap-3">
        <Image
          src={avatarSrc}
          alt="User"
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 rounded-full object-cover"
          unoptimized={avatarRemote}
        />
        <div>
          <div className="font-medium text-sm">{userData?.name || "Unknown User"}</div>
          <div className="text-sm">{comment.comment}</div>
          <div className="text-xs text-gray-500">{new Date(comment.date).toLocaleString()}</div>
        </div>
      </div>

      {/* Delete button for admin */}
      {onDelete && (
        <button
          onClick={onDelete}
          className="text-red-500 text-xs hover:underline ml-auto"
        >
          Delete
        </button>
      )}
    </div>
  );
};


export default CommentsSection;
