$(document).ready(function () {
  window.fbAsyncInit = function() {
      FB.init({
        appId      : '801314679940599',
        xfbml      : true,
        version    : 'v2.2'
      });

      // ADD ADDITIONAL FACEBOOK CODE HERE

      // Place following code after FB.init call.


      // Events

      $(".js-cancel-options").click(function (ev) {
        ev.preventDefault();
        removeSlideShowOptions();
      });

      $(".js-okay-options").click(function (ev) {
        ev.preventDefault();
        onClickOkay(ev);
      });

      $(".js-seconds-slider").bind("change", function () {
        var slideValue = $(".js-seconds-slider").val();
        $(".js-seconds-label").html(slideValue);
      });

      function updateTextInput(val) {
        $(".js-seconds-slider").val(val);
        $(".js-seconds-slider").html(val);
      }

      var SlideShow = function (albumId) {
        return {
          attendees: [],
          photos: [],
          secondsPerSlide: 7,
          albumId: albumId
        };
      };

      function onLogin(response) {
        if (response.status == 'connected') {
          listAlbums();
          FB.api('/me?fields=first_name,photos', function(data) {
            console.log(data);
            var welcomeBlock = document.getElementById('fb-welcome');
            welcomeBlock.innerHTML = 'Hello, ' + data.first_name + '!';
          });
        }
      }

      function listAlbums () {
        FB.api('/me/albums', function(data) {
          console.log(data);
          var $eventRadio = $(".js-album-radio");
          $.each(data.data, function (i, fbAlbum) {
            console.log(fbAlbum);
            $eventRadio.append("<div class='album-block' id=" + fbAlbum.id + ">"
              + fbAlbum.name + "</div>");
          });
          $(".album-block").on("click", function (ev) {
            this.show = startNewSlideShow(ev.target.id);
            showSlideShowOptions();
          });
        });
      }

      function showSlideShowOptions () {
        $(".js-slide-show-options").removeClass("hide-content");
        $(".js-instructions").addClass("overlay");
      }

      function removeSlideShowOptions () {
        $(".js-slide-show-options").addClass("hide-content");
        $(".js-instructions").removeClass("overlay");
      }

      function onClickOkay (ev) {
        removeSlideShowOptions();
        console.log(ev);
        getAlbumPhotos(this.show.albumId);
      }

      function startNewSlideShow (albumId) {
        return new SlideShow(albumId);
      }

      function getAlbumPhotos (fbAlbumId) {
        FB.api('/' + fbAlbumId + '/photos', function (data) {
          slideShow.photos = data.data;
          console.log(data);
        });
      }

      function getPhotosWithAttendee (attendeeId) {
        FB.api('/' + attendeeId + '/photo/', function (data) {
          console.log(data);
        });
      }

      function onClickAlbum (ev) {
        var fbAlbum = ev.target;
        var slideShow = new SlideShow();
        getAlbumPhotos(fbAlbum.id, slideShow);
      }

      FB.getLoginStatus(function(response) {
        // Check login status on load, and if the user is
        // already logged in, go directly to the welcome message.
        if (response.status == 'connected') {
          onLogin(response);
        } else {
          // Otherwise, show Login dialog first.
          FB.login(function(response) {
            onLogin(response);
          }, {scope: 'user_friends, email, user_events, user_photos'});
        }
      });
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  });