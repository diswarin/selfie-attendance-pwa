const db = require('../config/database');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

class Employee {
    static async findByEmployeeId(employeeId) {
        try {
            return await db.get(
                'SELECT * FROM employees WHERE employee_id = ?',
                [employeeId]
            );
        } catch (error) {
            console.error('Error finding employee:', error);
            throw error;
        }
    }

    static async validatePassword(employeeId, password) {
        try {
            const employee = await this.findByEmployeeId(employeeId);
            if (!employee) {
                return null;
            }

            const isValid = await bcrypt.compare(password, employee.password);
            return isValid ? employee : null;
        } catch (error) {
            console.error('Error validating password:', error);
            throw error;
        }
    }

    static async createSession(employeeId) {
        try {
            const sessionToken = uuidv4();
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

            await db.run(
                'INSERT INTO sessions (employee_id, session_token, expires_at) VALUES (?, ?, ?)',
                [employeeId, sessionToken, expiresAt.toISOString()]
            );

            return sessionToken;
        } catch (error) {
            console.error('Error creating session:', error);
            throw error;
        }
    }

    static async findBySession(sessionToken) {
        try {
            const session = await db.get(`
                SELECT s.*, e.employee_id, e.name, e.role 
                FROM sessions s 
                JOIN employees e ON s.employee_id = e.employee_id 
                WHERE s.session_token = ? AND s.expires_at > datetime('now')
            `, [sessionToken]);

            return session;
        } catch (error) {
            console.error('Error finding session:', error);
            throw error;
        }
    }

    static async deleteSession(sessionToken) {
        try {
            await db.run('DELETE FROM sessions WHERE session_token = ?', [sessionToken]);
        } catch (error) {
            console.error('Error deleting session:', error);
            throw error;
        }
    }

    static async getAllEmployees() {
        try {
            return await db.all(`
                SELECT id, employee_id, name, email, role, created_at 
                FROM employees 
                ORDER BY created_at DESC
            `);
        } catch (error) {
            console.error('Error getting all employees:', error);
            throw error;
        }
    }

    static async createEmployee(data) {
        try {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            
            const result = await db.run(`
                INSERT INTO employees (employee_id, name, email, password, role) 
                VALUES (?, ?, ?, ?, ?)
            `, [data.employee_id, data.name, data.email, hashedPassword, data.role || 'employee']);

            return result.id;
        } catch (error) {
            console.error('Error creating employee:', error);
            throw error;
        }
    }

    static async updateEmployee(id, data) {
        try {
            const updateFields = [];
            const values = [];

            if (data.name) {
                updateFields.push('name = ?');
                values.push(data.name);
            }
            if (data.email) {
                updateFields.push('email = ?');
                values.push(data.email);
            }
            if (data.role) {
                updateFields.push('role = ?');
                values.push(data.role);
            }
            if (data.password) {
                updateFields.push('password = ?');
                values.push(await bcrypt.hash(data.password, 10));
            }

            if (updateFields.length === 0) {
                throw new Error('No fields to update');
            }

            values.push(id);

            await db.run(`
                UPDATE employees 
                SET ${updateFields.join(', ')} 
                WHERE id = ?
            `, values);

            return true;
        } catch (error) {
            console.error('Error updating employee:', error);
            throw error;
        }
    }

    static async deleteEmployee(id) {
        try {
            await db.run('DELETE FROM employees WHERE id = ?', [id]);
            return true;
        } catch (error) {
            console.error('Error deleting employee:', error);
            throw error;
        }
    }
}

module.exports = Employee;