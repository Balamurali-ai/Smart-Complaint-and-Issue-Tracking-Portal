# Smart College Complaint & Issue Tracking Portal

A full-stack MERN application for managing college complaints and issues.

## Technology Stack

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT

## Features

### Student Features
- Register and Login
- Submit complaints with title, description, category, and optional image
- View all submitted complaints
- Track complaint status (Pending/In Progress/Resolved)
- View detailed complaint information
- Provide feedback after resolution

### Admin Features
- Admin login
- View all complaints
- Filter complaints by category and status
- Update complaint status
- Assign complaints to departments
- Add resolution messages
- Dashboard with statistics

## Project Structure

```
FSD project/
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── complaintController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Complaint.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   └── adminRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
└── client/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── StudentDashboard.js
    │   │   ├── SubmitComplaint.js
    │   │   ├── ComplaintDetail.js
    │   │   ├── AdminDashboard.js
    │   │   └── ManageComplaints.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Clone or Download the Project

### Step 2: Setup MongoDB
1. Install MongoDB locally or create a MongoDB Atlas account
2. Create a database named `complaint-portal`
3. Copy the connection string

### Step 3: Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Update .env file with your MongoDB URI
# Edit server/.env and update MONGODB_URI

# Start the server
npm run dev
```

The backend server will run on `http://localhost:5000`

### Step 4: Frontend Setup

```bash
# Open a new terminal
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the React app
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Complaints (Student)
- `POST /api/complaints` - Create new complaint
- `GET /api/complaints` - Get user's complaints
- `GET /api/complaints/:id` - Get complaint by ID
- `PUT /api/complaints/:id` - Update complaint
- `DELETE /api/complaints/:id` - Delete complaint

### Admin
- `GET /api/admin/complaints` - Get all complaints (with filters)
- `PUT /api/admin/update-status/:id` - Update complaint status
- `GET /api/admin/stats` - Get dashboard statistics

## Default Test Accounts

### Create Admin Account
Register with role "admin" through the registration page.

### Create Student Account
Register with role "student" (default) through the registration page.

## Usage Guide

### For Students:
1. Register/Login as a student
2. Click "Submit New Complaint"
3. Fill in the complaint details
4. Track status from dashboard
5. View details and provide feedback when resolved

### For Admins:
1. Register/Login as an admin
2. View dashboard statistics
3. Click "Manage Complaints" to see all complaints
4. Filter by category or status
5. Click "Update" to change status, assign department, or add resolution

## Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/complaint-portal
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in .env file
- For Atlas, whitelist your IP address

### Port Already in Use
- Change PORT in server/.env
- Kill the process using the port

### CORS Issues
- Ensure backend is running on port 5000
- Check proxy setting in client/package.json

## Future Enhancements
- Email notifications
- File upload for images
- Real-time updates with Socket.io
- Export reports to PDF
- Mobile responsive design improvements
- Multi-language support

## License
MIT

## Contact
For issues or questions, please create an issue in the repository.
