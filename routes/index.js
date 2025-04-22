const route = require("express").Router()
const UserControllers = require("../controllers/UserControllers")
const PusrchaseControllers = require("../controllers/PurchaseConrollers")
const authentication = require("../middlewares/authentication")
const authorization = require("../middlewares/authorization")

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login user dan mendapatkan token akses
 *     description: Endpoint untuk login menggunakan email dan password, serta mengembalikan token akses JWT jika berhasil.
 *     operationId: loginUser
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: Informasi login yang diperlukan berupa email dan password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "yourPassword123"
 *     responses:
 *       200:
 *         description: Login berhasil dan token akses dikembalikan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Token akses JWT untuk autentikasi di endpoint lain
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Email atau password tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid email or password"
 *       500:
 *         description: Terjadi kesalahan server internal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
route.post("/api/login", UserControllers.loginUser)

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new account by providing name, email, and password. Role is optional and defaults to 'user'.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: janedoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securePassword123
 *               role:
 *                 type: string
 *                 description: Optional. Default is 'user'.
 *                 example: user
 *     responses:
 *       201:
 *         description: Register successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Register successful
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Jane Doe
 *                     email:
 *                       type: string
 *                       example: janedoe@example.com
 *                     role:
 *                       type: string
 *                       example: user
 *       400:
 *         description: Bad request - Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Name, email, and password are required
 *       409:
 *         description: Conflict - Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 409
 *                 message:
 *                   type: string
 *                   example: Email already registered
 */
route.post("/api/register", UserControllers.registerUser)

route.post("/api/purchase", authentication, PusrchaseControllers.addPurchase)

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     description: Retrieve a list of all users. Only accessible to users with 'admin' role. Requires Bearer token.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: John Doe
 *                       role:
 *                         type: string
 *                         example: admin
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid or missing token
 *       403:
 *         description: Forbidden - User is not an admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access forbidden: admin only"
 */
route.get("/api/users", authentication, authorization, UserControllers.getAllUsers)


module.exports = route