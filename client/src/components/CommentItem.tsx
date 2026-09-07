import { useDeleteCommentMutation, useGetUserByIdQuery } from "@/state/api"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";

type CommentItemProps = {
  comment: {
    id: string;
    comment: string;
    date: string;
    userId: string;
    reply?: string;
  };
   onDelete?: () => void;
};

const CommentItem = ({ comment, onDelete }: CommentItemProps) => {

  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();
  const { user } = useUser();
  const isCommentOwner = user?.id === comment.userId;

  
 // const { data: userData } = useGetUserByIdQuery(comment.userId);

  // Admin fallback profile
  const isAdmin = comment.userId === "admin";

  const hardcodedAdmin = {
    name: "SASDI",
    profileImage: "/SASDI_WD.png", // make sure this image exists in your public folder
  };

  const { data: userDataApi } = useGetUserByIdQuery(comment.userId, {
    skip: isAdmin,
  });

  const userData = isAdmin ? hardcodedAdmin : userDataApi;

 const handleDelete = async (commentId: string) => {
  if (!window.confirm("Are you sure you want to delete this comment?")) return;

  try {
    await deleteComment(commentId).unwrap();
    // Optionally show toast
    console.log("Comment deleted");
    if (onDelete) onDelete(); // 👈 trigger parent refetch
  } catch (err) {
    console.error("Failed to delete comment:", err);
  }
};



  return (
    <div className="mb-6">
      {/* Main Comment */}
      <div className="flex gap-3 items-start">
        <Avatar>
          <AvatarImage src={userData?.profileImage} />
          <AvatarFallback className="bg-green-200 text-gray-800">
            {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}  
            </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold text-black">
            {userData?.name || "User"}
          </div>
          <div className="text-gray-800">{comment.comment}</div>
          <div className="text-xs text-gray-400">
            {new Date(comment.date).toLocaleString()}
            {isCommentOwner && (
  <button
    className="ml-4 text-red-600 text-xs hover:underline disabled:opacity-50"
    disabled={isDeleting}
    onClick={() => handleDelete(comment.id)}
  >
    {isDeleting ? "Deleting..." : "Delete"}
  </button>
)}

          </div>
        </div>
      </div>

      {/* Simple Reply (if any) */}
      {comment.reply && (
  <div className="ml-12 mt-2 p-2 border-l-2 border-gray-200 bg-gray-50 rounded">
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Avatar className="w-6 h-6 mt-0.5">
        <AvatarImage src="/SASDI_WD.png" />
      </Avatar>
      <div>
        <strong className="mr-1">Reply:</strong> {comment.reply}
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default CommentItem;
