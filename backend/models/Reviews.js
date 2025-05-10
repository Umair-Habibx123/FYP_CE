import { Schema, model } from "mongoose";

const ReviewsSchema = new Schema(
    {
        _id: { type: String, required: true },
        projectId: { type: String, required: true },
        selectionId: { type: String, required: true },
        reviews: [
            {
                reviewerId: { type: String, required: true },
                reviewerRole: { type: String, enum: ["teacher", "industry"], required: true },
                fullName: { type: String, required: true },
                comments: { type: String, required: true },
                rating: { type: Number, min: 1, max: 5, required: true },
                reviewedAt: { type: Date, required: true },
            },
        ],
        averageRating: { type: Number, default: 0 },
        totalReviews: { type: Number, default: 0 }
    },
    { timestamps: true }
);


ReviewsSchema.pre("save", function (next) {
    this.totalReviews = this.reviews.length;
    if (this.totalReviews > 0) {
        const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
        this.averageRating = totalRating / this.totalReviews;
    } else {
        this.averageRating = 0;
    }
    next();
});

const Review = model("Review", ReviewsSchema);

export default Review;