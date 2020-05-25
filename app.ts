import express = require('express');

const app: express.Application = express();

app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});