const { Product } = require("../models");

class ProductControllers {
  static async getAllProduct(req, res) {
    try {
      const dataProd = await Product.findAll({
        raw: true,
        attributes: ["name", "price"],
      });
      res.status(200).json({ data: dataProd });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async addProduct(req, res, next) {
    // console.log("sampai add prod");
    
    try {
      const { name, price} = req.body;

      // cek input form
      if (!name || !price) {
        throw {
          status: 400,
          message: "Product name and price are required",
        };
      }

      // Optional: cek apakah email sudah terdaftar
      const exist = await Product.findOne({ where: { name } });
      // if (exist) return res.status(409).json({ message: 'Email already registered' });
      if (exist) {
        throw { status: 409, message: "Product already registered" };
      }
      // console.log(password);

      const newProduct = await Product.create({
        name,
        price
      });

      res.status(201).json({
        message: "Register successful",
        user: {
          name: newProduct.name,
          email: newProduct.price
        },
      });
    } catch (error) {
    //   console.log(error, "==> SINI");
      next(error);
    }
  }
}

module.exports = ProductControllers;
