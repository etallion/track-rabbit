
// Get references to page elements
var $submitBtn = $("#submit");
var $monthView = $("#monthView");
var $moodSelection = null;
var $activitySelection = null;
var untrackedDate = null;



// The API object contains methods for each kind of request we'll make
var API = {
  saveDay: function(day){
    console.log(day, untrackedDate);
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
      url: "api/days/" + userID,
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
      userID = localStorage.getItem("trackRabbit");
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

// refreshExamples onload and get 30 of the most recent day post
var refreshExamples = function() {

  API.getDays().then(function(data) {
    console.log("refreshed");
    var $days = data.map(function(day) {
      
      if(day.mood === "Untracked"){

        var $actionElement = $("<button>");
        $actionElement.attr({
          "type": "button",
          "data-toggle": "modal",
          "data-target": "#exampleModal",
          "data-date": day.calendarDate,
          "class": "btn btn-info untrackedbtn"
        })
        .html(`<p><b>Track It!<br>${day.calendarDate.split('-').splice(1,2).join('/')}</b></p>`);
      } else {
          var $actionElement = $("<div>")
            .html(" " + day.mood +  "<br>" + day.activity + "<br>" + day.calendarDate);
            //.attr("data-id", day-id);
      }

      var $span = $("<span>")
        .attr({
          "data-id": day.id
        })
        .addClass(day.mood).addClass("dateblock")
        .append($actionElement);
        
        return $span;
      
    });

    $monthView.empty();
    $monthView.append($days);
  });
};

//Request days for user
refreshExamples();

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
//$submitBtn.on("click", handleFormSubmit);
//$exampleList.on("click", ".delete", handleDeleteBtnClick);

$(".moodBtn").on("click", function() {
  console.log("mood button clicked");
  $moodSelection = $(this);
  $(this).addClass('selectedModalButton');
});

$(".activityBtn").on("click", function() {
  console.log("activity button clicked");
  $activitySelection = $(this);
  $(this).addClass('selectedModalButton');
});

$(document).on("click", ".untrackedbtn", function(){
  console.log("untracked button clicked");
  console.log($(this).data("date"));
  untrackedDate = $(this).data("date");
});

$(".modal-save").on("click", function() {
  console.log("modal submit button clicked");
  if($activitySelection !== null && $moodSelection !== null){
    var day = {
      calendarDate: untrackedDate,
      mood: $moodSelection.data("value"),
      activity: $activitySelection.data("value"),
      UserId: userID
    }
    $moodSelection = null;
    $activitySelection = null;
    API.saveDay(day).then(res =>{
    //Close window and update calendar
    $updatedDateBlock = $('.untrackedbtn[data-date=' + untrackedDate +']').parent();
    $updatedDateBlock.addClass(day.mood);
    $updatedDateBlock.removeClass('Untracked');
    $updatedDateBlock.html(" " + day.mood +  "<br>" + day.activity + "<br>" + day.calendarDate);

    $('#exampleModal').modal('hide');
    $('.moodBtn').removeClass('selectedModalButton');
    $('.activityBtn').removeClass('selectedModalButton');
    });
  }
});


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