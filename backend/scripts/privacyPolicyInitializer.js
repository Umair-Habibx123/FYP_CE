// privacyPolicyInitializer.js
import PrivacyPolicy from "../models/PrivacyPolicy.js"; // adjust path as needed

const defaultPolicies = [
    {
        _id: "67d4374c0cf23930661c67d5",
        role: "industry",
        sections: [
            {
                "title": "Introduction",
                "content": "Welcome to the Collaborate Edge Portal. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our portal as an industry representative.",
                "listItems": []
            },
            {
                "title": "Information We Collect",
                "content": "When you create an account on the portal, we collect the following information:",
                "listItems": [
                    "Personal Information: Name, username, email address (educational or personal), profile picture, and contact details.",
                    "Industry Details: Industry name, website, address, designation, work email, company contact number, and verification documents.",
                    "Project-Related Information: Projects uploaded, edited, or deleted, project approvals, supervision permissions granted to teachers, and feedback provided to students."
                ]
            },
            {
                "title": "How We Use Your Information",
                "content": "We use your information for the following purposes:",
                "listItems": [
                    "To create and manage your account.",
                    "To verify your identity and approve you as an industry representative.",
                    "To allow you to upload, read, edit, and delete projects.",
                    "To facilitate collaboration with teachers and students for project supervision and progress tracking.",
                    "To improve the portal's functionality and user experience."
                ]
            },
            {
                "title": "Data Sharing",
                "content": "Your information may be shared with:",
                "listItems": [
                    "Teachers: To approve projects, request supervision permissions, and review student progress.",
                    "Students: To facilitate project collaboration and feedback.",
                    "Administrators: To manage your account and portal access."
                ]
            },
            {
                "title": "Data Security",
                "content": "We implement robust security measures to protect your data from unauthorized access, alteration, or disclosure. Your password is encrypted, and we use secure protocols for data transmission.",
                "listItems": []
            },
            {
                "title": "Your Rights",
                "content": "You have the right to:",
                "listItems": [
                    "Access and update your personal information.",
                    "Delete your account and data.",
                    "Request a copy of your data in a readable format."
                ]
            },
            {
                "title": "Cookies and Tracking",
                "content": "We use cookies to enhance your experience on the portal. You can disable cookies in your browser settings, but this may affect the portal's functionality.",
                "listItems": []
            },
            {
                "title": "Changes to This Policy",
                "content": "We may update this Privacy Policy periodically. Any changes will be posted on this page, and we will notify you via email or portal notifications.",
                "listItems": []
            },
            {
                "title": "Contact Us",
                "content": "If you have any questions or concerns about this Privacy Policy, please contact us at support@collaborateedge.com.",
                "listItems": []
            }
        ]
    },
    {
        _id: "68d4374c0cf23930661c67d5",
        role: "teacher",
        sections: [
            {
                "title": "Introduction",
                "content": "Welcome to the Collaborate Edge Portal. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our portal as a teacher.",
                "listItems": []
            },
            {
                "title": "Information We Collect",
                "content": "When you create an account on the portal, we collect the following information:",
                "listItems": [
                    "Personal Information: Name, username, email address (educational or personal), profile picture, and employee ID.",
                    "University Details: University name, designation, department, and other relevant details.",
                    "Project-Related Information: Projects reviewed, approved, or requested for more information, supervision requests, and feedback provided to students."
                ]
            },
            {
                "title": "How We Use Your Information",
                "content": "We use your information for the following purposes:",
                "listItems": [
                    "To create and manage your account.",
                    "To display projects uploaded by industry representatives for your review and approval.",
                    "To facilitate project supervision requests and collaboration with industry representatives.",
                    "To allow you to review and rate student progress and submissions.",
                    "To improve the portal's functionality and user experience."
                ]
            },
            {
                "title": "Data Sharing",
                "content": "Your information may be shared with:",
                "listItems": [
                    "Industry Representatives: To collaborate on project approvals and supervision.",
                    "Students: To facilitate project supervision and feedback.",
                    "Administrators: To manage your account and portal access."
                ]
            },
            {
                "title": "Data Security",
                "content": "We implement robust security measures to protect your data from unauthorized access, alteration, or disclosure. Your password is encrypted, and we use secure protocols for data transmission.",
                "listItems": []
            },
            {
                "title": "Your Rights",
                "content": "You have the right to:",
                "listItems": [
                    "Access and update your personal information.",
                    "Delete your account and data.",
                    "Request a copy of your data in a readable format."
                ]
            },
            {
                "title": "Cookies and Tracking",
                "content": "We use cookies to enhance your experience on the portal. You can disable cookies in your browser settings, but this may affect the portal's functionality.",
                "listItems": []
            },
            {
                "title": "Changes to This Policy",
                "content": "We may update this Privacy Policy periodically. Any changes will be posted on this page, and we will notify you via email or portal notifications.",
                "listItems": []
            },
            {
                "title": "Contact Us",
                "content": "If you have any questions or concerns about this Privacy Policy, please contact us at support@collaborateedge.com.",
                "listItems": []
            }
        ]
    },
    {
        _id: "69d4374c0cf23930661c67d5",
        role: "student",
        sections: [
            {
                "title": "Introduction",
                "content": "Welcome to the Collaborate Edge Portal. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our portal.",
                "listItems": []
            },
            {
                "title": "Information We Collect",
                "content": "When you create an account on the portal, we collect the following information:",
                "listItems": [
                    "Personal Information: Name, username, educational email address, profile picture, and student ID.",
                    "University Details: University name, year of study, and degree program.",
                    "Project-Related Information: Projects selected, group members, submissions, and feedback received."
                ]
            },
            {
                "title": "How We Use Your Information",
                "content": "We use your information for the following purposes:",
                "listItems": [
                    "To create and manage your account.",
                    "To display approved projects for your university.",
                    "To facilitate group creation and project submissions.",
                    "To allow teachers and industry representatives to review and rate your work.",
                    "To improve the portal's functionality and user experience."
                ]
            },
            {
                "title": "Data Sharing",
                "content": "Your information may be shared with:",
                "listItems": [
                    "Teachers: To approve projects and provide feedback.",
                    "Industry Representatives: To review project submissions and provide ratings.",
                    "Group Members: To facilitate collaboration on projects."
                ]
            },
            {
                "title": "Data Security",
                "content": "We implement robust security measures to protect your data from unauthorized access, alteration, or disclosure. Your password is encrypted, and we use secure protocols for data transmission.",
                "listItems": []
            },
            {
                "title": "Your Rights",
                "content": "You have the right to:",
                "listItems": [
                    "Access and update your personal information.",
                    "Delete your account and data.",
                    "Request a copy of your data in a readable format."
                ]
            },
            {
                "title": "Cookies and Tracking",
                "content": "We use cookies to enhance your experience on the portal. You can disable cookies in your browser settings, but this may affect the portal's functionality.",
                "listItems": []
            },
            {
                "title": "Changes to This Policy",
                "content": "We may update this Privacy Policy periodically. Any changes will be posted on this page, and we will notify you via email or portal notifications.",
                "listItems": []
            },
            {
                "title": "Contact Us",
                "content": "If you have any questions or concerns about this Privacy Policy, please contact us at support@fypportal.com.",
                "listItems": []
            }
        ]
    },
    {
        _id: "70d4374c0cf23930661c67d5",
        role: "main",
        sections: [
            {
                "title": "Introduction",
                "content": "Welcome to the Collaborate Edge Portal. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our portal, whether as an industry representative, teacher, or student.",
                "listItems": []
            },
            {
                "title": "Information We Collect",
                "content": "The information we collect varies based on your role on the portal:",
                "listItems": [
                    "For Industry Representatives: Name, username, email, profile picture, industry name, website, address, designation, work email, company contact number, verification documents, and project-related activities.",
                    "For Teachers: Name, username, email, profile picture, employee ID, university details, designation, department, and project-related activities.",
                    "For Students: Name, username, educational email, profile picture, student ID, university details, year of study, degree program, and project-related activities."
                ]
            },
            {
                "title": "How We Use Your Information",
                "content": "We use your information for the following purposes:",
                "listItems": [
                    "To create and manage your account based on your role.",
                    "To facilitate project collaboration between industry, teachers, and students.",
                    "To verify identities and approve accounts for industry representatives.",
                    "To display and manage projects (uploading, reviewing, approving, submitting).",
                    "To enable supervision requests and feedback between all roles.",
                    "To improve the portal's functionality and user experience for all users."
                ]
            },
            {
                "title": "Data Sharing",
                "content": "Information is shared between roles as needed for collaboration:",
                "listItems": [
                    "Industry representatives share project details with teachers for approval and with students for collaboration.",
                    "Teachers share supervision requests and feedback with both industry and students.",
                    "Students share project submissions with both teachers and industry representatives.",
                    "Administrators have access to manage all accounts and portal access."
                ]
            },
            {
                "title": "Data Security",
                "content": "We implement robust security measures to protect all user data:",
                "listItems": [
                    "All passwords are encrypted.",
                    "Secure protocols are used for all data transmission.",
                    "Role-based access controls ensure users only access appropriate information.",
                    "Regular security audits are conducted to maintain protection standards."
                ]
            },
            {
                "title": "Your Rights",
                "content": "All users have the right to:",
                "listItems": [
                    "Access and update your personal information.",
                    "Delete your account and associated data.",
                    "Request a copy of your data in a readable format.",
                    "Disable cookies (though this may affect functionality)."
                ]
            },
            {
                "title": "Cookies and Tracking",
                "content": "We use cookies to enhance all users' experience on the portal:",
                "listItems": [
                    "Cookies help maintain login sessions and preferences.",
                    "You can disable cookies in your browser settings.",
                    "Disabling cookies may affect portal functionality across all roles."
                ]
            },
            {
                "title": "Changes to This Policy",
                "content": "We may update this Privacy Policy periodically:",
                "listItems": [
                    "Changes will be posted on this page.",
                    "All users will be notified via email or portal notifications.",
                    "The 'lastUpdated' date at the top will reflect the most recent version."
                ]
            },
            {
                "title": "Contact Us",
                "content": "If you have any questions or concerns about this Privacy Policy, please contact us at support@collaborateedge.com.",
                "listItems": []
            }
        ]
    }
];

async function initializePrivacyPolicies() {
    try {
        const currentDate = new Date();

        for (const policyData of defaultPolicies) {
            const existingPolicy = await PrivacyPolicy.findOne({ role: policyData.role });

            if (!existingPolicy) {
                // Create a new policy with current date
                const policy = new PrivacyPolicy({
                    ...policyData,
                    lastUpdated: currentDate
                });
                await policy.save();
                console.log(`Created default privacy policy for ${policyData.role}`);
            }
            else {
                console.log(`Default privacy policy for ${policyData.role} already exists`);
            }
        }
    } catch (error) {
        console.error("Error initializing privacy policies:", error);
        throw error;
    }
}


export default initializePrivacyPolicies;