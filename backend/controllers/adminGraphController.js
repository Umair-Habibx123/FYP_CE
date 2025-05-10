import Project from "../models/Projects.js";
import User from "../models/User.js";


export const getUsersByYear = async (req, res) => {
    try {
        const users = await User.aggregate([
            {
                $group: {
                    _id: { year: { $year: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1 } },
        ]);

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getUsersByMonth = async (req, res) => {
    try {
        const { year } = req.params;

        console.log(`Fetching users for year: ${year}`); // Debugging

        const users = await User.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${year}-01-01`),
                        $lt: new Date(`${parseInt(year) + 1}-01-01`),
                    },
                },
            },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        console.log("Users by month:", users); // Debugging

        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getUsersByMonth:", error); // Debugging
        res.status(500).json({ message: error.message });
    }
};



export const getUsersByWeek = async (req, res) => {
    try {
        const { year, month } = req.params;
        const startOfMonth = new Date(`${year}-${month}-01`);

        console.log(`Fetching users for year: ${year}, month: ${month}`); // Debugging

        const users = await User.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfMonth,
                        $lt: new Date(`${year}-${parseInt(month) + 1}-01`),
                    },
                },
            },
            {
                $addFields: {
                    dayOfMonth: { $dayOfMonth: "$createdAt" },
                    firstDayOfMonth: { $dayOfWeek: startOfMonth }
                },
            },
            {
                $addFields: {
                    weekInMonth: {
                        $ceil: {
                            $divide: [
                                { $subtract: ["$dayOfMonth", 1] },
                                7
                            ]
                        }
                    }
                },
            },
            {
                $group: {
                    _id: {
                        week: "$weekInMonth",
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1 } },
        ]);

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const getUsersByRole = async (req, res) => {
    try {
        const users = await User.aggregate([
            {
                $group: {
                    _id: "$role", 
                    count: { $sum: 1 }, 
                },
            },
        ]);
       
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProjectsByType = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 0;
        let pipeline = [
            {
                $group: {
                    _id: "$projectType",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ];

        if (limit > 0) {
            pipeline.push({ $limit: limit });
        }

        const projects = await Project.aggregate(pipeline);
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProjectsByIndustry = async (req, res) => {
    try {
        const projects = await Project.aggregate([
            {
                $group: {
                    _id: "$industryName",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ]);

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProjectsByRepresentative = async (req, res) => {
    try {
        const projects = await Project.aggregate([
            {
                $group: {
                    _id: "$representativeId",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 10 } // Limit to top 10 representatives
        ]);

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};