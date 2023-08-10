import { Router } from "express";
// import ProductManager from "../manager/ProductManager.js";
import productModel from "../Dao/models/Product.models.js";
import messageModel from "../Dao/models/messages.models.js";
import cartModel from "../Dao/models/Cart.models.js";
const router = Router();
// const productos = new ProductManager("./dataBase/productos.json");

// router.get('/',(req,res)=>{
//     res.render('index',{})
// })

router.get("/chat", async (req, res) => {
  const messages = await messageModel.find().lean().exec();
  res.render("chat", { messages });
});

// //Consultamos la lista de productos de Nuestra BD
router.get("/products", async (req, res) => {
  try {
    const queryParams = req.query?.query || "";
    const query = {};
    if (queryParams) {
      const field = queryParams.split(",")[0];
      let value = queryParams.split(",")[1];

      if (!isNaN(parseInt(value))) value = parseInt(value);

      query[field] = value;
    }

    const limit = parseInt(req.query?.limit || 5);
    const page = parseInt(req.query?.page || 1);
    const sortPrice = parseInt(req.query?.sortPrice || 1);
    const pageproducts = await productModel.paginate(query, {
      page,
      limit,
      lean: true,
      sort:{price:sortPrice}
    });
    console.log(pageproducts);
    pageproducts.nextLink = pageproducts.hasNextPage
      ? `/products?page=${pageproducts.nextPage}&limit=${limit}`
      : "";
    pageproducts.prevLink = pageproducts.hasPrevPage
      ? `/products?page=${pageproducts.prevPage}&limit=${limit}`
      : "";
    pageproducts.nextPagei = pageproducts.hasNextPage
      ? `/products?page=${pageproducts.nextPage}&limit=${limit}`
      : "";
    pageproducts.prevPagei = pageproducts.hasPrevPage
      ? `/products?page=${pageproducts.prevPage}&limit=${limit}`
      : "";

    res.render("products", pageproducts);
  } catch (e) {
    console.error(e);
  }
});

router.get("/products-realtime", async (req, res) => {
  try {
    const products = await productModel.find().lean().exec();

    res.render("products_realtime", { products });
  } catch (e) {
    console.error(e);
  }
});

//   //Ruta de formulario de Productos.
router.get("/form-products", async (req, res) => {
  try {
    res.render("form", {});
  } catch (e) {
    console.error(e);
  }
});

//Creamos el post para el formulario
router.post("/form-products", async (req, res) => {
  try {
    //Se instancia en el body cada campo.
    const title = req.body.title;
    const descripcion = req.body.descripcion;
    const price = req.body.price;
    const thumbnail = req.body.thumbnail;
    const code = req.body.code;
    const stock = req.body.stock;
    const newProduct = {
      title,
      descripcion,
      price,
      thumbnail,
      code,
      stock,
    };
    const result = await productModel.create(newProduct);

    //  res.send({ status: "success", payload: result });

    res.redirect("/products");
    //  res.render("form", {});
  } catch (e) {
    console.error(e);
  }
});
//Borrar Productos
router.delete("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;
    await productModel.deleteOne({ _id: id });
    res.redirect("/products");
  } catch (error) {
    res.send({ result: "error", error });
  }
});

//vista detail products
router.get("/detail/:_id", async (req, res) => {
  const id = req.params._id;

  const product = await productModel.findById(id).lean().exec();
  console.log(product);

  try {
    res.render("detail", product);
  } catch (error) {
    console.log("error al obtener el producto", error);
  }
});

//vista de carts
router.get("/carts/:cid", async (req, res) => {
  const id = req.params.cid;

  try {
    const cart = await cartModel
      .findOne({ _id: id })
      .populate("products.pid")
      .lean()
      .exec();
    console.log(JSON.stringify(cart.products, null, "\t"));
    if (!cart) {
      res.send("el carrito no existe");
    } else {
      res.render("cart", { cart });
    }
  } catch (error) {
    console.log("error al obtener el carrito", error);
  }
});

//Contador Carrito
router.get("/cart/count", async (req, res) => {
  try {
    const cartCount = await cartModel.findById("64cc88ad1cc7179550403154");
    res.json({ count: cartCount.products.length });
  } catch (error) {
    console.error(
      "Error al obtener el número de productos en el carrito:",
      error
    );
    res
      .status(500)
      .json({ error: "Error al obtener el número de productos en el carrito" });
  }
});

export default router;
