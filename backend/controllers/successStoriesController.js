import Project from '../models/Projects.js';
import TeacherSupervision from '../models/TeacherSupervision.js';
import StudentSelection from '../models/StudentSelection.js';
import Review from '../models/Reviews.js';
import User from '../models/User.js';
import Student from '../models/Students.js';
import Teacher from '../models/Teachers.js';
import Industry from '../models/Industry.js';

export const getSuccessStories = async (req, res) => {
  try {
    // Step 1: Find all completed projects with good ratings
    const reviewsWithHighRating = await Review.aggregate([
      {
        $match: {
          averageRating: { $gte: 4 } // Only include projects with average rating >= 4
        }
      }
    ]);

    const projectIds = reviewsWithHighRating.map(review => review.projectId);

    // Step 2: Get all completed projects that have these IDs and are completed
    const completedSelections = await StudentSelection.find({
      'studentSelection.status.isCompleted': true
    });

    const completedProjectIds = completedSelections.map(sel => sel._id);

    // Intersection of well-rated projects and completed projects
    const successProjectIds = projectIds.filter(id => 
      completedProjectIds.includes(id)
    );

    // Step 3: Get full details for each success story
    const successStories = await Promise.all(
      successProjectIds.map(async (projectId) => {
        // Get project details
        const project = await Project.findById(projectId);
        
        // Get student group that completed it
        const selection = await StudentSelection.findOne({ _id: projectId });
        const completedGroup = selection.studentSelection.find(
          group => group.status.isCompleted
        );
        const completedAt = completedGroup ? completedGroup.completedAt : null;

        // Get teacher supervision details
        const supervision = await TeacherSupervision.findOne({ _id: projectId });
        const teacher = supervision ? await Teacher.findOne(
          { _id: supervision.supervisedBy[0].teacherId }
        ) : null;
        
        // Get industry representative details
        const industryRep = await Industry.findOne(
          { 'representingIndustries.name': project.industryName }
        );
        const repDetails = industryRep ? industryRep.representingIndustries.find(
          ind => ind.name === project.industryName
        ) : null;
        
        // Get reviews
        const review = await Review.findOne({ projectId });
        
        // Get student details
        const studentDetails = await Promise.all(
          completedGroup.groupMembers.map(async (email) => {
            const user = await User.findOne({ email });
            const student = await Student.findOne({ _id: email });
            return {
              name: user.username,
              profilePic: user.profilePic,
              university: student.university,
              degree: student.degreeOrProgram
            };
          })
        );
        
        return {
          project: {
            title: project.title,
            description: project.description,
            projectType: project.projectType,
            duration: project.duration,
            industry: repDetails ? {
              name: repDetails.name,
              website: repDetails.website,
              designation: repDetails.designation,
            } : null
          },
          studentGroup: {
            leader: completedGroup.groupLeader,
            members: studentDetails,
            university: completedGroup.university,
            completedAt: completedGroup.completedAt
          },
          supervisor: teacher ? {
            name: supervision.supervisedBy[0].fullName,
            department: teacher.department,
            university: teacher.university
          } : null,
          reviews: {
            teacherReview: review.reviews.find(r => r.reviewerRole === 'teacher'),
            industryReview: review.reviews.find(r => r.reviewerRole === 'industry'),
            averageRating: review.averageRating
          },
          attachments: project.attachments.filter(
            att => att.fileName.match(/\.(jpg|jpeg|png|gif)$/i)
          ) // Only image attachments for display
        };
      })
    );

    res.status(200).json({
      success: true,
      count: successStories.length,
      data: successStories
    });
    
  } catch (error) {
    console.error('Error fetching success stories:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching success stories'
    });
  }
};