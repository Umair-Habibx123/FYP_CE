import User from "../models/User.js";

const defaultAdmin = {
    _id: "admin1@gmail.com",
    username: "admin1",
    email: "admin1@gmail.com",
    password: "$2b$10$p6fbkN3TOGmzISpqVWXrJ.fl80o1GoBXyO60cd9nXyqterc/uk7zW",
    profilePic: "",
    role: "admin",
    status: "verified",
    createdAt: new Date(),
    updatedAt: new Date()
};

async function initializeAdminUser() {
    try {
        const existingAdmin = await User.findOne({ email: defaultAdmin.email });

        if (!existingAdmin) {
            const adminUser = new User(defaultAdmin);
            await adminUser.save();
            console.log('Default admin user created successfully');
        } else {
            console.log('Default admin user already exists');
        }

    } catch (error) {
        console.error('Error during database initialization:', error);
        throw error;
    }
}

export default initializeAdminUser;