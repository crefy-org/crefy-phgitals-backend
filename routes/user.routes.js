// routes/user.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management endpoints
 */

router.use(authenticate);

/**
 * @swagger
 * /users/phone:
 *   put:
 *     summary: Update user phone number
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *             required:
 *               - phone
 *     responses:
 *       200:
 *         description: Phone number updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid phone number
 *       401:
 *         description: Unauthorized
 */
router.put('/users/phone', authController.updatePhone);

module.exports = router;