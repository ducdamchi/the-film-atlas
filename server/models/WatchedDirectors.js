module.exports = (sequelize, DataTypes) => {
  const WatchedDirectors = sequelize.define("WatchedDirectors", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    directorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    num_watched_films: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    num_starred_films: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    num_stars_total: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    highest_star: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    avg_rating: {
      type: DataTypes.DECIMAL(3, 2), //up to 3 digits total incl. decimal, with max 2 decimal points
      allowNull: false,
    },
    score: {
      type: DataTypes.DECIMAL(4, 2), //up to 4 digits total incl. decimal, with max 2 decimal points
      allowNull: false,
    },
  })

  WatchedDirectors.associate = (models) => {
    WatchedDirectors.belongsToMany(models.Likes, {
      through: models.WatchedDirectorLikes,
      as: "watchedDirectorLikes",
      foreignKey: "watchedDirectorId",
      otherKey: "likeId",
    })
  }
  return WatchedDirectors
}
