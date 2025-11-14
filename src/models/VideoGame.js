import db from '../config/database.js'

// Define the VideoGame model
class VideoGame {
    // Table schema definition
    static tableName = 'video_games'

    // Create the video_games table
    static createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS ${this.tableName} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                genre TEXT,
                platform TEXT,
                release_year INTEGER,
                rating REAL,
                price REAL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `
        db.exec(sql)
        console.log(`✅ Table '${this.tableName}' created/verified`)
    }

    // Get all games
    static findAll() {
        const stmt = db.prepare(`SELECT * FROM ${this.tableName} ORDER BY id`)
        return stmt.all()
    }

    // Find game by ID
    static findById(id) {
        const stmt = db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`)
        return stmt.get(id)
    }

    // Find game by title
    static findByTitle(title) {
        const stmt = db.prepare(`SELECT * FROM ${this.tableName} WHERE title = ?`)
        return stmt.get(title)
    }

    // Create new game
    static create(gameData) {
        const { title, genre, platform, releaseYear, rating, price } = gameData
        const stmt = db.prepare(`
            INSERT INTO ${this.tableName} (title, genre, platform, release_year, rating, price)
            VALUES (?, ?, ?, ?, ?, ?)
        `)
        const result = stmt.run(
            title,
            genre || null,
            platform || null,
            releaseYear || null,
            rating || null,
            price || null
        )
        return this.findById(result.lastInsertRowid)
    }

    // Update game
    static update(id, gameData) {
        const { title, genre, platform, releaseYear, rating, price } = gameData

        const updates = []
        const values = []

        if (title !== undefined) {
            updates.push('title = ?')
            values.push(title)
        }
        if (genre !== undefined) {
            updates.push('genre = ?')
            values.push(genre)
        }
        if (platform !== undefined) {
            updates.push('platform = ?')
            values.push(platform)
        }
        if (releaseYear !== undefined) {
            updates.push('release_year = ?')
            values.push(releaseYear)
        }
        if (rating !== undefined) {
            updates.push('rating = ?')
            values.push(rating)
        }
        if (price !== undefined) {
            updates.push('price = ?')
            values.push(price)
        }

        // Always update timestamp
        updates.push('updated_at = CURRENT_TIMESTAMP')

        if (updates.length === 1) {
            return this.findById(id)
        }

        values.push(id)

        const stmt = db.prepare(`
            UPDATE ${this.tableName}
            SET ${updates.join(', ')}
            WHERE id = ?
        `)

        stmt.run(...values)
        return this.findById(id)
    }

    // Delete game
    static delete(id) {
        const stmt = db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`)
        const result = stmt.run(id)
        return result.changes > 0
    }

    // Count total games
    static count() {
        const stmt = db.prepare(`SELECT COUNT(*) as count FROM ${this.tableName}`)
        return stmt.get().count
    }

    // Seed sample data
    static seed() {
        const count = this.count()

        const sampleGames = [
            { title: 'FIFA 26', genre: 'Sports', platform: 'Multi-platform', releaseYear: 2026, rating: 4.6, price: 59.99 },
            { title: 'Call of Duty', genre: 'FPS', platform: 'Multi-platform', releaseYear: 2003, rating: 4.4, price: 19.99 },
            { title: 'Fortnite', genre: 'Battle Royale', platform: 'Multi-platform', releaseYear: 2017, rating: 4.5, price: 10 },
            { title: 'Rocket League', genre: 'Sports', platform: 'Multi-platform', releaseYear: 2015, rating: 4.7, price: 10 }
        ]

        if (count === 0) {
            console.log('📝 Seeding video_games table...')
            sampleGames.forEach(game => this.create(game))
            console.log(`✅ Seeded ${sampleGames.length} games`)
        } else {
            // Fix existing records that may have null rating/price
            sampleGames.forEach(game => {
                const existing = this.findByTitle(game.title)
                if (existing) {
                    const updates = {}
                    if (existing.rating === null || existing.rating === undefined) updates.rating = game.rating
                    if (existing.price === null || existing.price === undefined) updates.price = game.price
                    if (Object.keys(updates).length > 0) {
                        this.update(existing.id, updates)
                        console.log(`🔧 Updated ${game.title} with default rating/price`)
                    }
                }
            })
        }
    }
}

export default VideoGame