import { Loader2 } from "lucide-react";
import React from "react";
import Image from "next/image";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white space-y-4">
      <Image
        src="/logo.svg"
        alt="LMS Platform"
        width={120}
        height={120}
        priority
        className="animate-pulse"
      />
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <span className="text-gray-600 font-medium">Loading...</span>
    </div>
  );
};

export default Loading;
