const express = require("express");
const { healthController } = require("./controller/HealthController");

const healthRouter = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags:
 *       -  health
 *     summary: Health API
 *     description: To check the health of the service
 *     responses: 
 *       200:
 *         description: Success, service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *       404:
 *         description: Service is down
 *               
 */
healthRouter.get("/health", healthController);
module.exports = { healthRouter: healthRouter };
