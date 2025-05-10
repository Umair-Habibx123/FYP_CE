import { Router } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import Student from "../models/Students.js";

dotenv.config();

const router = Router();
router.use(cookieParser());


router.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});


router.post("/insertStudentUser", async (req, res) => {
    try {
        const { _id, email, studentId, degreeOrProgram, yearOfStudy, university, verificationDocuments, verified, verifiedBy } = req.body;

        if (!_id || !studentId || !degreeOrProgram || !yearOfStudy || !university || !verificationDocuments || !Array.isArray(verificationDocuments)) {
            return res.status(400).json({ error: "Invalid or missing required fields." });
        }

        
        const existingStudent = await Student.findOne({ _id: email });
        if (existingStudent) {
            return res.status(400).json({ error: "Student with this email already exists." });
        }

        
        const uniqueFiles = [];
        const fileUrls = new Set();
        verificationDocuments.forEach((doc) => {
            if (!fileUrls.has(doc.fileUrl)) {
                fileUrls.add(doc.fileUrl);
                uniqueFiles.push(doc);
            }
        });

        
        const studentData = new Student({
            _id: email,
            studentId,
            degreeOrProgram,
            yearOfStudy,
            university: university || "",
            verified: verified || false,
            verificationDocuments: uniqueFiles,
            verifiedAt: null,
            verifiedBy: verifiedBy || null,
        });

        await studentData.save();
        console.log(`Student data saved for ${email}.`);

        res.status(201).json({
            message: "Student registered successfully.",
            user: { email },
        });
    } catch (error) {
        console.error("Error inserting student user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get('/check-stdId', async (req, res) => {
    try {
      const { studentId } = req.query;
      const existingStudent = await Student.findOne({ studentId });
      res.json({ exists: !!existingStudent });
    } catch (error) {
      res.status(500).json({ error: 'Error checking ID' });
    }
  });


router.put("/updateStudent/:email", async (req, res) => {
    const { email } = req.params;
    const updatedStudent = req.body;

    try {
        const student = await Student.findOne({ _id: email });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        Object.assign(student, updatedStudent);


        await student.save();

        res.status(200).json({ message: "Student updated successfully", updatedStudent: student });
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});


export default router;
