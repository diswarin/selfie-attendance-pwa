const db = require('../config/database');

class Attendance {
    static async checkIn(employeeId, photo, location) {
        try {
            const today = new Date().toISOString().split('T')[0];
            
            // Check if already checked in today
            const existing = await db.get(`
                SELECT * FROM attendance 
                WHERE employee_id = ? AND date = ? AND check_in_time IS NOT NULL
            `, [employeeId, today]);

            if (existing) {
                throw new Error('Already checked in today');
            }

            // Create or update attendance record
            const existingRecord = await db.get(`
                SELECT * FROM attendance 
                WHERE employee_id = ? AND date = ?
            `, [employeeId, today]);

            if (existingRecord) {
                await db.run(`
                    UPDATE attendance 
                    SET check_in_time = datetime('now'), 
                        check_in_photo = ?, 
                        check_in_location = ?
                    WHERE id = ?
                `, [photo, location, existingRecord.id]);
                return existingRecord.id;
            } else {
                const result = await db.run(`
                    INSERT INTO attendance (employee_id, check_in_time, check_in_photo, check_in_location, date) 
                    VALUES (?, datetime('now'), ?, ?, ?)
                `, [employeeId, photo, location, today]);
                return result.id;
            }
        } catch (error) {
            console.error('Error checking in:', error);
            throw error;
        }
    }

    static async checkOut(employeeId, photo, location) {
        try {
            const today = new Date().toISOString().split('T')[0];
            
            // Find today's attendance record
            const attendance = await db.get(`
                SELECT * FROM attendance 
                WHERE employee_id = ? AND date = ? AND check_in_time IS NOT NULL
            `, [employeeId, today]);

            if (!attendance) {
                throw new Error('Must check in first');
            }

            if (attendance.check_out_time) {
                throw new Error('Already checked out today');
            }

            await db.run(`
                UPDATE attendance 
                SET check_out_time = datetime('now'), 
                    check_out_photo = ?, 
                    check_out_location = ?
                WHERE id = ?
            `, [photo, location, attendance.id]);

            return attendance.id;
        } catch (error) {
            console.error('Error checking out:', error);
            throw error;
        }
    }

    static async getTodayStatus(employeeId) {
        try {
            const today = new Date().toISOString().split('T')[0];
            
            const attendance = await db.get(`
                SELECT * FROM attendance 
                WHERE employee_id = ? AND date = ?
            `, [employeeId, today]);

            return {
                hasCheckedIn: !!(attendance && attendance.check_in_time),
                hasCheckedOut: !!(attendance && attendance.check_out_time),
                checkInTime: attendance ? attendance.check_in_time : null,
                checkOutTime: attendance ? attendance.check_out_time : null
            };
        } catch (error) {
            console.error('Error getting today status:', error);
            throw error;
        }
    }

    static async getAttendanceHistory(employeeId, limit = 30) {
        try {
            return await db.all(`
                SELECT * FROM attendance 
                WHERE employee_id = ? 
                ORDER BY date DESC 
                LIMIT ?
            `, [employeeId, limit]);
        } catch (error) {
            console.error('Error getting attendance history:', error);
            throw error;
        }
    }

    static async getAllAttendanceRecords(date = null, limit = 100) {
        try {
            let query = `
                SELECT a.*, e.name, e.employee_id as emp_id
                FROM attendance a 
                JOIN employees e ON a.employee_id = e.employee_id
            `;
            const params = [];

            if (date) {
                query += ' WHERE a.date = ?';
                params.push(date);
            }

            query += ' ORDER BY a.date DESC, a.check_in_time DESC LIMIT ?';
            params.push(limit);

            return await db.all(query, params);
        } catch (error) {
            console.error('Error getting all attendance records:', error);
            throw error;
        }
    }

    static async getMonthlyStats(employeeId, year, month) {
        try {
            const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
            const endDate = new Date(year, month, 0).toISOString().split('T')[0];

            const records = await db.all(`
                SELECT * FROM attendance 
                WHERE employee_id = ? AND date BETWEEN ? AND ?
                ORDER BY date
            `, [employeeId, startDate, endDate]);

            const totalDays = records.length;
            const presentDays = records.filter(r => r.check_in_time).length;
            const onTimeDays = records.filter(r => {
                if (!r.check_in_time) return false;
                const checkInHour = new Date(r.check_in_time).getHours();
                return checkInHour <= 9; // Assuming work starts at 9 AM
            }).length;

            return {
                totalDays,
                presentDays,
                onTimeDays,
                lateDays: presentDays - onTimeDays,
                records
            };
        } catch (error) {
            console.error('Error getting monthly stats:', error);
            throw error;
        }
    }
}

module.exports = Attendance;