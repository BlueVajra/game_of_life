window.GOL = {

  initialize: function () {
    this.createBoard();
    this.testing = false;
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

//BOARD

window.Board = {

  initialize: function () {
    this.width = 50;
    this.height = 50;
    this.grid = [];
    this.createGrid();
    this.addGrid();
    this.timer = null;
    this.lifeGrid = null;
  },

  createGrid: function () {
    for (var x = 0; x < this.height; x++) {
      var new_column = [];
      for (var y = 0; y < this.width; y++) {
        var new_node = new Cell(x, y);
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
    this.changeLife();
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

  changeLife: function () {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        this.grid[x][y].changeLife();
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
        } else {
          aliveInfo.push(neighbors[i][1] + "-" + neighbors[i][0] + ":isDead ")
        }
      }
    }

    if (GOL.testing) console.log(x + "-" + y + ": " + aliveInfo.join(" | "))

    return alive
  }
};

//CELL

var Cell = function (x, y) {
  this.alive = false;
  this.next = false;
  this.x = x;
  this.y = y;
  this.$element = null;
  this.node_div();
  this.$element.on("click", this.toggle.bind(this));
};

Cell.prototype.node_div = function () {
  this.$element = $("<div data-alive='false' data-x='" + this.x + "' data-y='" + this.y + "' class='node' id='node-" + this.x + "-" + this.y + "'></div>");
};

Cell.prototype.toggle = function () {

  if (this.alive === true) {
    this.alive = false;
    this.$element.removeClass('alive');
  } else {
    this.alive = true;
    this.$element.addClass("alive")
  }
  if (GOL.testing) console.log(this.x + "-" + this.y)
};

Cell.prototype.changeLife = function () {
  if (this.alive != this.next) {
    this.toggle();
  }
};


Cell.prototype.nextLife = function () {
  aliveNeighbors = Board.neighborLife(this.x, this.y);
  testString = this.x + "-" + this.y + " "

  if (this.alive) {
    if (aliveNeighbors < 2) {
      testString += "I'm Alive with " + aliveNeighbors + " live neighbors: I will die - CHANGE"
      this.next = false
    } else if (aliveNeighbors === 2 || aliveNeighbors === 3) {
      testString += "I'm Alive with " + aliveNeighbors + " live neighbors: I will stay alive"
      this.next = true
    } else {
      testString += "I'm Alive with " + aliveNeighbors + " live neighbors: I will die - CHANGE"
      this.next = false
    }
  } else {
    if (aliveNeighbors === 3) {
      testString += "I'm Dead with " + aliveNeighbors + " live neighbors: I will come alive - CHANGE"
      this.next = true
    } else {
      testString += "I'm Dead with " + aliveNeighbors + " live neighbors: I will stay dead"
      this.next = false
    }
  }
  if (GOL.testing) console.log(testString);

};