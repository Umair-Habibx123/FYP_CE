import { Schema, model } from "mongoose";

const projectSchema = new Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    projectType: { type: String, required: true },
    difficultyLevel: { type: String, required: true },
    industryName: { type: String, required: true },
    type: { type: String, enum: ["Individual", "Group"], required: true },
    maxStudentsPerGroup: { type: Number },
    maxGroups: { type: Number },
    duration: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
    },
    description: { type: String, required: true },
    attachments: [
      {
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    editStatus: { type: String, enum: ["locked", "unlocked"], required: true },
    unlockedUntil: { type: Date, default: null },
    lastEditRequestId: { type: String, default: "" },
    requiredSkills: [{ type: String, required: true }],
    additionalInfo: { type: String, default: "" },
    representativeId: { type: String, required: true },

  },
  { timestamps: true }
);

const Project = model("Project", projectSchema);

export default Project;



// extensionRequests: [
    //   {
    //     requestId: { type: String, required: true },
    //     requestedBy: { type: String, required: true },
    //     requestedDate: { type: Date, required: true },
    //     requestedEndDate: { type: Date, required: true },
    //     status: {
    //       type: String,
    //       enum: ["pending", "approved", "rejected"],
    //       required: true,
    //     },
    //     reason: { type: String, required: true },
    //     reviewedBy: { type: String },
    //     reviewDate: { type: Date },
    //   },
    // ],

    // approvedExtensions: [
    //   {
    //     extensionId: { type: String, required: true },
    //     originalEndDate: { type: Date, required: true },
    //     newEndDate: { type: Date, required: true },
    //     approvedBy: { type: String, required: true },
    //     approvalDate: { type: Date, required: true },
    //   },
    // ],

    // currentEndDate: { type: Date, required: true },