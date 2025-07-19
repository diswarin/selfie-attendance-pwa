const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

class Database {
    constructor() {
        this.db = null;
    }

    connect() {
        return new Promise((resolve, reject) => {
            const dbPath = path.join(__dirname, '../../database/attendance.db');
            // Ensure database directory exists
            const dbDir = path.dirname(dbPath);
            if (!fs.existsSync(dbDir)) {
                fs.mkdirSync(dbDir, { recursive: true });
            }
            
            this.db = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    console.error('Error connecting to database:', err);
                    reject(err);
                } else {
                    console.log('Connected to SQLite database');
                    this.initialize().then(resolve).catch(reject);
                }
            });
        });
    }

    async initialize() {
        try {
            // Read and execute schema
            const initSql = fs.readFileSync(path.join(__dirname, '../../database/init.sql'), 'utf8');
            await this.exec(initSql);
            
            // Check if we need to seed data
            const adminExists = await this.get("SELECT COUNT(*) as count FROM employees WHERE employee_id = 'admin'");
            
            if (adminExists.count === 0) {
                await this.seedData();
            }
            
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Error initializing database:', error);
            throw error;
        }
    }

    async seedData() {
        try {
            // Hash passwords for test users
            const adminHash = await bcrypt.hash('admin123', 10);
            const emp001Hash = await bcrypt.hash('123456', 10);
            const emp002Hash = await bcrypt.hash('123456', 10);

            // Insert test users with hashed passwords
            await this.run(`
                INSERT OR IGNORE INTO employees (employee_id, name, email, password, role) VALUES
                ('admin', 'ผู้ดูแลระบบ', 'admin@company.com', ?, 'admin'),
                ('emp001', 'พนักงาน ทดสอบ', 'emp001@company.com', ?, 'employee'),
                ('emp002', 'พนักงาน สองส่วน', 'emp002@company.com', ?, 'employee')
            `, [adminHash, emp001Hash, emp002Hash]);

            console.log('Test data seeded successfully');
        } catch (error) {
            console.error('Error seeding data:', error);
            throw error;
        }
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        });
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    exec(sql) {
        return new Promise((resolve, reject) => {
            this.db.exec(sql, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log('Database connection closed');
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }
}

module.exports = new Database();