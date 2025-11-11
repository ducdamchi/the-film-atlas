const express = require("express")
const router = express.Router()
const {
  Users,
  Films,
  Directors,
  WatchedDirectors,
  WatchedDirectorLikes,
  Likes,
  Saves,
} = require("../models")
const { validateToken } = require("../middlewares/AuthMiddleware")
const { Op, fn, col, literal, Sequelize } = require("sequelize")

/* Avg_rating: total stars / total films watched. max value = 3
  watchScore: use logarithm function that rewards a director when a user watches multiple films from them. max value = 1 (when user watches 10 or more films, watchScore = 1) 
  finalScore: max(avg_rating) = 3; max(watchScore) = 1; multiply avg_rating by 2 (max 6); multiply watchScore by 4 (max 4). This will achieve a score on a scale of 10, where avg_rating has 60% weight, and num_watched_films has 40% weight.*/
function calculateScore(num_stars_total, num_starred_films, num_watched_films) {
  const watchScore = Math.min(1, Math.log(num_watched_films + 1) / Math.log(10))
  if (parseInt(num_starred_films) === 0) {
    return Number(watchScore * 4).toFixed(2)
  } else {
    const finalScore = Number(
      (num_stars_total / num_starred_films) * 2 + watchScore * 4
    ).toFixed(2)
    return finalScore
  }
}

/* GET: Fetch all films liked by a user */
router.get("/", validateToken, async (req, res) => {
  try {
    const jwtUserId = req.user.id //UserId in signed JWT
    const sortBy = req.query.sortBy || "added_date"
    const sortDirection = req.query.sortDirection || "desc"
    const sortCommand = `${sortBy}_${sortDirection}`
    let order
    switch (sortCommand) {
      // Sorting by junction table attribute
      case "added_date_desc":
        order = [
          [{ model: Films, as: "likedFilms" }, Likes, "createdAt", "DESC"],
        ]
        break
      case "added_date_asc":
        order = [
          [{ model: Films, as: "likedFilms" }, Likes, "createdAt", "ASC"],
        ]
        break

      // Sorting by association model attribute
      case "released_date_desc":
        order = [[{ model: Films, as: "likedFilms" }, "release_date", "DESC"]]
        break
      case "released_date_asc":
        order = [[{ model: Films, as: "likedFilms" }, "release_date", "ASC"]]
        break
    }

    const userWithLikedFilms = await Users.findByPk(jwtUserId, {
      include: [
        {
          model: Films,
          as: "likedFilms",
          attributes: [
            "id",
            "title",
            "runtime",
            "directors",
            "directorNamesForSorting",
            "poster_path",
            "backdrop_path",
            "origin_country",
            "release_date",
          ],
          through: {
            attributes: ["createdAt"],
          },
        },
      ],
      order: order,
    })

    if (!userWithLikedFilms) {
      return res.status(404).json({ error: "User Not Found" })
    } else {
      return res.status(200).json(userWithLikedFilms.likedFilms)
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Error Fetching Content" })
  }
})

/* GET: Fetch all films rated by a user */
router.get("/rated", validateToken, async (req, res) => {
  try {
    const jwtUserId = req.user.id //UserId in signed JWT
    const sortBy = req.query.sortBy || "added_date"
    const sortDirection = req.query.sortDirection || "desc"
    const sortCommand = `${sortBy}_${sortDirection}`
    const numStars = parseInt(req.query.numStars)
    let order, whereCondition

    switch (sortCommand) {
      case "added_date_desc":
        order = [
          [{ model: Films, as: "likedFilms" }, Likes, "updatedAt", "DESC"],
        ]
        break
      case "added_date_asc":
        order = [
          [{ model: Films, as: "likedFilms" }, Likes, "updatedAt", "ASC"],
        ]
        break
      case "released_date_desc":
        order = [[{ model: Films, as: "likedFilms" }, "release_date", "DESC"]]
        break
      case "released_date_asc":
        order = [[{ model: Films, as: "likedFilms" }, "release_date", "ASC"]]
        break
    }

    if (numStars === 0) {
      whereCondition = { stars: { [Op.gt]: 0 } }
    } else if (numStars > 0) {
      whereCondition = { stars: numStars }
    } else {
      whereCondition = {}
    }

    const userWithRatedFilms = await Users.findByPk(jwtUserId, {
      include: [
        {
          model: Films,
          as: "likedFilms",
          attributes: [
            "id",
            "title",
            "runtime",
            "directors",
            "directorNamesForSorting",
            "poster_path",
            "backdrop_path",
            "origin_country",
            "release_date",
          ],
          through: {
            attributes: ["updatedAt"],
            where: whereCondition,
          },
        },
      ],
      order: order,
    })

    if (!userWithRatedFilms) {
      return res.status(404).json({ error: "User Not Found" })
    } else {
      return res.status(200).json(userWithRatedFilms.likedFilms)
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Error Fetching Content" })
  }
})

/* GET: Fetch all films user liked from a certain country */
router.get("/by_country", validateToken, async (req, res) => {
  try {
    const jwtUserId = req.user.id //UserId in signed JWT
    const sortBy = req.query.sortBy || "added_date"
    const sortDirection = req.query.sortDirection || "desc"
    const sortCommand = `${sortBy}_${sortDirection}`
    const countryCode = req.query.countryCode
    const numStars = parseInt(req.query.numStars)
    let order, whereCondition

    if (
      countryCode === null ||
      countryCode === "" ||
      countryCode.length !== 2
    ) {
      return res.status(404).json({ error: "Country Code Not Found" })
    }

    switch (sortCommand) {
      case "added_date_desc":
        order = [
          [{ model: Films, as: "likedFilms" }, Likes, "createdAt", "DESC"],
        ]
        break
      case "added_date_asc":
        order = [
          [{ model: Films, as: "likedFilms" }, Likes, "createdAt", "ASC"],
        ]
        break
      case "released_date_desc":
        order = [[{ model: Films, as: "likedFilms" }, "release_date", "DESC"]]
        break
      case "released_date_asc":
        order = [[{ model: Films, as: "likedFilms" }, "release_date", "ASC"]]
        break
    }

    if (numStars === 0) {
      whereCondition = Sequelize.literal(
        `stars > 0 AND JSON_CONTAINS(origin_country, '"${countryCode}"')`
      )
    } else if (numStars > 0) {
      whereCondition = Sequelize.literal(
        `stars = ${numStars} AND JSON_CONTAINS(origin_country, '"${countryCode}"')`
      )
    } else {
      whereCondition = Sequelize.literal(
        `JSON_CONTAINS(origin_country, '"${countryCode}"')`
      )
    }

    const userWithLikedFilms = await Users.findByPk(jwtUserId, {
      include: [
        {
          model: Films,
          as: "likedFilms",
          attributes: [
            "id",
            "title",
            "runtime",
            "directors",
            "directorNamesForSorting",
            "poster_path",
            "backdrop_path",
            "origin_country",
            "release_date",
          ],
          where: whereCondition,
          through: {
            attributes: ["createdAt"],
          },
        },
      ],
      order: order,
    })

    if (!userWithLikedFilms) {
      return res
        .status(200)
        .json({ error: `User Not Found / Films from ${countryCode} Not Found` })
    } else {
      return res.status(200).json(userWithLikedFilms.likedFilms)
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Error Fetching Content" })
  }
})

/* GET: Check if a film is liked by a user */
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

    const likedFilm = await Likes.findOne({
      where: {
        filmId: tmdbId,
        userId: jwtUserId,
      },
    })
    if (!likedFilm) {
      return res.status(200).json({ liked: false, stars: 0 })
    }
    return res.status(200).json({ liked: true, stars: likedFilm.stars })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Error Checking Like Status" })
  }
})

/* POST: Handle when user Likes a film */
router.post("/", validateToken, async (req, res) => {
  try {
    const jwtUserId = req.user.id //UserId in signed JWT
    const reqData = req.body
    let deleteResult

    /* Find User instance */
    const user = await Users.findByPk(jwtUserId)
    if (!user) {
      return res.status(404).json({ error: "User Not Found" })
    }

    /* Find or Create Film instance */
    const [film, created] = await Films.findOrCreate({
      where: {
        id: reqData.tmdbId,
      },
      defaults: {
        id: reqData.tmdbId,
        title: reqData.title,
        runtime: reqData.runtime,
        directors: reqData.directors,
        directorNamesForSorting: reqData.directorNamesForSorting,
        poster_path: reqData.poster_path,
        backdrop_path: reqData.backdrop_path,
        origin_country: reqData.origin_country,
        release_date: reqData.release_date,
      },
    })

    /* Add film to Liked junction table. Then double check if operation was successful. */
    await user.addLikedFilm(film, {
      through: { stars: reqData.stars },
    })
    const likedFilm = await Likes.findOne({
      where: {
        userId: jwtUserId,
        filmId: reqData.tmdbId,
      },
    })
    if (!likedFilm || !user.hasLikedFilm(film)) {
      return res.status(500).json({ error: "Error adding film to Likes" })
    }

    /* Check if film is in Saves junction table. If so, remove because a Watched film should not be in Watchlist */
    const watchlistedFilm = await Saves.findOne({
      where: {
        userId: jwtUserId,
        filmId: reqData.tmdbId,
      },
    })
    if (watchlistedFilm) {
      deleteResult = await Saves.destroy({
        where: {
          userId: jwtUserId,
          filmId: reqData.tmdbId,
        },
      })
      if (deleteResult !== 1) {
        return res.status(500).json({ error: "Error removing film from Saves" })
      }
    }

    /* Now, handle the Director model and WatchedDirector junction table */
    for (const director of reqData.directors) {
      /* Find or Create Director instance */
      const [directorEntry, directorEntryCreated] =
        await Directors.findOrCreate({
          where: {
            id: director.tmdbId,
          },
          defaults: {
            id: director.tmdbId,
            name: director.name,
            profile_path: director.profile_path,
          },
        })
      if (!directorEntry) {
        return res
          .status(500)
          .json({ error: "Director Entry Not Found or Created" })
      }

      /* Find WatchedDirector instance */
      const [watchedDirector, watchedDirectorCreated] =
        await WatchedDirectors.findOrCreate({
          where: {
            directorId: directorEntry.id,
            userId: jwtUserId,
          },
          defaults: {
            num_watched_films: 1,
            num_starred_films: reqData.stars === 0 ? 0 : 1,
            num_stars_total: reqData.stars,
            avg_rating: reqData.stars === 0 ? 0 : reqData.stars,
            highest_star: reqData.stars,
            score:
              reqData.stars === 0
                ? calculateScore(reqData.stars, 0, 1)
                : calculateScore(reqData.stars, 1, 1),
          },
        })
      if (!watchedDirector) {
        return res
          .status(500)
          .json({ error: "Watched Director Not Found or Created" })
      }

      /* Add Like instance to WatchedDirectorLikes junction table */
      await watchedDirector.addWatchedDirectorLike(likedFilm)
      const watchedDirectorLike = await WatchedDirectorLikes.findOne({
        where: {
          watchedDirectorId: watchedDirector.id,
          likeId: likedFilm.id,
        },
      })
      if (!watchedDirectorLike) {
        return res
          .status(500)
          .json({ error: "Watched Director Not Found or Created" })
      }

      /* If watchedDirector already exist, update the columns based on data from WatchedDirectorLikes junction table. 
      If not, the entry will be filled with initial data from findOrCreate's 'defaults' */
      if (!watchedDirectorCreated) {
        const likesFromWatchedDirector = await WatchedDirectors.findByPk(
          watchedDirector.id,
          {
            include: [
              {
                model: Likes,
                as: "watchedDirectorLikes",
                attributes: [],
                through: {
                  attributes: [],
                },
              },
            ],
            attributes: [
              //use watchedDirectorLikes to refer to alias given to Likes table.
              [
                fn("COUNT", col("watchedDirectorLikes.filmId")),
                "num_watched_films",
              ],
              [
                literal(
                  `COUNT(CASE WHEN watchedDirectorLikes.stars > 0 THEN 1 END)`
                ),
                "num_starred_films",
              ],
              [fn("SUM", col("watchedDirectorLikes.stars")), "num_stars_total"],
              [fn("MAX", col("watchedDirectorLikes.stars")), "highest_star"],
            ],
            group: ["WatchedDirectors.id"], // This returns one row per WatchedDirectors record with aggregates for THAT director only
            raw: true, //return plain JS objects instead of model instances
          }
        )
        if (!likesFromWatchedDirector) {
          return res.status(500).json({
            error: "Error Fetching Aggregations for Watched Directors.",
          })
        }

        const [affectedRows] = await WatchedDirectors.update(
          {
            num_watched_films: likesFromWatchedDirector.num_watched_films,
            num_starred_films: likesFromWatchedDirector.num_starred_films,
            num_stars_total: likesFromWatchedDirector.num_stars_total,
            avg_rating:
              likesFromWatchedDirector.num_stars_total /
              likesFromWatchedDirector.num_starred_films,
            highest_star: likesFromWatchedDirector.highest_star,
            score: calculateScore(
              likesFromWatchedDirector.num_stars_total,
              likesFromWatchedDirector.num_starred_films,
              likesFromWatchedDirector.num_watched_films
            ),
          },
          {
            where: {
              directorId: directorEntry.id,
              userId: jwtUserId,
            },
          }
        )
        if (affectedRows !== 1) {
          return res.status(500).json({
            error: "Error Updating Watched Directors with new Aggregations.",
          })
        }
      }
    }
    return res
      .status(200)
      .json({ liked: user.hasLikedFilm(film), stars: likedFilm.stars })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Error Adding Entry" })
  }
})

/* DELETE: Removed a film unliked by User from junction table */
router.delete("/", validateToken, async (req, res) => {
  try {
    const jwtUserId = req.user.id //UserId in signed JWT
    const tmdbId = req.body.tmdbId
    let deleteResult

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

    /* Find Liked Film instance */
    const likedFilm = await Likes.findOne({
      where: {
        userId: jwtUserId,
        filmId: tmdbId,
      },
    })
    if (!likedFilm) {
      return res.status(404).json({ error: "Liked Film Not Found" })
    }

    /* Locate each instance of watched director in junction table */
    for (const director of film.directors) {
      const watchedDirector = await WatchedDirectors.findOne({
        where: {
          directorId: director.tmdbId,
          userId: jwtUserId,
        },
      })
      if (!watchedDirector) {
        return res.status(404).json({
          error: `Cannot find entry for director ${director.name}, id: ${director.tmdbId} in WatchedDirector junction table.`,
        })
      }

      /* Add Like instance to WatchedDirectorLikes junction table */
      await watchedDirector.removeWatchedDirectorLike(likedFilm)

      const likesFromWatchedDirector = await WatchedDirectors.findByPk(
        watchedDirector.id,
        {
          include: [
            {
              model: Likes,
              as: "watchedDirectorLikes",
              attributes: [],
              through: {
                attributes: [],
              },
            },
          ],
          attributes: [
            //use watchedDirectorLikes to refer to alias given to Likes table.
            [
              fn("COUNT", col("watchedDirectorLikes.filmId")),
              "num_watched_films",
            ],
            [
              literal(
                `COUNT(CASE WHEN watchedDirectorLikes.stars > 0 THEN 1 END)`
              ),
              "num_starred_films",
            ],
            [fn("SUM", col("watchedDirectorLikes.stars")), "num_stars_total"],
            [fn("MAX", col("watchedDirectorLikes.stars")), "highest_star"],
          ],
          group: ["WatchedDirectors.id"], // This returns one row per WatchedDirectors record with aggregates for THAT director only
          raw: true, //return plain JS objects instead of model instances
        }
      )
      if (!likesFromWatchedDirector) {
        return res.status(500).json({
          error: "Error Fetching Aggregations for Watched Directors.",
        })
      }

      if (likesFromWatchedDirector.num_watched_films === 0) {
        deleteResult = await WatchedDirectors.destroy({
          where: {
            directorId: director.tmdbId,
            userId: jwtUserId,
          },
        })
        if (deleteResult !== 1) {
          return res
            .status(500)
            .json({ error: "Error Removing Watched Director" })
        }
      } else {
        const [affectedRows] = await WatchedDirectors.update(
          {
            num_watched_films: likesFromWatchedDirector.num_watched_films,
            num_starred_films: likesFromWatchedDirector.num_starred_films,
            num_stars_total: likesFromWatchedDirector.num_stars_total,
            avg_rating:
              likesFromWatchedDirector.num_stars_total /
              likesFromWatchedDirector.num_starred_films,
            highest_star: likesFromWatchedDirector.highest_star,
            score: calculateScore(
              likesFromWatchedDirector.num_stars_total,
              likesFromWatchedDirector.num_starred_films,
              likesFromWatchedDirector.num_watched_films
            ),
          },
          {
            where: {
              directorId: director.tmdbId,
              userId: jwtUserId,
            },
          }
        )
        if (affectedRows !== 1) {
          return res.status(500).json({
            error: "Error Updating Watched Directors with new Aggregations.",
          })
        }
      }
    }

    deleteResult = await Likes.destroy({
      where: {
        userId: jwtUserId,
        filmId: tmdbId,
      },
    })
    if (deleteResult !== 1) {
      return res.status(500).json({ error: "Error Removing Like" })
    }

    return res.status(200).json({ liked: false, stars: null })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Error Removing Entry" })
  }
})

/* PUT: Modify the rating of a film that's already liked */
router.put("/", validateToken, async (req, res) => {
  try {
    const jwtUserId = req.user.id //UserId in signed JWT
    const reqData = req.body

    /* Find Film instance */
    const film = await Films.findOne({ where: { id: reqData.tmdbId } })
    if (!film) {
      return res.status(404).json({ error: "Film Not Found" })
    }

    /* Find User instance */
    const user = await Users.findByPk(jwtUserId)
    if (!user) {
      return res.status(404).json({ error: "User Not Found" })
    }

    /* Find Liked Film instance */
    const likedFilm = await Likes.findOne({
      where: {
        userId: jwtUserId,
        filmId: reqData.tmdbId,
      },
    })
    if (!likedFilm) {
      return res.status(404).json({ error: "Liked Film Not Found" })
    }
    likedFilm.stars = reqData.stars
    await likedFilm.save()

    /* Now, handle the Director model and WatchedDirector junction table */
    for (const director of reqData.directors) {
      /* The director(s) should already exist at this point because the film has already been liked. Simply find the entry in watchedDirectors junction table to update the correct num_stars_total*/
      const watchedDirector = await WatchedDirectors.findOne({
        where: {
          directorId: director.tmdbId,
          userId: jwtUserId,
        },
      })
      if (!watchedDirector) {
        return res.status(404).json({
          error: `Cannot find director ${director.name}, id: ${director.tmdbId} in watchedDirector junction table.`,
        })
      }

      /* Add Like instance to WatchedDirectorLikes junction table */
      await watchedDirector.addWatchedDirectorLike(likedFilm)

      const likesFromWatchedDirector = await WatchedDirectors.findByPk(
        watchedDirector.id,
        {
          include: [
            {
              model: Likes,
              as: "watchedDirectorLikes",
              attributes: [],
              through: {
                attributes: [],
              },
            },
          ],
          attributes: [
            //use watchedDirectorLikes to refer to alias given to Likes table.
            [
              fn("COUNT", col("watchedDirectorLikes.filmId")),
              "num_watched_films",
            ],
            [
              literal(
                `COUNT(CASE WHEN watchedDirectorLikes.stars > 0 THEN 1 END)`
              ),
              "num_starred_films",
            ],
            [fn("SUM", col("watchedDirectorLikes.stars")), "num_stars_total"],
            [fn("MAX", col("watchedDirectorLikes.stars")), "highest_star"],
          ],
          group: ["WatchedDirectors.id"], // This returns one row per WatchedDirectors record with aggregates for THAT director only
          raw: true, //return plain JS objects instead of model instances
        }
      )

      await WatchedDirectors.update(
        {
          num_watched_films: likesFromWatchedDirector.num_watched_films,
          num_starred_films: likesFromWatchedDirector.num_starred_films,
          num_stars_total: likesFromWatchedDirector.num_stars_total,
          avg_rating:
            likesFromWatchedDirector.num_stars_total /
            likesFromWatchedDirector.num_starred_films,
          highest_star: likesFromWatchedDirector.highest_star,
          score: calculateScore(
            likesFromWatchedDirector.num_stars_total,
            likesFromWatchedDirector.num_starred_films,
            likesFromWatchedDirector.num_watched_films
          ),
        },
        {
          where: {
            directorId: director.tmdbId,
            userId: jwtUserId,
          },
        }
      )
    }

    return res.status(200).json({ stars: likedFilm.stars })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Error Adding Entry" })
  }
})

module.exports = router

// // If current num_watched_films by a director is 1, remove director from junction table
// if (watchedDirector.num_watched_films <= 1) {
//   //Remove all entries in WatchedDirectorLikes
//   await WatchedDirectorLikes.destroy({
//     where: {
//       watchedDirectorId: watchedDirector.id,
//     },
//   })
//   //Then remove watchedDirecotr entry
//   await watchedDirector.destroy()
// } else {
//   /* First, decrement num_watched_films and num_stars_total */
//   await WatchedDirectors.decrement(
//     {
//       num_watched_films: 1,
//       num_stars_total: likedFilm.stars,
//     },
//     {
//       where: {
//         directorId: director.tmdbId,
//         userId: jwtUserId,
//       },
//     }
//   )

//   /* Second, fetch updated entry and calculate avg_rating to avoid race condition*/
//   const updatedJunctionEntry = await WatchedDirectors.findOne({
//     where: {
//       directorId: director.tmdbId,
//       userId: jwtUserId,
//     },
//   })
//   newAvgRating = Number(
//     updatedJunctionEntry.num_stars_total /
//       updatedJunctionEntry.num_watched_films
//   ).toFixed(1)

//   /* Finally, update entry with calculated avg_rating */
//   await WatchedDirectors.update(
//     {
//       avg_rating: newAvgRating,
//     },
//     {
//       where: {
//         directorId: entry.id,
//         userId: jwtUserId,
//       },
//     }
//   )
// }
