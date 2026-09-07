import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import * as dynamoose from "dynamoose";
import serverless from "serverless-http";
import seed from "./seed/seedDynamodb";
import {
  clerkMiddleware,
  createClerkClient
} from "@clerk/express";
/* ROUTE IMPORTS */
import courseRoutes from "./routes/courseRoutes";
import { listAllCourse } from "./controllers/courseController";
import userClerkRoutes from "./routes/userClerkRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import userCourseProgressRoutes from "./routes/userCourseProgressRoutes";
import registerRoutes from "./routes/registerRoutes";
import courseRequestRoutes from "./routes/courseRequestRoutes";
import userRoutes from "./routes/userRoutes";
import paymentsRoute from "./routes/paymentsRoute";
import contentsRoutes from "./routes/contentsRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import objectRoutes from "./routes/objectRoutes";
import passcodeRoutes from "./routes/passcodeRoutes";
import commentRoutes from "./routes/commentRoutes";
import youtubeLinksRoutes from "./routes/youtubeLinksRoutes";
import feedbackRoutes from "./routes/feedbacksRoutes"; // Import feedback routes
import multipartRoutes from "./routes/multipartRoutes";

/* CONFIGURATIONS */
dotenv.config();
const isProduction = process.env.NODE_ENV === "production";
if (!isProduction) {
  dynamoose.aws.ddb.local();
}

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const app = express();

const getAllCoursesRouter = express.Router();
getAllCoursesRouter.get("/", listAllCourse);

// CORS must run first so OPTIONS preflight and error responses still get browser-safe headers.
// `origin: true` echoes the request `Origin` (needed for credentialed / Authorization requests from Vercel previews).
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    maxAge: 86400,
  })
);

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(clerkMiddleware());

/* ROUTES */
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/getallcourses", getAllCoursesRouter);
app.use("/courses", courseRoutes);
app.use("/users/clerk", userClerkRoutes);
app.use("/transactions", transactionRoutes);
app.use("/users/course-progress", userCourseProgressRoutes);
app.use("/register", registerRoutes);
app.use("/courseRequest", courseRequestRoutes);
app.use("/users", userRoutes);
app.use("/payments", paymentsRoute);
app.use("/contents", contentsRoutes);
app.use("/reviews", reviewRoutes);
app.use("/s3objects", objectRoutes);
app.use("/passcodes", passcodeRoutes);
app.use("/commentsection", commentRoutes);
app.use("/youtube", youtubeLinksRoutes); // Ensure you have youtubeRoutes imported correctly
app.use("/feedbacks", feedbackRoutes); // Import feedback routes
app.use("/api", multipartRoutes);

/* SERVER */
const port = process.env.PORT || 3000;
if (!isProduction) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// aws production environment
const serverlessApp = serverless(app);
export const handler = async (event: any, context: any) => {
  if (event.action === "seed") {
    await seed();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data seeded successfully" }),
    };
  } else {
    return serverlessApp(event, context);
  }
};
