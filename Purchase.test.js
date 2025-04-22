const PusrchaseControllers = require('./controllers/PurchaseConrollers');
const { Product, Purchase, sequelize } = require('./models');

jest.mock('./models');

describe('PusrchaseControllers.addPurchase', () => {
    let req, res, t;
  
    beforeEach(() => {
      req = {
        body: {},
        user: { id: 1 }
      };
  
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      t = {
        commit: jest.fn(),
        rollback: jest.fn()
      };
  
      sequelize.transaction.mockResolvedValue(t);
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return 400 if productId is not provided', async () => {
      req.body = {};
      await PusrchaseControllers.addPurchase(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Gagal purchase',
        error: 'productId wajib diisi'
      });
      expect(t.rollback).toHaveBeenCalled();
    });
  
    it('should return 404 if product is not found', async () => {
      req.body = { productId: 99 };
      Product.findByPk.mockResolvedValue(null);
  
      await PusrchaseControllers.addPurchase(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Produk tidak ditemukan' });
      expect(t.commit).not.toHaveBeenCalled();
    });
  
    it('should create a purchase and return 201 if valid', async () => {
      req.body = { productId: 1 };
      const fakeProduct = { id: 1, name: 'Product X' };
      const fakePurchase = { id: 123, userId: 1, productId: 1 };
  
      Product.findByPk.mockResolvedValue(fakeProduct);
      Purchase.create.mockResolvedValue(fakePurchase);
  
      await PusrchaseControllers.addPurchase(req, res);
  
      expect(Purchase.create).toHaveBeenCalledWith(
        { userId: 1, productId: 1 },
        { transaction: t }
      );
      expect(t.commit).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Purchase berhasil',
        data: fakePurchase
      });
    });
  
    it('should handle internal server errors and rollback transaction', async () => {
      req.body = { productId: 1 };
      Product.findByPk.mockRejectedValue(new Error('DB error'));
  
      await PusrchaseControllers.addPurchase(req, res);
  
      expect(t.rollback).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Gagal purchase',
        error: 'DB error'
      });
    });
  });

  