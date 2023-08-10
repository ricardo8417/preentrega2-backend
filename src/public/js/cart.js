// agregar productos al carrito
const addCart = (id) => {
  const cid = "64cc88ad1cc7179550403154";
  const pid = id;
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantity: 1 }),
  };

  fetch(`/api/carts/${cid}/product/${pid}`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error al agregar el producto al carrito:", error);
    });
};

//eliminar productos del carrito
const deleteProduct = (id) => {
  const cid = "64cc88ad1cc7179550403154";
  const pid = id;
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(`/api/carts/${cid}/products/${pid}`, requestOptions)
    .then((response) => {
      if (response.status === 204) {
        console.log("Producto eliminado exitosamente");
      } else {
        console.error(
          "Error al eliminar el producto. Código de estado:",
          response.status
        );
      }
    })
    .catch((error) => {
      console.error("Error al eliminar el producto:", error);
    });
};

// obtengo el número de productos en el carrito
fetch("/cart/count")
  .then((response) => response.json())
  .then((data) => {
    console.log(
      (document.getElementById("countCart").textContent = data.count)
    );
  })
  .catch((error) => {
    console.error(
      "Error al obtener el número de productos en el carrito:",
      error
    );
  });
