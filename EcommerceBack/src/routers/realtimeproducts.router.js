import { Router } from 'express';
import { promises as fs } from 'fs';

const realtimeProductsRouter = Router();

realtimeProductsRouter.get('/', async (req, res) => {
  try {
    const data = await fs.readFile('src/products.json', 'utf8');
    const products = JSON.parse(data);
    res.render('realTimeProducts', { products });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

export default realtimeProductsRouter;
