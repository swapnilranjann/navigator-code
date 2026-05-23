/**
 * KTM Navigator Backend - Full Auth Edition 🛡️
 */

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'ktm_ready_to_race_secret_key';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- ENHANCED DEBUG LOGGER ---
app.use((req, res, next) => {
  const startTime = Date.now();
  console.log(`\n┌───────────────── 📥 INCOMING REQUEST ─────────────────`);
  console.log(`│ 📡 Method : ${req.method}`);
  console.log(`│ 🌐 URL    : ${req.url}`);
  console.log(`│ ⏰ Time   : ${new Date().toLocaleTimeString()}`);
  if (req.body && Object.keys(req.body).length > 0) {
    const bodyCopy = { ...req.body };
    if (bodyCopy.password) bodyCopy.password = '[MASKED]';
    console.log(`│ 📦 Body   :\n│   ${JSON.stringify(bodyCopy, null, 2).split('\n').join('\n│   ')}`);
  }
  console.log(`└───────────────────────────────────────────────────────`);

  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - startTime;
    console.log(`\n┌───────────────── 📤 OUTGOING RESPONSE ────────────────`);
    console.log(`│ 📡 Method : ${req.method}`);
    console.log(`│ 🌐 URL    : ${req.url}`);
    console.log(`│ 🚥 Status : ${res.statusCode >= 400 ? '❌' : '✅'} ${res.statusCode}`);
    console.log(`│ ⏱️  Delay  : ${duration}ms`);
    
    if (data) {
      try {
        const parsed = JSON.parse(data);
        const dataCopy = Array.isArray(parsed) ? parsed : { ...parsed };
        if (dataCopy.token) dataCopy.token = '[JWT TOKEN MASKED]';
        console.log(`│ 📦 Data   :\n│   ${JSON.stringify(dataCopy, null, 2).split('\n').join('\n│   ')}`);
      } catch (e) {
        console.log(`│ 📦 Data   : ${data.toString().substring(0, 200)}`);
      }
    }
    console.log(`└───────────────────────────────────────────────────────\n`);
    
    return originalSend.apply(res, arguments);
  };
  
  next();
});

// --- MONGODB CONNECTION ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ktm_navigator';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- DATA MODELS ---

// New Collection: ktm_users
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String },
  regNumber: { type: String },
  bikeModel: { type: String, default: 'KTM 250 Duke' },
  totalDistance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'ktm_users' });

const User = mongoose.model('User', UserSchema);

// Existing collections...
const RideSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: String,
  distance: Number,
  duration: String,
  from: String,
  to: String,
}, { collection: 'ktm_rides' });

const Ride = mongoose.model('Ride', RideSchema);

// --- AUTH ENDPOINTS ---

/**
 * @route POST /api/register
 * @desc  Create a new KTM Rider account
 */
app.post('/api/register', async (req, res) => {
  console.log(`[AUTH] Attempting to register rider: ${req.body.email}`);
  try {
    const { name, email, password, mobile, regNumber, bikeModel } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`[AUTH] ❌ Registration failed: Email ${email} already exists.`);
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name, email, password: hashedPassword, mobile, regNumber, bikeModel
    });

    await newUser.save();
    console.log(`[AUTH] ✅ Success: New rider registered: ${name}`);
    res.status(201).json({ message: 'Rider registered successfully!' });
  } catch (err) {
    console.error('[AUTH] ❌ Registration error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route POST /api/login
 * @desc  Login to your rider profile
 */
app.post('/api/login', async (req, res) => {
  console.log(`[AUTH] Login attempt for: ${req.body.email}`);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`[AUTH] ❌ Login failed: Rider ${email} not found.`);
      return res.status(404).json({ error: 'Rider not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`[AUTH] ❌ Login failed: Incorrect password for ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    console.log(`[AUTH] ✅ Success: ${user.name} logged in.`);
    
    res.json({
      token,
      user: { id: user._id, name: user.name, bikeModel: user.bikeModel }
    });
  } catch (err) {
    console.error('[AUTH] ❌ Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Existing Ride fetching logic...
app.get('/api/rides', async (req, res) => {
  const rides = await Ride.find().sort({ _id: -1 });
  res.json(rides);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 KTM AUTH-SERVER LIVE AT http://192.168.1.23:${PORT}`);
});
