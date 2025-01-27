const express = require('express');
const crypto = require('crypto');
const app = express();
const path = require('path'); // Подключаем модуль path для работы с путями

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.json());

app.use(express.static('public'));


// Настройки для шифрования
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // 32 байта для AES-256
const iv = crypto.randomBytes(16); // 16 байт для IV

// Текст, зашифрованный для хранения
let cipher = crypto.createCipheriv(algorithm, key, iv);
let secretText = cipher.update('Привет, Алина! Это твой секретный текст.', 'utf8', 'hex');
secretText += cipher.final('hex');
let isTextRead = false;

// Функция для дешифровки текста
function decryptText(encryptedText) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Эндпоинт для получения текста
app.get('/read-text', (req, res) => {
    if (isTextRead) {
        return res.send('Текст уже был прочитан и больше недоступен.');
    }

    // Дешифруем текст
    const decryptedText = decryptText(secretText);

    // Устанавливаем флаг, что текст был прочитан
    isTextRead = true;

    // Удаляем текст с сервера
    secretText = null;

    res.send(`<p>${decryptedText}</p>`);
});

// Запуск сервера
app.listen(3000, () => console.log('Сервер запущен на http://localhost:3000'));
