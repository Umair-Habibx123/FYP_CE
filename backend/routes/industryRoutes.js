import { Router } from "express";
import cookieParser from "cookie-parser";
import IndustryRepresentative from "../models/Industry.js";
import dotenv from 'dotenv';
import mongoose from "mongoose";
dotenv.config();


const router = Router();
router.use(cookieParser());

router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});



router.post("/insertIndustryUser", async (req, res) => {
  console.log("Request Body:", req.body); 
  try {
    const { _id, email, representingIndustries , verifiedBy } = req.body;

    if (!_id || !representingIndustries || !Array.isArray(representingIndustries)) {
      return res.status(400).json({ error: "Invalid or missing required fields." });
    }

    const existingUser = await IndustryRepresentative.findOne({ _id: email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists." });
    }

    
    const processedIndustries = representingIndustries.map((industry) => {
      const uniqueFiles = [];
      const fileUrls = new Set();

      industry.verificationDocuments.forEach((doc) => {
        if (!fileUrls.has(doc.fileUrl)) {
          fileUrls.add(doc.fileUrl);
          uniqueFiles.push(doc);
        }
      });

      return {
        industryId: industry.industryId || new mongoose.Types.ObjectId().toString(),
        name: industry.name,
        website: industry.website || "",
        address: industry.address,
        designation: industry.designation,
        workEmail: industry.workEmail,
        companyContactNumber: industry.companyContactNumber,
        verified: industry.verified || false,
        verificationDocuments: uniqueFiles, 
      };
    });

    
    const industryData = new IndustryRepresentative({
      _id: email,
      representingIndustries: processedIndustries,
      verifiedAt: null,
      verifiedBy: verifiedBy || null,
    });

    console.log("Final industryUserData:", JSON.stringify(industryData, null, 2));

    await industryData.save();
    console.log(`Industry data saved for ${email}.`);

    res.status(201).json({
      message: "Industry user registered successfully.",
      user: { email },
    });
  } catch (error) {
    console.error("Error inserting industry user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get('/check-workemail', async (req, res) => {
  try {
    const { workemail } = req.query;
    
    const existingIndustry = await IndustryRepresentative.findOne({
      'representingIndustries.workEmail': workemail
    });

    res.json({ exists: !!existingIndustry });
  } catch (error) {
    console.error('Error checking work email:', error);
    res.status(500).json({ error: 'Error checking work email' });
  }
});



router.get("/getIndustryByEmail", async (req, res) => {
  const { email } = req.query;

  try {
    const industry = await IndustryRepresentative.findOne({ _id: email });

    if (!industry) {
      return res.status(404).json({ message: "Industry representative not found" });
    }

    
    const verifiedIndustries = industry.representingIndustries.filter(item => item.verified === true);


    
    const industryNames = verifiedIndustries.map(item => item.name);

    
    res.json({ industryNames });
  } catch (error) {
    console.error("Error fetching industry data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



router.delete("/deleteRepInd/:userId/:industryId", async (req, res) => {
  const { userId, industryId } = req.params;

  try {
    
    const user = await IndustryRepresentative.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const industry = user.representingIndustries.find(ind => ind.industryId === industryId);
    if (!industry) {
      return res.status(404).json({ message: "Industry not found" });
    }

    
    const fileUrls = industry.verificationDocuments.map(doc => doc.fileUrl);

    
    for (const fileUrl of fileUrls) {
      await fetch(`${process.env.VITE_REACT_APP_BACKEND_BASEURL}/deletefile`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl }),
      });
    }

    
    const updatedUser = await IndustryRepresentative.findOneAndUpdate(
      { _id: userId },
      { $pull: { representingIndustries: { industryId: industryId } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Failed to update user" });
    }

    res.status(200).json({ message: "Industry and files removed successfully", user: updatedUser });
  } catch (error) {
    console.error("Error deleting industry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});





router.post("/insertRepInd", async (req, res) => {
  try {
    const { _id, representingIndustries } = req.body;
    console.log("Received Data:", req.body);

    
    const user = await IndustryRepresentative.findById(_id);

    if (user) {
      
      user.representingIndustries.push(...representingIndustries);
      await user.save();
    } else {
      
      await IndustryRepresentative.create({ _id, representingIndustries });
    }

    res.status(200).json({ message: "Industries saved successfully" });
  } catch (error) {
    console.error("Error saving industries:", error);
    res.status(500).json({ message: "Error saving industries", error });
  }
});





router.put("/updateRepInd/:email", async (req, res) => {
  const { email } = req.params;
  const { industryId, updatedIndustry } = req.body;

  try {
    const industryRep = await IndustryRepresentative.findById(email);
    if (!industryRep) {
      return res.status(404).json({ message: "Industry Representative not found" });
    }

    const industryIndex = industryRep.representingIndustries.findIndex(ind => ind.industryId === industryId);
    if (industryIndex === -1) {
      return res.status(404).json({ message: "Industry not found" });
    }

    industryRep.representingIndustries[industryIndex] = { ...industryRep.representingIndustries[industryIndex], ...updatedIndustry };

    await industryRep.save();

    res.status(200).json({ message: "Industry updated successfully", updatedIndustry: industryRep.representingIndustries[industryIndex] });
  } catch (error) {
    console.error("Error updating industry:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});





export default router;
