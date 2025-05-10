import { Schema, model } from "mongoose";

const IndustryRepresentativeSchema = new Schema(
    {
        _id: { type: String, required: true },
        representingIndustries: [
            {
                industryId: { type: String, required: true, unique: true },
                name: { type: String, required: true },
                website: { type: String, default: "" },
                address: { type: String, required: true },
                designation: { type: String, required: true },
                workEmail: { type: String, required: true, unique: true },
                companyContactNumber: { type: String, required: true },
                verified: { type: Boolean, default: false },
                verificationDocuments: [
                    {
                        fileName: { type: String, required: true },
                        fileUrl: { type: String, required: true },
                        uploadedAt: { type: Date, default: Date.now },
                    },
                ],
            },
        ],
        verifiedAt: { type: Date, default: null },
        verifiedBy: { type: String, default: null },
    },
    { timestamps: true }
);

IndustryRepresentativeSchema.pre('save', function (next) {
    // Check if any industry's verified status was modified to true
    const newlyVerified = this.representingIndustries?.some(industry => 
        industry.isModified('verified') && industry.verified
    );

    if (newlyVerified && this.verifiedBy && !this.verifiedAt) {
        this.verifiedAt = new Date();
        // Also set verifiedBy on the specific industry that was verified
        this.representingIndustries.forEach(industry => {
            if (industry.isModified('verified') && industry.verified) {
                industry.verifiedBy = this.verifiedBy;
            }
        });
    }
    next();
});

const IndustryRepresentative = model("IndustryRepresentative", IndustryRepresentativeSchema);

export default IndustryRepresentative;