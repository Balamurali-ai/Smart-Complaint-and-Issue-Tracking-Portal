# Quick Start Guide

## Step-by-Step Instructions to Run the Project

### 1. Install MongoDB
- Download and install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service

### 2. Setup Backend

Open Terminal/Command Prompt:

```bash
cd "c:\Users\mithu\OneDrive\Desktop\FSD project\server"
npm install
npm run dev
```

Backend will start on http://localhost:5000

### 3. Setup Frontend

Open a NEW Terminal/Command Prompt:

```bash
cd "c:\Users\mithu\OneDrive\Desktop\FSD project\client"
npm install
npm start
```

Frontend will start on http://localhost:3000

### 4. Test the Application

1. Open browser and go to http://localhost:3000
2. Click "Register" to create a new account
3. Choose role: "student" or "admin"
4. Login with your credentials

### Student Flow:
- Submit a complaint
- View your complaints
- Check complaint status
- Provide feedback when resolved

### Admin Flow:
- View dashboard statistics
- Manage all complaints
- Filter by category/status
- Update complaint status
- Assign to department
- Add resolution message

## Troubleshooting

### If MongoDB connection fails:
Check that MongoDB is running:
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

### If ports are busy:
Change PORT in server/.env file

### If npm install fails:
Try:
```bash
npm install --legacy-peer-deps
```

## Default Configuration

- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- Database: mongodb://localhost:27017/complaint-portal

Enjoy using the Complaint Portal!
