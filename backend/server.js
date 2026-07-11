const http = require('http');

let db = [];

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  console.log('Request received', req.method, req.url);
  let body = '';
  
  req.on('data', (chunk) => {
    body += JSON.parse(chunk);
  });
  req.on('end', () => {
    if (req.method === 'POST') {
      console.log('Received data:', body);
      db.push(body);
      res.end('Data received\n');
    }
    if (req.method === 'GET' ) {
      res.end(JSON.stringify(db));
    }
  });
  
});

server.listen( 3000, () => {
  console.log(`Server running on port 3000`);
});