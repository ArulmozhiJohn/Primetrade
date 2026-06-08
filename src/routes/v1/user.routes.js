const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../../middlewares/auth');
const prisma = require('../../config/prisma');
const { successResponse } = require('../../utils/response');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Get current logged-in user profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 */
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return successResponse(res, 200, 'Profile fetched successfully', user);
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       403:
 *         description: Forbidden - Admins only
 */
router.get('/', protect, restrictTo('ADMIN'), async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return successResponse(res, 200, 'Users fetched successfully', users);
  } catch (err) { next(err); }
});

module.exports = router;