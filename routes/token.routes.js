// routes/token.routes.js
const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/token.controller');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Tokens
 *   description: Digital token management
 */

/**
 * @swagger
 * /tokens/{tokenId}/redeem:
 *   post:
 *     summary: Redeem a token
 *     tags: [Tokens]
 *     parameters:
 *       - in: path
 *         name: tokenId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *     responses:
 *       200:
 *         description: Token redeemed successfully
 *       400:
 *         description: Invalid token or user
 *       500:
 *         description: Server error
 */
router.post('/tokens/:tokenId/redeem', tokenController.redeemToken);

// Protected routes
router.use(authenticate);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get current user info
 *     tags: [Tokens]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/user', tokenController.getUser);

/**
 * @swagger
 * /tokens/mint:
 *   post:
 *     summary: Mint a new token
 *     tags: [Tokens]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token minted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Token'
 *       400:
 *         description: Minting failed
 *       401:
 *         description: Unauthorized
 */
router.post('/tokens/mint', tokenController.mintToken);

/**
 * @swagger
 * /tokens:
 *   get:
 *     summary: Get all tokens for current user
 *     tags: [Tokens]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Token'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/tokens', tokenController.getUserTokens);

/**
 * @swagger
 * /tokens/{tokenId}/qrcode:
 *   get:
 *     summary: Generate QR code for a token
 *     tags: [Tokens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tokenId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: QR code generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 qrCode:
 *                   type: string
 *                   description: Base64 encoded QR code image
 *       404:
 *         description: Token not found
 *       401:
 *         description: Unauthorized
 */
router.get('/tokens/:tokenId/qrcode', tokenController.generateQRCode);

/**
 * @swagger
 * /tokens/batch-mint:
 *   post:
 *     summary: Mint multiple tokens at once
 *     tags: [Tokens]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numberOfMints:
 *                 type: integer
 *                 minimum: 1
 *                 example: 5
 *     responses:
 *       200:
 *         description: Batch minting successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/tokens/batch-mint', tokenController.batchMintTokens);

module.exports = router;