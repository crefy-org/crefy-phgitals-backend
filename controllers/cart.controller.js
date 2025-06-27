// controllers/cart.controller.js
const cartService = require('../services/cart.service');
const orderService = require('../services/order.service');

class CartController {
    async getCart(req, res) {
        try {
            const cart = await cartService.getCart(req.user._id);
            res.json(cart);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async addToCart(req, res) {
        try {
            const { productId, quantity } = req.body;
            const cart = await cartService.addToCart(req.user._id, productId, quantity);
            res.json(cart);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateCartItem(req, res) {
        try {
            const { productId, quantity } = req.body;
            const cart = await cartService.updateCartItem(req.user._id, productId, quantity);
            res.json(cart);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async removeFromCart(req, res) {
        try {
            const { productId } = req.body;
            const cart = await cartService.removeFromCart(req.user._id, productId);
            res.json(cart);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async checkoutCart(req, res) {
        try {
            const userId = req.user._id;
            const order = await orderService.createOrderFromCart(userId);
            res.json(order);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new CartController();