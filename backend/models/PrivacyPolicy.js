import { Schema, model } from "mongoose";

const SectionSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    listItems: { type: [String], default: [] } 
});

const PrivacyPolicySchema = new Schema(
    {
        lastUpdated: { type: Date, default: Date.now },
        sections: [SectionSchema], 
        role: { type: String, required: true, enum: ["industry", "student", "teacher", "main"] } 
    },
    { timestamps: true }
);

const PrivacyPolicy = model("PrivacyPolicy", PrivacyPolicySchema);

export default PrivacyPolicy;

