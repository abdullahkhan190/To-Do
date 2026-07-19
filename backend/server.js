const http = require('http');
const mongos = require('mongoose');


mongos.connect("mongodb+srv://admin:admin@cluster0.kehxplj.mongodb.net/?appName=Cluster0");

const todoSchema = new mongos.Schema({todoText: String});

const todoModel = new mongos.model("todoModel",todoSchema);

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  console.log('Request received', req.method, req.url);
  let body = '';
  
  req.on('data', (chunk) => {
    body += chunk;
  });
  
  req.on('end', async () => {
    if (req.method === "OPTIONS") {
    res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
    }
    if (req.method === 'POST') {
      console.log('Received data:', body);
      await new  todoModel(JSON.parse(body)).save();
      res.end('Data received\n');
    }
    if (req.method === 'GET' ) {
      const getTodos = await todoModel.find();
      res.end(JSON.stringify(getTodos));
    }
    if (req.method === 'DELETE') {
      console.log(req.url.split('/')[1]);
      const deletedItem = await todoModel.findByIdAndDelete(req.url.split('/')[1])
      console.log("deleted ",deletedItem);
      res.end(JSON.stringify(deletedItem));
    }

  });
  
});

const port = process.env.PORT || 3000

server.listen( port, () => {
  console.log('Server running ');
});