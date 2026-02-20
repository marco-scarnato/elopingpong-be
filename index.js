const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Ping Pong Ranking API is running' });
});

app.get('/api/players', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM players ORDER BY score_21 DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/teams', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT t.*, p1.name as p1_name, p2.name as p2_name 
      FROM teams t
      JOIN players p1 ON t.player1_id = p1.id
      JOIN players p2 ON t.player2_id = p2.id
      ORDER BY t.score_21 DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
