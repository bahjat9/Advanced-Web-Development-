import express from "express"
import config from "./config/config.js"  // Import config
import { logMiddleware } from "./middleware/logger.js"
import { validateApiKey, validateApiKeyProduction } from "./middleware/apiKey.js"  // Import API key middleware
import gameRoutes from "./routes/gameRoutes.js"
import { initializeDatabase } from "./config/database.js"

const app = express()

// Initialize database before starting server
await initializeDatabase()

// Global middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logMiddleware)
// Serve static frontend from /public
app.use(express.static('public'))

// Public routes (no API key needed)
app.get('/', (req, res) => {
	res.json({ 
		message: "Welcome to the API",
		version: "1.0.0",
		environment: config.nodeEnv,
		endpoints: {
			games: "/games"
		}
	})
})

// Health check (useful for Render)
app.get('/health', (req, res) => {
	res.json({ 
		status: 'OK',
		timestamp: new Date().toISOString(),
		environment: config.nodeEnv
	})
})

// Protected routes (API key required)
// Option 1: Protect all /users routes
app.use('/games', validateApiKeyProduction, gameRoutes)

// Also expose APIs under /api prefix for the frontend
app.use('/api/games', validateApiKeyProduction, gameRoutes)

// Option 2: Only protect in production (easier for development)
// app.use('/users', validateApiKeyProduction, userRoutes)

// 404 handler
app.use((req, res) => {
	res.status(404).json({ 
		error: 'Not Found',
		message: `Route ${req.method} ${req.path} not found` 
	})
})

// Error handler
app.use((err, req, res, next) => {
	console.error('Error:', err)
	res.status(err.status || 500).json({
		error: err.message || 'Internal Server Error',
		...(config.isDevelopment() && { stack: err.stack })
	})
})

// Start server
app.listen(config.port, () => {
	console.log(`✅ Server running on http://localhost:${config.port}`)
	console.log(`📊 Environment: ${config.nodeEnv}`)
	console.log(`🔒 API Key protection: ${config.apiKey ? 'ENABLED' : 'DISABLED'}`)
	console.log(`\nAPI Endpoints:`)
	console.log(`  GET    /              - Welcome message (public)`)
	console.log(`  GET    /games         - Get all games (protected)`)
	console.log(`  GET    /games/:id     - Get game by ID (protected)`)
	console.log(`  POST   /games         - Create new game (protected)`)
	console.log(`  PUT    /games/:id     - Update game (protected)`)
	console.log(`  DELETE /games/:id     - Delete game (protected)`)
})

export default app