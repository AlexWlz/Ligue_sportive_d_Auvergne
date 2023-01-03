module.exports = (sequelize, DataTypes) => {
  const Commands = sequelize.define("Commands", {
    panier: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    id_user: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
  });

  return Commands;
};
