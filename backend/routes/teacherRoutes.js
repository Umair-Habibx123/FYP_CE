import { Router } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import Teacher from "../models/Teachers.js";
import User from "../models/User.js"

dotenv.config();

const router = Router();
router.use(cookieParser());


router.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});


router.post("/insertTeacherUser", async (req, res) => {
    try {
        const { _id, email, employeeId, designation, department, university, verificationDocuments, verified, verifiedBy } = req.body;

        if (!_id || !employeeId || !designation || !department || !verificationDocuments || !Array.isArray(verificationDocuments)) {
            return res.status(400).json({ error: "Invalid or missing required fields." });
        }


        const existingTeacher = await Teacher.findOne({ _id: email });
        if (existingTeacher) {
            return res.status(400).json({ error: "Teacher with this email already exists." });
        }


        const uniqueFiles = [];
        const fileUrls = new Set();
        verificationDocuments.forEach((doc) => {
            if (!fileUrls.has(doc.fileUrl)) {
                fileUrls.add(doc.fileUrl);
                uniqueFiles.push(doc);
            }
        });


        const teacherData = new Teacher({
            _id: email,
            employeeId,
            designation,
            department,
            university: university || "",
            verified: verified || false,
            verificationDocuments: uniqueFiles,
            verifiedAt: null,
            verifiedBy: verifiedBy || null,
        });

        await teacherData.save();
        console.log(`Teacher data saved for ${email}.`);

        res.status(201).json({
            message: "Teacher registered successfully.",
            user: { email },
        });
    } catch (error) {
        console.error("Error inserting teacher user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get('/check-techId', async (req, res) => {
    try {
        const { employeeId } = req.query;
        const existingTeacher = await Teacher.findOne({ employeeId });
        res.json({ exists: !!existingTeacher });
    } catch (error) {
        res.status(500).json({ error: 'Error checking ID' });
    }
});





router.put("/updateTeacherEmpInfo/:email", async (req, res) => {
    const { email } = req.params;
    const updatedTeacher = req.body;

    try {
        const teacher = await Teacher.findOne({ _id: email });

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }


        console.log("Updated Teacher Data:", updatedTeacher);


        Object.assign(teacher, updatedTeacher);


        await teacher.save();

        res.status(200).json({ message: "Teacher updated successfully", updatedTeacher: teacher });
    } catch (error) {
        console.error("Error updating teacher:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});


export default router;
