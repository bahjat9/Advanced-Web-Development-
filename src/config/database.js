import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create/connect to database
const db = new Database(path.join(__dirname, '../../database.sqlite'))

// Enable foreign keys
db.pragma('foreign_keys = ON')

// Initialize database tables
export const initializeDatabase = async () => {
	console.log('🔧 Initializing database...')
	
	// Import models
	const VideoGame = (await import('../models/VideoGame.js')).default

	// Create tables
	VideoGame.createTable()

	// Seed data
	VideoGame.seed()
	
	console.log('✅ Database initialization complete')
}

export default db