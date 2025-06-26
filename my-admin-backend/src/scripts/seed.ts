import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database';
import Permission from '../models/Permission';
import Role from '../models/Role';
import User from '../models/User';

dotenv.config({ path: '.env' });

const seedDatabase = async () => {
    try {
        await connectDB();
        console.log('Database connected for seeding...');

        // Clear existing data
        await Permission.deleteMany({});
        await Role.deleteMany({});
        await User.deleteMany({});
        console.log('Cleared existing data.');

        // --- Define Permissions ---
        const permissionsList = [
            // User Management
            { name: 'user:create', description: 'Create a new user' },
            { name: 'user:read', description: 'Read user data' },
            { name: 'user:update', description: 'Update a user' },
            { name: 'user:delete', description: 'Delete a user' },
            // Role Management
            { name: 'role:create', description: 'Create a new role' },
            { name: 'role:read', description: 'Read role data' },
            { name: 'role:update', description: 'Update a role' },
            { name: 'role:delete', description: 'Delete a role' },
            // Product (Sample CRUD)
            { name: 'product:create', description: 'Create a new product' },
            { name: 'product:read', description: 'Read product data' },
            { name: 'product:update', description: 'Update a product' },
            { name: 'product:delete', description: 'Delete a product' },
        ];

        const createdPermissions = await Permission.insertMany(permissionsList);
        const permissionIds = createdPermissions.map(p => p._id);
        console.log('Permissions seeded.');

        // --- Define Roles ---
        // Super Admin Role (has all permissions)
        const superAdminRole = new Role({
            name: 'Super Admin',
            permissions: permissionIds,
        });
        await superAdminRole.save();
        console.log('Super Admin role seeded.');

        // Viewer Role (has only read permissions)
        const viewerPermissions = createdPermissions
            .filter(p => p.name.includes(':read'))
            .map(p => p._id);

        const viewerRole = new Role({
            name: 'Viewer',
            permissions: viewerPermissions,
        });
        await viewerRole.save();
        console.log('Viewer role seeded.');

        // --- Create Super Admin User ---
        const superAdminUser = new User({
            name: 'Super Admin',
            email: 'admin@example.com',
            password: 'password123', // This will be hashed by the pre-save hook
            role: superAdminRole._id,
            isEmailVerified: true,
        });
        await superAdminUser.save();
        console.log('Super Admin user created.');
        console.log('---');
        console.log('Admin Email: admin@example.com');
        console.log('Admin Password: password123');
        console.log('---');

        console.log('Database seeding completed successfully!');
    } catch (error) {
        console.error('Error during database seeding:', error);
    } finally {
        mongoose.disconnect();
        console.log('Disconnected from database.');
    }
};

seedDatabase(); 