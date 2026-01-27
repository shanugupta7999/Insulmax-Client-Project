// ES6 Import
import express from 'express';
import mongoose from 'mongoose';



const app = express();

app.get('/', (req, res) => {
  res.send('Hello ES6 Backend!');
});

app.listen(5000, () => console.log('Server running on port 5000'));


