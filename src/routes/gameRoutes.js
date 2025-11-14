import express from 'express'
import { logMiddleware } from '../middleware/logger.js'
import * as gameController from '../controllers/gameController.js'

const router = express.Router()

router.get('/', logMiddleware, gameController.getAllGames) // GET /games
router.get('/:id', gameController.getGameById) // GET /games/:id
router.post('/', gameController.createGame) // POST /games
router.put('/:id', gameController.updateGame) // PUT /games/:id
router.delete('/:id', gameController.deleteGame) // DELETE /games/:id

export default router