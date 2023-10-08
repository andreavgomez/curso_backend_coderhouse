const fs = require('fs');

class ProductManager {
  constructor() {
    this.filePath = 'products.json';
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }

  saveProducts() {
    const data = JSON.stringify(this.products, null, 2);
    console.log("Data to be saved:", data); 
    fs.writeFileSync(this.filePath, data, 'utf8');
  }

  addProduct(product) {
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.error("Todos los campos son obligatorios.");
      return;
    }

    if (this.products.some((p) => p.code === product.code)) {
      console.error("El campo 'code' debe ser único. Este código ya existe.");
      return;
    }

    const id = this.generateUniqueId();
    this.products.push({ ...product, id });
    this.saveProducts();
    console.log("Producto agregado con éxito:", { ...product, id });
  }

  generateUniqueId() {
    return this.products.length + 1;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((p) => p.id === id);
    if (product) {
      return product;
    } else {
      console.error("Producto no encontrado.");
      return null;
    }
  }

  updateProduct(id, updatedProduct) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct, id };
      this.saveProducts();
      console.log("Producto actualizado con éxito:", this.products[index]);
    } else {
      console.error("Producto no encontrado.");
    }
  }

  deleteProduct(id) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveProducts();
      console.log("Producto eliminado con éxito.");
    } else {
      console.error("Producto no encontrado.");
    }
  }
}

// Proceso de Testing
const productManager = new ProductManager();

// Prueba 1: getProducts debe devolver un arreglo vacío [] al principio
const products1 = productManager.getProducts();
console.log("Productos al principio:", products1);

// Prueba 2: Agregar un producto
productManager.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
});

// Prueba 3: getProducts debe mostrar el producto agregado
const products2 = productManager.getProducts();
console.log("Productos después de agregar uno:", products2);

// Prueba 4: Intentar agregar un producto con el mismo código (debe mostrar un error)
productManager.addProduct({
  title: "producto repetido",
  description: "Este producto tiene un código repetido",
  price: 150,
  thumbnail: "Sin imagen",
  code: "abc123", // Código repetido
  stock: 10,
});

// Prueba 5: Buscar un producto por ID (encontrar)
const productById1 = productManager.getProductById(1);
console.log("Producto con ID 1:", productById1);

// Prueba 6: Buscar un producto por ID (no encontrar)
const productById2 = productManager.getProductById(999); // ID que no existe
console.log("Producto con ID 999:", productById2);

// Prueba 7: Actualizar un producto
productManager.updateProduct(1, {
  title: "Producto actualizado",
  price: 250,
});

// Prueba 8: Eliminar un producto
productManager.deleteProduct(1);
