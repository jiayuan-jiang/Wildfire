const express = require('express');
const sqlite3 = require('better-sqlite3');

const app = express();
const db = sqlite3('Users.db');

// 处理登录请求
app.post('http://localhost:5198/login_process', (req, res) => {
    const { name, password } = req.body;

    // 在数据库中查询用户信息
    const stmt = db.prepare('SELECT * FROM users WHERE name = ? AND password = ?');
    const user = stmt.get(name, password);

    if (user) {
        // 如果找到用户，则返回登录成功的结果
        res.json({
            success: true,
            state: 'authenticated',
            message: 'Login successful',
            content: `Welcome, ${name}!`
        });
    } else {
        // 如果未找到用户，则返回登录失败的结果
        res.json({
            success: false,
            state: 'unauthenticated',
            message: 'Invalid username or password',
            content: ''
        });
    }
});

app.listen(5198, () => {
    console.log('Server is running on port 3000');
});