import { Router } from 'express';
import CartManager from '../carts/CartManager.js';

const cartsRouter = Router();
const cartManager = new CartManager('src/carts.json'); // Crea una instancia de CartManager

// Ruta para obtener todos los carritos
cartsRouter.get('/', async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.json(carts);
  } catch (error) {
    console.error('Error al obtener los carritos:', error);
    res.status(500).json({ error: 'Error al obtener los carritos' });
  }
});

// Ruta para obtener un carrito por ID
cartsRouter.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const cart = await cartManager.getCart(cartId);

  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

// Ruta para crear un nuevo carrito
cartsRouter.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({ message: 'Carrito creado con éxito', cart: newCart });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

// Ruta para agregar un producto a un carrito
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

export default cartsRouter;
