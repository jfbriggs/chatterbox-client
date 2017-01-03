
var ChatterBox = function() {
  this.server = 'https://api.parse.com/1/classes/messages';
};

ChatterBox.prototype.init = function () {
  this.fetch();
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
          if (this.escapeHtml(message.roomname) === room) {
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
  $('.messages').append('<li>' + this.escapeHtml(message.username) + ': ' + this.escapeHtml(message.text) + '</li>');
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


var app = new ChatterBox();
app.init();


var message = {
  username: 'shawndrost',
  text: '<script>something</script>',
  roomname: '4chan'
};
