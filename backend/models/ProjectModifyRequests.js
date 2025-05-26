import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const ProjectModifyRequestsSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  projectId: {
    type: String,
    required: true
  },
  requestType: {
    type: String,
    enum: ['edit', 'delete'],
    required: true
  },
  requestedBy: {
    type: String,
    required: true
  },
  requestStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reason: {
    type: String,
    required: true
  },
  reviewedBy: {
    type: String,
    default: null
  },
  reviewedAt: {
    type: Date,
    default: null
  },
  reviewComments: {
    type: String,
    default: null
  }
}, { timestamps: true }); 

const ProjectModifyRequests = model("ProjectModifyRequests", ProjectModifyRequestsSchema);

export default ProjectModifyRequests;

