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
