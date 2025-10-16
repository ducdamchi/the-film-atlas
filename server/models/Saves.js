module.exports = (sequelize, DataTypes) => {
  const Saves = sequelize.define("Saves", {
    filmId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  })
  return Saves
}
