import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import UserCourseProgress from "../models/userCourseProgressModel";
import Course from "../models/courseModel";
import { calculateOverallProgress } from "../utils/utils";
import { mergeSections } from "../utils/utils";

export const getUserEnrolledCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const auth = getAuth(req);

  /*
  // Optional: Enable this block if you want to restrict access only to the user themselves
  if (!auth || auth.userId !== userId) {
    res.status(403).json({ message: "Access denied" });
    return;
  }
  */

  if (!auth) {
    res.status(403).json({ message: "Access denied" });
    return;
  }

  try {
    const enrolledProgress = await UserCourseProgress.query("userId")
      .eq(userId)
      .exec();

    if (!enrolledProgress || enrolledProgress.length === 0) {
      res.status(200).json({
        message: "User has no enrolled courses",
        data: [],
      });
      return;
    }

    const courseIds = enrolledProgress.map((item: any) => item.courseId);
    const courses = await Course.batchGet(courseIds);

    res.status(200).json({
      message: "Enrolled courses retrieved successfully",
      data: courses,
    });
  } catch (error) {
    console.error("Error retrieving enrolled courses:", error);
    res.status(500).json({
      data: [],
      message: "Error retrieving enrolled courses",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getUserCourseProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, courseId } = req.params;

  try {
    const progress = await UserCourseProgress.get({ userId, courseId });
    if (!progress) {
      res
        .status(404)
        .json({ message: "Course progress not found for this user" });
      return;
    }
    res.json({
      message: "Course progress retrieved successfully",
      data: progress,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving user course progress", error });
  }
};

export const updateUserCourseProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, courseId } = req.params;
  const progressData = req.body;

  try {
    let progress = await UserCourseProgress.get({ userId, courseId });
    console.log("enrollling new course", userId, courseId);
    if (!progress) {
      console.log("enrollling new course", userId, courseId);
      // If no progress exists, create initial progress
      progress = new UserCourseProgress({
        userId,
        courseId,
        enrollmentDate: new Date().toISOString(),
        overallProgress: 0,
        sections: progressData.sections || [],
        lastAccessedTimestamp: new Date().toISOString(),
      });
    } else {
      // Merge existing progress with new progress data
      progress.sections = mergeSections(
        progress.sections,
        progressData.sections || []
      );
      progress.lastAccessedTimestamp = new Date().toISOString();
      progress.overallProgress = calculateOverallProgress(progress.sections);
    }

    await progress.save();

    res.json({
      message: "",
      data: progress,
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({
      message: "Error updating user course progress",
      error,
    });
  }
};


export const enrollUserInCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, courseId } = req.body;

  console.log("enrollling new course", userId, courseId);

  if (!userId || !courseId) {
    res.status(400).json({
      message: "userId and courseId are required",
    });
    return;
  }

  try {
    // 1. Fetch course
    
    const course = await Course.get(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    // 2. Check if already enrolled (optional, based on business logic)
    const existingProgress = await UserCourseProgress.query("userId")
      .eq(userId)
      .filter("courseId").eq(courseId)
      .exec();

    if (existingProgress && existingProgress.length > 0) {
      res.status(409).json({
        message: "User already enrolled in this course",
      });
      return;
    }

    // 3. Create initial course progress
    const initialProgress = new UserCourseProgress({
      userId,
      courseId,
      enrollmentDate: new Date().toISOString(),
      overallProgress: 0,
      sections: course.sections.map((section: any) => ({
        sectionId: section.sectionId,
        chapters: section.chapters.map((chapter: any) => ({
          chapterId: chapter.chapterId,
          completed: false,
        })),
      })),
      lastAccessedTimestamp: new Date().toISOString(),
    });
    await initialProgress.save();

    // 4. Add enrollment to course record
    await Course.update(
      { courseId },
      {
        $ADD: {
          enrollments: [{ userId }],
        },
      }
    );

    res.status(200).json({
      message: "User enrolled successfully",
      data: {
        courseProgress: initialProgress,
      },
    });
  } catch (error) {
    console.error("Error enrolling user:", error);
    res.status(500).json({
      message: "Internal server error during enrollment",
      error,
    });
  }
};


export const unenrollUserFromCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, courseId } = req.body;

  console.log("unenrolling user", userId, courseId);

  if (!userId || !courseId) {
    res.status(400).json({
      message: "userId and courseId are required",
    });
    return;
  }

  try {
    // 1. Delete user's progress for this course
    const progressRecords = await UserCourseProgress.query("userId")
      .eq(userId)
      .filter("courseId").eq(courseId)
      .exec();

    if (progressRecords.length === 0) {
      res.status(404).json({
        message: "User is not enrolled in this course",
      });
      return;
    }

    for (const progress of progressRecords) {
      await progress.delete();
    }

    // 2. Remove user from course enrollments. no need to remove enrollmnet since we only blocking access
    /*await Course.update(
      { courseId },
      {
        $DELETE: {
          enrollments: [{ userId }],
        },
      }
    );*/

    res.status(200).json({
  data: { success: true },
  message: "User unenrolled successfully",
});
  } catch (error) {
    console.error("Error unenrolling user:", error);
    res.status(500).json({
      message: "Internal server error during unenrollment",
      error,
    });
  }
};



export const enrollUserInAllSpecialCategoryCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400).json({ message: "userId is required" });
    return;
  }

  const specialCategories = ["Monthly_Common_Case_Discussion", "Youtube_Live_Session"];

  try {
    // 1. Get all course IDs in special categories
    const specialCourses = await Course.scan("category")
      .in(specialCategories)
      .exec();

    if (!specialCourses || specialCourses.length === 0) {
      res.status(404).json({ message: "No special category courses found" });
      return;
    }

    const enrolledCourses = [];

    // 2. Loop through each course and enroll user if not already enrolled
    for (const course of specialCourses) {
      // Check if user already enrolled
      const existingProgress = await UserCourseProgress.query("userId")
        .eq(userId)
        .filter("courseId").eq(course.courseId)
        .exec();

      if (existingProgress && existingProgress.length > 0) {
        // Already enrolled - skip
        continue;
      }

      // Create initial progress
      const initialProgress = new UserCourseProgress({
        userId,
        courseId: course.courseId,
        enrollmentDate: new Date().toISOString(),
        overallProgress: 0,
        sections: course.sections.map((section: any) => ({
          sectionId: section.sectionId,
          chapters: section.chapters.map((chapter: any) => ({
            chapterId: chapter.chapterId,
            completed: false,
          })),
        })),
        lastAccessedTimestamp: new Date().toISOString(),
      });

      await initialProgress.save();

      // Update course enrollment list
      await Course.update(
        { courseId: course.courseId },
        {
          $ADD: {
            enrollments: [{ userId }],
          },
        }
      );

      enrolledCourses.push(course.courseId);
    }

    res.status(200).json({
      message: "User enrolled successfully in special category courses",
      data: {
        enrolledCourseIds: enrolledCourses,
      },
    });
  } catch (error) {
    console.error("Error enrolling user in special courses:", error);
    res.status(500).json({
      message: "Internal server error during enrollment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};



