import { Schema, model } from "mongoose";

const StudentSubmissionSchema = new Schema(
    {
        _id: { type: String, required: true },
        projectId: { type: String, required: true },
        selectionId: { type: String, required: true }, 
        submissions: [
            {
                submissionId: { type: String, required: true },
                submittedById: { type: String, required: true }, 
                submittedByName: { type: String, required: true }, 
                comments: { type: String, required: true },
                submittedAt: { type: Date, default: null },
                files: [ 
                    {
                        fileName: { type: String, default: null },
                        fileUrl: { type: String, default: null },
                        uploadedAt: { type: Date, default: Date.now },
                    },
                ],
            },
        ],
        totalSubmissions: { type: Number, default: 0 },
        lastSubmittedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

StudentSubmissionSchema.pre("save", function (next) {
    this.totalSubmissions = this.submissions.length;
    
    this.submissions.forEach((submission) => {
        if (!submission.submittedAt) {
            submission.submittedAt = new Date();
        }
    });
    
    if (this.submissions.length > 0) {
        this.lastSubmittedAt = this.submissions[this.submissions.length - 1].submittedAt;
    }

    next();
});

const StudentSubmission = model("StudentSubmission", StudentSubmissionSchema);

export default StudentSubmission;