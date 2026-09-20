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

    /* 
    ===============
    USER REGISTRATION CODE
    =============== 
    */

   

  checkRegistrationCodeStatus: build.mutation<
  { success: boolean;isFirstTime: boolean;isPending:boolean;isAccepted:boolean;isHolted:boolean;message?: string },
  { code: string, email: string }
>({
  query: ({ code, email }) => ({
    url: "/register/checkRegistrationCodeStatus",
    method: "POST",
    body: { code, email },
  }),
}),

saveRegistrationCodeIfNew: build.mutation<
  { success: boolean; alreadyExists?: boolean; message?: string },
  { code: string; email: string, isSavingRequest?: boolean }
>({
  query: ({ code, email, isSavingRequest }) => ({
    url: "/register/saveRegistrationCodeIfNew",
    method: "POST",
    body: { code, email, isSavingRequest },
  }),
}),

registerAnotherCodeForExistingUser: build.mutation<
  { success: boolean; alreadyExists?: boolean; message?: string },
  { code: string; email: string }
>({
  query: ({ code, email }) => ({
    url: "/register/registerAnotherCodeForExistingUser",
    method: "POST",
    body: { code, email },
  }),
}),



updateRegistrationStatus: build.mutation<
  { success: boolean; message: string },
  { code: string;isRegistered?: boolean }
>({
  query: ({ code,isRegistered }) => ({
    url: "/register/updateRegistrationStatus",
    method: "POST",
    body: { code,isRegistered },
  }),
}),

/* 
    ===============
    USER
    =============== 
    */

saveUser: build.mutation<
  { success: boolean; message: string },
  {
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
    profileImage?: string;
  }
>({
  query: ({
    id,
    name,
    email,
    phone,
    address,
    profileImage,
  }) => ({
    url: "/users/saveUser", // Replace with your actual endpoint
    method: "POST",
    body: {
    id,
    name,
    email,
    phone,
    address,
    profileImage,},
  }),
}),


getUploadProfileImageUrl: build.mutation<
  { uploadUrl: string; imageUrl: string },
  { fileName: string; fileType: string }
>({
  query: ({ fileName, fileType }) => ({
    url: `users/getUploadProfileImageUrl`,
    method: "POST",
    body: { fileName, fileType },
  }),
}),

getUserById: build.query<DBUser, string>({
  query: (userId) => `users/getUserById/${userId}`,
  providesTags: ["Users"],
}),


// in your api slice
registerUserAtomic: build.mutation<RegisterUserResponse, RegisterUserPayload>({
  query: (body) => ({
    url: "users/register-user",
    method: "POST",
    body,
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
  { success: boolean; courseRequests: any[] },
  void
>({
  query: () => ({
    url: "/register/getAllCourseRequests", // Adjust the path if needed
    method: "GET",
  }),
}),

//REVIEWS

// Save a review
saveReview: build.mutation<
  { message: string; data: { success: boolean } },
  {
    name: string;
    role: string;
    feedback: string;
    rating: number;
  }
>({
  query: ({ name, role, feedback, rating }) => ({
    url: "/reviews/saveReview",
    method: "POST",
    body: { name, role, feedback, rating },
  }),
}),

// Get all reviews
getAllReviews: build.query<
  { message: string; data: { data: any[] } },
  { isTop: boolean }
>({
  query: ({ isTop }) => ({
    url: `/reviews/getAllReviews?isTop=${isTop}`,
    method: "GET",
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


//YOUTUBE

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




//PASSCODES


isPasscodeTaken: build.query<
  {
    isTaken: boolean; success: boolean; message: string 
},
  { passcode: string }
>({
  query: ({ passcode }) => ({
    url: `/passcodes/is-taken/${passcode}`,
    method: "GET",
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

//FEEDBACKS

getAllFeedback: build.query<
  { data: { id: string; feedback: string; feedbackVideoUrl?: string }[] },
  void
>({
  query: () => ({
    url: "feedbacks/getAllFeedback",
    method: "GET",
  }),
}),





//BANNERS

getAllBanners: build.query<
  { data: { id: string; imageUrl: string }[] }, // Adjust fields if needed
  void
>({
  query: () => ({
    url: "contents/banners/getAllBanners", // adjust based on your route
    method: "GET",
  }),
}),


getAllEvents: build.query<
  {
    data: {
      subImages: never[];
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



getAllGalleryImages: build.query<
  { data: { id: string; imageUrl: string }[] },
  void
>({
  query: () => ({
    url: "contents/gallery/getAllGalleryImages",
    method: "GET",
  }),
}),

//NOTICES

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

    /** Projected course list (same as `GET /getallcourses` / admin `listAllCourses`) — no sections/chapters. */
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



    //PAYMENTS
createPaymentSession: build.mutation<
  { session: { id: string }; successIndicator?: string; orderId?: string },
  { amount: number; description?: string, isNTB: boolean }
>({
  query: ({ amount, description, isNTB }) => ({
    url: "/payments/create-session",
    method: "POST",
    body: {
      amount,
      description,
      isNTB
    },
  }),
}),




verifyPayment: build.query<any, string>({
  query: (orderId) => ({
    url: `/payments/verify?orderId=${orderId}`,
    method: "GET",
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
  useUpdateUserMutation,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetCoursesQuery,
  useListAllCoursesQuery,
  useGetCourseQuery,
  useGetUploadVideoUrlMutation,
  useGetTransactionsQuery,
  useCreateTransactionMutation,
  useCreateStripePaymentIntentMutation,
  useGetUserEnrolledCoursesQuery,
  useGetUserCourseProgressQuery,
  useUpdateUserCourseProgressMutation,

  useCheckRegistrationCodeStatusMutation,
  useSaveRegistrationCodeIfNewMutation,
  useRegisterAnotherCodeForExistingUserMutation,

  useSaveCourseRequestMutation,

  useSaveUserMutation,
  useGetUploadProfileImageUrlMutation,
  useGetUserByIdQuery,

  useCreatePaymentSessionMutation,
  useVerifyPaymentQuery,

  useGetAllBannersQuery,
  useGetAllEventsQuery,
  useGetAllGalleryImagesQuery,

  useGetAllNoticesQuery,

  useSaveReviewMutation,
  useGetAllReviewsQuery,

  useIsPasscodeTakenQuery,
  useLazyIsPasscodeTakenQuery,
  useUpdatePasscodeStatusMutation,

  useAddCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsByChapterIdQuery,

  useGetAllYouTubeLinksQuery,
  useRegisterUserAtomicMutation,

  useGetAllFeedbackQuery,

} = api;
