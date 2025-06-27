// api.js
const express = require('express');
const router = express.Router();

// Import all route files
const authRoutes = require('./auth.routes');
const adminRoutes = require('./admin.routes');
const userRoutes = require('./user.routes');
const tokenRoutes = require('./token.routes');
const productRoutes = require('./product.routes');
const cartRoutes = require('./cart.routes');
const orderRoutes = require('./orders.routes');
const statsRoutes = require('./stats.routes');

// Use all routes
router.use(authRoutes);
router.use(adminRoutes);
router.use(userRoutes);
router.use(tokenRoutes);
router.use(productRoutes);
router.use(cartRoutes);
router.use(orderRoutes);
router.use(statsRoutes);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         address:
 *           type: string
 *         phone:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Token:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         tokenId:
 *           type: string
 *         owner:
 *           type: string
 *         redeemed:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 * 
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         type:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         originalPrice:
 *           type: number
 *         image:
 *           type: string
 *         features:
 *           type: array
 *           items:
 *             type: string
 *         max_claims:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Cart:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 $ref: '#/components/schemas/Product'
 *               quantity:
 *                 type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 $ref: '#/components/schemas/Product'
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *         total:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, completed, cancelled]
 *         paymentReference:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

module.exports = router;