const amqp = require('amqplib');

class RabbitMQ {
  constructor(amqpUrl, queue) {
    this.amqpUrl = amqpUrl;
    this.queue = queue;
    this.messages = [];
  }

  async connect() {
    this.connection = await amqp.connect(this.amqpUrl);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queue, { durable: true });
  }

  async consume() {
    await this.connect();
    console.log(`Esperando mensajes en la cola ${this.queue}...`);
    
    this.channel.consume(this.queue, (message) => {
      if (message !== null) {
        const data = message.content.toString();  
        this.messages.push(data);
        console.log("Mensaje recibido:", data);

        this.processMessage(data);

        this.channel.ack(message);
      }
    });
  }

  processMessage(message) {
    if (message.includes('Distancia:')) {
      const distanceMatch = message.match(/Distancia: (\d+) cm/);
      const distance = distanceMatch ? parseInt(distanceMatch[1]) : null;

      const tempMatch = message.match(/Temp: ([\d.]+) C/);
      const temperature = tempMatch ? parseFloat(tempMatch[1]) : null;

      const humMatch = message.match(/Hum: ([\d.]+) %/);
      const humidity = humMatch ? parseFloat(humMatch[1]) : null;

      console.log('Datos extraídos:', { distance, temperature, humidity });
    }
  }

  getMessages() {
    return this.messages;
  }

  async close() {
    await this.channel.close();
    await this.connection.close();
  }
}

module.exports = RabbitMQ;
