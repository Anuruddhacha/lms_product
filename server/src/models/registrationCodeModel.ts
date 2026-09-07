import { Schema, model } from "dynamoose";

// Define the registration code schema
const registrationCodeSchema = new Schema(
  {
    code: {
      type: String,
      hashKey: true, // The registration code will be the primary key
      required: true,
    },
    isExpired: {
      type: Boolean,
      default: false, // Indicates if the code has expired
    },
    isHolted: {
      type: Boolean,
      default: false, // NEW: Whether this code is temporarily blocked
    },
    isPending: {
      type: Boolean,
      default: false, // Indicates if the code has expired
    },
    isAccepted: {
      type: Boolean,
      default: false, // Indicates if the code has expired
    },
    expirationDate: {
      type: String,
      required: false, // Optional, can store expiration date in ISO format
    },
    usedByUserId: {
      type: String,
      required: false, // Optional, stores the user ID if the code has been used
    },
    email: {
      type: String,
      required: true, 
    },
    isRegistered: {
      type: Boolean,
      required: true, 
    },
  },
  {
    saveUnknown: true, // Allows saving unknown attributes (flexible schema)
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

// Create the model using the schema
const RegistrationCode = model("RegistrationCode", registrationCodeSchema);

// Export the model
export default RegistrationCode;
