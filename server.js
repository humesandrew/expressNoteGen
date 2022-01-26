//Initialize the server// 

const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const path = require('path');

const notes = require('./db/db.json');
const fs = require('fs');
const util = require('util');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));



// API routes // 
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

const readAndAppend = (content, file) => {
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
  };

app.get('/api/notes', (req, res) => {
    console.log(req.method, " request received");
    res.json(notes);
 })
 
 app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);
     

    const { title, text } = req.body;
    const newNote = { title, text };
    
if (title && text) {
    readAndAppend(newNote, './db/db.json');
res.json(notes);
   
} else {
    console.log("Produced an error")
}
 });




//HTML routes // 

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
  });
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });





app.listen(PORT, () => console.log('Server started on port: 3001'))