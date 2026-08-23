const http = require('http');
const mongos = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'my-super-secret-key-123';

mongos.connect(process.env.MONGODB_URI);

const userSchema = new mongos.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const userModel = mongos.model('userModel', userSchema);

const todoSchema = new mongos.Schema({
  todoText: String,
  userId: { type: mongos.Schema.Types.ObjectId, required: true },
});
const todoModel = mongos.model('todoModel', todoSchema);

function getToken(req) {
  const header = req.headers['authorization'];
  if (!header) return null;
  try { return jwt.verify(header.split(' ')[1], JWT_SECRET).userId; }
  catch (e) { return null; }
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  console.log('Request received', req.method, req.url);
  let body = '';
  req.on('data', chunk => body += chunk);

  req.on('end', async () => {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      });
      return res.end();
    }

    const send = (code, data) => {
      res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify(data));
    };

    if (req.method === 'POST' && req.url === '/register') {
      const { username, password } = JSON.parse(body);
      if (await userModel.findOne({ username })) return send(400, { error: 'Username already taken' });
      const hashed = await bcrypt.hash(password, 10);
      await new userModel({ username, password: hashed }).save();
      return send(201, { message: 'Account created! Please log in.' });
    }

    if (req.method === 'POST' && req.url === '/login') {
      const { username, password } = JSON.parse(body);
      const user = await userModel.findOne({ username });
      if (!user || !await bcrypt.compare(password, user.password)) return send(401, { error: 'Wrong username or password' });
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
      return send(200, { token, username: user.username });
    }

    const userId = getToken(req);
    if (!userId) return send(401, { error: 'Please log in first' });

    if (req.method === 'GET') {
      return send(200, await todoModel.find({ userId }));
    }
    if (req.method === 'POST') {
      return send(201, await new todoModel({ todoText: JSON.parse(body).todoText, userId }).save());
    }
    if (req.method === 'DELETE') {
      return send(200, await todoModel.findOneAndDelete({ _id: req.url.split('/')[1], userId }));
    }
    if (req.method === 'PUT') {
      return send(200, await todoModel.findOneAndUpdate(
        { _id: req.url.split('/')[1], userId },
        { todoText: JSON.parse(body).todoText }
      ));
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log('Server running'));
