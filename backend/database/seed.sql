-- Insert test users (passwords will be hashed by the application)
-- admin: admin123
-- emp001: 123456

INSERT OR IGNORE INTO employees (employee_id, name, email, password, role) VALUES
('admin', 'ผู้ดูแลระบบ', 'admin@company.com', '$2b$10$placeholder_hash_will_be_replaced', 'admin'),
('emp001', 'พนักงาน ทดสอบ', 'emp001@company.com', '$2b$10$placeholder_hash_will_be_replaced', 'employee'),
('emp002', 'พนักงาน สองส่วน', 'emp002@company.com', '$2b$10$placeholder_hash_will_be_replaced', 'employee');