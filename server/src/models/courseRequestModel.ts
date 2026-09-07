import { Schema, model } from "dynamoose";

// Define the registration code schema
const courseRequestSchema = new Schema(
  {
    code: {
      type: String,
      hashKey: true, // The registration code will be the primary key
      required: true,
    },
    isAccepted: {
      type: Boolean,
      default: false, // Indicates if the code has expired
    },
    userId: {
      type: String,
      required: false, // Optional, stores the user ID if the code has been used
    },
    email: {
      type: String,
      required: true, 
    },
    userName: {
      type: String,
      required: true, 
    },
    phone: {
      type: String,
      required: true, 
    },
    selectedCourseIds: {
      type: Array,
      schema: [String], // Array of strings
      required: true,
    },
    profileImageUrl: {
      type: String,
      required: true, 
    },
  },
  {
    saveUnknown: true, // Allows saving unknown attributes (flexible schema)
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

// Create the model using the schema
const CourseRequest = model("CourseRequest", courseRequestSchema);

// Export the model
export default CourseRequest;
