const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Carely backend is running!');
});

app.listen(port, () => {
  console.log(`Carely backend listening at http://localhost:${port}`);
});