import { Router } from 'express';
const router = Router();
import Notifications from '../models/Notifications.js';
import Project from '../models/Projects.js';
import User from '../models/User.js';
import TeacherSupervision from '../models/TeacherSupervision.js';
import StudentSelection from "../models/StudentSelection.js"


router.get('/notifications/user/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const { 
            limit = 10, 
            skip = 0, 
            read, 
            type,
            sort 
        } = req.query;

        // Convert read query param to boolean if provided
        const readFilter = read !== undefined ? read === 'true' : null;

        const result = await Notifications.getUserNotifications(email, {
            limit,
            skip,
            read: readFilter,
            type,
            sort
        });

        res.json({
            success: true,
            data: result.notifications,
            pagination: {
                total: result.total,
                limit: result.limit,
                skip: result.skip
            }
        });
    } catch (error) {
        console.error('Error fetching user notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch notifications',
            error: error.message
        });
    }
});



// GET /notifications/user/user@example.com
// GET /notifications/user/user@example.com?read=false
// GET /notifications/user/user@example.com?type=review
// GET /notifications/user/user@example.com?limit=20&skip=10
// GET /notifications/user/user@example.com?sort=-priority,-createdAt



// Mark specific notification as read
router.patch('/notifications/mark-as-read/:notificationId', async (req, res) => {
    try {
        const { userId } = req.body;
        const { notificationId } = req.params;

        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID/email is required' 
            });
        }

        const updateResult = await Notifications.findOneAndUpdate(
            {
                _id: notificationId,
                'recipients.userId': userId
            },
            {
                $set: {
                    'recipients.$.read': true,
                    'recipients.$.readAt': new Date()
                }
            },
            { new: true }
        );

        if (!updateResult) {
            return res.status(404).json({ 
                success: false, 
                message: 'Notification not found or user is not a recipient' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Notification marked as read',
            data: updateResult
        });

    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update notification status',
            error: error.message 
        });
    }
});

// Mark all notifications as read for a user
router.patch('/notifications/mark-all-as-read', async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID/email is required' 
            });
        }

        const updateResult = await Notifications.updateMany(
            {
                'recipients.userId': userId,
                'recipients.read': false
            },
            {
                $set: {
                    'recipients.$[elem].read': true,
                    'recipients.$[elem].readAt': new Date()
                }
            },
            {
                arrayFilters: [{ 'elem.userId': userId }],
                multi: true
            }
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(200).json({ 
                success: true, 
                message: 'No unread notifications found for this user' 
            });
        }

        res.json({ 
            success: true, 
            message: 'All notifications marked as read',
            data: null
        });

    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update notifications status',
            error: error.message 
        });
    }
});



router.get('/notifications/unread-count/:email', async (req, res) => {
    try {
        const { email } = req.params;
        
        const count = await Notifications.countDocuments({
            'recipients': {
                $elemMatch: {
                    userId: email,
                    read: false
                }
            }
        });
        
        res.json({ 
            success: true, 
            count 
        });
    } catch (error) {
        console.error('Error getting unread count:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});



// Route to send project approval notification
router.post('/project-approval-notification', async (req, res) => {
    try {
        const {
            projectId,
            senderId,
            senderName,
            senderRole,
            recipients,
            approvalStatus,
            comments,
            actionRequired,
            responseDeadline
        } = req.body;

        if (!projectId || !senderId || !senderName || !recipients || recipients.length === 0) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Determine notification type based on approval status
        let notificationType;
        let title;
        let message;
        let actionType = null;

        switch (approvalStatus) {
            case 'approved':
                notificationType = 'projectApproval';
                title = 'Project Approved';
                message = `Your project has been approved. ${comments ? 'Comments: ' + comments : ''}`;
                actionType = null;
                break;
            case 'rejected':
                notificationType = 'projectApproval';
                title = 'Project Rejected';
                message = `Your project has been rejected. ${comments ? 'Reason: ' + comments : ''}`;
                actionType = null;
                break;
            case 'needMoreInfo':
                notificationType = 'projectEditRequest';
                title = 'Project Requires Changes';
                message = `Your project requires additional information. ${comments ? 'Details: ' + comments : ''}`;
                actionType = 'approval';
                break;
            default:
                return res.status(400).json({ error: "Invalid approval status" });
        }

        // Create notification
        const notification = new Notifications({
            type: notificationType,
            title,
            message,
            relatedEntity: {
                type: 'project',
                id: projectId
            },
            recipients: recipients.map(recipient => ({
                userId: recipient.userId,
                read: false
            })),
            sender: {
                userId: senderId,
                name: senderName,
                role: senderRole || 'teacher'
            },
            actionRequired: actionRequired || false,
            actionType,
            actionLink: `/project/${projectId}`,
            responseDeadline: responseDeadline ? new Date(responseDeadline) : null,
            priority: 'high',
            metadata: {
                approvalStatus,
                comments
            }
        });

        await notification.save();

        res.status(201).json({
            message: "Notification sent successfully",
            notification
        });

    } catch (error) {
        console.error("Error sending project approval notification:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



router.post('/project-approval-response', async (req, res) => {
    try {
        const {
            notificationId,
            userId,
            response,
            comments
        } = req.body;

        if (!notificationId || !userId || !response) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Update notification response
        const updatedNotification = await Notifications.respondToNotification(
            userId,
            notificationId,
            response,
            comments
        );

        if (!updatedNotification) {
            return res.status(404).json({ error: "Notification not found or already responded" });
        }

        // If this was a response to a "need more info" request, update the project status
        if (updatedNotification.type === 'projectEditRequest') {
            const projectId = updatedNotification.relatedEntity.id;
            
            // Update project status based on response
            let projectUpdate = {};
            if (response === 'approved') {
                projectUpdate.status = 'changesMade';
            } else if (response === 'rejected') {
                projectUpdate.status = 'changesRejected';
            }

            // Use Project.findByIdAndUpdate instead of findByIdAndUpdate
            await Project.findByIdAndUpdate(projectId, projectUpdate);
        }

        res.status(200).json({
            message: "Response recorded successfully",
            notification: updatedNotification
        });

    } catch (error) {
        console.error("Error processing project approval response:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



export const sendSupervisionRequestNotification = async (projectId, teacherDetails) => {
    try {
        // Get the project to find the representative
        const project = await Project.findById(projectId).select('representativeId title');
        
        if (!project) {
            console.error('Project not found for notification');
            return;
        }

        // Create the notification
        const notification = new Notifications({
            type: "supervisionResponse",
            title: "New Supervision Request",
            message: `${teacherDetails.fullName} from ${teacherDetails.university} has requested to supervise your project "${project.title}"`,
            relatedEntity: {
                type: "supervision",
                id: project.title,
            },
            recipients: [{
                userId: project.representativeId,
                read: false,
            }],
            sender: {
                userId: teacherDetails.teacherId,
                name: teacherDetails.fullName,
                role: "teacher",
            },
            actionRequired: true,
            actionType: "approval",
            actionLink: `/teacherSupervision/${projectId}`,
            priority: "high",
        });

        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating supervision request notification:', error);
        throw error;
    }
};


export const sendSupervisionResponseNotification = async (projectId, teacherId, status, actionBy, comments) => {
    try {
        // Get project details
        const project = await Project.findById(projectId).select('title');
        if (!project) {
            console.error('Project not found for notification');
            return;
        }

        // Get action user details
        const actionUser = await User.findById(actionBy).select('username role');
        if (!actionUser) {
            console.error('Action user not found for notification');
            return;
        }

        // Determine notification content based on status
        let title, message;
        if (status === 'approved') {
            title = 'Supervision Request Approved';
            message = `Your request to supervise "${project.title}" has been approved`;
        } else if (status === 'rejected') {
            title = 'Supervision Request Rejected';
            message = `Your request to supervise "${project.title}" has been rejected`;
        } else {
            return; // Only send notifications for approved/rejected statuses
        }

        if (comments) {
            message += `. Comments: ${comments}`;
        }

        // Create notification for the teacher
        const notification = new Notifications({
            type: "supervisionResponse",
            title,
            message,
            relatedEntity: {
                type: "supervision",
                id: project.title,
            },
            recipients: [{
                userId: teacherId,
                read: false,
            }],
            sender: {
                userId: actionBy,
                name: actionUser.username,
                role: actionUser.role,
            },
            actionRequired: false,
            priority: "medium",
            metadata: {
                status,
                comments
            }
        });

        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating supervision response notification:', error);
        throw error;
    }
};


export const sendGroupSelectionNotification = async (projectId, studentEmail, university) => {
    try {
        // Get project details
        const project = await Project.findById(projectId).select('title representativeId');
        if (!project) {
            console.error('Project not found for notification');
            return;
        }

        // Get student details
        const student = await User.findOne({ email: studentEmail }).select('username');
        if (!student) {
            console.error('Student not found for notification');
            return;
        }

        // Get approved supervisors for this project
        const supervision = await TeacherSupervision.findOne({ _id: projectId });
        const approvedSupervisors = supervision?.supervisedBy.filter(
            s => s.responseFromInd.status === 'approved'
        ) || [];

        // Create notifications for:
        // 1. Project representative
        // 2. All approved supervisors

        const recipients = [
            {
                userId: project.representativeId,
                read: false
            },
            ...approvedSupervisors.map(supervisor => ({
                userId: supervisor.teacherId,
                read: false
            }))
        ];

        const notification = new Notifications({
            type: "groupChange",
            title: "New Group Created",
            message: `${student.username} from ${university} has created a new group for your project "${project.title}"`,
            relatedEntity: {
                type: "group",
                id: project.title,
                secondaryId: project.representativeId // Optional: can store representative ID here
            },
            recipients,
            sender: {
                userId: studentEmail,
                name: student.username,
                role: "student"
            },
            actionRequired: false,
            priority: "medium",
            metadata: {
                selectionType: "newGroup",
                university
            }
        });

        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating group selection notification:', error);
        throw error;
    }
};



export const sendGroupJoinNotification = async (projectId, selectionId, joiningStudentEmail, existingGroupMembers) => {
    try {
        // Get project details
        const project = await Project.findById(projectId).select('title representativeId');
        if (!project) {
            console.error('Project not found for notification');
            return;
        }

        // Get joining student details
        const joiningStudent = await User.findOne({ email: joiningStudentEmail }).select('username');
        if (!joiningStudent) {
            console.error('Joining student not found for notification');
            return;
        }

        // Get approved supervisors for this project
        const supervision = await TeacherSupervision.findOne({ _id: projectId });
        const approvedSupervisors = supervision?.supervisedBy.filter(
            s => s.responseFromInd.status === 'approved'
        ) || [];

        // Create recipients list:
        // 1. Project representative
        // 2. All approved supervisors
        // 3. Existing group members (excluding the joining student)
        const recipients = [
            {
                userId: project.representativeId,
                read: false
            },
            ...approvedSupervisors.map(supervisor => ({
                userId: supervisor.teacherId,
                read: false
            })),
            ...existingGroupMembers
                .filter(memberEmail => memberEmail !== joiningStudentEmail)
                .map(memberEmail => ({
                    userId: memberEmail,
                    read: false
                }))
        ];

        const notification = new Notifications({
            type: "groupChange",
            title: "New Member Joined Group",
            message: `${joiningStudent.username} has joined group ${selectionId} for project "${project.title}"`,
            relatedEntity: {
                type: "group",
                id: project.title,
                secondaryId: selectionId // Store the selectionId as secondaryId
            },
            recipients,
            sender: {
                userId: joiningStudentEmail,
                name: joiningStudent.username,
                role: "student"
            },
            actionRequired: false,
            priority: "medium",
            metadata: {
                actionType: "memberJoined",
                selectionId,
                joiningMember: joiningStudentEmail
            }
        });

        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating group join notification:', error);
        throw error;
    }
};


export const sendSubmissionNotification = async (projectId, selectionId, submittedByName, submissionId) => {
    try {
        // Get project details
        const project = await Project.findById(projectId).select('title representativeId');
        if (!project) {
            console.error('Project not found for notification');
            return;
        }

        // Get group details
        const selection = await StudentSelection.findOne(
            { _id: projectId, "studentSelection.selectionId": selectionId },
            { "studentSelection.$": 1 }
        );
        
        if (!selection || !selection.studentSelection.length) {
            console.error('Group not found for notification');
            return;
        }

        const group = selection.studentSelection[0];

        // Get approved supervisors for this project
        const supervision = await TeacherSupervision.findOne({ _id: projectId });
        const approvedSupervisors = supervision?.supervisedBy.filter(
            s => s.responseFromInd.status === 'approved'
        ) || [];

        // Create recipients list:
        // 1. Project representative
        // 2. All approved supervisors
        // 3. Group leader (if different from submitter)
        const recipients = [
            {
                userId: project.representativeId,
                read: false
            },
            ...approvedSupervisors.map(supervisor => ({
                userId: supervisor.teacherId,
                read: false
            })),
            ...(group.groupLeader !== submittedByName ? [{
                userId: group.groupLeader,
                read: false
            }] : [])
        ];

        const notification = new Notifications({
            type: "submission",
            title: "New Submission Added",
            message: `${submittedByName} has submitted work for project "${project.title}" (Group: ${selectionId})`,
            relatedEntity: {
                type: "submission",
                id: project.title,
                secondaryId: submissionId
            },
            recipients,
            sender: {
                userId: submittedByName,
                name: submittedByName,
                role: "student"
            },
            actionRequired: false,
            priority: "high",
            metadata: {
                submissionId,
                selectionId,
                projectTitle: project.title
            }
        });

        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating submission notification:', error);
        throw error;
    }
};


export const sendReviewNotification = async (projectId, selectionId, review) => {
    try {
        // Get project details
        const project = await Project.findById(projectId).select('title');
        if (!project) {
            console.error('Project not found for notification');
            return;
        }

        // Get reviewer details
        const reviewer = await User.findOne({ email: review.reviewerId }).select('username role');
        if (!reviewer) {
            console.error('Reviewer not found for notification');
            return;
        }

        // Get group members
        const selection = await StudentSelection.findOne(
            { "studentSelection.selectionId": selectionId },
            { "studentSelection.$": 1 }
        );
        
        if (!selection || !selection.studentSelection.length) {
            console.error('Group not found for notification');
            return;
        }

        const groupMembers = selection.studentSelection[0].groupMembers;

        // Create notification for each group member
        const notification = new Notifications({
            type: "review",
            title: "New Review Received",
            message: `Your project "${project.title}" has been reviewed by ${reviewer.username} with rating ${review.rating}`,
            relatedEntity: {
                type: "review",
                id: project.title,
                secondaryId: selectionId
            },
            recipients: groupMembers.map(member => ({
                userId: member,
                read: false
            })),
            sender: {
                userId: review.reviewerId,
                name: reviewer.username,
                role: reviewer.role
            },
            actionRequired: false,
            priority: "medium",
            metadata: {
                rating: review.rating,
                comments: review.comments,
                projectTitle: project.title
            }
        });

        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating review notification:', error);
        throw error;
    }
};


export const sendRoleCompletionNotification = async (projectId, selectionId, role , completedByEmail = null) => {
    try {
        // Get project details
        const project = await Project.findById(projectId).select('title');
        if (!project) {
            console.error('Project not found for notification');
            return;
        }

        // Get selection/group details
        const selection = await StudentSelection.findOne(
            { _id: projectId, "studentSelection.selectionId": selectionId },
            { "studentSelection.$": 1 }
        );
        
        if (!selection || !selection.studentSelection.length) {
            console.error('Group not found for notification');
            return;
        }

        const group = selection.studentSelection[0];
        const groupMembers = group.groupMembers;

        // Get the role name and sender details
        let roleName, sender;
        if (role === 'industry') {
            roleName = 'Industry Representative';
            const industryUser = await User.findOne({ email: completedByEmail }).select('username role') || {
                username: 'Industry Supervisor',
                role: 'industry'
            };
            sender = {
                userId: completedByEmail || 'system',
                name: industryUser.username,
                role: industryUser.role
            };
        } else {
            roleName = 'Teacher/ Supervisor';
            const teacherUser = await User.findOne({ email: completedByEmail }).select('username role') || {
                username: 'Teacher',
                role: 'teacher'
            };
            sender = {
                userId: 'system',
                name: "system" ,
                role: "system"
            };
        }

        // Create notification for each group member
        const notification = new Notifications({
            type: "projectCompletion",
            title: `${roleName} Marked Project as Completed`,
            message: `Your ${roleName.toLowerCase()} has marked project "${project.title}" (Group: ${selectionId}) as completed`,
            relatedEntity: {
                type: "project",
                id: project.title,
                secondaryId: selectionId
            },
            recipients: groupMembers.map(member => ({
                userId: member,
                read: false
            })),
            sender,
            actionRequired: false,
            priority: "high",
            metadata: {
                selectionId,
                projectTitle: project.title,
                completedBy: role,
                completedAt: new Date(),
                completedByUser: completedByEmail
            }
        });

        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating role completion notification:', error);
        throw error;
    }
};


export default router;