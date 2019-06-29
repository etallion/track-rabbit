var db = require("../models");
var moment = require('moment');
var Sequelize = require('sequelize');


module.exports = function(app) {
  // Create a new user
  app.post("/api/user", function(req, res) {
    db.User.create(req.body).then(function(user) {
      res.json(user);
    });
  });

  // Get all days
  app.get("/api/days/:id", function(req, res) {

    const today = new Date().toISOString().split('T')[0];
    var pastDate = moment(today).subtract(30 , 'days').toISOString().split('T')[0];

    db.Day.findAll({
      where:{ 
        UserId: req.params.id,
        calendarDate: {[Sequelize.Op.lte]: today, [Sequelize.Op.gt]: pastDate}
      },
      raw: true, 
      limit: 30,
      order: [
        ['calendarDate', 'DESC']
      ]
    }).then(function(dbDays) {
      
      
      const dataWithMissingEntries = [];
      var limit = dbDays.length > 29 ? 30 : dbDays.length;
      var dbPos = 0;

      for (let index = 0; index < 30; index++) {
        //console.log(dbDays[index].calendarDate + " length="+dbDays.length);
        pastDate = moment(today).subtract(index , 'days').toISOString().split('T')[0];
       
        if(dbPos < dbDays.length && dbDays[dbPos].calendarDate == pastDate){
          dataWithMissingEntries.push(dbDays[dbPos]);
          dbPos++;
        } else {
          const unTracked = { calendarDate: pastDate, mood: "Untracked", activity: "Click to Record"};
          dataWithMissingEntries.push(unTracked);
        } 
      }
      res.json(dataWithMissingEntries);
    });
  });

  // Create a new day
  app.post("/api/day", function(req, res) {
    console.log(req.body);
    db.Day.create(req.body).then(function(day) {
      res.json(day);
    });
  });

  // Delete a day by id
  app.delete("/api/day/:id", function(req, res) {
    db.Day.destroy({ where: { id: req.params.id } }).then(function(day) {
      res.json(day);
    });
  });

  // Update a day by id
  app.put("/api/update/:id", function(req, res) {
    db.Day.update({ where: { id: req.params.id } }).then(function(day) {
      res.json(day);
    });
  });
};
