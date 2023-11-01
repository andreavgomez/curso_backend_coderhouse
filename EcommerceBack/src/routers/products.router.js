import { Router } from 'express';
import ProductManager from '../ProductManager/ProductManager.js';

const productsRouter = Router();
const productManager = new ProductManager('src/products.json');  // Crea una instancia de ProductManager

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

export default productsRouter;
