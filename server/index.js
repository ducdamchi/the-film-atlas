const express = require("express") //create an instance of express framework
const app = express()
const db = require("./models") //import database
const cors = require("cors")

/* Automatically parses JSON data from incoming requests and makes it available in req.body. */
app.use(express.json())
app.use(cors())

const authRouter = require("./routes/Auth.js")
const userLikesRouter = require("./routes/UserLikes.js")
const userSavesRouter = require("./routes/UserSaves.js")

const filmsRouter = require("./routes/Film.js")

app.use("/auth", authRouter)
app.use("/profile/me/liked-films", userLikesRouter)
app.use("/profile/me/watchlist", userSavesRouter)
app.use("/film", filmsRouter)

/* Notes:
db.sequelize.sync() synchronizes Sequelize models with database tables by either:
- Create tables that don't exist in database
- Alter tables to match model definitions, or
- Drops and recreates tables.
.then() is a Promise that resolves when the synchronization is complete. Since sync() returns a Promise, we can use .then() to execute code after the sync operation finishes.
*/
db.sequelize.sync().then(() => {
  app.listen(3002, () => {
    console.log("Server running on port 3002")
  })
})
