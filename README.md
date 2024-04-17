# Todo Web Application

This is a simple Todo web application built using Node.js, Express.js, MongoDB Atlas, and Tailwind CSS for the frontend. Users can add tasks they need to complete and schedule them for the next 10 days. An admin user has CRUD (Create, Read, Update, Delete) functionalities and can be created via the terminal using npm run createAdmin.

## Features

- Users can add tasks to their todo list.
- Tasks can be scheduled for the next 10 days and can be only-read for past 10 days.
- Admin functionalities:
  - Create, Read, Update, and Delete tasks.
  - Set task limits per day for individual users.

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js
- MongoDB Atlas account
- npm (Node Package Manager)
  
## Installation

1. Clone the repository:
```
git clone https://github.com/CroniX-Business/Todo-Web-App.git
```
2. Navigate to the project directory:
```
cd Todo-Web-App
```
3. Install dependencies:
```
npm install
```
4. Set up .env and add inside:
```
DATABASE=your_mongodb_uri
```
5. Run the application:
```
npm start
```

## Usage

Once the application is running, users can access it through their web browser at http://localhost:3000.
Users can sign up and log in to their accounts to manage their todo list.
Admin functionalities can be accessed via the terminal using ```npm run createAdmin```.

## License

This project is licensed under the MIT License.

## Acknowledgments

This application was built using Node.js, Express.js, MongoDB Atlas, and Tailwind CSS.
Special thanks to the contributors of the dependencies used in this project.
