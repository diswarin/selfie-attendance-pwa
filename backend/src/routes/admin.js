const express = require('express');
const { body, validationResult } = require('express-validator');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);
router.use(requireAdmin);

// Get all employees
router.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.getAllEmployees();
        res.json({ success: true, employees });
    } catch (error) {
        console.error('Get employees error:', error);
        res.status(500).json({ error: 'Failed to get employees' });
    }
});

// Create new employee
router.post('/employees', [
    body('employee_id').notEmpty().withMessage('Employee ID is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['admin', 'employee']).withMessage('Invalid role')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const employeeId = await Employee.createEmployee(req.body);
        res.json({ success: true, message: 'Employee created successfully', employeeId });
    } catch (error) {
        console.error('Create employee error:', error);
        if (error.message.includes('UNIQUE constraint failed')) {
            res.status(400).json({ error: 'Employee ID already exists' });
        } else {
            res.status(500).json({ error: 'Failed to create employee' });
        }
    }
});

// Update employee
router.put('/employees/:id', [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Invalid email'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['admin', 'employee']).withMessage('Invalid role')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        await Employee.updateEmployee(req.params.id, req.body);
        res.json({ success: true, message: 'Employee updated successfully' });
    } catch (error) {
        console.error('Update employee error:', error);
        res.status(500).json({ error: 'Failed to update employee' });
    }
});

// Delete employee
router.delete('/employees/:id', async (req, res) => {
    try {
        await Employee.deleteEmployee(req.params.id);
        res.json({ success: true, message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Delete employee error:', error);
        res.status(500).json({ error: 'Failed to delete employee' });
    }
});

// Get all attendance records
router.get('/attendance', async (req, res) => {
    try {
        const { date, limit } = req.query;
        const records = await Attendance.getAllAttendanceRecords(
            date || null,
            parseInt(limit) || 100
        );
        res.json({ success: true, records });
    } catch (error) {
        console.error('Get attendance records error:', error);
        res.status(500).json({ error: 'Failed to get attendance records' });
    }
});

// Get attendance statistics
router.get('/stats', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const thisMonth = new Date().getMonth() + 1;
        const thisYear = new Date().getFullYear();

        // Get today's attendance
        const todayRecords = await Attendance.getAllAttendanceRecords(today);
        
        // Get all employees for counts
        const allEmployees = await Employee.getAllEmployees();
        
        const totalEmployees = allEmployees.length;
        const presentToday = todayRecords.filter(r => r.check_in_time).length;
        const checkedOutToday = todayRecords.filter(r => r.check_out_time).length;

        res.json({
            success: true,
            stats: {
                totalEmployees,
                presentToday,
                checkedOutToday,
                absentToday: totalEmployees - presentToday
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Failed to get statistics' });
    }
});

module.exports = router;