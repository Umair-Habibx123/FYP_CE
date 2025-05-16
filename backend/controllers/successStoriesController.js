import Project from '../models/Projects.js';
import TeacherSupervision from '../models/TeacherSupervision.js';
import StudentSelection from '../models/StudentSelection.js';
import User from '../models/User.js';
import Student from '../models/Students.js';
import Teacher from '../models/Teachers.js';
import Industry from '../models/Industry.js';

export const getSuccessStories = async (req, res) => {
  try {
    // Step 1: Find all completed projects from StudentSelection
    const completedSelections = await StudentSelection.find({
      'studentSelection.status.isCompleted': true
    });

    const completedProjectIds = completedSelections.map(sel => sel._id);

    // Step 2: Get full details for each completed project
    const successStories = await Promise.all(
      completedProjectIds.map(async (projectId) => {
        // Get project details
        const project = await Project.findById(projectId);
        if (!project) return null;
        
        // Get student group that completed it
        const selection = await StudentSelection.findOne({ _id: projectId });
        const completedGroup = selection.studentSelection.find(
          group => group.status.isCompleted
        );
        if (!completedGroup) return null;

        // Get teacher supervision details
        const supervision = await TeacherSupervision.findOne({ _id: projectId });
        let teacherDetails = null;
        
        if (supervision && supervision.supervisedBy.length > 0) {
          const teacher = await Teacher.findOne(
            { _id: supervision.supervisedBy[0].teacherId }
          );
          const teacherUser = await User.findOne(
            { _id: supervision.supervisedBy[0].teacherId }
          );
          
          if (teacher) {
            teacherDetails = {
              _id: teacher._id,
              username: teacherUser?.username || '',
              profilePic: teacherUser?.profilePic || '',
              employeeId: teacher.employeeId,
              designation: teacher.designation,
              department: teacher.department,
              university: teacher.university,
              fullName: supervision.supervisedBy[0].fullName,
              responseFromInd: supervision.supervisedBy[0].responseFromInd
            };
          }
        }
        
        // Get industry representative details
        let industryDetails = null;
        let representativeUserDetails = null;
        
        if (project.industryName) {
          const industryRep = await Industry.findOne(
            { 'representingIndustries.name': project.industryName }
          );
          
          if (industryRep) {
            const repDetails = industryRep.representingIndustries.find(
              ind => ind.name === project.industryName
            );
            
            if (repDetails) {
              industryDetails = {
                _id: industryRep._id,
                industryId: repDetails.industryId,
                name: repDetails.name,
                website: repDetails.website,
                address: repDetails.address,
                designation: repDetails.designation,
                workEmail: repDetails.workEmail,
                companyContactNumber: repDetails.companyContactNumber,
                representativeEmail: project.representativeId
              };

              // Fetch representative user details if representativeEmail exists
              if (project.representativeId) {
                const repUser = await User.findOne({ email: project.representativeId });
                if (repUser) {
                  representativeUserDetails = {
                    username: repUser.username,
                    profilePic: repUser.profilePic,
                    email: repUser.email,
                    role: repUser.role,
                    // Add any other user fields you need
                  };
                }
              }
            }
          }
        }
        
        // Get student details
        const studentDetails = await Promise.all(
          completedGroup.groupMembers.map(async (email) => {
            const user = await User.findOne({ email });
            const student = await Student.findOne({ _id: email });
            return {
              _id: email,
              username: user?.username || '',
              profilePic: user?.profilePic || '',
              studentId: student?.studentId || '',
              university: student?.university || '',
              degreeOrProgram: student?.degreeOrProgram || '',
              yearOfStudy: student?.yearOfStudy || ''
            };
          })
        );
        
        return {
          project: {
            _id: project._id,
            title: project.title,
            description: project.description,
            projectType: project.projectType,
            difficultyLevel: project.difficultyLevel,
            requiredSkills: project.requiredSkills,
            duration: project.duration,
            status: project.status,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt
          },
          studentGroup: {
            selectionId: completedGroup.selectionId,
            groupLeader: completedGroup.groupLeader,
            members: studentDetails,
            university: completedGroup.university,
            joinedAt: completedGroup.joinedAt,
            status: completedGroup.status,
            completedAt: completedGroup.completedAt
          },
          supervisor: teacherDetails,
          industry: industryDetails,
          representative: representativeUserDetails // Added representative user details
        };
      })
    );

    // Filter out any null entries (in case of missing data)
    const filteredStories = successStories.filter(story => story !== null);

    res.status(200).json({
      success: true,
      count: filteredStories.length,
      data: filteredStories
    });
    
  } catch (error) {
    console.error('Error fetching success stories:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching success stories'
    });
  }
};