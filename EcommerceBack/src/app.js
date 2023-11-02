import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';

import { __dirname } from './utils.js';
import indexRouter from './routers/index.router.js';
import productsRouter from './routers/products.router.js';
import cartsRouter from './routers/carts.router.js';
import realtimeProductsRouter from './routers/realtimeproducts.router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use('/', indexRouter);
app.use('/api/products', productsRouter);
// app.use('/', productsRouter);
app.use('/api/carts', cartsRouter);
// app.use('/realtimeproducts', realtimeProductsRouter);
app.use('/api/realtime', realtimeProductsRouter);


app.use((error, req, res, next) => {
  const message = `Ah ocurrido un error desconocido: ${error.message}`;
  console.error(message);
  res.status(500).json({ message });
});

export default app;