window.GOL = {

  initialize: function () {
    this.createBoard();
    this.testing = false
    $(document).on("click", "#start_button", this.startGame.bind(this));
    $(document).on("click", "#stop_button", this.stopGame.bind(this));

  },

  createBoard: function () {
    Board.initialize();
  },

  startGame: function () {
    Board.startTimer();
  },

  stopGame: function () {
    Board.stopTimer();
  }

}

window.Board = {

  initialize: function () {
    this.width = 50;
    this.height = 50;
    this.grid = [];
    this.createGrid();
    this.addGrid();
    this.timer = null;
    this.lifeGrid = null;
    $(document).on("click", "#game_board div", this.clickedDiv.bind(this));
  },

  createGrid: function () {
    for (var x = 0; x < this.height; x++) {
      var new_column = [];
      for (var y = 0; y < this.width; y++) {
        var new_node = new Cell();
        new_node.initialize(x,y);
        new_column.push(new_node)
      }
      this.grid.push(new_column);
    }
  },

  addGrid: function () {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        $html = this.grid[x][y].$element;
        $('#game_board').append($($html));
      }
      $('#game_board').append('<br />');
    }
  },

  clickedDiv: function (event) {
    $thisCell = $(event.target);
    this.toggleCell($thisCell);
  },

  changeCell: function(x,y){
    $thisCell = $("#node-"+ x +"-"+ y);
    this.toggleCell($thisCell);
  },

  toggleCell: function (currentCell) {
    $thisCell = currentCell
    a = $thisCell.data().x;
    b = $thisCell.data().y;

    this.grid[a][b].toggle();

    if ($thisCell.data().alive === true) {
      $thisCell.data("alive", false);
      $thisCell.removeClass('alive');
    } else {
      $thisCell.data("alive", true);
      $thisCell.addClass('alive');
    }
    if (GOL.testing) console.log($thisCell.data())
  },

  startTimer: function () {
    this.timer = setInterval(function () {
      Board.Tick();
    }, 200);
  },

  stopTimer: function () {
    clearInterval(this.timer);
  },

  Tick: function () {
    this.checkLife();
    this.nextLife();
  },

  checkLife: function () {
    this.lifeGrid = []

    for (var y = 0; y < this.height; y++) {
      var new_row = [];
      for (var x = 0; x < this.width; x++) {
        new_row.push(this.grid[x][y].alive)
      }
      this.lifeGrid.push(new_row);
    }

    if (GOL.testing) console.log("---" + this.lifeGrid + "---")
  },

  nextLife: function () {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        this.grid[x][y].nextLife();
      }
    }
  },

  neighborLife: function (x, y) {
    var neighbors = [
      [x - 1, y],
      [x + 1, y],
      [x - 1, y - 1],
      [x, y - 1],
      [x + 1, y - 1],
      [x - 1, y + 1],
      [x, y + 1],
      [x + 1, y + 1]
    ]

    var aliveInfo = []
    var alive = 0
    for (var i = 0; i < 8; i++) {
      if ((neighbors[i][0] >= 0 && neighbors[i][0] < this.width) && (neighbors[i][1] >= 0 && neighbors[i][1] < this.height)) {
        if (this.lifeGrid[neighbors[i][1]][neighbors[i][0]]) {
          alive++
          aliveInfo.push(neighbors[i][1] + "-" + neighbors[i][0] + ":isAlive ")
        }else{
          aliveInfo.push(neighbors[i][1] + "-" + neighbors[i][0] + ":isDead ")
        }
      }
    }

    if (GOL.testing) console.log(x + "-" + y + ": " + aliveInfo.join(" | "))

    return alive
  }
};

var Cell;
Cell = function Cell() {

  Cell.prototype.initialize = function (x, y) {
    this.alive = false;
    this.x = x;
    this.y = y;
    this.$element = null;
    this.node_div();
    this.id = "#node-" + this.x + "-" + this.y;
    this.node = $(document).find($(this.id[0]))
  };

  Cell.prototype.node_div = function () {
    this.$element = "<div data-alive='false' data-x='" + this.x + "' data-y='" + this.y + "' class='node' id='node-" + this.x + "-" + this.y + "'></div>";
  };

  Cell.prototype.toggle = function () {

    if (this.alive === true) {
      this.alive = false;
    } else {
      this.alive = true;
    }
    if (GOL.testing) console.log(this.x + "-" + this.y)
  };

  Cell.prototype.nextLife = function () {
    aliveNeighbors = Board.neighborLife(this.x, this.y);
    testString = this.x + "-" + this.y + " "

    if(this.alive){
      if(aliveNeighbors < 2){
        testString += "I'm Alive with " + aliveNeighbors + " live neighbors: I will die - CHANGE"
        Board.changeCell(this.x,this.y)
      }else if(aliveNeighbors === 2 || aliveNeighbors === 3){
        testString += "I'm Alive with " + aliveNeighbors + " live neighbors: I will stay alive"
      }else{
        testString += "I'm Alive with " + aliveNeighbors + " live neighbors: I will die - CHANGE"
        Board.changeCell(this.x,this.y)
      }
    }else{
      if(aliveNeighbors === 3){
        testString += "I'm Dead with " + aliveNeighbors + " live neighbors: I will come alive - CHANGE"
        Board.changeCell(this.x,this.y)
      }else{
        testString += "I'm Dead with " + aliveNeighbors + " live neighbors: I will stay dead"
      }
    }
    if (GOL.testing) console.log(testString);

  };
};