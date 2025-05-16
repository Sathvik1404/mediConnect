# MediConnect 🏥

MediConnect is a modern, full-stack healthcare management platform that connects patients, doctors, and hospitals through a seamless digital experience.

---

## 🌟 Features

### 👩‍⚕️ For Patients
- Register and login
- Book appointments with doctors
- View and cancel upcoming appointments
- Message doctors directly
- Track medications and refill alerts
- Review hospitals and doctors
- View medical metrics and activity logs

### 🧑‍⚕️ For Doctors
- Manage appointments and patient records
- View incoming applications from hospitals
- Respond to messages from patients
- Write prescriptions and medical notes

### 🏥 For Hospitals
- Register and manage doctor staff
- Review doctor applications
- Manage hospital profile and ratings

### 📦 Admin Panel (optional)
- Oversee all users, appointments, and metrics

---

## 🛠 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios
- Lucide Icons

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Razorpay API (for payments)
- JWT Authentication
- Multer (file uploads)
- RESTful API architecture

---

## 🚀 Getting Started

### 🔧 Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Razorpay account (for payments)
- [Optional] Cloudinary API for images

---

### 📁 Folder Structure

mediConnect/
├── client/ # React frontend
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── context/ # Auth Context
│ │ └── App.jsx
├── server/ # Express backend
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ └── index.js

yaml
Copy
Edit

---

### ⚙️ Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mediConnect.git
cd mediConnect
2. Install Dependencies
bash
Copy
Edit
# For frontend
cd client
npm install

# For backend
cd ../server
npm install
3. Configure Environment Variables
Create .env files for both client/ and server/.

server/.env:

ini
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
4. Run the Project
bash
Copy
Edit
# Run backend
cd server
nodemon index.js

# Run frontend
cd ../client
npm start
🧪 Testing
Use Thunder Client or Postman to test the following:

POST /api/patient/login

GET /api/hospitals

POST /api/appointment

GET /api/messages/:id

📸 Screenshots
Add screenshots of the Patient Dashboard, Doctor Panel, Appointment Page, and Messaging Module.

✅ TODOs
 Add video call integration (WebRTC)

 Notification system

 Advanced analytics dashboard for doctors/hospitals

🤝 Contributing
Fork the repo

Create a new branch (git checkout -b feature-x)

Commit your changes (git commit -m 'Add feature x')

Push to the branch (git push origin feature-x)

Open a Pull Request

