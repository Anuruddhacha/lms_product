import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";
import { User } from "@clerk/nextjs/server";
import { Clerk } from "@clerk/clerk-js";
import { toast } from "sonner";

const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: any
) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  try {
    const result: any = await baseQuery(args, api, extraOptions);

    if (result.error) {
      const errorData = result.error.data;
      const errorMessage =
        errorData?.message ||
        result.error.status.toString() ||
        "An error occurred";
      toast.error(`Error: ${errorMessage}`);
    }

    const isMutationRequest =
      (args as FetchArgs).method && (args as FetchArgs).method !== "GET";

    if (isMutationRequest) {
      const successMessage = result.data?.message;
      if (successMessage) toast.success(successMessage);
    }

    if (result.data) {
      result.data = result.data.data;
    } else if (
      result.error?.status === 204 ||
      result.meta?.response?.status === 24
    ) {
      return { data: null };
    }

    return result;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return { error: { status: "FETCH_ERROR", error: errorMessage } };
  }
};

export const api = createApi({
  baseQuery: customBaseQuery,
  reducerPath: "api",
  tagTypes: ["Courses", "Users", "UserCourseProgress"],
  endpoints: (build) => ({
    /* 
    ===============
    USER CLERK
    =============== 
    */
    updateUser: build.mutation<User, Partial<User> & { userId: string }>({
      query: ({ userId, ...updatedUser }) => ({
        url: `users/clerk/${userId}`,
        method: "PUT",
        body: updatedUser,
      }),
      invalidatesTags: ["Users"],
    }),


    getAllUsers2: build.query<User[], void>({
      query: () => "users/clerk/allUsers",
    }),

/* 
    ===============
    USER REGISTRATION
    =============== 
    */

    getAllRegistrationCodes: build.query<
  { data: any[]; message: string },
  void
>({
  query: () => ({
    url: "/register/getAllRegistrationCodes", // adjust path if it's different
    method: "GET",
  }),
}),


 acceptRegistrationCode: build.mutation<
      { success: boolean; message?: string }, // Response type
      { code: string } // Request type
    >({
      query: ({code}) => ({
        url: "/register/acceptRegistrationCode", // Adjust endpoint path as needed
        method: "POST",
        body:{code}, // Send the `code` as the body
      }),
    }),

    deleteRegistrationByEmail: build.mutation<
  { success: boolean; message: string },
  string
>({
  query: (email) => ({
    url: "/register/deleteRegistrationByEmail",
    method: "DELETE",
    body: { email },
  }),
}),



    //USERS

  getAllUsers: build.query<DBUser[], void>({
  query: () => "users/getAllUsers",
  providesTags: ["Users"],
}),


deleteUserAndDataByEmail: build.mutation<
  { success: boolean; message: string }, // Response type
  string                                 // Argument type (email)
>({
  query: (email) => ({
    url: "users/delete-user-and-data",
    method: "DELETE",
    body: { email }, // Email passed in the body
  }),
}),




    //PASSCODES

getAllPasscodes: build.query<any[], void>({
  query: () => ({
    url: "/passcodes/getAllPasscodes",
    method: "GET",
  }),
}),


savePasscodeIfNotTaken: build.mutation<
  { success: boolean; message: string; isTaken: boolean },
  { passcode : string; email?: string; phone?: string }
>({
  query: ({ passcode , email, phone }) => ({
    url: "/passcodes/savePasscodeIfNotTaken",
    method: "POST",
    body: { passcode , email, phone },
  }),
}),


updatePasscodeStatus: build.mutation<
  { success: boolean; message: string },
  { passcode : string }
>({
  query: ({ passcode  }) => ({
    url: "/passcodes/updatePasscodeStatus",
    method: "POST",
    body: { passcode  },
  }),
}),


deletePasscodeByCode: build.mutation<
  { success: boolean; message: string },
  { passcode: string }
>({
  query: ({ passcode }) => ({
    url: `/passcodes/deletePasscode/${passcode}`,
    method: "DELETE",
  }),
}),


    /* 
    ===============
    COURSES
    =============== 
    */
    getCourses: build.query<Course[], { category?: string }>({
      query: ({ category }) => ({
        url: "courses",
        params: { category },
      }),
      providesTags: ["Courses"],
    }),

    listAllCourses: build.query<Course[], void>({
      query: () => "getallcourses",
      providesTags: ["Courses"],
    }),

    getCourse: build.query<Course, string>({
      query: (id) => `courses/${id}`,
      providesTags: (result, error, id) => [{ type: "Courses", id }],
    }),

    createCourse: build.mutation<
      Course,
      { teacherId: string; teacherName: string }
    >({
      query: (body) => ({
        url: `courses`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Courses"],
    }),

    updateCourse: build.mutation<
      Course,
      { courseId: string; formData: FormData }
    >({
      query: ({ courseId, formData }) => ({
        url: `courses/${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Courses", id: courseId },
      ],
    }),

    deleteCourse: build.mutation<{ message: string }, string>({
      query: (courseId) => ({
        url: `courses/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),

    getUploadVideoUrl: build.mutation<
      { uploadUrl: string; videoUrl: string },
      {
        courseId: string;
        chapterId: string;
        sectionId: string;
        fileName: string;
        fileType: string;
      }
    >({
      query: ({ courseId, sectionId, chapterId, fileName, fileType }) => ({
        url: `courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/get-upload-url`,
        method: "POST",
        body: { fileName, fileType },
      }),
    }),
  
     getUploadResourseUrl: build.mutation<
      { uploadUrl: string; resourceUrl: string },
      {
        courseId: string;
        fileName: string;
        fileType: string;
      }
    >({
      query: ({ courseId,fileName, fileType }) => ({
        url: `courses/getUploadResourceUrl/${courseId}`,
        method: "POST",
        body: { fileName, fileType },
      }),
    }),


  getCoursesByIds: build.query<Course[], string[]>({
  query: (ids) => ({
    url: `courses/getCoursesByIds`,
    method: "POST",
    body: { courseIds: ids },
  }),
  providesTags: ["Courses"],
}),


deleteResourceFromS3: build.mutation<
  { message: string; key: string },
  { resourceUrl: string }
>({
  query: ({ resourceUrl }) => ({
    url: "courses/deleteResourceFromS3", // adjust path to match your backend route
    method: "POST",
    body: { resourceUrl },
  }),
}),



    /* 
    ===============
    COURSE REQUESTS
    =============== 
    */

    saveCourseRequest: build.mutation<
    { success: boolean; message: string },
    { code: string; isAccepted?: boolean,userId:string,email:string,userName:string, phone:string, selectedCourseIds:string[], profileImageUrl:string}
  >({
    query: ({ code, isAccepted,userId, email, userName, phone, selectedCourseIds, profileImageUrl}) => ({
      url: "/courseRequest/saveCourseRequest",
      method: "POST",
      body: { code, isAccepted,userId, email, userName, phone, selectedCourseIds, profileImageUrl},
    }),
  }),

getAllCourseRequests: build.query<
  { data: any[]; message: string },
  void
>({
  query: () => ({
    url: "/courseRequest/getAllCourseRequests", // adjust path if needed
    method: "GET",
  }),
}),


deleteCourseRequestByEmail: build.mutation<
  { success: boolean; message: string },
  string
>({
  query: (email) => ({
    url: `/courseRequest/deleteCourseRequestByEmail/${email}`,
    method: "DELETE",
  }),
}),

//FEEDBACKS

// Get upload URL for feedback video
getUploadFeedbackVideoUrl: build.mutation<
  { uploadUrl: string; videoUrl: string },
  { fileName: string; fileType: string }
>({
  query: ({ fileName, fileType }) => ({
    url: "feedbacks/getUploadFeedbackVideoUrl",
    method: "POST",
    body: { fileName, fileType },
  }),
}),

// Save feedback
saveFeedback: build.mutation<
  { success: boolean; message: string },
  { feedback: string; feedbackVideoUrl?: string }
>({
  query: ({ feedback, feedbackVideoUrl }) => ({
    url: "feedbacks/saveFeedback",
    method: "POST",
    body: { feedback, feedbackVideoUrl },
  }),
}),

// Get all feedback
getAllFeedback: build.query<
  { data: { id: string; feedback: string; feedbackVideoUrl?: string }[] },
  void
>({
  query: () => ({
    url: "feedbacks/getAllFeedback",
    method: "GET",
  }),
}),

// Delete feedback
deleteFeedback: build.mutation<{ message: string }, string>({
  query: (id) => ({
    url: `feedbacks/deleteFeedback/${id}`,
    method: "DELETE",
  }),
}),





//CONTENTS

getUploadBannerImageUrl: build.mutation<
  { uploadUrl: string; imageUrl: string },
  { fileName: string; fileType: string }
>({
  query: ({ fileName, fileType }) => ({
    url: "contents/banners/getBannerUploadUrl", // adjust based on your route
    method: "POST",
    body: { fileName, fileType },
  }),
}),



saveBanner: build.mutation<
  { success: boolean; message: string },
  { imageUrl: string }
>({
  query: ({ imageUrl }) => ({
    url: "contents/banners/saveBanner", // adjust based on your route
    method: "POST",
    body: { imageUrl },
  }),
}),


getAllBanners: build.query<
  { data: { id: string; imageUrl: string }[] }, // Adjust fields if needed
  void
>({
  query: () => ({
    url: "contents/banners/getAllBanners", // adjust based on your route
    method: "GET",
  }),
}),


deleteBanner: build.mutation<{ message: string }, string>({
  query: (id) => ({
    url: `contents/banners/deleteBanner/${id}`, // adjust if needed
    method: "DELETE",
  }),
}),


//NOTICES


getUploadNoticePdfUrl: build.mutation<
  { uploadUrl: string; pdfUrl: string },
  { fileName: string; fileType: string }
>({
  query: ({ fileName, fileType }) => ({
    url: "contents/notices/getUploadNoticePdfUrl",
    method: "POST",
    body: { fileName, fileType },
  }),
}),


saveNotice: build.mutation<
  { success: boolean; message: string },
  { pdfUrl: string; notice: string }
>({
  query: ({ pdfUrl, notice }) => ({
    url: "contents/notices/saveNotice",
    method: "POST",
    body: { pdfUrl, notice },
  }),
}),


getAllNotices: build.query<
  {
    data: {
      id: string;
      pdfUrl: string;
      notice: string;
      createdAt?: string;
      updatedAt?: string;
    }[];
  },
  void
>({
  query: () => ({
    url: "contents/notices/getAllNotices",
    method: "GET",
  }),
}),


deleteNotice: build.mutation<{ message: string }, string>({
  query: (id) => ({
    url: `contents/notices/deleteNotice/${id}`,
    method: "DELETE",
  }),
}),


//COMMENTS


// Add a new comment
addComment: build.mutation<
  { message: string; data: { success: boolean } },
  {
    comment: string;
    chapterId: string;
    userId: string;
  }
>({
  query: ({ comment, chapterId, userId }) => ({
    url: "/commentsection/comments/addComment",
    method: "POST",
    body: { comment, chapterId, userId },
  }),
}),

// Delete a comment by ID
deleteComment: build.mutation<
  { message: string; data: any },
  string // comment ID
>({
  query: (id) => ({
    url: `/commentsection/comments/${id}`,
    method: "DELETE",
  }),
}),

// Get all comments for a chapter
getCommentsByChapterId: build.query<
  { comments: any[] },
  string // chapterId
>({
  query: (chapterId) => ({
    url: `/commentsection/comments/chapter/${chapterId}`,
    method: "GET",
  }),
}),

// Update a comment with reply
replyToComment: build.mutation<
  { message: string; data: any },
  {
    id: string;
    reply: string;
  }
>({
  query: ({ id, reply }) => ({
    url: `/commentsection/comments/${id}/reply`,
    method: "PUT",
    body: { reply },
  }),
}),


//USERS

getUserById: build.query<DBUser, string>({
  query: (userId) => `users/getUserById/${userId}`,
  providesTags: ["Users"],
}),


deleteUserByEmail: build.mutation<
  { success: boolean; message: string },
  string
>({
  query: (email) => ({
    url: `users/deleteUserByEmail`,
    method: "DELETE",
    body: { email },
  }),
  invalidatesTags: ["Users"],
}),




//Gallery


getUploadGalleryImageUrl: build.mutation<
  { uploadUrl: string; imageUrl: string },
  { fileName: string; fileType: string }
>({
  query: ({ fileName, fileType }) => ({
    url: "contents/gallery/getUploadGalleryImageUrl",
    method: "POST",
    body: { fileName, fileType },
  }),
}),

saveGalleryImage: build.mutation<
  { success: boolean; message: string },
  { imageUrl: string }
>({
  query: ({ imageUrl }) => ({
    url: "contents/gallery/saveGalleryImage",
    method: "POST",
    body: { imageUrl },
  }),
}),

getAllGalleryImages: build.query<
  { data: { id: string; imageUrl: string }[] },
  void
>({
  query: () => ({
    url: "contents/gallery/getAllGalleryImages",
    method: "GET",
  }),
}),

deleteGalleryImage: build.mutation<{ message: string }, string>({
  query: (id) => ({
    url: `contents/gallery/deleteGalleryImage/${id}`,
    method: "DELETE",
  }),
}),




// services/contentApi.ts (or wherever your API slice is defined)

getUploadEventImageUrl: build.mutation<
  { uploadUrl: string; imageUrl: string },
  { fileName: string; fileType: string }
>({
  query: ({ fileName, fileType }) => ({
    url: "contents/events/getUploadEventImageUrl",
    method: "POST",
    body: { fileName, fileType },
  }),
}),

saveEvent2: build.mutation<
  { success: boolean; message: string },
  {
    title: string;
    date: string;
    description: string;
    imageUrl?: string;
  }
>({
  query: ({ title, date, description, imageUrl }) => ({
    url: "contents/events/saveEvent",
    method: "POST",
    body: { title, date, description, imageUrl },
  }),
}),


saveEvent: build.mutation<
  { success: boolean; message: string },
  {
    title: string;
    date: string;
    description: string;
    imageUrl?: string;
    subImages?: string[];   // Add subImages here
  }
>({
  query: ({ title, date, description, imageUrl, subImages }) => ({
    url: "contents/events/saveEvent",
    method: "POST",
    body: { title, date, description, imageUrl, subImages },  // Pass subImages in body
  }),
}),


getAllEvents: build.query<
  {
    data: {
      id: string;
      title: string;
      date: string;
      description: string;
      imageUrl?: string;
    }[];
  },
  void
>({
  query: () => ({
    url: "contents/events/getAllEvents",
    method: "GET",
  }),
}),

deleteEvent: build.mutation<{ message: string }, string>({
  query: (id) => ({
    url: `contents/events/deleteEvent/${id}`,
    method: "DELETE",
  }),
}),

//YOUTUBE

// --- YouTube‑link endpoints ----------------------------------------------
saveYouTubeLink: build.mutation<
  { success: boolean; message: string },
  { youtubeUrl: string }
>({
  query: ({ youtubeUrl }) => ({
    url: "youtube/saveYouTubeLink",
    method: "POST",
    body: { youtubeUrl },
  }),
}),

getAllYouTubeLinks: build.query<
  {
    data: {
      id: string;
      youtubeUrl: string;
    }[];
  },
  void
>({
  query: () => ({
    url: "youtube/getAllYouTubeLinks",
    method: "GET",
  }),
}),

deleteYouTubeLink: build.mutation<{ message: string }, string>({
  query: (id) => ({
    url: `youtube/deleteYouTubeLink/${id}`,
    method: "DELETE",
  }),
}),
// -------------------------------------------------------------------------



//OBJECTS


deleteObjectByUrl: build.mutation<
  { message: string; data: { key: string } },  // response type
  { url: string }                             // input type
>({
  query: ({ url }) => ({
    url: "s3objects/delete-object",
    method: "POST",
    body: { url },
  }),
}),

// Deletes the raw source AND the entire HLS output prefix (all
// variant playlists + segments) for a video, not just one key.
deleteVideoAssets: build.mutation<
  { message: string; data: { videoId: string; deletedCount: number; deletedKeys: string[] } },
  { videoId?: string; url?: string }
>({
  query: (body) => ({
    url: "s3objects/delete-video-assets",
    method: "POST",
    body,
  }),
}),





    /* 
    ===============
    TRANSACTIONS
    =============== 
    */
    getTransactions: build.query<Transaction[], string>({
      query: (userId) => `transactions?userId=${userId}`,
    }),
    createStripePaymentIntent: build.mutation<
      { clientSecret: string },
      { amount: number }
    >({
      query: ({ amount }) => ({
        url: `/transactions/stripe/payment-intent`,
        method: "POST",
        body: { amount },
      }),
    }),
    createTransaction: build.mutation<Transaction, Partial<Transaction>>({
      query: (transaction) => ({
        url: "transactions",
        method: "POST",
        body: transaction,
      }),
    }),

    /* 
    ===============
    USER COURSE PROGRESS
    =============== 
    */
    getUserEnrolledCourses: build.query<Course[], string>({
      query: (userId) => `users/course-progress/${userId}/enrolled-courses`,
      providesTags: ["Courses", "UserCourseProgress"],
    }),

    getUserCourseProgress: build.query<
      UserCourseProgress,
      { userId: string; courseId: string }
    >({
      query: ({ userId, courseId }) =>
        `users/course-progress/${userId}/courses/${courseId}`,
      providesTags: ["UserCourseProgress"],
    }),

  enrollUserInCourse: build.mutation<
  UserCourseProgress,
  { userId: string; courseId: string }
>({
  query: ({ userId, courseId }) => ({
    url: `users/course-progress/enrollUserInCourse`,
    method: "POST",
    body: { userId, courseId },
  }),
  invalidatesTags: ["UserCourseProgress", "Courses"],
}),


unenrollUserFromCourse: build.mutation<
  { success: boolean }, // or any other appropriate response shape
  { userId: string; courseId: string }
>({
  query: ({ userId, courseId }) => ({
    url: `users/course-progress/unenrollUserFromCourse`,
    method: "POST",
    body: { userId, courseId },
  }),
  invalidatesTags: ["UserCourseProgress", "Courses"],
}),



    updateUserCourseProgress: build.mutation<
      UserCourseProgress,
      {
        userId: string;
        courseId: string;
        progressData: {
          sections: SectionProgress[];
        };
      }
    >({
      query: ({ userId, courseId, progressData }) => ({
        url: `users/course-progress/${userId}/courses/${courseId}`,
        method: "PUT",
        body: progressData,
      }),
      invalidatesTags: ["UserCourseProgress"],
      async onQueryStarted(
        { userId, courseId, progressData },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          api.util.updateQueryData(
            "getUserCourseProgress",
            { userId, courseId },
            (draft) => {
              Object.assign(draft, {
                ...draft,
                sections: progressData.sections,
              });
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetCoursesQuery,
  useListAllCoursesQuery,
  useGetCourseQuery,
  useGetUploadVideoUrlMutation,
  useGetUploadResourseUrlMutation,


  useGetTransactionsQuery,
  useCreateTransactionMutation,
  useCreateStripePaymentIntentMutation,
  useGetUserEnrolledCoursesQuery,
  useGetUserCourseProgressQuery,
  useUpdateUserCourseProgressMutation,
  useEnrollUserInCourseMutation,
  useUnenrollUserFromCourseMutation,

  useGetAllRegistrationCodesQuery,
  useAcceptRegistrationCodeMutation,

  useGetAllCourseRequestsQuery,
  useSaveCourseRequestMutation,

  useGetCoursesByIdsQuery,

  useDeleteResourceFromS3Mutation,

  useGetUploadBannerImageUrlMutation,
  useSaveBannerMutation,
  useGetAllBannersQuery,
  useDeleteBannerMutation,
  useGetUploadEventImageUrlMutation,
  useSaveEventMutation,
  useGetAllEventsQuery, 
  useDeleteEventMutation,

  useGetUploadGalleryImageUrlMutation,
  useSaveGalleryImageMutation,  
  useGetAllGalleryImagesQuery,
  useDeleteGalleryImageMutation,

  useGetUploadNoticePdfUrlMutation,
  useSaveNoticeMutation,
  useGetAllNoticesQuery,
  useDeleteNoticeMutation,

  useDeleteObjectByUrlMutation,
  useDeleteVideoAssetsMutation,

  useGetAllPasscodesQuery,
  useSavePasscodeIfNotTakenMutation,  
  useUpdatePasscodeStatusMutation,
  useDeletePasscodeByCodeMutation,

  useAddCommentMutation,
  useDeleteCommentMutation, 
  useGetCommentsByChapterIdQuery,
  useReplyToCommentMutation,

  useGetUserByIdQuery,

  useDeleteYouTubeLinkMutation,
  useGetAllYouTubeLinksQuery, 
  useSaveYouTubeLinkMutation,

  useDeleteCourseRequestByEmailMutation,
  useDeleteUserByEmailMutation,
  useDeleteRegistrationByEmailMutation,
  useDeleteUserAndDataByEmailMutation,

  useGetUploadFeedbackVideoUrlMutation,
  useSaveFeedbackMutation,
  useGetAllFeedbackQuery,
  useDeleteFeedbackMutation,

} = api;
