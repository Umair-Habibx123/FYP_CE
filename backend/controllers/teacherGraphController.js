import StudentSelection from "../models/StudentSelection.js";
import Review from "../models/Reviews.js";
import TeacherApproval from "../models/TeacherApproval.js"
import TeacherSupervision from "../models/TeacherSupervision.js"

export const getTeacherStats = async (req, res) => {
    try {
        const { teacherId } = req.params;

        // 1. Get teacher's approval statistics
        const approvalStats = await TeacherApproval.aggregate([
            { $unwind: "$approvals" },
            { $match: { "approvals.teacherId": teacherId } },
            {
                $group: {
                    _id: "$approvals.status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Convert approval stats to object
        const approvalCounts = approvalStats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
        }, { approved: 0, needMoreInfo: 0, rejected: 0, pending: 0 });

        // 2. Get teacher's supervision statistics
        const supervisionStats = await TeacherSupervision.aggregate([
            { $unwind: "$supervisedBy" },
            { $match: { "supervisedBy.teacherId": teacherId } },
            {
                $group: {
                    _id: "$supervisedBy.responseFromInd.status",
                    count: { $sum: 1 },
                    projectIds: { $addToSet: "$_id" }
                }
            }
        ]);

        // Convert supervision stats to object
        const supervisionCounts = supervisionStats.reduce((acc, stat) => {
            if (stat._id) {  // Only process if status exists
                acc[stat._id] = stat.count;
                if (stat._id === 'approved') {
                    acc.projectIds = stat.projectIds;
                }
            }
            return acc;
        }, { approved: 0, pending: 0, rejected: 0, projectIds: [] });

        // 3. Get groups supervised by this teacher (from approved supervisions)
        const supervisedGroups = await StudentSelection.aggregate([
            { $unwind: "$studentSelection" },
            {
                $match: {
                    "_id": { $in: supervisionCounts.projectIds || [] }
                }
            },
            {
                $group: {
                    _id: "$studentSelection.isCompleted",
                    count: { $sum: 1 },
                    selectionIds: { $addToSet: "$studentSelection.selectionId" }
                }
            }
        ]);

        // Convert group stats to object
        const groupStats = supervisedGroups.reduce((acc, stat) => {
            if (stat._id === true) {
                acc.completed = stat.count;
                acc.completedSelectionIds = stat.selectionIds;
            } else if (stat._id === false) {
                acc.ongoing = stat.count;
                acc.ongoingSelectionIds = stat.selectionIds;
            }
            return acc;
        }, { completed: 0, ongoing: 0, completedSelectionIds: [], ongoingSelectionIds: [] });

        // Get all relevant selection IDs
        const allSelectionIds = [...groupStats.completedSelectionIds, ...groupStats.ongoingSelectionIds];

        // 4. Get reviews for the teacher's supervised groups
        const reviews = await Review.aggregate([
            {
                $match: {
                    "selectionId": { $in: allSelectionIds }
                }
            },
            { $unwind: "$reviews" },
            {
                $match: {
                    "reviews.reviewerRole": "teacher",
                    "reviews.reviewerId": teacherId
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$reviews.rating" },
                    totalReviews: { $sum: 1 },
                    ratings: { $push: "$reviews.rating" }
                }
            }
        ]);

        // 5. Get reviews for the teacher's supervised groups by industry
        const industryReviews = await Review.aggregate([
            {
                $match: {
                    "selectionId": { $in: allSelectionIds }
                }
            },
            { $unwind: "$reviews" },
            {
                $match: {
                    "reviews.reviewerRole": "industry"
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$reviews.rating" },
                    totalReviews: { $sum: 1 },
                    ratings: { $push: "$reviews.rating" }
                }
            }
        ]);

        // Prepare rating distributions
        const teacherRatings = reviews.length > 0 ? reviews[0].ratings : [];
        const industryRatings = industryReviews.length > 0 ? industryReviews[0].ratings : [];

        const teacherDistribution = [1, 2, 3, 4, 5].map(star => ({
            stars: star,
            count: teacherRatings.filter(r => Math.round(r) === star).length
        }));

        const industryDistribution = [1, 2, 3, 4, 5].map(star => ({
            stars: star,
            count: industryRatings.filter(r => Math.round(r) === star).length
        }));

        // Calculate combined average
        const teacherTotal = reviews.length > 0 ? reviews[0].totalReviews : 0;
        const teacherAvg = reviews.length > 0 ? reviews[0].averageRating : 0;
        const industryTotal = industryReviews.length > 0 ? industryReviews[0].totalReviews : 0;
        const industryAvg = industryReviews.length > 0 ? industryReviews[0].averageRating : 0;

        const combinedAverage = (teacherTotal + industryTotal) > 0
            ? (teacherAvg * teacherTotal + industryAvg * industryTotal) / (teacherTotal + industryTotal)
            : 0;

        // Prepare response
        const response = {
            teacherId,
            approvalStats: {
                total: approvalCounts.approved + approvalCounts.needMoreInfo + approvalCounts.rejected,
                approved: approvalCounts.approved,
                needMoreInfo: approvalCounts.needMoreInfo,
                rejected: approvalCounts.rejected,
                approvalRate: approvalCounts.approved > 0
                    ? Math.round((approvalCounts.approved / (approvalCounts.approved + approvalCounts.needMoreInfo + approvalCounts.rejected)) * 100)
                    : 0
            },
            supervisionStats: {
                total: supervisionCounts.approved + supervisionCounts.pending + supervisionCounts.rejected,
                approved: supervisionCounts.approved,
                pending: supervisionCounts.pending,
                rejected: supervisionCounts.rejected,
                successRate: supervisionCounts.approved > 0
                    ? Math.round((supervisionCounts.approved / (supervisionCounts.approved + supervisionCounts.rejected)) * 100)
                    : 0
            },
            groupStats: {
                total: groupStats.completed + groupStats.ongoing,
                completed: groupStats.completed,
                ongoing: groupStats.ongoing,
                completionRate: (groupStats.completed + groupStats.ongoing) > 0
                    ? Math.round((groupStats.completed / (groupStats.completed + groupStats.ongoing)) * 100)
                    : 0
            },
            ratingStats: {
                teacherReviews: {
                    average: teacherAvg,
                    total: teacherTotal,
                    distribution: teacherDistribution
                },
                industryReviews: {
                    average: industryAvg,
                    total: industryTotal,
                    distribution: industryDistribution
                },
                combinedAverage: combinedAverage
            }
        };

        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getUniversityTeacherStats = async (req, res) => {
    try {
        const { university } = req.params;

        console.log("Fetching stats for university:", university);

        // 1. Get all teacher approvals for the university
        const approvalStats = await TeacherApproval.aggregate([
            { $unwind: "$approvals" },
            { $match: { "approvals.university": university } },
            {
                $group: {
                    _id: "$approvals.status",
                    count: { $sum: 1 }
                }
            }
        ]);
        console.log("Approval stats raw:", approvalStats);

        // Convert approval stats to object
        const approvalCounts = approvalStats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
        }, { approved: 0, needMoreInfo: 0, rejected: 0, pending: 0 });
        console.log("Approval counts:", approvalCounts);

        // 2. Get all teacher supervisions for the university
        const supervisionStats = await TeacherSupervision.aggregate([
            { $unwind: "$supervisedBy" },
            { $match: { "supervisedBy.university": university } },
            {
                $group: {
                    _id: "$supervisedBy.responseFromInd.status",
                    count: { $sum: 1 },
                    projectIds: { $addToSet: "$_id" }
                }
            }
        ]);
        console.log("Supervision stats raw:", supervisionStats);

        // Convert supervision stats to object
        const supervisionCounts = supervisionStats.reduce((acc, stat) => {
            if (stat._id) {
                acc[stat._id] = stat.count;
                if (stat._id === 'approved') {
                    acc.projectIds = stat.projectIds;
                }
            }
            return acc;
        }, { approved: 0, pending: 0, rejected: 0, projectIds: [] });
        console.log("Supervision counts:", supervisionCounts);

        // 3. Get all groups supervised by university teachers
        const supervisedGroups = await StudentSelection.aggregate([
            { $match: { "_id": { $in: supervisionCounts.projectIds || [] } } },
            { $unwind: "$studentSelection" },
            { $match: { "studentSelection.university": university } },
            {
                $group: {
                    _id: "$studentSelection.isCompleted",
                    count: { $sum: 1 },
                    selectionIds: { $addToSet: "$studentSelection.selectionId" }
                }
            }
        ]);


        // Convert group stats to object
        const groupStats = supervisedGroups.reduce((acc, stat) => {
            if (stat._id === true) {
                acc.completed = stat.count;
                acc.completedSelectionIds = stat.selectionIds;
            } else if (stat._id === false) {
                acc.ongoing = stat.count;
                acc.ongoingSelectionIds = stat.selectionIds;
            }
            return acc;
        }, { completed: 0, ongoing: 0, completedSelectionIds: [], ongoingSelectionIds: [] });

        // Get all relevant selection IDs
        const allSelectionIds = [...groupStats.completedSelectionIds, ...groupStats.ongoingSelectionIds];
        console.log("All selection IDs:", allSelectionIds);

        // 4. Get reviews for all supervised groups by university teachers
        const teacherReviews = await Review.aggregate([
            { $match: { "selectionId": { $in: allSelectionIds } } },
            { $unwind: "$reviews" },
            { $match: { "reviews.reviewerRole": "teacher" } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$reviews.rating" },
                    totalReviews: { $sum: 1 },
                    ratings: { $push: "$reviews.rating" }
                }
            }
        ]);
        console.log("Teacher reviews raw:", teacherReviews);

        // 5. Get reviews for all supervised groups by industry
        const industryReviews = await Review.aggregate([
            { $match: { "selectionId": { $in: allSelectionIds } } },
            { $unwind: "$reviews" },
            { $match: { "reviews.reviewerRole": "industry" } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$reviews.rating" },
                    totalReviews: { $sum: 1 },
                    ratings: { $push: "$reviews.rating" }
                }
            }
        ]);
        console.log("Industry reviews raw:", industryReviews);

        // Calculate rating statistics
        const teacherReviewData = teacherReviews[0] || { averageRating: 0, totalReviews: 0, ratings: [] };
        const industryReviewData = industryReviews[0] || { averageRating: 0, totalReviews: 0, ratings: [] };

        const teacherDistribution = [1, 2, 3, 4, 5].map(star => ({
            stars: star,
            count: teacherReviewData.ratings.filter(r => Math.round(r) === star).length
        }));

        const industryDistribution = [1, 2, 3, 4, 5].map(star => ({
            stars: star,
            count: industryReviewData.ratings.filter(r => Math.round(r) === star).length
        }));

        const combinedAverage = (teacherReviewData.totalReviews + industryReviewData.totalReviews) > 0
            ? (teacherReviewData.averageRating * teacherReviewData.totalReviews +
                industryReviewData.averageRating * industryReviewData.totalReviews) /
            (teacherReviewData.totalReviews + industryReviewData.totalReviews)
            : 0;

            // weightage calculation 


        const approvalWeight = 0.2;
        const supervisionWeight = 0.25;
        const completionWeight = 0.3;
        const ratingWeight = 0.4;

        const approvalScore = approvalCounts.approved > 0
            ? (approvalCounts.approved / (approvalCounts.approved + approvalCounts.needMoreInfo + approvalCounts.rejected)) * 100
            : 0;

        const supervisionScore = supervisionCounts.approved > 0
            ? (supervisionCounts.approved / (supervisionCounts.approved + supervisionCounts.rejected)) * 100
            : 0;

        const completionScore = (groupStats.completed + groupStats.ongoing) > 0
            ? (groupStats.completed / (groupStats.completed + groupStats.ongoing)) * 100
            : 0;

        const ratingScore = combinedAverage * 20;

        const comprehensiveSuccessRate = Math.round(
            (approvalScore * approvalWeight) +
            (supervisionScore * supervisionWeight) +
            (completionScore * completionWeight) +
            (ratingScore * ratingWeight)
        );


        // 6. Get teacher participation stats
        const teacherParticipation = await TeacherSupervision.aggregate([
            { $unwind: "$supervisedBy" },
            { $match: { "supervisedBy.university": university } },
            {
                $group: {
                    _id: "$supervisedBy.teacherId",
                    name: { $first: "$supervisedBy.fullName" },
                    totalSupervisions: { $sum: 1 },
                    approvedSupervisions: {
                        $sum: {
                            $cond: [{ $eq: ["$supervisedBy.responseFromInd.status", "approved"] }, 1, 0]
                        }
                    }
                }
            },
            { $sort: { totalSupervisions: -1 } },
            { $limit: 5 }
        ]);
        console.log("Teacher participation:", teacherParticipation);


        // Prepare response
        const response = {
            university,
            approvalStats: {
                total: approvalCounts.approved + approvalCounts.needMoreInfo + approvalCounts.rejected,
                approved: approvalCounts.approved,
                needMoreInfo: approvalCounts.needMoreInfo,
                rejected: approvalCounts.rejected,
                approvalRate: approvalCounts.approved > 0
                    ? Math.round((approvalCounts.approved / (approvalCounts.approved + approvalCounts.needMoreInfo + approvalCounts.rejected)) * 100)
                    : 0
            },
            supervisionStats: {
                total: supervisionCounts.approved + supervisionCounts.pending + supervisionCounts.rejected,
                approved: supervisionCounts.approved,
                pending: supervisionCounts.pending,
                rejected: supervisionCounts.rejected,
                successRate: supervisionCounts.approved > 0
                    ? Math.round((supervisionCounts.approved / (supervisionCounts.approved + supervisionCounts.rejected)) * 100)
                    : 0
            },
            groupStats: {
                total: groupStats.completed + groupStats.ongoing,
                completed: groupStats.completed,
                ongoing: groupStats.ongoing,
                completionRate: (groupStats.completed + groupStats.ongoing) > 0
                    ? Math.round((groupStats.completed / (groupStats.completed + groupStats.ongoing)) * 100)
                    : 0
            },
            ratingStats: {
                teacherReviews: {
                    average: teacherReviewData.averageRating,
                    total: teacherReviewData.totalReviews,
                    distribution: teacherDistribution
                },
                industryReviews: {
                    average: industryReviewData.averageRating,
                    total: industryReviewData.totalReviews,
                    distribution: industryDistribution
                },
                combinedAverage: combinedAverage
            },
            topTeachers: teacherParticipation.map(teacher => ({
                teacherId: teacher._id,
                teacherName: teacher.name,
                totalSupervisions: teacher.totalSupervisions,
                approvedSupervisions: teacher.approvedSupervisions,
                // successRate: supervisionCounts.approved > 0
                // ? Math.round((supervisionCounts.approved / (supervisionCounts.approved + supervisionCounts.rejected)) * 100)
                // : 0


                // Calculate weighted success rate incorporating multiple factors
                successRate: comprehensiveSuccessRate,
            }))
        };

        console.log("Final response:", response);
        res.status(200).json(response);

    } catch (error) {
        console.error("Error in getUniversityTeacherStats:", error);
        res.status(500).json({ message: error.message });
    }
};