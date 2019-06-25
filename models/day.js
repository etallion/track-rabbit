
module.exports = function(sequelize, DataTypes) {
  var Day = sequelize.define("Day", {
    // eslint-disable-next-line camelcase
    calendarDate: DataTypes.DATEONLY,
    mood: {
      type: DataTypes.STRING,
      defaultValue: "neutral",
      validate: {
        isIn: {
          args: [["sad", "neutral", "happy"]],
          msg:
            "Mood value should be between 1 and 5, where 5 is feeling amazing."
        }
      }
    },
    activity: {
      type: DataTypes.STRING,
      defaultValue: "none",
      validate: {
        isIn: {
          args: [["none", "treadmill", "weights", "bike"]],
          msg:
            "Mood value should be between 1 and 5, where 5 is feeling amazing."
        }
      }
    }
  });

  Day.associate = function(models) {
    // Associating User with Posts
    // When an User is deleted, also delete any associated Posts
    Day.belongsTo(models.User, {
      onDelete: "cascade"
    });
  };

  return Day;
};
