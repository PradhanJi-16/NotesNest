const express = require('express');
const mongoose =require('mongoose');
const cors = require('cors');
require('dotenv').config();//library loading

const app =express();//express ka app banaya

app.use(cors());
app.use(express.json());//Middleware

const noteRoutes = require('./routes/noteRoutes');
app.use('/api/notes', noteRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('API is working!');// Test route
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB Atlas connection error:', err));


const PORT = process.env.PORT || 5000;
app.listen(PORT,() =>{
    console.log(`Server running on port ${process.env.PORT}`);
});