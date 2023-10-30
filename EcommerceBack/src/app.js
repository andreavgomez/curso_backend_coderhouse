const express = require('express');
const ProductManager = require('./ProductManager/ProductManager');
const CartManager = require('./carts/CartManager');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 8080;

const productManager = new ProductManager('src/products.json');
const cartManager = new CartManager('src/carts.json');

app.use(express.json());

// Enrutador para productos
const productsRouter = express.Router();
app.use('/api/products', productsRouter);

// Rutas para productos
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

productsRouter.put('/:pid', async (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;

  try {
    await productManager.updateProduct(productId, updatedProduct);
    res.json({ message: 'Producto actualizado con éxito', updatedProduct });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

productsRouter.delete('/:pid', async (req, res) => {
  const productId = req.params.pid;

  try {
    await productManager.deleteProduct(productId);
    res.json({ message: 'Producto eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

// Enrutador para carritos
const cartsRouter = express.Router();
app.use('/api/carts', cartsRouter);

// Rutas para carritos
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

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor Express corriendo en el puerto ${port}`);
});
