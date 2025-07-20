const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Attendance = require('../models/Attendance');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, req.user.employee_id + '-' + uniqueSuffix + '.jpg');
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Apply authentication to all routes
router.use(authenticate);

// Check-in endpoint
router.post('/checkin', upload.single('photo'), [
    body('location').notEmpty().withMessage('Location is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Photo is required for check-in' });
        }

        const { location } = req.body;
        const photoPath = req.file.filename;

        const attendanceId = await Attendance.checkIn(
            req.user.employee_id,
            photoPath,
            location
        );

        res.json({
            success: true,
            message: 'Checked in successfully',
            attendanceId,
            checkInTime: new Date().toISOString()
        });
    } catch (error) {
        console.error('Check-in error:', error);
        
        // Clean up uploaded file on error
        if (req.file) {
            fs.unlink(req.file.path, () => {});
        }
        
        res.status(400).json({ error: error.message || 'Check-in failed' });
    }
});

// Check-out endpoint
router.post('/checkout', upload.single('photo'), [
    body('location').notEmpty().withMessage('Location is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Photo is required for check-out' });
        }

        const { location } = req.body;
        const photoPath = req.file.filename;

        const attendanceId = await Attendance.checkOut(
            req.user.employee_id,
            photoPath,
            location
        );

        res.json({
            success: true,
            message: 'Checked out successfully',
            attendanceId,
            checkOutTime: new Date().toISOString()
        });
    } catch (error) {
        console.error('Check-out error:', error);
        
        // Clean up uploaded file on error
        if (req.file) {
            fs.unlink(req.file.path, () => {});
        }
        
        res.status(400).json({ error: error.message || 'Check-out failed' });
    }
});

// Get today's status
router.get('/status', async (req, res) => {
    try {
        const status = await Attendance.getTodayStatus(req.user.employee_id);
        res.json({ success: true, status });
    } catch (error) {
        console.error('Status error:', error);
        res.status(500).json({ error: 'Failed to get status' });
    }
});

// Get attendance history
router.get('/history', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 30;
        const history = await Attendance.getAttendanceHistory(req.user.employee_id, limit);
        res.json({ success: true, history });
    } catch (error) {
        console.error('History error:', error);
        res.status(500).json({ error: 'Failed to get history' });
    }
});

// Get monthly statistics
router.get('/stats/:year/:month', async (req, res) => {
    try {
        const { year, month } = req.params;
        const stats = await Attendance.getMonthlyStats(
            req.user.employee_id,
            parseInt(year),
            parseInt(month)
        );
        res.json({ success: true, stats });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to get statistics' });
    }
});

module.exports = router;