import { Schema, model } from "mongoose";

const TeacherApprovalSchema = new Schema(
    {
        _id: { type: String, required: true, unique: true },
        approvals: [
            {
                teacherId: { type: String, required: true },
                fullName: { type: String, required: true },
                status: { type: String, enum: ["approved", "pending", "needMoreInfo", "rejected"], default: "pending" },
                university: { type: String, required: true },
                comments: { type: String, required: true },
                actionAt: { type: Date, default: null },
                actionBy: { type: String, default: null },
            },
        ],
    },
    { timestamps: true }
);


TeacherApprovalSchema.pre('save', function (next) {
    this.approvals.forEach(approval => {
        if ((approval.status === 'approved' || approval.status === 'needMoreInfo' || approval.status === 'rejected') && !approval.actionAt) {
            approval.actionAt = new Date();
        }
    });
    next();
});

const TeacherApproval = model("TeacherApproval", TeacherApprovalSchema);

export default TeacherApproval;