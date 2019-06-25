FB.getLoginStatus(function(response) {
  if (response.status === "connected") {
    console.log(response.authResponse.accessToken);
    FB.api('/me', function(response) {
        console.log(JSON.stringify(response.id + " Name: " + response.name));
    });
  }
});