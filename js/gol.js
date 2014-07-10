window.GOL = {

  initialize: function () {
    this.createBoard();
    $(document).on("click", "#start_button", this.startGame.bind(this));

  },

  createBoard: function () {
    Board.initialize();
  },

  startGame: function () {
    alert("starting the game");
  }

}

window.Board = {

  initialize: function () {
    this.width = 10;
    this.height = 10;
    this.grid = [];
    this.createGrid();
    this.addGrid();
    $(document).on("click", "#game_board div", this.toggleCell.bind(this));
  },

  createGrid: function () {
    for (var x = 0; x < this.height; x++) {
      var new_column = [];
      for (var y = 0; y < this.width; y++) {
        var new_node = new Cell();
        new_node.initialize(x, y);
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

  toggleCell: function (event) {
    $thisCell = $(event.target)
    if ($thisCell.data().alive === "true") {
      $thisCell.data("alive", "false");
      $thisCell.removeClass('alive');
    } else {
      $thisCell.data("alive", "true");
      $thisCell.addClass('alive');

    }
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

  };

  Cell.prototype.node_div = function () {
    this.$element = "<div data-x='" + this.x + "' data-y='" + this.y + "' data-alive='false' class='node' id='node-" + this.x + "-" + this.y + "'></div>";
  };

  Cell.prototype.showMe = function () {
    console.log(this)
    alert("hey there")
  };

};