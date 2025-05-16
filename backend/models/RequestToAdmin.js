import { Schema, model } from "mongoose";

const requestToAdminSchema = new Schema(
    {
        _id: { type: String, required: true },
        type: { 
            type: String, 
            enum: ["editProject", "deleteProject"], 
            required: true 
        },
        projectId: { type: String, required: true },
        requestedBy: { type: String, required: true },
        requestedAt: { type: Date, default: Date.now },
        status: { 
            type: String, 
            enum: ["pending", "approved", "rejected"], 
            default: "pending" 
        },
        actionedBy: { type: String, default: null },
        actionedAt: { type: Date, default: null },
        comments: { type: String, required: true },
        
        // For edit requests only
        proposedChanges: {
            title: { type: String },
            description: { type: String },
            requiredSkills: [{ type: String }],
            duration: {
                startDate: { type: Date },
                endDate: { type: Date }
            },
            // Add other fields that can be edited as needed
        },
        
        // For delete requests
        deleteReason: { type: String }
    },
    { timestamps: true }
);

const RequestToAdmin = model("RequestToAdmin", requestToAdminSchema);

export default RequestToAdmin;