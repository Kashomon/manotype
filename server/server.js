const http = require('http');
const fs = require('fs');
const hostname = '127.0.0.1';
const port = 1337;


http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Hello World</h1>\n');
}).listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


http.createServer((req, res) => {
  //attach listener 
  req.on("end", function () {
    //the book
    var book = req('/bookproc/testdata/gullivers_travels.txt');
    //read the book file
    fs.readFile(book, 'utf-8', function(error, data) {
      res.writeHead(200, {
        'Content-Type' : 'text/plain'
      });
      //find the A in book.
      data = book.indexOf('a');
      //Write to file the number of As
      fs.writeFile(book, data);
      //end reponse
      res.end('This book contains' + data + 'incidents of the letter A!');
    });
  });
}).listen(8080);
