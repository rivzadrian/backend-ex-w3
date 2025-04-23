const ProductControllers = require('./controllers/ProductControllers');
const { Product } = require('./models');

jest.mock('./models');

describe('ProductControllers.addProduct', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, user: { role: 'admin' } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  it('should return 400 if name or price is missing', async () => {
    await ProductControllers.addProduct(req, res, next);

    expect(next).toHaveBeenCalledWith({
      status: 400,
      message: 'Product name and price are required'
    });
  });

  it('should return 409 if product already exists', async () => {
    req.body = { name: 'iPhone', price: 1000 };
    Product.findOne.mockResolvedValue({ id: 1 });

    await ProductControllers.addProduct(req, res, next);

    expect(next).toHaveBeenCalledWith({
      status: 409,
      message: 'Product already registered'
    });
  });

  it('should create product and return 201', async () => {
    const newProd = { name: 'iPhone', price: 1000 };
    Product.findOne.mockResolvedValue(null);
    Product.create.mockResolvedValue(newProd);
    req.body = newProd;

    await ProductControllers.addProduct(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Register successful',
      user: {
        name: newProd.name,
        email: newProd.price
      }
    });
  });
});

describe('ProductControllers.getAllProduct', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should return 200 and list of products', async () => {
    const mockProducts = [
      { name: 'iPhone 14', price: 999 },
      { name: 'MacBook Pro', price: 2499 }
    ];

    Product.findAll.mockResolvedValue(mockProducts);

    await ProductControllers.getAllProduct(req, res);

    expect(Product.findAll).toHaveBeenCalledWith({
      raw: true,
      attributes: ['name', 'price']
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: mockProducts });
  });

  it('should return 500 on error', async () => {
    Product.findAll.mockRejectedValue(new Error('Database error'));

    await ProductControllers.getAllProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.any(Error));
  });
});

  
  
