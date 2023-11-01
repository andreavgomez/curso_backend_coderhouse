import express from 'express';
import handlebars from 'express-handlebars';
import http from 'http'; // Importar http
import { Server } from 'socket.io'; // Importar Server desde socket.io

import path from 'path';

import { __dirname } from './utils.js';
import indexRouter from './routers/index.router.js';

const app = express();
const server = http.createServer(app); // Crear el servidor HTTP
const io = new Server(server); // Crear una instancia de Socket.IO
const port = 8080;

// const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// const express = require('express');

const expressHandlebars = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const ProductManager = require('./ProductManager/ProductManager');
const CartManager = require('./carts/CartManager');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 8080;

const productManager = new ProductManager('src/products.json');
const cartManager = new CartManager('src/carts.json');

app.engine('handlebars', expressHandlebars());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/src/views`); // Ruta a la carpeta de vistas

app.use(express.json());
app.use(express.static('public'));

// Enrutador para productos
const productsRouter = express.Router();
app.use('/api/products', productsRouter);

productsRouter.get('/', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit);
      const products = await productManager.getProducts();
  
      if (isNaN(limit)) {
        res.json(products);
      } else {
        const limitedProducts = products.slice(0, limit);
        res.json(limitedProducts);
      }
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      res.status(500).json({ error: 'Error al obtener los productos' });
    }
  });
  
  productsRouter.get('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);
  
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  });
  
  productsRouter.post('/', async (req, res) => {
    const product = req.body;
  
    try {
      await productManager.addProduct(product);
      res.status(201).json({ message: 'Producto agregado con éxito', product });
    } catch (error) {
      res.status(500).json({ error: 'Error al agregar el producto' });
    }
  });

// Enrutador para carritos
const cartsRouter = express.Router();
app.use('/api/carts', cartsRouter);

cartsRouter.get('/', async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.json(carts);
  } catch (error) {
    console.error('Error al obtener los carritos:', error);
    res.status(500).json({ error: 'Error al obtener los carritos' });
  }
});

cartsRouter.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const cart = await cartManager.getCart(cartId);

  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

cartsRouter.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({ message: 'Carrito creado con éxito', cart: newCart });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    await cartManager.addProductToCart(cartId, productId);
    res.json({ message: 'Producto agregado al carrito con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
});

// Real-time Products View
app.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realTimeProducts', { products });
});

// WebSocket Connection
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('addProduct', (product) => {
    productManager.addProduct(product);
    const products = productManager.getProducts();
    io.emit('updateProducts', products);
  });

  socket.on('deleteProduct', (productId) => {
    productManager.deleteProduct(productId);
    const products = productManager.getProducts();
    io.emit('updateProducts', products);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Iniciar el servidor
server.listen(port, () => {
  console.log(`Servidor Express corriendo en el puerto ${port}`);
});
