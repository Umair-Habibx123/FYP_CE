import express from "express";
import cookieParser from "cookie-parser";
import Project from "../models/Projects.js";
import { deleteFileFromGridFS } from "../routes/gridFsRoutes.js";
import mongoose from "mongoose";
import IndustryRepresentative from "../models/Industry.js";
import StudentSelection from "../models/StudentSelection.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
router.use(cookieParser());

router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

router.post("/AddProject", express.json(), async (req, res) => {
  console.log("📥 Received Data:", req.body);
  try {
    const {
      title,
      description,
      projectType,
      representativeId,
      industryName,
      difficultyLevel,
      selection,
      requiredSkills,
      additionalInfo,
      duration,
      maxStudentsPerGroup,
      maxGroups,
      attachments,
    } = req.body;

    if (
      !title ||
      !description ||
      !projectType ||
      !representativeId ||
      !difficultyLevel ||
      !duration
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let parsedDuration;
    try {
      parsedDuration =
        typeof duration === "string" ? JSON.parse(duration) : duration;
    } catch (err) {
      return res.status(400).json({ error: "Invalid duration format" });
    }

    let parsedAttachments = [];
    try {
      parsedAttachments = JSON.parse(attachments || "[]");
    } catch (err) {
      return res.status(400).json({ error: "Invalid attachments format" });
    }

    let parsedRequiredSkills = [];
    try {
      parsedRequiredSkills =
        typeof requiredSkills === "string"
          ? JSON.parse(requiredSkills)
          : requiredSkills;
    } catch (err) {
      return res.status(400).json({ error: "Invalid requiredSkills format" });
    }

    console.log("📎 Processed Attachments:", parsedAttachments);

    const newProject = new Project({
      _id: `proj${Date.now()}`,
      title,
      description,
      type: selection,
      projectType,
      difficultyLevel,
      requiredSkills: parsedRequiredSkills,
      additionalInfo,
      duration: parsedDuration,
      representativeId,
      industryName,
      attachments: parsedAttachments,
      ...(selection === "Group" && { maxStudentsPerGroup, maxGroups }),
      //  editStatus : "unlocked",
      //  unlockedUntil : null,
      //  lastEditRequestId : null
    });

    const savedProject = await newProject.save();
    await IndustryRepresentative.updateOne(
      { _id: representativeId },
      { $push: { postedProjects: savedProject._id } }
    );

    res
      .status(201)
      .json({ message: "Project added successfully", project: savedProject });
  } catch (error) {
    console.error("❌ Error saving project:", error);
    res.status(500).json({ error: "Failed to add project. Please try again." });
  }
});


router.put("/updateProject/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedProject = await Project.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res
      .status(200)
      .json({ message: "Project updated successfully", updatedProject });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

router.delete("/deleteProject/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.attachments && project.attachments.length > 0) {
      for (const attachment of project.attachments) {
        
    // Assuming fileUrl looks like: "/file/BUCKET_NAME/FILENAME"
        await deleteFileFromGridFS(attachment.fileUrl);
      }
    }

    await Project.findByIdAndDelete(id);

    await IndustryRepresentative.updateOne(
      { _id: project.representativeId },
      { $pull: { postedProjects: id } }
    );

    res
      .status(200)
      .json({ message: "Project and associated files deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting project:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

router.get("/fetchProjectDetailById/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

router.get("/getMyProjects", async (req, res) => {
  try {
    const { representativeId } = req.query;
    if (!representativeId) {
      return res.status(400).json({ message: "Representative ID is required" });
    }

    const projects = await Project.find({ representativeId });

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/getAllProjects", async (req, res) => {
  try {
    const projects = await Project.find();

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/getCompletedProjects", async (req, res) => {
  try {
    const completedProjects = await Project.aggregate([
      {
        $lookup: {
          from: "studentselections",
          localField: "_id",
          foreignField: "_id",
          as: "studentSelectionData",
        },
      },
      { $unwind: "$studentSelectionData" },
      {
        $match: {
          "studentSelectionData.studentSelection.status.isCompleted": true,
        },
      },
    ]);

    res.status(200).json(completedProjects);
  } catch (error) {
    console.error("Error fetching completed projects:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
