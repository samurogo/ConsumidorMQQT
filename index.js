const express = require('express');
const bodyParser = require('body-parser');
const RabbitMQ = require('./rabbitmq');

const app = express();
app.use(bodyParser.json());

const amqpUrl = 'amqp://samuel:samuel2004@44.197.73.155:5672';
const queue = 'mqtt';
const rabbitMQ = new RabbitMQ(amqpUrl, queue);

async function startConsuming() {
  await rabbitMQ.consume();
}

startConsuming();

app.get('/', (req, res) => {
  res.send('API funcionando');
});

app.get('/messages', (req, res) => {
  res.json(rabbitMQ.getMessages());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
