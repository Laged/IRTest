let clients = [];
const express = require('express');
const port = process.env.PORT || 1337;
const bodyParser = require('body-parser');
const moment = require('moment');
const app = express()
	.use(express.static(__dirname + '/public'))
	.use(bodyParser.urlencoded({extended:true}))
	.get('/', (req, res) => {
		res.sendFile(__dirname + '/index.html' )
	})
	.post('/data', (req, res) => {
		const reqID = req.body.id;
		const reqValue = req.body.value;
		if(reqID && reqValue) {
			const data = {
				id: reqID,
				value: reqValue,
				timeStamp: moment().format('HH:mm')
			}
			console.log(data);
			clients.forEach(client => client.send(JSON.stringify(data)));
		}
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
