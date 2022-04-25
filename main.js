(function () {
    self.Board = function (width, height) {
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
    };
    self.Board.prototype = {
        get elements() {
            let elements = this.bars;
            elements.push(this.ball);
            return elements;
        },
    };
})();


(function () {
    self.Ball = function (x, y, radius, board) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.speed_y = 0;
      this.speed_x = 3;
      this.board = board;
      board.ball = this;
      this.kind = "circle";
    };
  })();

(function () {
    self.Bar = function (x, y, width, height, board) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 5;
    };

    self.Bar.prototype = {
        down: function () {
            this.y += this.speed;
        },
        up: function () {
            this.y -= this.speed;
        },
        toString: function () {
      return "x: " + this.x + " y: " + this.y;
    },
    };
})();

(function () {
    self.BoardView = function (canvas, board) {
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    };
    self.BoardView.prototype = {
        clean: function () {
            this.ctx.clearRect(0, 0, this.board.width, this.board.height);
          },
        draw: function () {
            for (let i = this.board.elements.length - 1; i >= 0; i--) {
                let el = this.board.elements[i];
                draw(this.ctx, el);
            }
        },
        play: function () {
            this.clean();
            this.draw();
          },
    };
    function draw(ctx, element) {
           // if (element !== null && element.hasOwnProperty("kind")) {
    switch (element.kind) {
        case "rectangle":
          ctx.fillRect(element.x, element.y, element.width, element.height);
          break;
        case "circle":
          ctx.arc(element.x,element.y,element.radius,0,7);
          ctx.fill();
          ctx.closePath();
          break;
        }
    }
})();

let board = new Board(800, 400);
let bar = new Bar(20, 100, 40, 100, board);
let bar_2 = new Bar(735, 100, 40, 100, board);
let canvas = document.getElementById("canvas");
let board_view = new BoardView(canvas, board);
let ball = new Ball(350,100,10,board);

document.addEventListener("keydown", function (event) {
    event.preventDefault();
    if (event.keyCode == 38) {
        bar.up();
    } else if (event.keyCode == 40) {
        bar.down();
    } else if (event.keyCode === 87) {
        // Movimiento W
        bar_2.up();
      } else if (event.keyCode === 83) {
        // Movimiento S
        bar_2.down();
    }

    
});

// window.addEventListener("load", main);
window.requestAnimationFrame(controller);
//Antes main
function controller() {
  board_view.play();
  // board_view.clean();
  // board_view.draw()
  window.requestAnimationFrame(controller);
}