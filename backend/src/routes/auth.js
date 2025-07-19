const express = require('express');
const { body, validationResult } = require('express-validator');
const Employee = require('../models/Employee');

const router = express.Router();

// Login endpoint
router.post('/login', [
    body('employee_id').notEmpty().withMessage('Employee ID is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { employee_id, password } = req.body;

        const employee = await Employee.validatePassword(employee_id, password);
        
        if (!employee) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const sessionToken = await Employee.createSession(employee.employee_id);

        res.json({
            success: true,
            sessionToken,
            user: {
                employee_id: employee.employee_id,
                name: employee.name,
                role: employee.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Logout endpoint
router.post('/logout', async (req, res) => {
    try {
        const sessionToken = req.headers.authorization?.replace('Bearer ', '');
        
        if (sessionToken) {
            await Employee.deleteSession(sessionToken);
        }

        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
});

// Verify session endpoint
router.get('/verify', async (req, res) => {
    try {
        const sessionToken = req.headers.authorization?.replace('Bearer ', '');
        
        if (!sessionToken) {
            return res.status(401).json({ error: 'No session token provided' });
        }

        const session = await Employee.findBySession(sessionToken);
        
        if (!session) {
            return res.status(401).json({ error: 'Invalid or expired session' });
        }

        res.json({
            success: true,
            user: {
                employee_id: session.employee_id,
                name: session.name,
                role: session.role
            }
        });
    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});

module.exports = router;