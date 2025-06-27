const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const adminController = require('../controllers/admin.controller');

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
 *         wallet_address:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         username:
 *           type: string
 *         coffee_tokens:
 *           type: number
 *         coffee_redemptions:
 *           type: number
 *         role:
 *           type: string
 *           enum: [user, admin]
 *         created_at:
 *           type: string
 *           format: date-time
 *     CoffeeToken:
 *       type: object
 *       properties:
 *         token_id:
 *           type: string
 *         user:
 *           type: string
 *         status:
 *           type: string
 *           enum: [issued, redeemed, expired]
 *         created_at:
 *           type: string
 *           format: date-time
 *         redeemed_at:
 *           type: string
 *           format: date-time
 *     MobileUser:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         wallet_address:
 *           type: string
 *         coffee_tokens:
 *           type: number
 *         tokenCount:
 *           type: number
 *         mintedTokens:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               token_id:
 *                 type: string
 *               status:
 *                 type: string
 *               created_at:
 *                 type: string
 *                 format: date-time
 *     BulkMintResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         count:
 *           type: number
 *         tokens:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               token_id:
 *                 type: string
 *               user_id:
 *                 type: string
 *               status:
 *                 type: string
 */

// Protect all admin routes
router.use(authenticate);
router.use(requireAdmin);

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin access required)
 *       500:
 *         description: Server error
 */
router.get('/admin/users', adminController.getUsers);

/**
 * @swagger
 * /admin/users-with-tokens:
 *   get:
 *     summary: Get all users with their tokens (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users with their tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   wallet_address:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   coffee_tokens:
 *                     type: number
 *                   tokens:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/CoffeeToken'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin access required)
 *       500:
 *         description: Server error
 */
router.get('/admin/users-with-tokens', adminController.getUsersWithTokens);

/**
 * @swagger
 * /admin/users-mobile:
 *   get:
 *     summary: Get simplified user data for mobile display (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users with simplified token data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MobileUser'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin access required)
 *       500:
 *         description: Server error
 */
router.get('/admin/users-mobile', adminController.getUsersForMobile);

/**
 * @swagger
 * /admin/bulk-mint:
 *   post:
 *     summary: Bulk mint tokens for multiple users (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userIds
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of user IDs to mint tokens for
 *               tokenData:
 *                 type: object
 *                 additionalProperties:
 *                   type: object
 *                 description: Optional metadata for each token keyed by user ID
 *     responses:
 *       200:
 *         description: Tokens minted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BulkMintResponse'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin access required)
 *       404:
 *         description: One or more users not found
 *       500:
 *         description: Server error during bulk mint
 */
router.post('/admin/bulk-mint', adminController.bulkMintTokens);

module.exports = router;