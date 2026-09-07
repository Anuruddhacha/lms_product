type FeedbackCardProps = {
  name: string;
  role: string;
  feedback: string;
  avatar?: string;
  rating: number;
};

const FeedbackCard = ({ name, role, feedback, avatar, rating }: FeedbackCardProps) => {
  // Create stars (filled and empty)
  const totalStars = 5;
  const stars = [];
  for (let i = 1; i <= totalStars; i++) {
    stars.push(
      <svg
        key={i}
        className={`w-5 h-5 inline-block ${
          i <= rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.388 2.455a1 1 0 00-.364 1.118l1.286 3.966c.3.92-.755 1.688-1.54 1.118l-3.388-2.455a1 1 0 00-1.176 0l-3.388 2.455c-.784.57-1.838-.197-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.037 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
      </svg>
    );
  }

  return (
    <div className="max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col gap-4">
      <p className="text-gray-700 dark:text-gray-200 italic">{feedback}</p>
      
      {/* Stars */}
      <div>{stars}</div>

      <div className="flex items-center gap-4 mt-4">
        <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold uppercase">
    {name[0]}
  </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{name}</p>
          <p className="text-sm text-green-600 dark:text-green-400">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;
