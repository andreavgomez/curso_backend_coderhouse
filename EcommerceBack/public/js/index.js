const socket = io();

socket.on('all-products', (products) => {
  // Actualiza la lista de productos en la vista
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';
  products.forEach((product) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${product.title} - ${product.description} - $${product.price}`;
    productList.appendChild(listItem);
  });
});

socket.on('client-emit', (data) => {
  console.log('event client-emit', data);
});

socket.on('broadcast-emit', (data) => {
  console.log('event broadcast-emit', data);
});

// Esta función limpia el formulario
function clearForm() {
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('price').value = '';
}

function addProduct() {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const price = parseFloat(document.getElementById('price').value);
  
  if (title && description && price) {
    socket.emit('add-product', { title, description, price });
    clearForm(); // Limpia el formulario después de enviar
  }
}

function deleteProduct(productId) {
  socket.emit('delete-product', productId);
}
