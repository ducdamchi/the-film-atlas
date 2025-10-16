module.exports = (sequelize, DataTypes) => {
  const Films = sequelize.define("Films", {
    //use TMDB id as model's id
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    runtime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    director: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    poster_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    backdrop_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    origin_country: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    release_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  })

  // Each Film can be Liked by many users
  Films.associate = (models) => {
    Films.belongsToMany(models.Users, {
      through: models.Likes,
      as: "likedByUsers",
      foreignKey: "filmId",
      otherKey: "userId",
    })
    // Each Film can be Saved by many users
    Films.belongsToMany(models.Users, {
      through: models.Saves,
      as: "savedByUsers",
      foreignKey: "filmId",
      otherKey: "userId",
    })
  }

  return Films
}
