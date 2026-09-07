import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const CourseCardSearch = ({
  course,
  isSelected,
  onClick,
}: SearchCourseCardProps) => {

    const categoryPlaceholderMap = {
  ayurvedic: "/ayurveda_placeholder.jpeg",
  beauty: "/beauty_placeholder.jpeg",
  Monthly_Common_Case_Discussion: "/monthly_case_placeholder.jpeg",
  Youtube_Live_Session: "/youtube_live_placeholder.jpeg",
};

// fallback if category is missing or unrecognized
const defaultPlaceholder = "/default_placeholder.jpeg";

const placeholder =
  categoryPlaceholderMap[course.category as keyof typeof categoryPlaceholderMap] ||
  defaultPlaceholder;

  return (
    <div
      onClick={onClick}
      className={`course-card-search group ${
        isSelected
          ? "course-card-search--selected"
          : "course-card-search--unselected"
      }`}
    >
      <div className="course-card-search__image-container">
                 <Image
                  src={course.image || placeholder}
                  alt={course.title}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  priority
                  />
      </div>
      <div className="course-card-search__content">
        <div>
          <h2 className="course-card-search__title">{course.title}</h2>
          <p className="course-card-search__description">
            {course.description}
          </p>
        </div>
        <div className="mt-2">
          <p className="course-card-search__teacher">By {course.teacherName}</p>
          <div className="course-card-search__footer">
            {/*<span className="course-card-search__price">
              {formatPrice(course.price)}
            </span>*/}
            <span className="course-card-search__enrollment">
              {course.enrollments?.length} Enrolled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCardSearch;
