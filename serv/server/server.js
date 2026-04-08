const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const clientDir = path.join(__dirname, '..', 'client');
if (fs.existsSync(clientDir)) {
  app.use(express.static(clientDir));
}

app.post('/users', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Имя обязательно' });
    }

    const user = await prisma.user.create({
      data: { name }
    });

    res.json(user);
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).json({ error: 'Ошибка при создании пользователя' });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).json({ error: 'Ошибка при получении пользователей' });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Пользователь удален' });
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).json({ error: 'Ошибка при удалении пользователя' });
  }
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});