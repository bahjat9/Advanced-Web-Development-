import VideoGame from '../models/VideoGame.js'

// Get all games
export const getAllGames = () => {
    return VideoGame.findAll()
}

// Get game by ID
export const getGameById = (id) => {
    return VideoGame.findById(id)
}

// Create new game
export const createGame = (gameData) => {
    const { title } = gameData

    // Basic business logic: title is required
    if (!title) {
        throw new Error('Title is required')
    }

    // Prevent duplicate title (optional business rule)
    if (VideoGame.findByTitle(title)) {
        throw new Error('Title already exists')
    }

    return VideoGame.create(gameData)
}

// Update game
export const updateGame = (id, gameData) => {
    const existing = VideoGame.findById(id)
    if (!existing) return null

    // If title changes ensure no conflict
    if (gameData.title && gameData.title !== existing.title && VideoGame.findByTitle(gameData.title)) {
        throw new Error('Title already exists')
    }

    return VideoGame.update(id, gameData)
}

// Delete game
export const deleteGame = (id) => {
    return VideoGame.delete(id)
}

export const getGameCount = () => {
    return VideoGame.count()
}
