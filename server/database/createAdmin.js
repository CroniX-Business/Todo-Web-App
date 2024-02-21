import mongoose from 'mongoose';
import inquirer from 'inquirer';
import UserModel from './user.js';

async function promptAdminDetails() {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'email',
            message: 'Enter admin email:',
            validate: function (value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value) || 'Please enter a valid email address';
            }
        },
        {
            type: 'input',
            name: 'username',
            message: 'Enter admin username:',
        },
        {
            type: 'password',
            name: 'password',
            message: 'Enter admin password:',
        },
    ]);
}

async function createAdminUser(adminDetails) {
    try {
        const existingUser = await UserModel.findOne({ email: adminDetails.email });
        if (existingUser) {
            console.log('User with this email already exists!');
            process.exit(1);
        }

        adminDetails.taskCount = 10;
        adminDetails.role = 'admin';

        const newUser = new UserModel(adminDetails);
        await newUser.save();
        console.log('Admin user created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
}

mongoose.connect('mongodb+srv://petarruskan:wvUrxbhMBuoGeXgD@profiles.jkhnkcr.mongodb.net/todo', { useNewUrlParser: true, useUnifiedTopology: true });

async function main() {
    try {
        const adminDetails = await promptAdminDetails();

        await createAdminUser(adminDetails);
    } catch (error) {
        console.error('An error occurred:', error);
        process.exit(1);
    }
}

main();
