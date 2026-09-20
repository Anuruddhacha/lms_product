import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

const CourseCard = ({ course, onGoToCourse }: CourseCardProps) => {

  const placeholder = "/placeholderex.png";

  return (
    <Card
      onClick={() => onGoToCourse(course)}
      className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
    >
      <CardHeader className="p-0 overflow-hidden">
        <div className="relative w-full h-56">
          <Image
          src={course.image || placeholder}
          alt={course.title}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          priority
          />

        </div>
      </CardHeader>

      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold mb-2 text-gray-900 dark:text-white line-clamp-2">
          {course.title}
        </CardTitle>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-8 h-8">
            <AvatarImage alt={course.teacherName} />
            <AvatarFallback className="bg-blue-200 text-blue-800 font-medium">
              {course.teacherName?.[0]}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {course.teacherName}
          </p>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {course.category}
          </span>
          {/* Uncomment to show price */}
          {/* <span className="font-medium text-blue-600 dark:text-blue-400">
            {formatPrice(course.price)}
          </span> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
