const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Obtenir toutes les commandes de l'utilisateur
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('items.product')
      .sort('-createdAt');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir une commande par ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.userId
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer une commande à partir du panier
router.post('/', [
  auth,
  body('shippingAddress.street').notEmpty(),
  body('shippingAddress.city').notEmpty(),
  body('shippingAddress.postalCode').notEmpty(),
  body('shippingAddress.country').notEmpty(),
  body('paymentMethod').isIn(['carte', 'paypal', 'virement'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: req.userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Panier vide' });
    }

    // Vérifier les stocks
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          error: `Stock insuffisant pour ${item.product.name}`
        });
      }
    }

    // Créer les items de la commande
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.price
    }));

    // Calculer les montants
    const subtotal = cart.totalPrice;
    const taxAmount = subtotal * 0.20; // TVA 20%
    const shippingCost = subtotal > 50 ? 0 : 5.99;
    const totalAmount = subtotal + taxAmount + shippingCost;

    const order = new Order({
      user: req.userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      taxAmount,
      shippingCost,
      totalAmount
    });

    await order.save();

    // Mettre à jour les stocks
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // Vider le panier
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: 'Commande créée avec succès',
      order
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mettre à jour le statut d'une commande (admin uniquement)
router.put('/:id/status', [auth, adminAuth], async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.json({
      message: 'Statut mis à jour',
      order
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir toutes les commandes (admin uniquement)
router.get('/admin/all', [auth, adminAuth], async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'username email')
      .populate('items.product')
      .sort('-createdAt');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
