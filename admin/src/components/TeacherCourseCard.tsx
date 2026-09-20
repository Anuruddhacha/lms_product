import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { MessageCircle, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const TeacherCourseCard = ({
  course,
  onEdit,
  onDelete,
  isOwner,
}: TeacherCourseCardProps) => {

  const placeholder = "/placeholderex.png";

  const router = useRouter();

  return (
    <Card className="course-card-teacher group">
      <CardHeader className="course-card-teacher__header">
  <div className="relative w-full h-48">
  <Image
    src={course.image || placeholder}
    alt={course.title}
    fill
    className="object-cover transition-transform duration-300 group-hover:scale-105"
    priority
  />
</div>

      </CardHeader>

      <CardContent className="course-card-teacher__content">
        <div className="flex flex-col">
          <CardTitle className="course-card-teacher__title">
            {course.title}
          </CardTitle>

          <CardDescription className="course-card-teacher__category">
            {course.category}
          </CardDescription>

          <p className="text-sm mb-2">
            Status:{" "}
            <span
              className={cn(
                "font-semibold px-2 py-1 rounded",
                course.status === "Published"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-red-500/20 text-red-400"
              )}
            >
              {course.status}
            </span>
          </p>
          {course.enrollments && (
            <p className="ml-1 mt-1 inline-block text-secondary bg-secondary/10 text-sm font-normal">
              <span className="font-bold text-secondary-700">
                {course.enrollments.length}
              </span>{" "}
              Student{course.enrollments.length > 1 ? "s" : ""} Enrolled
            </p>
          )}
        </div>

        <div className="w-full xl:flex space-y-2 xl:space-y-0 gap-2 mt-3">
          {isOwner ? (
            <>
              <div>
                <Button
                  className="course-card-teacher__edit-button"
                  onClick={() => onEdit(course)}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
              <div>
                <Button
                  className="course-card-teacher__delete-button"
                  onClick={() => onDelete(course)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
<Button
  variant="ghost"
  size="icon"
  className=" rounded w-full bg-blue-600 text-white-100 hover:bg-blue-400 hover:text-customgreys-primarybg cursor-pointer"
  onClick={() => router.push(`/teacher/courses/${course.courseId}/comments`)}
>
  <MessageCircle className="w-6 h-6" />
</Button>



            </>
          ) : (
            <p className="text-sm text-gray-500 italic">View Only</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherCourseCard;
