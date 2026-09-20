import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  CheckCircle,
  Trophy,
  Menu,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import Loading from "@/components/Loading";
import { useCourseProgressData } from "@/hooks/useCourseProgressData";

const ChaptersSidebar2 = () => {
  const router = useRouter();
  const { setOpen } = useSidebar();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const {
    user,
    course,
    userProgress,
    chapterId,
    courseId,
    isLoading,
    updateChapterProgress,
  } = useCourseProgressData();

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) return <Loading />;
  if (!user) return <div>Please sign in to view course progress.</div>;
  if (!course || !userProgress) return <div>Error loading course content</div>;

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prevSections) =>
      prevSections.includes(sectionTitle)
        ? prevSections.filter((title) => title !== sectionTitle)
        : [...prevSections, sectionTitle]
    );
  };

  const handleChapterClick = (sectionId: string, chapterId: string) => {
    router.push(`/user/courses/${courseId}/chapters/${chapterId}`, {
      scroll: false,
    });
  };

  return (
    <div ref={sidebarRef} className="chapters-sidebar flex-col bg-white text-gray-800 border-r border-gray-200 p-4">
      <div className="chapters-sidebar__header mb-4">
        <h2 className="chapters-sidebar__title text-xl font-bold text-blue-600">{course.title}</h2>
        <hr className="chapters-sidebar__divider border-t border-gray-200 my-3" />
      </div>
      {course.sections.map((section, index) => (
        <Section
          key={section.sectionId}
          section={section}
          index={index}
          sectionProgress={userProgress.sections.find(
            (s) => s.sectionId === section.sectionId
          )}
          chapterId={chapterId as string}
          courseId={courseId as string}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          handleChapterClick={handleChapterClick}
          updateChapterProgress={updateChapterProgress}
        />
      ))}
    </div>
  );
};


const ChaptersSidebar = () => {
  const router = useRouter();
  const { setOpen } = useSidebar();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);

  const {
    user,
    course,
    userProgress,
    chapterId,
    courseId,
    isLoading,
    updateChapterProgress,
  } = useCourseProgressData();

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) return <Loading />;
  if (!user) return <div>Please sign in to view course progress.</div>;
  if (!course || !userProgress) return <div>Error loading course content</div>;

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prevSections) =>
      prevSections.includes(sectionTitle)
        ? prevSections.filter((title) => title !== sectionTitle)
        : [...prevSections, sectionTitle]
    );
  };

  const handleChapterClick = (sectionId: string, chapterId: string) => {
    router.push(`/user/courses/${courseId}/chapters/${chapterId}`, {
      scroll: false,
    });
    setShowSidebar(false); // hide on mobile after click
  };

  return (
    <>
      {/* Toggle Button - only visible on mobile */}
      <button
        className="lg:hidden fixed top-4 left-12 z-50 bg-white rounded-full p-2 shadow-md border bg-blue-500 border-gray-300"
        onClick={() => setShowSidebar((prev) => !prev)}
      >
        {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
       className={`
  chapters-sidebar flex-col bg-white text-gray-800 border-r border-gray-200 p-4
  transition-transform duration-300 ease-in-out

  lg:translate-x-0 lg:relative lg:h-auto lg:min-w-[18rem] lg:max-w-[100%] lg:flex
  fixed top-0 left-0 h-full min-w-[18rem] max-w-[90vw] z-40
  ${showSidebar ? "translate-x-0" : "-translate-x-full"}
`}


      >
        <div className="chapters-sidebar__header mb-4">
          <h2 className="chapters-sidebar__title text-xl font-bold text-blue-600">
            {course.title}
          </h2>
          <hr className="chapters-sidebar__divider border-t border-gray-200 my-3" />
        </div>

        {course.sections.map((section, index) => (
          <Section
            key={section.sectionId}
            section={section}
            index={index}
            sectionProgress={userProgress.sections.find(
              (s) => s.sectionId === section.sectionId
            )}
            chapterId={chapterId as string}
            courseId={courseId as string}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            handleChapterClick={handleChapterClick}
            updateChapterProgress={updateChapterProgress}
          />
        ))}
      </div>
    </>
  );
};

const Section = ({
  section,
  index,
  sectionProgress,
  chapterId,
  courseId,
  expandedSections,
  toggleSection,
  handleChapterClick,
  updateChapterProgress,
}: {
  section: any;
  index: number;
  sectionProgress: any;
  chapterId: string;
  courseId: string;
  expandedSections: string[];
  toggleSection: (sectionTitle: string) => void;
  handleChapterClick: (sectionId: string, chapterId: string) => void;
  updateChapterProgress: (
    sectionId: string,
    chapterId: string,
    completed: boolean
  ) => void;
}) => {
  const completedChapters =
    sectionProgress?.chapters.filter((c: any) => c.completed).length || 0;
  const totalChapters = section.chapters.length;
  const isExpanded = expandedSections.includes(section.sectionTitle);

  return (
    <div className="chapters-sidebar__section">
      <div
        onClick={() => toggleSection(section.sectionTitle)}
        className="chapters-sidebar__section-header flex justify-between items-center cursor-pointer hover:bg-blue-50 px-3 py-2 rounded transition"
      >
        <div className="chapters-sidebar__section-title-wrapper flex items-center gap-2">
          <p className=" text-md  text-black font-bold">
            Section 0{index + 1}
          </p>
          {isExpanded ? (
            <ChevronUp className=" text-black" />
          ) : (
            <ChevronDown className=" text-black" />
          )}
        </div>
        <h3 className="text-black text-md font-semibold">
          {section.sectionTitle}
        </h3>
      </div>
      <hr className="chapters-sidebar__divider" />

      {isExpanded && (
        <div className="chapters-sidebar__section-content">
          <ProgressVisuals
            section={section}
            sectionProgress={sectionProgress}
            completedChapters={completedChapters}
            totalChapters={totalChapters}
          />
          <ChaptersList
            section={section}
            sectionProgress={sectionProgress}
            chapterId={chapterId}
            courseId={courseId}
            handleChapterClick={handleChapterClick}
            updateChapterProgress={updateChapterProgress}
          />

           {/* Add Resource list here */}
          <ResourcesList resources={section.resources || []} />

        </div>
      )}
      <hr className="chapters-sidebar__divider" />
    </div>
  );
};

const ProgressVisuals = ({
  section,
  sectionProgress,
  completedChapters,
  totalChapters,
}: {
  section: any;
  sectionProgress: any;
  completedChapters: number;
  totalChapters: number;
}) => {
  return (
    <>
      <div className="chapters-sidebar__progress flex items-center justify-between mt-2 mb-1">
        <div className="chapters-sidebar__progress-bars flex gap-1 w-full max-w-[80%]">
          {section.chapters.map((chapter: any) => {
            const isCompleted = sectionProgress?.chapters.find(
              (c: any) => c.chapterId === chapter.chapterId
            )?.completed;
            return (
              <div
                key={chapter.chapterId}
                className={cn(
                  "chapters-sidebar__progress-bar w-full h-2 bg-gray-200 rounded",
                  isCompleted && "chapters-sidebar__progress-bar--completed bg-blue-500"
                )}
              ></div>
            );
          })}
        </div>
        <div className="chapters-sidebar__trophy">
          <Trophy className="chapters-sidebar__trophy-icon text-blue-400" />
        </div>
      </div>
      <p className="chapters-sidebar__progress-text text-sm text-black">
        {completedChapters}/{totalChapters} COMPLETED
      </p>
    </>
  );
};



const ResourcesList = ({
  resources,
}: {
  resources: { fileName: string; fileType: string; fileUrl: string }[];
}) => {
  if (!resources || resources.length === 0) return null;

  const truncateName = (name: string, maxLength = 25) => {
    return name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;
  };

   return (
    <div className="chapters-sidebar__resources-wrapper">
      <p className="chapters-sidebar__resources-title text-black font-bold">Resources of this section</p>
      <ul className="chapters-sidebar__resources">
        {resources.map((resource, idx) => (
          <li
            key={idx}
            className="chapters-sidebar__resource-item flex items-center justify-between py-1 px-2 rounded-md hover:bg-muted transition"
          >
            <span
              className="chapters-sidebar__resource-name text-sm truncate max-w-[70%]"
              title={resource.fileName}
            >
              {truncateName(resource.fileName)}
            </span>
            <a
              href={resource.fileUrl}
              download={resource.fileName}
              target="_blank"
              rel="noopener noreferrer"
              title={`Download ${resource.fileName}`}
              className="chapters-sidebar__resource-download-btn text-xs text-white bg-purple-400 hover:bg-purple-500 px-3 py-1 rounded transition"
            >
              Download
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};



const ChaptersList = ({
  section,
  sectionProgress,
  chapterId,
  courseId,
  handleChapterClick,
  updateChapterProgress,
}: {
  section: any;
  sectionProgress: any;
  chapterId: string;
  courseId: string;
  handleChapterClick: (sectionId: string, chapterId: string) => void;
  updateChapterProgress: (
    sectionId: string,
    chapterId: string,
    completed: boolean
  ) => void;
}) => {
  return (
    <ul className="chapters-sidebar__chapters  mt-3 space-y-1">
      {section.chapters.map((chapter: any, index: number) => (
        <Chapter
          key={chapter.chapterId}
          chapter={chapter}
          index={index}
          sectionId={section.sectionId}
          sectionProgress={sectionProgress}
          chapterId={chapterId}
          courseId={courseId}
          handleChapterClick={handleChapterClick}
          updateChapterProgress={updateChapterProgress}
        />
      ))}
    </ul>
  );
};

const Chapter = ({
  chapter,
  index,
  sectionId,
  sectionProgress,
  chapterId,
  courseId,
  handleChapterClick,
  updateChapterProgress,
}: {
  chapter: any;
  index: number;
  sectionId: string;
  sectionProgress: any;
  chapterId: string;
  courseId: string;
  handleChapterClick: (sectionId: string, chapterId: string) => void;
  updateChapterProgress: (
    sectionId: string,
    chapterId: string,
    completed: boolean
  ) => void;
}) => {
  const chapterProgress = sectionProgress?.chapters.find(
    (c: any) => c.chapterId === chapter.chapterId
  );
  const isCompleted = chapterProgress?.completed;
  const isCurrentChapter = chapterId === chapter.chapterId;

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();

    updateChapterProgress(sectionId, chapter.chapterId, !isCompleted);
  };

  return (
    <li
      className={cn("chapters-sidebar__chapter flex items-center justify-between cursor-pointer hover:bg-blue-50 px-3 py-2 rounded transition", {
        "chapters-sidebar__chapter--current bg-blue-100": isCurrentChapter,
      })}
      onClick={() => handleChapterClick(sectionId, chapter.chapterId)}
    >
      {isCompleted ? (
        <div
          className="chapters-sidebar__chapter-check text-blue-600 cursor-pointer"
          onClick={handleToggleComplete}
          title="Toggle completion status"
        >
          <CheckCircle className="chapters-sidebar__check-icon w-5 h-5" />
        </div>
      ) : (
        <div
          className={cn("chapters-sidebar__chapter-number w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700", {
            "chapters-sidebar__chapter-number--current bg-blue-500 text-white": isCurrentChapter,
          })}
        >
          {index + 1}
        </div>
      )}
      <span
        className={cn("chapters-sidebar__chapter-title flex-1 ml-3 text-sm font-medium text-black dark:text-black", {
          "chapters-sidebar__chapter-title--completed line-through text-black dark:text-black": isCompleted,
          "chapters-sidebar__chapter-title--current text-black font-semibold dark:text-black": isCurrentChapter,
        })}
      >
        {chapter.title}
      </span>
      {chapter.type === "Text" && (
        <FileText className="chapters-sidebar__text-icon w-4 h-4 text-black" />
      )}
    </li>
  );
};

export default ChaptersSidebar;
