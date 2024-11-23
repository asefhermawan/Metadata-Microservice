var express = require('express');
var cors = require('cors');
require('dotenv').config();
var multer = require('multer');

var app = express();

// Set up multer to handle file uploads
var storage = multer.memoryStorage(); // Store file in memory
var upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

// Serve the HTML form
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Serve the output view
app.get('/output', function (req, res) {
  res.sendFile(process.cwd() + '/views/output.html');
});

// Handle the file upload and respond with metadata
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: 'No file uploaded' });
  }

  const fileMetadata = {
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
  };

  // Pass file metadata to output view via query params
  const queryString = new URLSearchParams(fileMetadata).toString();
  res.redirect(`/output?${queryString}`);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port);
});
