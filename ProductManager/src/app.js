const express = require('express');
const ProductManager = require('./ProductManager/ProductManager'); 
const app = express();
const port = 8080;

const productManager = new ProductManager('products.json');

app.use(express.json());

// Endpoint al raiz del servidor
app.get('/', (req, res) => {
    res.send('Bienvenido a mi servidor Express');
  });
  
// Endpoint para obtener todos los productos
app.get('/products', async (req, res) => {
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
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Endpoint para obtener un producto por ID
app.get('/products/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  if (isNaN(productId)) {
    res.status(400).json({ error: 'ID de producto no válido' });
    return;
  }git 

  const product = await productManager.getProductById(productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor Express corriendo en el puerto ${port}`);
});
