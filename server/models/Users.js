module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  })

  // Each User can have many "Like" instances
  Users.associate = (models) => {
    Users.belongsToMany(models.Films, {
      through: models.Likes,
      as: "likedFilms",
      foreignKey: "userId",
      otherKey: "filmId",
    })
    // Each User can have many "Save" instances
    Users.belongsToMany(models.Films, {
      through: models.Saves,
      as: "savedFilms",
      foreignKey: "userId",
      otherKey: "filmId",
    })
  }

  return Users
}
