const express = require('express'); //it imports express library
const app = express();  // creates server application
const mongoose = require('mongoose'); // it imports  
// mongoose for db setup 
const Service = require('./models/service');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const verifyToken = require('./middleware/verifyToken');
const isAdmin = require('./middleware/isAdmin'); 
const Booking = require('./models/Booking');
 require('dotenv').config();
app.use(express.json());
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, phone });
    const savedUser = await newUser.save();

    res.status(201).json({ message: 'User registered successfully', userId: savedUser._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
  
  // Usewr can make Booking via thi route
app.post('/api/bookings', verifyToken, async (req, res) => {
  try {
    const { service, date, timeSlot } = req.body;

    const newBooking = new Booking({
      user: req.user.id,
      service,
      date,
      timeSlot
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/bookings/my', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('service');
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/bookings/:id', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You can only cancel your own bookings' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ message: 'Booking cancelled successfully', booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/bookings', verifyToken, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user', 'name email').populate('service');
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/bookings/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedBooking) return res.status(404).json({ error: 'Booking not found' });
    res.status(200).json(updatedBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 app.post('/api/services', verifyToken, isAdmin, async (req, res) => {
  try {
    const newService = new Service(req.body);
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/services', async (req,res) => {
    try{
        const services = await Service.find();
        res.status(200).json(services);
    }
    catch (err) { 
        res.status(500).json({error: err.message});
     }
}) ;

app.get('/api/services/:id', async(req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if(!service) return res.status(404).json({ error: 'Service not found'} );
        res.status(200).json(service);
    }catch(err) {
      res.status(500).json({ error : err.message });
    }
    });

    app.put('/api/services/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedService) return res.status(404).json({ error: 'Service not found' });
    res.status(200).json(updatedService);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/services/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) return res.status(404).json({ error: 'Service not found' });
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/',(req, res) => {
    res.send('Hello, my backend is working!');

});

mongoose.connect(process.env.MONGO_URI)
 .then(() => console.log('MongoDB connected'))
 .catch((err) => console.log('MongoDB connection error:', err));

   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});