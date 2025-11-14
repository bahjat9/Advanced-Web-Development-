import * as gameService from '../service/gameService.js'

// Get all games
export const getAllGames = (req, res) => {
    try {
        const games = gameService.getAllGames()

        const filtered = games.map(g => ({
            id: g.id,
            title: g.title,
            genre: g.genre,
            platform: g.platform,
            releaseYear: g.release_year,
            rating: g.rating,
            price: g.price
        }))

        res.status(200).json(filtered)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get single game
export const getGameById = (req, res) => {
    try {
        const { id } = req.params
        const game = gameService.getGameById(id)
        if (!game) return res.status(404).json({ message: 'Game not found' })

        res.status(200).json({
            id: game.id,
            title: game.title,
            genre: game.genre,
            platform: game.platform,
            releaseYear: game.release_year,
            rating: game.rating,
            price: game.price
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Create game
export const createGame = (req, res) => {
    try {
        const { title, genre, platform, releaseYear, rating, price } = req.body

        if (!title) return res.status(400).json({ message: 'Title is required' })

        const newGame = gameService.createGame({ title, genre, platform, releaseYear, rating, price })
        res.status(201).json(newGame)
    } catch (error) {
        if (error.message === 'Title already exists') return res.status(409).json({ message: error.message })
        res.status(500).json({ message: error.message })
    }
}

// Update game
export const updateGame = (req, res) => {
    try {
        const { id } = req.params
        const updates = req.body

        const updated = gameService.updateGame(id, updates)
        if (!updated) return res.status(404).json({ message: 'Game not found' })

        res.status(200).json(updated)
    } catch (error) {
        if (error.message === 'Title already exists') return res.status(409).json({ message: error.message })
        res.status(500).json({ message: error.message })
    }
}

// Delete game
export const deleteGame = (req, res) => {
    try {
        const { id } = req.params
        const deleted = gameService.deleteGame(id)
        if (!deleted) return res.status(404).json({ message: 'Game not found' })

        res.status(204).send()
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
