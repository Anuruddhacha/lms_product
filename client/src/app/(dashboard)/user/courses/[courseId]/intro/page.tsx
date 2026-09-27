"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";
import { useCourseProgressData } from "@/hooks/useCourseProgressData";
import { BookOpenIcon } from "lucide-react";
import ReactPlayer from "react-player";
import { shouldForceHls } from "@/lib/utils";

const CourseIntro = () => {
  const router = useRouter();
  const { user, course, userProgress, isLoading } = useCourseProgressData();
  const playerRef = useRef<ReactPlayer>(null);

  const firstChapter = useMemo(() => {
    if (!course?.sections) return null;
    for (const section of course.sections) {
      if (section.chapters && section.chapters.length > 0) {
        return section.chapters[0];
      }
    }
    return null;
  }, [course]);

  if (isLoading) return <Loading />;
  if (!user) return <div className="text-center text-lg mt-10">Please sign in to view course details.</div>;
  if (!course) return <div className="text-center text-lg mt-10 text-red-600">Error loading course information.</div>;

  return (
    <div className="flex flex-col min-h-screen bg-udemy-lightGray p-6">
      <div className="max-w-5xl w-full mx-auto space-y-10">
        {/* Header Section */}
        <section className="relative py-10 bg-white-100 border border-gray-200 rounded-md shadow-sm">
          <div className="px-6 md:px-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-800">
                  {course.title}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  By {course.teacherName}
                </p>
              </div>
              <Avatar className="h-14 w-14">
                <AvatarImage alt={course.teacherName} />
                <AvatarFallback>{course.teacherName?.[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </section>


        {/* Course Intro Video Player */}
{firstChapter?.video && (
  <div className="w-full rounded-xl overflow-hidden shadow-md bg-black">
         <ReactPlayer
            ref={playerRef}
            url= {firstChapter.video as string}
            controls
            width="100%"
            height="100%"
            onContextMenu={(e: { preventDefault: () => any; }) => e.preventDefault()} // Disable right-click
            config={{
            file: {
                 // videos/hls/{id}/{id}.m3u8 URLs need to be played via
                 // hls.js instead of being handed to a plain <video> tag,
                 // except on iOS/WebKit, which plays HLS natively and
                 // doesn't reliably support hls.js.
                 forceHLS: shouldForceHls(firstChapter.video as string),
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

  </div>
)}

        {/* CTA Button */}
        {firstChapter && (
          <div className="text-center">
  <Button
    className="bg-udemy-purple hover:bg-udemy-purpleDark text-white-100 px-8 py-3 text-lg rounded-sm font-bold shadow-lg transition duration-300"
    onClick={() =>
      router.push(
        `/user/courses/${course.courseId}/chapters/${firstChapter.chapterId}`,
        { scroll: false }
      )
    }
  >
    📚 Access Course Content
  </Button>
</div>

        )}




        {/* Resources */}
        <section className="bg-white-100 border border-gray-200 rounded-md shadow-sm p-6">
          <h2 className="text-2xl font-bold text-udemy-black mb-4">Resources & Links</h2>
          <div className="space-y-6">
           
           


           {(course.zoomLinks?.length ?? 0) > 0 && (
  <div className="bg-udemy-purpleLight border border-udemy-purple/20 rounded-md p-5 space-y-4">
    <h3 className="text-lg font-semibold text-udemy-purple">Zoom Lives</h3>

    <div className="flex flex-col gap-4">
      {[...(course.zoomLinks ?? [])].reverse().map((link, i) => (
        <div key={i} className="flex items-start gap-4">
          <div className="text-udemy-purple text-2xl mt-1 shrink-0">
            🎥
          </div>
          <div className="flex flex-col">
            <h4 className="font-semibold text-udemy-black break-words text-base">
              {link.title}
            </h4>
            <p className="text-sm text-udemy-gray mb-2">{link.description}</p>
            <a
              href={link.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white-100 bg-udemy-purple hover:bg-udemy-purpleDark px-4 py-1.5 rounded-sm font-medium transition w-fit"
            >
              Join
            </a>
          </div>
        </div>
      ))}
    </div>
  </div>
)}


            {(course.youtubeLinks?.length ?? 0) > 0 && (
  <div className="bg-gradient-to-r from-red-100 via-red-50 to-white border border-red-200 rounded-2xl p-5 space-y-4">
    <h3 className="text-lg font-semibold text-red-700">YouTube Links</h3>
    
    <div className="flex flex-col gap-4">
      {[...(course.youtubeLinks ?? [])].reverse().map((link, i) => (
        <div key={i} className="flex items-start gap-4">
          <div className="text-red-600 text-2xl mt-1 shrink-0">
            ▶️
          </div>
          <div className="flex flex-col">
            <h4 className="font-semibold text-gray-800 break-words text-base">
              {link.title}
            </h4>
            <p className="text-sm text-gray-600 mb-2">{link.description}</p>
            <a
              href={link.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white-100 bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-md font-medium transition w-fit"
            >
              Watch
            </a>
          </div>
        </div>
      ))}
    </div>
  </div>
)}


            {(course.uploadedResources?.length ?? 0) > 0 && (
  <div>
    <h3 className="text-lg font-semibold text-udemy-black mb-4">Files</h3>
    <div className="flex flex-col gap-4">
      {[...(course.uploadedResources ?? [])].reverse().map((res, i) => (
        <div
          key={i}
          className="w-full p-5 rounded-md shadow-sm hover:shadow-md transition bg-udemy-lightGray border border-gray-200"
        >
          <div className="flex items-start gap-4">
            <div className="text-udemy-purple text-3xl mt-1 shrink-0">
              📄
            </div>
            <div className="flex flex-col">
              <h4 className="font-semibold text-udemy-black break-words text-lg">
                {res.fileName}
              </h4>
              <p className="text-sm text-udemy-gray mb-2">{res.fileType}</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={res.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white-100 bg-udemy-purple hover:bg-udemy-purpleDark px-4 py-1.5 rounded-sm font-medium transition"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}




            {!(course.zoomLinks?.length || course.youtubeLinks?.length || course.uploadedResources?.length) && (
              <p className="text-gray-500 italic">No resources have been added yet.</p>
            )}
          </div>
        </section>



              {/* Course Structure */}
           <section className="bg-white-100 border border-gray-200 rounded-md shadow-sm p-6">
  <h2 className="text-2xl font-bold text-udemy-black flex items-center gap-2 mb-6">
    <BookOpenIcon className="w-6 h-6 text-udemy-purple" />
    Course Structure
  </h2>

  {course.sections?.length > 0 ? (
    course.sections.map((section, i) => (
      <div
        key={section.sectionId}
        className="mb-6 p-6 bg-udemy-lightGray border border-gray-200 rounded-md shadow-sm transition hover:shadow-md"
      >
        <h3 className="text-xl font-semibold text-udemy-black mb-3 flex items-center gap-2">
          <span className="bg-udemy-purpleLight text-udemy-purple px-2 py-0.5 rounded-md text-sm font-bold">
            Section {i + 1}
          </span>
          {section.sectionTitle}
        </h3>

        <ul className="ml-6 list-disc text-udemy-black space-y-2">
          {section.chapters.map((chapter, j) => (
            <li key={chapter.chapterId} className="text-base leading-relaxed">
              <span className="font-medium text-udemy-black">Chapter {j + 1}:</span> {chapter.title}
            </li>
          ))}
        </ul>
      </div>
    ))
  ) : (
    <p className="text-gray-500 italic">No sections available for this course.</p>
  )}
</section>



      </div>
    </div>
  );
};

export default CourseIntro;
