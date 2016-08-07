$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $(this).addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
});

webshim.polyfill('es5 forms');

// Generates a random guid ID

function guid() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4());
}

// Shuffle an array

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// Resize images to full screen when width changes

var initial_width = 0;

$(window).resize( function () {      
  var screenWidth = $(window).width() + "px";
  var screenHeight = $(window).height() + "px";
  if (screenWidth != initial_width) {
    $(".fullscreen").css({
      width: screenWidth,
      'min-height': screenHeight,
    }); 
    $('.overlay-mask').css({
      'height': screenHeight
    })
    initial_width = screenWidth;
  }
}).trigger('resize'); 

// Gallery

$('#gallery-images').children('img').wrap('<div>').each(function () {
  var self = $(this);
  self.parent().attr('data-zoom', self.attr('src'));
  if (!self.is('[data-original]')) {
    self.attr('src', self.attr('src').replace('.jpg', '_s.jpg'));
  }
  new Luminous(self.parent().get(0), { sourceAttribute: 'data-zoom'});
}).end().justifiedGallery({
  rowHeight: 250,
  lastRow: 'justify',
  margins: 0
});

$('#gallery-images img').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
  $(this).removeClass('animated').parent().one('mouseover click touch', function () { $(this).css('background', 'black'); });
});


// Fade out the logo on scroll

$(window).scroll(function(){
    $(".overlay-mask").removeClass('animated').css("opacity", 1 - $(window).scrollTop() / 400);
});

// Song selector - pick from pre-defined list of Spotify songs or search

var popular = ["3U4isOIWM3VvDubwSI3y7a", "22PMfvdz35fFKYnJyMn077", "34gCuhDGsG4bRPIf9bb02f", "6lanRgr6wXibZr8KgzXxBl", "0W4Kpfp1w2xkY3PrV714B7", "0VZ9xPNa6ROafP6GYYuv2S", "0IktbUcnAGrvD03AWnz3Q8", "1jyddn36UN4tVsJGtaJfem", "1EzrEOXmMH3G43AXT1y7pA", "6ZapsNk1ZpaebNXAIohP9R", "5OiaAaIMYlCZONyDBxqk4G", "6NPVjNh8Jhru9xOmyQigds", "7kWhdmRYv8CqbWNqfojqVd", "4T6HLdP6OcAtqC6tGnQelG", "5Hroj5K7vLpIG4FNCRIjbP", "05pKAafT85jeeNhZ6kq7HT", "1nd9moIZkGvWoHtReFqkRY", "0n4bITAu0Y0nigrz3MFJMb", "4VywXu6umkIQ2OS0m1I79y", "2jg4Yc8071puvDRYi22B3a", "7rPLZ8Krm6CZIbraFUlnWZ", "4myBMnNWZlgvVelYeTu55w", "2tUBqZG2AbRi7Q0BIrVrEj", "0Vpswx5knuuXW8HmNK1LrT", "7BqBn9nzAq8spo5e7cZ0dJ", "5IVuqXILoxVWvWEPm82Jxr", "4vp2J1l5RD4gMZwGFLfRAu", "4vfioWSgbZSVwsYtPS1a6s", "3AszgPDZd9q0DpDFt4HFBy", "77NNZQSqzLNqh2A9JhLRkg", "5R9a4t5t5O0IsznsrKPVro", "6zC0mpGYwbNTpk9SKwh08f", "3ogtSrlbtiTamktbA0hw0E", "3XyU03WycJQ02kExHb9dqW", "7jJH8F3PHlNvxfqEAAfFDl", "32OlwWuMpZ6b0aN2RZOeMS", "3s4U7OHV7gnj42VV72eSZ6", "5nNmj1cLH3r4aA4XDJ2bgY", "4oeRfmp9XpKWym6YD1WvBP", "0Cvjlph1WGbwZY1PlMEtJY", "07Tx168RSsUS1HqkDIOZbH", "3oiMJQAWVaxSubJ7b2VUtX", "3bidbhpOYeV4knp8AIu8Xn", "0ZPfDxZn5O0L84wvPSN2iG", "55h7vJchibLdUkxdlX3fK7", "5FJVAEAZ6FRSfQPaJylSFG", "4h8VwCb1MTGoLKueQ1WgbD", "69kOkLUCkxIZYexIgSG8rq", "42loEE51UDcecom9K8K4ei", "1fujSajijBpJlr5mRGKHJN"];

var tracksearch = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('id'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: {
    url: 'https://api.spotify.com/v1/search?q=%QUERY&type=track',
    wildcard: '%QUERY',
    transform: function (data) {
      return data.tracks.items;
    }
  }
});

var tracksuggest = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('id'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: {
    url: 'https://api.spotify.com/v1/tracks?ids=' + shuffle(popular).slice(0, 10).join(','),
    wildcard: '%QUERY',
    transform: function (data) {
      return data.tracks;
    }}
});

$('.track-preview').on('playpause', function (e, play_status) {
  var self = $(this);

  if (play_status === undefined && self.data('play') === false) {
    self.get(0).play();
    self.data('play', true);
    $('.track-control .control-label').text('Pause');
    $('.track-control .glyphicon').addClass('glyphicon-pause').removeClass('glyphicon-play');
  } else {
    self.get(0).pause();
    self.data('play', false);
    $('.track-control .control-label').text('Preview');
    $('.track-control .glyphicon').removeClass('glyphicon-pause').addClass('glyphicon-play');
  }
}).on('ended', function(){
  $(this).trigger('playpause', [false]);
}).trigger('playpause', [false]);

$('.search-song').typeahead({ minLength: 0 }, {
  name: 'spotify-songs',
  display: function (s) {
    return s.name + ' by ' + s.artists[0].name;
  },
  templates: {
    suggestion: Handlebars.compile('<div><img src="{{album.images.2.url}}" width="40" height="40" class="pull-left" style="margin-right: 5px;" /> <strong style="width: 100%; overflow: hidden;">{{name}}</strong> <br/> <small>{{artists.0.name}}</small></div>')
  },
  source: function (query, sync, async) {
    if (query === '') {
      tracksuggest.search('marry', sync, async);
    } else {
      tracksearch.search(query, sync, async);
    }
  }
}).bind('typeahead:select', function(ev, suggestion) {
  $('.track')
    .removeClass('hidden')
    .find('.track-name').text(suggestion.name).end()
    .find('.track-artist').text(suggestion.artists[0].name).end()
//      .find('.track-image').attr('src', suggestion.album.images[0].url).end()
    .find('.track-url').attr('value', suggestion.external_urls.spotify).end()
    .find('.track-preview').attr('src', suggestion.preview_url).end()

    $('.track-preview').trigger('playpause', [false]);
});

$('.track-control').on('click', function () {
  $('.track-preview').trigger('playpause');
});


/* $('.section-heading').addClass('animated bounce infinite');/*.on('mouseout', function () {
  $(this).removeClass('animated bounce').addClass('animated bounce').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {  
      $(this).removeClass('animated bounce')
  });
});*/

$('input[type=number]').on('click', function () { $(this).select(); });

// ScrollReveal plugin setup

window.sr = ScrollReveal({ reset: true, viewFactor: 0.6, delay: 100, duration: 350 });

$('[data-sr]').each(function () {
  var self = $(this);
  self.attr('id', 'sr-' + guid());
  sr.reveal('#' + self.attr('id'), self.data('sr'));
});

// Bootstrap tooltip

$('[data-toggle="tooltip"]').tooltip();

// RSVP submit form

$('#rsvp form').on('submit', function () {
  var self = $(this);
  var rsvp = self.closest('.rsvp-container');

  rsvp.addClass('animated ' + self.data('animation-out')).removeClass('infinite');

  $.ajax({
    data: self.serialize(),
    type: 'POST',
    url: self.attr('action'),
    complete: function () {
      scrollTo(0, $('#rsvp').offset().top);
      $(document).trigger('resize').trigger('scroll');
      //$('#rsvp').removeAttr('style');
      self.remove();
      $('.rsvp-thankyou').removeClass('hidden').addClass('animated ' + self.data('animation-in'));
    }
  })
  return false;
});

// Update attenance form submit button icon

$('.attenance input').on('change', function () {
  if ($(this).data('active-class')) {
    $('.submit .glyphicon').removeAttr('class').addClass('glyphicon').addClass($(this).data('active-class'));
  } else { 
    $('.submit .glyphicon').removeAttr('class').addClass('glyphicon glyphicon-send');
  }
})

// Smooth scrolling

smoothScroll.init();

$(function () {
    setTimeout(function () {
      $('.overlay-mask').removeClass('hidden').addClass('animated fadeIn');

      $.firefly({
          color: '#ffffff',
          minPixel: 1,
          maxPixel: 2,
          total : 15,
          on: '#masthead'
      });

      var timeout = setInterval(function () {
        if ($('#masthead').height() > 0) {
          $('.loader').addClass('fadeOut animated');

          setTimeout(function () {
            $('.loader').remove();
            clearInterval(timeout);
          }, 500);
        }
      }, 300);

      setTimeout(function () {
        clearInterval(timeout);
      }, 8000);

      $('.wiggle').mouseover(function () {
        $(this).animateCss('swing');
      })

      new WOW({ offset: 100, live: false}).init();
    }, 500);
});