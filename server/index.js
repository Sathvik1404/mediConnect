const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');

const port = process.env.PORT || 5000;
const db_url = process.env.MONGODB_URL;

const app = express();

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(session({
    secret: 'hospital-token',
    resave: false,
    saveUninitialized: true
}));

app.use(express.json());

const patientAuthenticationRouter = require('./routes/patientrouters/patientauthentication.router');
const patientProfileRouter = require('./routes/patientrouters/patientprofile.router');
const doctorsRouter = require('./routes/doctorrouters/doctorprofile.router')

const doctorAuthenticationRouter = require('./routes/doctorrouters/doctorauthentication.router');
const doctorProfileRouter = require('./routes/doctorrouters/doctorprofile.router');

const hospitalAuthenticationRouter = require('./routes/hospitalrouters/hospitalauthentication.router');

mongoose.connect(db_url, {
    tls: true,
})
    .then(() => console.log("Mongo Connected"))
    .catch(err => console.log(err));


// Patient End Points
app.use('/api/patient', patientAuthenticationRouter);
app.use('/api/patient/profile', patientProfileRouter);
app.use('/api/patient/doctorslist', doctorsRouter);

// Doctor End Points
app.use('/api/doctor', doctorAuthenticationRouter);
app.use('/api/doctor/profile', doctorProfileRouter);

// Hospital End Points
app.use('/api/hospital', hospitalAuthenticationRouter);

app.listen(port, () => console.log(`Server is running on ${port}`));
