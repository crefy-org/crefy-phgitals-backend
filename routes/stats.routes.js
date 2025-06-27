// routes/stats.routes.js
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Statistics and analytics
 */

router.use(authenticate);

/**
 * @swagger
 * /stats/overview:
 *   get:
 *     summary: Get dashboard overview stats
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overview statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSales:
 *                   type: number
 *                 totalOrders:
 *                   type: integer
 *                 totalProducts:
 *                   type: integer
 *                 totalUsers:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/stats/overview', statsController.fetchStats);

/**
 * @swagger
 * /stats/sales:
 *   get:
 *     summary: Get monthly sales data
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly sales data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: string
 *                   sales:
 *                     type: number
 *       401:
 *         description: Unauthorized
 */
router.get('/stats/sales', statsController.fetchSalesData);

/**
 * @swagger
 * /stats/top-products:
 *   get:
 *     summary: Get top selling products
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   product:
 *                     $ref: '#/components/schemas/Product'
 *                   sales:
 *                     type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/stats/top-products', statsController.fetchTopProducts);

/**
 * @swagger
 * /stats/blockchain:
 *   get:
 *     summary: Get blockchain statistics
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Blockchain stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalTokens:
 *                   type: integer
 *                 totalHolders:
 *                   type: integer
 *                 totalTransactions:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/stats/blockchain', statsController.fetchBlockChainStats);

module.exports = router;