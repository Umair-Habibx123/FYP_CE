import Project from "../models/Projects.js";
import TeacherApproval from "../models/TeacherApproval.js";
import TeacherSupervision from "../models/TeacherSupervision.js";
import StudentSelection from "../models/StudentSelection.js";
import StudentSubmission from "../models/StudentSubmission.js";
import Review from "../models/Reviews.js";


export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();

    const result = await Promise.all(
      projects.map(async (proj) => {
        const projectId = proj._id;

        const approvals = await TeacherApproval.findOne({ _id: projectId });
        const supervised = await TeacherSupervision.findOne({ _id: projectId });
        const selection = await StudentSelection.findOne({ _id: projectId });
        const submission = await StudentSubmission.findOne({ projectId });
        const review = await Review.findOne({ projectId });

        return {
          _id: projectId,
          title: proj.title,
          projectType: proj.projectType,
          difficultyLevel: proj.difficultyLevel,
          industryName: proj.industryName,
          type: proj.type,
          maxStudentsPerGroup: proj.maxStudentsPerGroup,
          maxGroups: proj.maxGroups,
          duration: {
            startDate: proj.duration.startDate,
            endDate: proj.duration.endDate,
          },
          description: proj.description,
          status: 'active', // Or compute dynamically if needed
          approvals: approvals?.approvals || [],
          supervisedBy: supervised?.supervisedBy || [],
          studentSelection: selection?.studentSelection || [],
          submissions: submission?.submissions || [],
          reviews: review?.reviews || [],
          averageRating: review?.averageRating || 0,
          totalReviews: review?.totalReviews || 0,
        };
      })
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
