const User = require("../models/User");
const bcrypt = require("bcryptjs");

const seedAdminUser = async () => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Admin@123456', salt);
            
            const newAdmin = new User({
                name: 'Super Admin',
                email: 'admin@activ.com',
                password: hashedPassword,
                role: 'admin'
            });

            await newAdmin.save();
            console.log("✅ Default Super Admin seeded successfully.");
        } else {
            console.log("⚡ Admin user already exists. Skipping root seed.");
        }
    } catch (err) {
        console.error("❌ Failed to seed admin user:", err);
    }
};

module.exports = seedAdminUser;
