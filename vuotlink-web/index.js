const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Mật khẩu bảo mật (Bạn đổi lại giống hệt trong game nhé)
const secret = "Khanganh2012"; 

// Bộ nhớ tạm để lưu thông tin Token (Không lo bị lag ổ cứng)
let db = {}; 

app.get('/', (req, res) => {
    const action = req.query.action;

    // 1. Plugin gọi lên để tạo Token
    if (action === 'create' && req.query.secret === secret) {
        const token = req.query.token;
        db[token] = {
            player: req.query.player,
            status: 'pending'
        };
        return res.send("ok");
    }

    // 2. Plugin gọi lên để kiểm tra xem ai đã vượt link xong
    if (action === 'check' && req.query.secret === secret) {
        let completed = [];
        for (let token in db) {
            if (db[token].status === 'done') {
                completed.push({ token: token, player: db[token].player });
                delete db[token]; // Xóa token ngay sau khi lấy để tránh nhận quà 2 lần
            }
        }
        return res.json(completed);
    }

    // 3. Người chơi bị ném tới đây sau khi vượt Link4m
    if (action === 'verify') {
        const token = req.query.token;
        if (db[token] && db[token].status === 'pending') {
            db[token].status = 'done'; // Cập nhật trạng thái thành 'done'
            return res.send(`
                <meta charset="UTF-8">
                <h1 style='color:green; text-align:center; margin-top:50px;'>Bạn đã vượt link thành công!</h1>
                <h2 style='text-align:center;'>Hãy quay lại Server Minecraft để nhận thưởng nhé!</h2>
            `);
        } else {
            return res.send(`
                <meta charset="UTF-8">
                <h1 style='color:red; text-align:center; margin-top:50px;'>Link không hợp lệ hoặc bạn đã nhận quà rồi!</h1>
            `);
        }
    }

    // Mặc định từ chối các truy cập lạ
    return res.status(403).send("Access Denied");
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại port ${PORT}`);
});