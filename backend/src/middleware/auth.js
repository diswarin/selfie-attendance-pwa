const Employee = require('../models/Employee');

const authenticate = async (req, res, next) => {
    try {
        const sessionToken = req.headers.authorization?.replace('Bearer ', '') || 
                           req.cookies?.sessionToken;

        if (!sessionToken) {
            return res.status(401).json({ error: 'No session token provided' });
        }

        const session = await Employee.findBySession(sessionToken);

        if (!session) {
            return res.status(401).json({ error: 'Invalid or expired session' });
        }

        req.user = {
            employee_id: session.employee_id,
            name: session.name,
            role: session.role
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};

const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Admin access required' });
    }
};

module.exports = { authenticate, requireAdmin };