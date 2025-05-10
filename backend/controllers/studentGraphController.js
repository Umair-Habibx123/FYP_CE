import StudentSelection from "../models/StudentSelection.js";
import Review from "../models/Reviews.js";
import Student from "../models/Students.js";
import Project from "../models/Projects.js"

// Get student project completion stats
export const getStudentCompletionStats = async (req, res) => {
    try {
        const { studentId } = req.params;

        const studentProjects = await StudentSelection.find({
            "studentSelection": {
                $elemMatch: {
                    $or: [
                        { "groupLeader": studentId },
                        { "groupMembers": studentId }
                    ]
                }
            }
        }).populate({
            path: '_id',  // This is the field that contains the project ID
            model: 'Project'  // The name of your Project model
        });


        if (!studentProjects || studentProjects.length === 0) {
            return res.status(404).json({
                message: "No projects found for this student"
            });
        }

        let totalSelections = 0;
        let totalCompletions = 0;
        const projects = [];

        studentProjects.forEach(projectDoc => {
            projectDoc.studentSelection.forEach(selection => {
                // Check if this student is involved in this selection
                if (selection.groupLeader === studentId ||
                    selection.groupMembers.includes(studentId)) {

                    totalSelections++;
                    if (selection.isCompleted) {
                        totalCompletions++;
                    }

                    projects.push({
                        projectId: projectDoc._id,  // This is the same as the _id field
                        projectDetails: projectDoc._id,  // Now contains the populated project details
                        selectionId: selection.selectionId,
                        isCompleted: selection.isCompleted,
                        joinedAt: selection.joinedAt,
                        completedAt: selection.completedAt,
                        university: selection.university,
                        industry: projectDoc._id?.industryName  // Get industry from populated project
                    });
                }
            });
        });

        res.status(200).json({
            studentId,
            stats: {
                total: totalSelections,
                completed: totalCompletions,
                ongoing: totalSelections - totalCompletions,
                completionRate: totalSelections > 0
                    ? Math.round((totalCompletions / totalSelections) * 100)
                    : 0
            },
            timelineData: projects.map(proj => ({
                projectId: proj.projectId,
                name: proj.projectDetails?.title || `Project ${proj.projectId}`,
                duration: proj.completedAt
                    ? (new Date(proj.completedAt) - new Date(proj.joinedAt)) / (1000 * 60 * 60 * 24)
                    : (new Date() - new Date(proj.joinedAt)) / (1000 * 60 * 60 * 24),
                status: proj.isCompleted ? 'Completed' : 'Ongoing',
                joinedAt: proj.joinedAt,
                completedAt: proj.completedAt || null
            })),
            chartData: {
                // For Pie/Doughnut Chart
                completionPie: [
                    { name: 'Completed', value: totalCompletions },
                    { name: 'Ongoing', value: totalSelections - totalCompletions }
                ],

                // For Bar Chart (by industry)
                industryDistribution: Object.entries(
                    projects.reduce((acc, proj) => {
                        const industry = proj.industry || 'Unknown Industry';
                        acc[industry] = (acc[industry] || 0) + 1;
                        return acc;
                    }, {})
                ).map(([industry, count]) => ({
                    industry,
                    count
                })),

                // For Line Chart (completion timeline)
                completionTimeline: projects
                    .filter(proj => proj.isCompleted)
                    .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt))
                    .map((proj, index) => ({
                        sequence: index + 1,
                        date: proj.completedAt,
                        projectId: proj.projectId
                    }))
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


export const getStudentRatings = async (req, res) => {
    try {
        const { studentId } = req.params;

        // 1. Get student info
        const student = await Student.findOne({ _id: studentId });
        if (!student) return res.status(404).json({ message: "Student not found" });

        // 2. Get all student selections
        const studentSelections = await StudentSelection.find({
            "studentSelection": {
                $elemMatch: {
                    $or: [
                        { "groupLeader": studentId },
                        { "groupMembers": studentId }
                    ]
                }
            }
        });

        // 3. Extract selection IDs
        const selectionData = studentSelections.reduce((acc, project) => {
            project.studentSelection.forEach(selection => {
                if (selection.groupLeader === studentId ||
                    selection.groupMembers.includes(studentId)) {
                    acc.allIds.push(selection.selectionId);
                    if (selection.isCompleted) acc.completedIds.push(selection.selectionId);
                }
            });
            return acc;
        }, { allIds: [], completedIds: [] });

        // 4. Get reviews
        const reviewDocs = await Review.find({ selectionId: { $in: selectionData.allIds } });

        // 5. Process reviews
        const processedData = reviewDocs.reduce((acc, reviewDoc) => {
            const isCompleted = selectionData.completedIds.includes(reviewDoc.selectionId);

            reviewDoc.reviews.forEach(review => {
                // Timeline entry
                acc.timeline.push({
                    date: review.reviewedAt.toISOString().split('T')[0],
                    rating: review.rating,
                    role: review.reviewerRole,
                    projectId: reviewDoc.projectId,
                    completed: isCompleted
                });

                // Rating distribution
                const star = Math.round(review.rating);
                acc.distribution[star - 1].count++;
                if (isCompleted) acc.distribution[star - 1].completedCount++;

                // By role
                const roleKey = review.reviewerRole === 'teacher' ? 'teacher' : 'industry';
                acc.byRole[roleKey].total += review.rating;
                acc.byRole[roleKey].count++;
                if (isCompleted) {
                    acc.byRole[roleKey].completedTotal += review.rating;
                    acc.byRole[roleKey].completedCount++;
                }

                // Projects
                if (!acc.projects[reviewDoc.projectId]) {
                    acc.projects[reviewDoc.projectId] = {
                        ratings: [],
                        completed: isCompleted
                    };
                }
                acc.projects[reviewDoc.projectId].ratings.push(review.rating);
            });
            return acc;
        }, {
            timeline: [],
            distribution: [1, 2, 3, 4, 5].map(star => ({ stars: star, count: 0, completedCount: 0 })),
            byRole: {
                teacher: { total: 0, count: 0, completedTotal: 0, completedCount: 0 },
                industry: { total: 0, count: 0, completedTotal: 0, completedCount: 0 }
            },
            projects: {}
        });

        // 6. Calculate averages
        const calculateAvg = (total, count) => count > 0 ? total / count : 0;

        const response = {
            studentId,
            ratingStats: {
                overall: {
                    average: student.averageRating || 0,
                    total: student.totalReviews || 0,
                    completed: {
                        average: calculateAvg(
                            processedData.byRole.teacher.completedTotal + processedData.byRole.industry.completedTotal,
                            processedData.byRole.teacher.completedCount + processedData.byRole.industry.completedCount
                        ),
                        total: processedData.byRole.teacher.completedCount + processedData.byRole.industry.completedCount
                    }
                },
                distribution: processedData.distribution,
                byRole: {
                    teacher: {
                        average: calculateAvg(processedData.byRole.teacher.total, processedData.byRole.teacher.count),
                        count: processedData.byRole.teacher.count,
                        completedAverage: calculateAvg(
                            processedData.byRole.teacher.completedTotal,
                            processedData.byRole.teacher.completedCount
                        )
                    },
                    industry: {
                        average: calculateAvg(processedData.byRole.industry.total, processedData.byRole.industry.count),
                        count: processedData.byRole.industry.count,
                        completedAverage: calculateAvg(
                            processedData.byRole.industry.completedTotal,
                            processedData.byRole.industry.completedCount
                        )
                    }
                }
            },
            timeline: processedData.timeline.sort((a, b) => new Date(a.date) - new Date(b.date)),
            projects: Object.entries(processedData.projects).map(([projectId, data]) => ({
                projectId,
                average: calculateAvg(
                    data.ratings.reduce((sum, r) => sum + r, 0),
                    data.ratings.length
                ),
                reviews: data.ratings.length,
                completed: data.completed,
                ratings: data.ratings
            }))
        };

        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};