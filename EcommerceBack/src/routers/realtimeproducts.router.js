import { Router } from 'express';

const realtimeProductsRouter = Router();

realtimeProductsRouter.get('/', (req, res) => {
  res.render('realTimeProducts'); // Renderiza la vista realTimeProducts.handlebars
});

export default realtimeProductsRouter;
