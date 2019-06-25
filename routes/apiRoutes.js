var db = require("../models");

module.exports = function(app) {
  // Create a new user
  app.post("/api/user", function(req, res) {
    db.User.create(req.body).then(function(user) {
      res.json(user);
    });
  });

  // Get all days
  app.get("/api/days", function(req, res) {
    db.Days.findAll().then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new day
  app.post("/api/day", function(req, res) {
    db.Days.create(req.body).then(function(day) {
      res.json(day);
    });
  });

  // Delete a day by id
  app.delete("/api/day/:id", function(req, res) {
    db.Days.destroy({ where: { id: req.params.id } }).then(function(day) {
      res.json(day);
    });
  });

  // Update a day by id
  app.put("/api/update/:id", function(req, res) {
    db.Days.update({ where: { id: req.params.id } }).then(function(day) {
      res.json(day);
    });
  });
};
