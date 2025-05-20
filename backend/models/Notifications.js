import { Schema, model } from "mongoose";

const recipientSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
        readAt: {
            type: Date,
            default: null,
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        // New field for tracking response to action-required notifications
        responded: {
            type: Boolean,
            default: false,
        },
        response: {
            type: String,
            enum: ["approved", "rejected", "pending"],
            default: "pending",
        },
    },
    { _id: false }
);

const senderSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "teacher", "industry", "student", "system"],
            default: "system",
        },
    },
    { _id: false }
);

const relatedEntitySchema = new Schema(
    {
        type: {
            type: String,
            required: true,
            enum: [
                "project",
                "supervision",
                "group",
                "submission",
                "review",
                "request",
            ],
        },
        id: {
            type: String,
            required: true,
        },
        // Additional reference fields for complex relationships
        secondaryId: {
            type: String,
        },
    },
    { _id: false }
);

const notificationsSchema = new Schema(
    {
        type: {
            type: String,
            required: true,
            enum: [
                "projectApproval",
                "supervisionResponse",
                "groupChange",
                "submission",
                "review",
                "projectCompletion",
                "projectEditRequest",
                "projectDeleteRequest",
                "dateExtensionRequest",
                "supervisorChangeRequest",
                "universityTransferRequest",
                "projectWithdrawal",
                "dateExtensionApproval"
            ],
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        relatedEntity: {
            type: relatedEntitySchema,
            required: true,
        },
        recipients: {
            type: [recipientSchema],
            required: true,
            validate: {
                validator: function (v) {
                    return v.length > 0;
                },
                message: "At least one recipient is required",
            },
        },
        sender: {
            type: senderSchema,
            required: true,
        },
        actionRequired: {
            type: Boolean,
            default: false,
        },
        // New field for action type when action is required
        actionType: {
            type: String,
            enum: ["finalApproval" , "dateExtensionApproval" , "approval", "information", "confirmation", null],
            default: null,
        },
        actionLink: {
            type: String,
            trim: true,
        },
        // New field for deadline to respond to action-required notifications
        responseDeadline: {
            type: Date,
        },
        metadata: {
            type: Schema.Types.Mixed,
            default: {},
        },
        // New field for tracking notification priority
        priority: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
            default: "medium",
        },
        createdAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        // New field for tracking if the notification is part of a sequence
        sequenceId: {
            type: String,
        },
        // New field for tracking the step in a sequence
        sequenceStep: {
            type: Number,
        },
    },
    {
        timestamps: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for performance
notificationsSchema.index({ "recipients.userId": 1, read: 1 });
notificationsSchema.index({ "relatedEntity.id": 1, type: 1 });
notificationsSchema.index({ actionRequired: 1, "recipients.responded": 1 });
notificationsSchema.index({ priority: 1, createdAt: -1 });

// Update the updatedAt field before saving
notificationsSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

// Static methods
notificationsSchema.statics.markAsRead = async function (
    userId,
    notificationId
) {
    return this.findOneAndUpdate(
        {
            _id: notificationId,
            "recipients.userId": userId,
        },
        {
            $set: {
                "recipients.$.read": true,
                "recipients.$.readAt": new Date(),
            },
        },
        { new: true }
    );
};

notificationsSchema.statics.markAsDeleted = async function (
    userId,
    notificationId
) {
    return this.findOneAndUpdate(
        {
            _id: notificationId,
            "recipients.userId": userId,
        },
        {
            $set: {
                "recipients.$.deleted": true,
            },
        },
        { new: true }
    );
};


// Add this to your Notifications model static methods
notificationsSchema.statics.getUserNotifications = async function (
    userId,
    { 
        limit = 10, 
        skip = 0, 
        read = null, 
        type = null,
        sort = '-createdAt' 
    } = {}
) {
    const query = {
        "recipients.userId": userId,
        "recipients.deleted": false
    };

    // Optional filters
    if (read !== null) {
        query["recipients.read"] = read;
    }
    if (type) {
        query.type = type;
    }

    const [notifications, total] = await Promise.all([
        this.find(query)
            .sort(sort)
            .skip(parseInt(skip))
            .limit(parseInt(limit)),
        this.countDocuments(query)
    ]);

    return {
        notifications,
        total,
        limit: parseInt(limit),
        skip: parseInt(skip)
    };
};

// New method to respond to action-required notifications
notificationsSchema.statics.respondToNotification = async function (
    userId,
    notificationId,
    response,
    comments = null
) {
    const update = {
        $set: {
            "recipients.$.responded": true,
            "recipients.$.response": response,
            "recipients.$.read": true,
            "recipients.$.readAt": new Date(),
        },
    };

    if (comments) {
        update.$set["recipients.$.comments"] = comments;
    }

    return this.findOneAndUpdate(
        {
            _id: notificationId,
            "recipients.userId": userId,
            actionRequired: true,
            "recipients.$.responded": false,
        },
        update,
        { new: true }
    );
};

const Notifications = model("Notifications", notificationsSchema);

export default Notifications;
