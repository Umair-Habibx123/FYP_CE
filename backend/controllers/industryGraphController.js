import Project from "../models/Projects.js";
import TeacherApproval from "../models/TeacherApproval.js"
import TeacherSupervision from "../models/TeacherSupervision.js"
import StudentSelection from "../models/StudentSelection.js";


// Get projects by skills
export const getProjectsBySkills = async (req, res) => {
    try {
        const { representativeId } = req.params;


        const projects = await Project.find({ representativeId }, 'requiredSkills');

        const skillsCount = projects.reduce((acc, project) => {
            project.requiredSkills.forEach(skill => {
                acc[skill] = (acc[skill] || 0) + 1;
            });
            return acc;
        }, {});

        const result = Object.entries(skillsCount).map(([skill, count]) => ({
            skill,
            count
        }));

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const getProjectsTimeline = async (req, res) => {
    try {
        const { representativeId } = req.params;

        const projects = await Project.find(
            { representativeId: representativeId },
            { createdAt: 1 }
        ).sort({ createdAt: 1 });

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getProjectStatusCounts = async (req, res) => {
    try {
        const { representativeId } = req.params;

        const projects = await Project.find(
            { representativeId: representativeId },
            { _id: 1 }
        );

        const projectIds = projects.map(project => project._id);

        const counts = await TeacherApproval.aggregate([
            {
                $match: {
                    _id: { $in: projectIds }
                }
            },
            { $unwind: "$approvals" },
            {
                $group: {
                    _id: "$approvals.status",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    status: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ]);

        res.status(200).json(counts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Get university engagement  --- combines data from multiple collections
// studentSelections, teacherApprovals, teacherSupervisions


export const getUniversityEngagement = async (req, res) => {
    try {
        const { representativeId } = req.params;

        // First get all project IDs for this representative
        const projects = await Project.find(
            { representativeId: representativeId },
            { _id: 1 }
        );
        const projectIds = projects.map(project => project._id);

        if (projectIds.length === 0) {
            return res.status(200).json([]);
        }

        // Function to safely run aggregations
        const safeAggregate = async (model, pipeline) => {
            try {
                if (!model) return [];
                return await model.aggregate(pipeline);
            } catch (error) {
                console.error(`Error in aggregation for ${model?.modelName || 'unknown'}:`, error);
                return [];
            }
        };

        // Get engagement data from multiple collections with error handling
        const [studentSelections, teacherApprovals, teacherSupervisions] = await Promise.all([
            // Student Selections data from separate collection
            safeAggregate(StudentSelection, [
                { $match: { _id: { $in: projectIds } } },
                { $unwind: "$studentSelection" },
                {
                    $group: {
                        _id: "$studentSelection.university",
                        totalSelections: { $sum: 1 },
                        completedSelections: {
                            $sum: {
                                $cond: [{ $eq: ["$studentSelection.isCompleted", true] }, 1, 0]
                            }
                        },
                        uniqueGroups: { $addToSet: "$studentSelection.selectionId" },
                        earliestJoinDate: { $min: "$studentSelection.joinedAt" },
                        latestCompletionDate: { $max: "$studentSelection.completedAt" }
                    }
                },
                {
                    $project: {
                        university: "$_id",
                        totalSelections: 1,
                        completedSelections: 1,
                        activeSelections: { $subtract: ["$totalSelections", "$completedSelections"] },
                        uniqueGroupCount: { $size: "$uniqueGroups" },
                        earliestEngagement: "$earliestJoinDate",
                        latestCompletion: "$latestCompletionDate",
                        _id: 0
                    }
                }
            ]),

            // Teacher Approvals data from separate collection
            safeAggregate(TeacherApproval, [
                { $match: { _id: { $in: projectIds } } },
                { $unwind: "$approvals" },
                {
                    $group: {
                        _id: "$approvals.university",
                        totalApprovals: { $sum: 1 },
                        approved: {
                            $sum: {
                                $cond: [{ $eq: ["$approvals.status", "approved"] }, 1, 0]
                            }
                        },
                        rejected: {
                            $sum: {
                                $cond: [{ $eq: ["$approvals.status", "rejected"] }, 1, 0]
                            }
                        },
                        pending: {
                            $sum: {
                                $cond: [{ $eq: ["$approvals.status", "pending"] }, 1, 0]
                            }
                        },
                        needMoreInfo: {
                            $sum: {
                                $cond: [{ $eq: ["$approvals.status", "needMoreInfo"] }, 1, 0]
                            }
                        },
                        earliestApprovalDate: {
                            $min: "$approvals.actionAt"
                        },
                        latestApprovalDate: {
                            $max: "$approvals.actionAt"
                        }
                    }
                },
                {
                    $project: {
                        university: "$_id",
                        totalApprovals: 1,
                        approved: 1,
                        rejected: 1,
                        pending: 1,
                        needMoreInfo: 1,
                        earliestApproval: "$earliestApprovalDate",
                        latestApproval: "$latestApprovalDate",
                        _id: 0
                    }
                }
            ]),

            // Teacher Supervision data from separate collection
            safeAggregate(TeacherSupervision, [
                { $match: { _id: { $in: projectIds } } },
                { $unwind: "$supervisedBy" },
                {
                    $group: {
                        _id: "$supervisedBy.university",
                        totalSupervisions: { $sum: 1 },
                        supervisionApproved: {
                            $sum: {
                                $cond: [{ $eq: ["$supervisedBy.responseFromInd.status", "approved"] }, 1, 0]
                            }
                        },
                        supervisionRejected: {
                            $sum: {
                                $cond: [{ $eq: ["$supervisedBy.responseFromInd.status", "rejected"] }, 1, 0]
                            }
                        },
                        supervisionPending: {
                            $sum: {
                                $cond: [
                                    {
                                        $or: [
                                            { $eq: ["$supervisedBy.responseFromInd.status", "pending"] },
                                            { $eq: ["$supervisedBy.responseFromInd.status", null] }
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        },
                        earliestSupervisionDate: {
                            $min: "$supervisedBy.responseFromInd.actionedAt"
                        },
                        latestSupervisionDate: {
                            $max: "$supervisedBy.responseFromInd.actionedAt"
                        }
                    }
                },
                {
                    $project: {
                        university: "$_id",
                        totalSupervisions: 1,
                        supervisionApproved: 1,
                        supervisionRejected: 1,
                        supervisionPending: 1,
                        earliestSupervision: "$earliestSupervisionDate",
                        latestSupervision: "$latestSupervisionDate",
                        _id: 0
                    }
                }
            ])
        ]);

        // Combine all data by university
        const universityMap = {};

        // Process student selections
        studentSelections?.forEach(item => {
            if (!universityMap[item.university]) {
                universityMap[item.university] = {
                    engagementTimeline: {
                        firstActivity: item.earliestEngagement,
                        lastActivity: item.latestCompletion
                    }
                };
            }
            Object.assign(universityMap[item.university], item);
        });

        // Process teacher approvals
        teacherApprovals?.forEach(item => {
            if (!universityMap[item.university]) {
                universityMap[item.university] = {
                    engagementTimeline: {
                        firstActivity: item.earliestApproval,
                        lastActivity: item.latestApproval
                    }
                };
            } else {
                // Update timeline with earliest and latest dates
                universityMap[item.university].engagementTimeline.firstActivity =
                    Math.min(universityMap[item.university].engagementTimeline.firstActivity || Infinity, item.earliestApproval);
                universityMap[item.university].engagementTimeline.lastActivity =
                    Math.max(universityMap[item.university].engagementTimeline.lastActivity || 0, item.latestApproval);
            }
            Object.assign(universityMap[item.university], item);
        });

        // Process teacher supervisions
        teacherSupervisions?.forEach(item => {
            if (!universityMap[item.university]) {
                universityMap[item.university] = {
                    engagementTimeline: {
                        firstActivity: item.earliestSupervision,
                        lastActivity: item.latestSupervision
                    }
                };
            } else {
                // Update timeline with earliest and latest dates
                universityMap[item.university].engagementTimeline.firstActivity =
                    Math.min(universityMap[item.university].engagementTimeline.firstActivity || Infinity, item.earliestSupervision);
                universityMap[item.university].engagementTimeline.lastActivity =
                    Math.max(universityMap[item.university].engagementTimeline.lastActivity || 0, item.latestSupervision);
            }
            Object.assign(universityMap[item.university], item);
        });

        // Convert to array and sort by most engaged
        const result = Object.values(universityMap).map(univ => {

            // weightage calculation 
            const engagementScore =
                (univ.totalSelections || 0) * 4 +
                (univ.totalApprovals || 0) * 3 +
                (univ.totalSupervisions || 0) * 2;

            return {
                university: univ.university,
                studentSelections: {
                    total: univ.totalSelections || 0,
                    completed: univ.completedSelections || 0,
                    active: univ.activeSelections || 0,
                    uniqueGroups: univ.uniqueGroupCount || 0
                },
                teacherApprovals: {
                    total: univ.totalApprovals || 0,
                    approved: univ.approved || 0,
                    rejected: univ.rejected || 0,
                    pending: univ.pending || 0,
                    needMoreInfo: univ.needMoreInfo || 0
                },
                teacherSupervisions: {
                    total: univ.totalSupervisions || 0,
                    approved: univ.supervisionApproved || 0,
                    rejected: univ.supervisionRejected || 0,
                    pending: univ.supervisionPending || 0
                },
                engagementTimeline: univ.engagementTimeline || {
                    firstActivity: null,
                    lastActivity: null
                },
                engagementScore,
                engagementLevel: getEngagementLevel(engagementScore)
            };
        }).sort((a, b) => b.engagementScore - a.engagementScore);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error in getUniversityEngagement:', error);
        res.status(500).json({ message: error.message });
    }
};


function getEngagementLevel(score) {
    if (score >= 50) return 'Very High';
    if (score >= 30) return 'High';
    if (score >= 15) return 'Medium';
    if (score >= 5) return 'Low';
    return 'Very Low';
}