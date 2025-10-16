const express = require("express")
const router = express.Router()
const { Users } = require("../models")
const { Films } = require("../models")
const { validateToken } = require("../middlewares/AuthMiddleware")

/* GET: Fetch all films added to watchlist by a user */
router.get("/", validateToken, async (req, res) => {
  try {
    const jwtUserId = req.user.id //UserId in signed JWT
    const userWithSavedFilms = await Users.findByPk(jwtUserId, {
      include: [
        {
          model: Films,
          as: "savedFilms",
          attributes: [
            "id",
            "title",
            "runtime",
            "director",
            "poster_path",
            "backdrop_path",
            "origin_country",
            "release_date",
          ],
        },
      ],
    })
    if (!userWithSavedFilms) {
      return res.status(404).json({ error: "User Not Found" })
    } else {
      return res.status(200).json(userWithSavedFilms.savedFilms)
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Error Fetching Content" })
  }
})

/* GET: Check if a film is added to watchlist by a user */
router.get("/:tmdbId", validateToken, async (req, res) => {
  try {
    const tmdbId = req.params.tmdbId //tmdbId used in URL
    const jwtUserId = req.user.id //UserId in signed JWT

    /* Find Film instance */
    const film = await Films.findOne({ where: { id: tmdbId } })
    /* If Film not already in app's db, User couldn't have liked it */
    if (!film) {
      return res.status(200).json({ liked: false })
    }

    /* Find User instance */
    const user = await Users.findByPk(jwtUserId)
    if (!user) {
      return res.status(404).json({ error: "User Not Found" })
    }

    const saved = await user.hasSavedFilm(film)
    return res.status(200).json({ saved: saved })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Error Checking Watchlist Status" })
  }
})

/* POST: Add a film to watchlist junction table */
router.post("/", validateToken, async (req, res) => {
  try {
    const jwtUserId = req.user.id //UserId in signed JWT
    const likeData = req.body

    /* Either find existing film or create new film */
    const [film, created] = await Films.findOrCreate({
      where: {
        id: likeData.tmdbId,
      },
      defaults: {
        tmdbId: likeData.tmdbId,
        title: likeData.title,
        runtime: likeData.runtime,
        director: likeData.director,
        poster_path: likeData.poster_path,
        backdrop_path: likeData.backdrop_path,
        origin_country: likeData.origin_country,
        release_date: likeData.release_date,
      },
    })
    const user = await Users.findByPk(jwtUserId)

    if (!user) {
      return res.status(404).json({ error: "User Not Found" })
    } else {
      await user.addSavedFilm(film)
      return res.status(200).json("Success")
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Error Adding Entry" })
  }
})

/* DELETE: Removed a film 'unsaved' by User from watchlist junction table */
router.delete("/", validateToken, async (req, res) => {
  try {
    const jwtUserId = req.user.id //UserId in signed JWT
    const tmdbId = req.body.tmdbId

    /* Find Film instance */
    const film = await Films.findOne({ where: { id: tmdbId } })
    if (!film) {
      return res.status(404).json({ error: "Film Not Found" })
    }

    /* Find User instance */
    const user = await Users.findByPk(jwtUserId)
    if (!user) {
      return res.status(404).json({ error: "User Not Found" })
    }

    await user.removeSavedFilm(film)
    return res.status(200).json("Success")
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Error Removing Entry" })
  }
})
module.exports = router
