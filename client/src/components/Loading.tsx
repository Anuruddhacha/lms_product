import { Loader2 } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white-100 space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-udemy-purple" />
      <span className="text-udemy-gray font-medium">Loading...</span>
    </div>
  );
};

export default Loading;
