let clients = [];
const express = require('express');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const app = express()
		.use(bodyParser.urlencoded({extended:true}))
		.get('/', (req, res) => {
			res.sendFile(__dirname + '/index.html' )
		})
		.post('/data', (req, res) => {
			const value = req.body.value;
			clients.forEach(client => client.send(value));
			res.end();
		})
		.listen(port, () => console.log('Running on ' + port));


const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;
const wss = new WebSocketServer({server: app});

wss.on('connection', (ws) => {
		clients.push(ws);
		ws.on('close', (code, message) => {
			let idx = clients.indexOf(ws);
			if (idx >= 0)
				clients.splice(idx, 1);
		});
});
