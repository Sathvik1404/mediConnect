# MediConnect 🏥

MediConnect is a modern full-stack healthcare management system that bridges the gap between **patients**, **doctors**, and **hospitals** via an intuitive and responsive web application.

---

## 🌟 Features

### 👩‍⚕️ Patient Module

* Signup/Login authentication
* Book and cancel appointments
* Track appointment history
* Message doctors
* Submit hospital/doctor reviews
* Medication tracking

### 🧑‍⚕️ Doctor Module

* Manage patient appointments
* View messages and reply
* Prescribe medications
* Apply to hospitals
* Track patient history

### 🏥 Hospital Module

* Manage hospital profiles
* View and accept doctor applications
* Maintain ratings and feedback

### ⚖️ Admin Module *(optional)*

* Overview of all system users and actions
* Aggregate reports

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios
* React Router DOM
* Lucide React Icons

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Auth
* Razorpay Integration (for payments)

---

## ✨ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mediConnect.git
cd mediConnect
```

### 2. Install Dependencies

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 3. Create `.env` Files

**server/.env**

```
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

---

### 4. Start the App

```bash
# Start backend
cd server
nodemon index.js

# Start frontend
cd ../client
npm start
```

---

## 🔧 Folder Structure

```
mediConnect/
  ├── client/        # React frontend
  │    ├── src/
  │        ├── components/
  │        ├── pages/
  │        └── App.jsx
  └── server/        # Express backend
       ├── models/
       ├── routes/
       ├── controllers/
       └── index.js
```

---

## 🔮 API Testing Endpoints

Use **Thunder Client** or **Postman**:

| Endpoint             | Method | Description             |
| -------------------- | ------ | ----------------------- |
| `/api/patient/login` | POST   | Patient login           |
| `/api/hospitals`     | GET    | Fetch hospitals         |
| `/api/appointment`   | POST   | Create appointment      |
| `/api/messages/:id`  | GET    | Get messages for a user |

---

## 📈 Future Enhancements

* [ ] AI diagnosis suggestions
* [ ] Video consultations
* [ ] Notifications via email/SMS

---


> Built with passion to simplify healthcare ❤️
