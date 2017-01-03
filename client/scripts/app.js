var app = {};

$(document).ready(function() {
  var ChatterBox = function() {
    this.server = 'https://api.parse.com/1/classes/messages';
  };

  ChatterBox.prototype.init = function () {
    this.fetch();
    var context = this;

    $('#roomSelect').on('change', function(e) {
      context.clearMessages();
      context.fetch(this.options[e.target.selectedIndex].value);
    });

    $('#submit-message').on('click', function(e) {
      var text = $(this).parent().find('input[name="message"]').val();
      var username = 'bob';
      var roomname = $('#roomSelect').find(':selected').text();
      console.log(roomname);
    });
  };

  ChatterBox.prototype.send = function (message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  };

  ChatterBox.prototype.fetch = function (room) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      success: function (data) {
        for (var message of data.results) {
          if (room) {
            if (room === 'All' || this.escapeHtml(message.roomname) === room) {
              this.renderMessage(message);
            }
          } else {
            this.renderMessage(message);
          }
          this.renderRoom(message);
        }
        console.log('chatterbox: Fetch Successful');
      }.bind(this),
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch', data);
      }
    });
  };

  ChatterBox.prototype.clearMessages = function () {
    $('.messages > li').remove();
  };

  ChatterBox.prototype.renderMessage = function (message) {
    var created = new Date(message.createdAt);
    var month = created.getMonth() + 1;
    var day = created.getDate();
    var year = created.getFullYear();
    var hours = created.getHours();
    var mins = created.getMinutes();
    var seconds = created.getSeconds();
    var milli = created.getMilliseconds();
    var timeStamp = month + '/' + day + '/' + year + ' ' + hours + ':' + mins + ':' + seconds + ':' + milli;
    $('.messages').prepend('<li>' + timeStamp + ' ' + this.escapeHtml(message.username) + ': ' + this.escapeHtml(message.text) + '</li>');
  };

  ChatterBox.prototype.renderRoom = function (message) {
    var currentRoom = this.escapeHtml(message.roomname);
    var rooms = $('#roomSelect').children('option');

    for (var i = 0; i < rooms.length; i++) {
      if (rooms[i].value === currentRoom) {
        return;
      }
    }
    $('#roomSelect').append('<option value="' + currentRoom + '">' + currentRoom + '</option>');
  };

  ChatterBox.prototype.escapeHtml = function (string) {
    var entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;'
    };

    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  };

  app = new ChatterBox();
  app.init();

});


var message = {
  username: 'shawndrost',
  text: '<script>something</script>',
  roomname: '4chan'
};
