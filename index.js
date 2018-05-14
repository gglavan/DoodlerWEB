const express = require("express");
const path = require("path");
const app = express();
const server = require("http").Server(app);
const port = process.env.PORT || 8000;

app.use('/', express.static(path.join(__dirname, 'src')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/node_modules/fabric/dist', express.static(path.join(__dirname, 'node_modules/fabric/dist')));

app.get("/", function(req, res, next) {
  res.sendFile(path.join(__dirname, '/src/index.html'));
});

server.listen(port, function() {
  console.log("App is running on port " + port);
});