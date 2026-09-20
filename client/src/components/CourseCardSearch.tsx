import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const CourseCardSearch = ({
  course,
  isSelected,
  onClick,
}: SearchCourseCardProps) => {



  const placeholder = "/placeholderex.png";


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
          <h2 className="course-card-search__title text-black">{course.title}</h2>
          <p className="course-card-search__description text-black">
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
