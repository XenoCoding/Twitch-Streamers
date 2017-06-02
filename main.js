$(document).ready(function() {

  //these are the base links for channels and streams
  var twitchChannels = "https://wind-bow.glitch.me/twitch-api/channels/";
  var twitchStreams = "https://wind-bow.glitch.me/twitch-api/streams/";

  //these variables are being declared here so that they are global. they will be used in functions later
  var channel;
  var channelLink;
  var channelLogo;
  var channelName;
  var channelRow;
  var channelStream;
  var notStreaming;
  var stream;
  var streaming;
  var channelVideo;
  var channelBanner;

  //this array is the base list of users when the page first loads. the list is subject to change
  var streamers = [
    "freecodecamp",
    "CodingTutorials360",
    "Slinned",
    "VGBootcamp",
    "ThrowdownTV",
    "TwinGalaxiesLive",
    "iDevelopThings",
    "CaptainKraft",
    "anthonyz_",
    "Xiceman126",
    "BeyondTheSummit",
    "The8BitDrummer"
  ];

  //grabs all the HTML elements that I will be needing to alter
  var addStreamer = $("#addStreamer");
  var all = $("#all");
  var offline = $("#offline");
  var online = $("#online");
  var streamerButton = $("#streamerButton");
  var streamersContainer = $(".streamers");
  var warning = $("#warning");

  function addNewStreamer(){

    // we make another getJSON call so that we can see if the channel the user submitted exists.
    $.getJSON(
      "https://wind-bow.glitch.me/twitch-api/channels/" + addStreamer.val(),
      function(data) {
        //if the channel does not exist, then we tell the user inside our warning element.
        if (data.error) {
          warning.append("That twitch account does not exist!");
        } else if (jQuery.inArray(addStreamer.val(), streamers) != -1) {
          // we also want to check to see if we are already displaying that channel
          warning.append("That twitch account is already on the list!");

          //if the channel exists and it's not already on the list, then we add the channel to our list of channels and we update the streamers.
        } else {
          streamers.push(addStreamer.val());
          updateStreamers();
        }
      }
    );
  }

  //this is called whenever the list of streams needs to be displayed again
  function updateStreamers() {
    //first empties the current streamers
    streamersContainer.html("");

    //loops through all of the streamers in the array
    for (let i = 0; i < streamers.length; i++) {

      // sets up the links for each individual streamer
      channel = twitchChannels + streamers[i] + "?callback=?";
      stream = twitchStreams + streamers[i] + "?callback=?";

      // creates the HTML for each streamer's row. ids are created based on the streamer
      streamersContainer.append(
        "<a href='' id='" +
          streamers[i] +
          "link' target='_blank'><div class='row channelRow' id='" +
          streamers[i] +
          "Row'><div class='col-sm-12'><img src='' id='" +
          streamers[i] +
          "logo' class='channelLogos'/><span class='channelNames' id='" +
          streamers[i] +
          "name'></span><br /><span class='channelStreams' id = '" +
          streamers[i] +
          "stream'></span><div id='" +
          streamers[i] +
          "Video' class='channelVideos'></div></div></div></a>"
      );

      // makes the first getJSON call, retrieving data about the streamer's channel
      $.getJSON(channel, function(channelData) {
        // accesses the HTML elements we just created based on their id. that way we get each individual one
        channelLogo = $("#" + streamers[i] + "logo");
        channelName = $("#" + streamers[i] + "name");
        channelLink = $("#" + streamers[i] + "link");
        channelRow = $("#" + streamers[i] + "Row");

        //uses the data retrieved to create a url property for the channel's banner
        channelBanner = 'url("' + channelData.profile_banner + '")';

        //changes the channel's background image to the channel banner, as well as creates the logo image, the channel name, and the link to the channel.
        channelRow.css("background-image", channelBanner);
        channelLogo.attr("src", channelData.logo);
        channelName.html(channelData.display_name);
        channelLink.attr("href", channelData.url);

        //this adds a title to the row, telling the user what game the channel plays
        channelRow.attr("title", channelData.game);

        //adds some styling for the background image.
        channelRow.css("background-size", "cover");
        channelRow.css("background-position", "center");
      });

      //all of the channel rows should be created. now we want to grab additional information and use it if the channel is streaming
      $.getJSON(stream, function(streamData) {

        channelStream = $("#" + streamers[i] + "stream");

        //this will return true if the channel is currently streaming
        if (streamData.stream) {
          console.log(streamData.stream);
          //we add the "streaming" class to the row to give it relevant css properties
          channelRow.addClass("streaming");

          //we display the name of the stream
          channelStream.html(streamData.stream.channel.status);
          channelStream.css("display", "block");

          //we give the name of the channel a background color of blue
          channelName.css("background-color", "#3500D3");

          // we store all of the streaming channels so that we can use it later
          streaming = $(".streaming");
        } else {
          // if the channel is not streaming, then we add the "notStreaming" class to the channel to give it the relevant css properties, and also store those elements in a variable.
          channelRow.addClass("notStreaming");
          notStreaming = $(".notStreaming");
        }
      });
    }
  }

  // calls the function when the user submits the name of the streamer he wants to display
  streamerButton.click(function() {

    if(addStreamer.val){
      //clears the warning's html so it can display something new if it needs to
      warning.html('');

      addNewStreamer();
    }

  });

  addStreamer.keypress(function(e) {

    if(addStreamer.val && e.which == 13){
      warning.html('');

      addNewStreamer();
    }

  });

  //ROWS TO HIDE OR DISPLAY
  all.click(function() {
    streaming.show();
    notStreaming.show();
  });

  online.click(function() {
    streaming.show();
    notStreaming.hide();
  });

  offline.click(function() {
    streaming.hide();
    notStreaming.show();
  });

  //updates the streamers once the page has loaded
  updateStreamers();
  
});
