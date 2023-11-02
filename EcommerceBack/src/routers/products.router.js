import { Router } from 'express';
import { promises as fs } from 'fs';
import path from 'path'; 
import ProductManager from '../ProductManager/ProductManager.js';
// import realtimeProductsRouter from './realtimeproducts.router';

const productsRouter = Router();
const productManager = new ProductManager('src/products.json');  // Crea una instancia de ProductManager

// // Configura la ruta para la vista en tiempo real de productos
// productsRouter.use('/realtimeproducts', realtimeProductsRouter);

// Ruta para obtener todos los productos
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

// Ruta para obtener un producto por ID
productsRouter.get('/:pid', async (req, res) => {
  const productId = req.params.pid;
  const product = await productManager.getProductById(productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Ruta para agregar un producto
productsRouter.post('/', async (req, res) => {
  const product = req.body;

  try {
    await productManager.addProduct(product);
    res.status(201).json({ message: 'Producto agregado con éxito', product });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

// Nueva ruta para emitir la lista de productos a través de WebSocket
productsRouter.get('/realtime', async (req, res) => {
  try {
    const data = await fs.readFile('src/products.json', 'utf8');
    const products = JSON.parse(data);
    res.json(products);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});


// // Ruta para la vista en tiempo real de productos
// productsRouter.get('/realtimeproducts', async (req, res) => {
//   try {
//     const data = await fs.readFile('src/products.json', 'utf8');
//     const products = JSON.parse(data);
//     res.render('realTimeProducts', { products }); // Renderiza la vista realTimeProducts.handlebars
//   } catch (error) {
//     console.error('Error al obtener los productos:', error);
//     res.status(500).json({ error: 'Error al obtener los productos' });
//   }
// });


export default productsRouter;
