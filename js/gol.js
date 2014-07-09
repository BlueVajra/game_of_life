window.GOL = {

  initialize: function () {
    this.createBoard()

  },

  createBoard: function () {
    Board.initialize();
  }

}

window.Board = {

  initialize: function () {
    this.width = 10;
    this.height = 10;
    this.grid = []
    this.createGrid();
    this.addGrid();


  },

  createGrid: function () {
    for (var x = 0; x < this.height; x++) {
      var new_column = []
      for (var y = 0; y < this.width; y++) {
        var new_node = new Cell();
        new_node.initialize(x, y);
//        new_column.push(new Node.initialize(x,y));
        new_column.push(new_node)
      }
      this.grid.push(new_column);
    }
  },

  addGrid: function () {
    for (var x = 0; x < this.height; x++) {
      for (var y = 0; y < this.width; y++) {
        $html = this.grid[x][y].$element
        $('#game_board').append($html)
      }
      $('#game_board').append('<br />');
    }
  }
}

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
    this.$element = "<div id='node-" + this.x + "-" + this.y + "'></div>"
  };


}

