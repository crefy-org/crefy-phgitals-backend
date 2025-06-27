const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

router.use(authenticate);

/**
 * @swagger
 * /orders/from-cart:
 *   post:
 *     summary: Create order from cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created from cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid cart data
 *       401:
 *         description: Unauthorized
 */
router.post('/orders/from-cart', orderController.createOrderFromCart);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order with specific items
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *             required:
 *               - items
 *     responses:
 *       201:
 *         description: Order created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid order data
 *       401:
 *         description: Unauthorized
 */
router.post('/orders', orderController.createOrder);

/**
 * @swagger
 * /orders/complete:
 *   post:
 *     summary: Complete order payment
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *               mpesaCode:
 *                 type: string
 *             required:
 *               - orderId
 *               - mpesaCode
 *     responses:
 *       200:
 *         description: Payment completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid payment data
 *       401:
 *         description: Unauthorized
 */
router.post('/orders/complete', orderController.completePayment);

module.exports = router;