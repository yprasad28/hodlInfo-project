const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');

const app = express();
const db = new sqlite3.Database('holdinfo.db');

app.use(express.json());

// Create the database table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS tickers (
    id INTEGER PRIMARY KEY,
    name TEXT,
    last REAL,
    buy REAL,
    sell REAL,
    volume REAL,
    base_unit TEXT
  );
`);

// Fetch top 10 results from API and store in database
axios.get('https://api.wazirx.com/api/v2/tickers')
  .then(response => {
    console.log('Received response from WazirX API');
    const tickers = Object.values(response.data);
    const top10Tickers = tickers.slice(0, 10);
    top10Tickers.forEach(ticker => {
      const {
        name,
        last,
        buy,
        sell,
        volume,
        base_unit
      } = ticker; // Extract the values from the ticker object

      // Check if all values are defined
      if (name && last && buy && sell && volume && base_unit) {
        db.run(`
          INSERT INTO tickers (name, last, buy, sell, volume, base_unit)
          VALUES (?, ?, ?, ?, ?, ?);
        `, [
          name,
          last,
          buy,
          sell,
          volume,
          base_unit
        ]);
      } else {
        console.log(`Skipping ticker ${name} due to missing values`);
      }
    });
  })
  .catch(error => {
    console.error('Error making request to WazirX API:', error);
  });

// Create a route to retrieve data from database
app.get('/api/tickers', (req, res) => {
  console.log('Received GET request to /api/tickers');
  db.all('SELECT * FROM tickers LIMIT 10', (err, rows) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send({ message: 'Error fetching data' });
    } else {
      res.json(rows);
    }
  });
});

app.listen(5501, () => {
  console.log('Server listening on port 3000');
});