import { Server } from 'socket.io';
import { promises as fs } from 'fs';

export const init = (httpServer) => {
  const socketServer = new Server(httpServer);

  socketServer.on('connection', (socketClient) => {
    console.log(`Nuevo cliente socket conectado ${socketClient.id} 🎊`);

    socketClient.emit('client-emit', { status: 'ok' });
    socketClient.broadcast.emit('broadcast-emit', { status: 'ok' });

    // Envía la lista de productos a través de WebSocket
    socketClient.on('get-products', async () => {
      try {
        const data = await fs.readFile('src/products.json', 'utf8');
        const products = JSON.parse(data);
        socketClient.emit('all-products', products);
      } catch (error) {
        console.error('Error al leer los productos:', error);
      }
    });

    socketClient.on('message', (msg) => {
      console.log(`Cliente envió un nuevo mensaje: ${msg}`);
    });

    socketClient.on('add-product', async (product) => {
      try {
        const data = await fs.readFile('src/products.json', 'utf8');
        const products = JSON.parse(data);
        product.id = (products.length + 1).toString(); // Genera un nuevo ID único
        products.push(product);
        await fs.writeFile('src/products.json', JSON.stringify(products, null, 2), 'utf8');
        socketServer.emit('all-products', products); // Envía la lista actualizada a todos los clientes
      } catch (error) {
        console.error('Error al agregar un producto:', error);
      }
    });

    socketClient.on('delete-product', async (productId) => {
      try {
        const data = await fs.readFile('src/products.json', 'utf8');
        const products = JSON.parse(data);
        const index = products.findIndex((p) => p.id === productId);
        if (index !== -1) {
          products.splice(index, 1);
          await fs.writeFile('src/products.json', JSON.stringify(products, null, 2), 'utf8');
          socketServer.emit('all-products', products); // Envía la lista actualizada a todos los clientes
        } else {
          console.error('Producto no encontrado.');
        }
      } catch (error) {
        console.error('Error al eliminar un producto:', error);
      }
    });
  });
};
