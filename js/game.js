Array.prototype.flatten = function(){
  var merged = [];
  return merged.concat.apply(merged, this);
};

function Game(string) {
  this.board = createBoard();

  function createBoard(){
    if(typeof string === 'undefined') {
      var array = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      var index1 = Math.floor(Math.random()*15)+1;
      var index2 = Math.floor(Math.random()*15)+1;

      while (index2 == index1) {
        var index2 = Math.floor(Math.random()*15)+1;
      };

      array[index1] = 2;
      array[index2] = 2;
      return array;
    } else{
      return string.split('');
    };
  };
};

Game.prototype.spawnBlock = function(){
  var zerosIndex = [];

  this.board.forEach(function(value, index){
    if(value == '0'){
      zerosIndex.push(index);
    };
  });

  var randIndex = Math.floor(Math.random()*zerosIndex.length);

  if(Math.random() < .9) {
    this.board[zerosIndex[randIndex]] = 2;
  } else {
    this.board[zerosIndex[randIndex]] = 4;
  };
};

Game.prototype.toString = function() {
  var displayBoard = this.board.map(function(value){return value});
  displayBoard.splice(12,0,'\n');
  displayBoard.splice(8,0,'\n');
  displayBoard.splice(4,0,'\n');
  return displayBoard.join('');
};

Game.prototype.rowChunk = function() {
  var newArray = [];

  for(i = 0; i < 16; i += 4) {
    newArray.push(this.board.slice(i, i + 4));
  };

  return newArray;
};

Game.prototype.columnChunk = function(array) {
  var newArray = [[],[],[],[]];

  array.forEach(function(value,index){
    newArray[index % 4].push(value);
  });

  return newArray;
};

Game.prototype.move = function(direction) {

  var rows = this.rowChunk();
  var columns = this.columnChunk(this.board);

  function reverseArrays(array) {
    return array.map(function(subArray) {
      return subArray.reverse();
    });
  };

  function extractZeros(array) {
    return array.map(function(subArray) {
      return subArray.filter(function(number) {
        return number != 0;
      });
    });
  };

  function checkMatch(array) {
    return array.map(function(subArray) {
      for(i = 0; i < subArray.length; i++) {
        if(subArray[i] === subArray[i + 1]) {
          subArray[i] = subArray[i] * 2;
          subArray.splice(i + 1, 1);
        };
      };
      return subArray;
    });
  };

  function addZeros(array) {
    return array.map(function(subArray) {
      while(subArray.length < 4) {
        subArray.push(0);
      };
      return subArray;
    });
  };

  function moveArray(array) {
    var array = extractZeros(array);
    var array = checkMatch(array);
    return addZeros(array);
  };

  function compareArrays(startBoard, endBoard) {
    var same = [];

    for(i = 0; i < 16; i++) {
      if(startBoard[i] == endBoard[i]) {
        same.push('yes');
      };
    };

    if(same.length === 16) {
      return false;
    } else {
      return  true;
    };
  };

  switch (direction) {
    case 'Left':
      var startBoard = this.board;
      var currentBoard = moveArray(rows);
      break;
    case 'Right':
      var startBoard = this.board;
      var currentBoard = reverseArrays(moveArray(reverseArrays(rows)));
      break;
    case 'Up':
      var startBoard = this.board;
      var currentBoard = moveArray(columns);
      var currentBoard = currentBoard.flatten();
      var currentBoard = this.columnChunk(currentBoard);
      break;
    case 'Down':
      var startBoard = this.board;
      var currentBoard = reverseArrays(moveArray(reverseArrays(columns)));
      var currentBoard = currentBoard.flatten();
      var currentBoard = this.columnChunk(currentBoard);
      break;
  }
  
  endBoard = currentBoard.flatten();
  if(compareArrays(startBoard, endBoard)) {
    this.board = endBoard;
    this.spawnBlock();
  };
};