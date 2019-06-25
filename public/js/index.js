
// Get references to page elements
var $exampleText = $("#example-text");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#submit");
var $exampleList = $("#example-list");
var $monthView = $("#monthView");



// The API object contains methods for each kind of request we'll make
var API = {
  saveDay: function(day) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/day",
      data: JSON.stringify(day)
    });
  },
  getDays: function() {
    return $.ajax({
      url: "api/days",
      type: "GET"
    });
  },
  getDay: function(id) {
    return $.ajax({
      url: "api/day/" + id,
      type: "GET"
    });
  },
  deleteDay: function(id) {
    return $.ajax({
      url: "api/day/" + id,
      type: "DELETE"
    });
  },
  update: function(id) {
    return $.ajax({
      url: "api/update/" + id,
      type: "PUT"
    });
  },
  createUser: function() {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      url: "api/user",
      type: "POST"
    }).then(function(res) {
      localStorage.setItem("trackRabbit", res.id);
      console.log(res.createdAt);
    });
  }
};

//Check for user information stored in local storage
localStorage = window.localStorage;

if (!localStorage.getItem("trackRabbit")) {
  API.createUser();
}

const userID = localStorage.getItem("trackRabbit");

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function() {
  API.getDays().then(function(data) {
    var $days = data.map(function(day) {
      var $a = $("<a>")
        .text(day.mood)
        .attr("href", "/mood/" + day.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": day.id
        })
        .append($a);

      return $li;
    });

    $monthView.empty();
    $monthView.append($days);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var example = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim()
  };

  if (!(example.text && example.description)) {
    alert("You must enter an example text and description!");
    return;
  }

  API.saveExample(example).then(function() {
    refreshExamples();
  });

  $exampleText.val("");
  $exampleDescription.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function() {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);


// // for client side date check
// function formatDate(date) {
//   var d = new Date(date),
//       month = '' + (d.getMonth() + 1),
//       day = '' + d.getDate(),
//       year = d.getFullYear();

//   if (month.length < 2) month = '0' + month;
//   if (day.length < 2) day = '0' + day;

//   return [year, month, day].join('-');
// }

// //createAT
// yourDate.toISOString().split('T')[0]