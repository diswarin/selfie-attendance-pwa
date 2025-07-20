-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'employee' CHECK(role IN ('admin', 'employee')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT NOT NULL,
    check_in_time DATETIME,
    check_out_time DATETIME,
    check_in_photo TEXT,
    check_out_photo TEXT,
    check_in_location TEXT,
    check_out_location TEXT,
    date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT NOT NULL,
    session_token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_attendance_employee_id ON attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_employee_id ON sessions(employee_id);