$(document).ready(function() {
  var gameController = new GameController();
  gameController.initialize();
});

function GameController(){
};

GameController.prototype.initialize = function(){
  this.game = new Game();
  this.updateDisplay();
  this.bindKeys();
};

GameController.prototype.updateDisplay = function(){
  this.game.board.forEach(function(value, index){
    var $tile = $('#' + (index + 1));
    $tile.html(value);
    $tile.removeClass();
    $tile.addClass('value-'+value);
  });
};

GameController.prototype.bindKeys = function(){
  var that = this;
  var directions = ['up', 'down', 'left', 'right'];

  for (i = 0; i < directions.length; i++) {
    Mousetrap.bind(directions[i], function() {
      that.game.move(event.keyIdentifier);
      that.updateDisplay();
    }, 'keyup');
  };
};