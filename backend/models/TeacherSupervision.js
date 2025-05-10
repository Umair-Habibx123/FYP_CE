import { Schema, model } from "mongoose";

const TeacherSupervisionSchema = new Schema(
    {
        _id: { type: String, required: true },
        supervisedBy: [
            {
                teacherId: { type: String, required: true },
                fullName: { type: String, required: true },
                university: { type: String, required: true },
                email: { type: String, required: true },
                responseFromInd: {
                    status: { type: String, enum: ["approved", "pending", "rejected"], default: "pending" },
                    comments: { type: String, default: null },
                    actionBy: { type: String, default: null },
                    actionedAt: { type: Date, default: null }
                }
            },
        ],
    },
    { timestamps: true }
);


TeacherSupervisionSchema.pre('save', function (next) {
    this.supervisedBy.forEach(supervisedBy => {
        if (supervisedBy.responseFromInd.isModified('status') && supervisedBy.responseFromInd.status) {
            supervisedBy.responseFromInd.actionedAt = new Date();
        }
    });
    next();
});

const TeacherSupervision = model("TeacherSupervision", TeacherSupervisionSchema);

export default TeacherSupervision;
