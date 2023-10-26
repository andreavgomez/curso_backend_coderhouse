# curso_backend_coderhouse
Curso Backend Node js

# Instalacion
npm i -g nodemon  

npm init

# Para instalar el servidor express
npm i express

# Para ejecutar el .js en la terminal
npm run dev

# EndPoints:

# Productos:
Productos (Productos Router):

Obtener todos los productos: GET /api/products
Obtener un producto por ID: GET /api/products/:pid
Agregar un nuevo producto: POST /api/products
Actualizar un producto existente: PUT /api/products/:pid
Eliminar un producto por ID: DELETE /api/products/:pid

# Carritos:
Carritos (Carritos Router):

Obtener todos los carritos: GET /api/carts
Obtener un carrito por ID: GET /api/carts/:cid
Crear un nuevo carrito: POST /api/carts
Agregar un producto a un carrito: POST /api/carts/:cid/product/:pid