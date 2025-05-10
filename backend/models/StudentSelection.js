import { Schema, model } from "mongoose";

const StudentSelectionSchema = new Schema(
  {
    _id: { type: String, required: true },
    studentSelection: [
      {
        selectionId: { type: String, required: true },
        university: { type: String, default: null },
        groupLeader: { type: String, required: true },
        groupMembers: { type: [String], default: [] },
        joinedAt: { type: Date, default: null },
        isCompleted: { type: Boolean, default: false },
        completedAt: { type: Date, default: null },
      },
    ],
  },
  { timestamps: true }
);

StudentSelectionSchema.pre("save", function (next) {
  this.studentSelection.forEach((selection) => {
    if (!selection.joinedAt) {
      selection.joinedAt = new Date();
    }

    if (selection.isCompleted && !selection.completedAt) {
      selection.completedAt = new Date();
    }

    if (!selection.isCompleted && selection.completedAt) {
      selection.completedAt = null;
    }
  });
  next();
});

const StudentSelection = model("StudentSelection", StudentSelectionSchema);

export default StudentSelection;