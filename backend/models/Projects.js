import { Schema, model } from "mongoose";

const projectSchema = new Schema(
    {
        _id: { type: String, required: true },
        title: { type: String, required: true },
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
        requiredSkills: [{ type: String, required: true }],
        additionalInfo: { type: String, default: "" },
        representativeId: { type: String, required: true },
    },
    { timestamps: true } 
);

const Project = model("Project", projectSchema);

export default Project;