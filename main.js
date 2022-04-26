//CANVAS C
(function () {
    self.Board = function (width, height) {
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
        this.playing = false;
    };
    //BARRAS LATERALES MOVIMIENTO
    self.Board.prototype = {
        get elements() {
            var elements = this.bars.map(function (bar) {
                return bar;
            });
            elements.push(this.ball);
            return elements;
        },
    };
})();

//PELOTA C
(function () {
    self.Ball = function (x, y, radius, board) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed_y = 0;
        this.speed_x = 4;
        this.board = board;
        this.direction = 1;
        board.ball = this;
        this.kind = "circle";
    };

    //VELOCIDAD
    self.Ball.prototype = {
        move: function () {
            this.x = this.x + this.speed_x * this.direction;
            this.y += this.speed_y;
        },
    };
})();
//BARRAS C
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
        //PINTA
        draw: function () {
            for (let i = this.board.elements.length - 1; i >= 0; i--) {
                let el = this.board.elements[i];
                draw(this.ctx, el);
            }
        },
        //INICIO JUEGO 
        play: function () {
            if (this.board.playing) {
                this.clean();
                this.draw();
                this.board.ball.move();
            }
        },
    };

    function draw(ctx, element) {
        switch (element.kind) {
            case "rectangle":
                ctx.fillRect(element.x, element.y, element.width, element.height);
                break;
            case "circle":
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.radius, 0, 7);
                ctx.fill();
                ctx.closePath();
                break;
        }
    }
})();

//INICIAR CONSTRUCTORES CON VALORES
let board = new Board(800, 400);
let bar = new Bar(20, 100, 40, 100, board);
let bar_2 = new Bar(735, 100, 40, 100, board);
let canvas = document.getElementById("canvas");
let board_view = new BoardView(canvas, board);
let ball = new Ball(350, 100, 10, board);

//TECLADO
document.addEventListener("keydown", function (event) {
    //ARRIBA A ABAJO
    if (event.keyCode == 38) {
        event.preventDefault();
        bar.up();
    } else if (event.keyCode == 40) {
        event.preventDefault();
        bar.down();
    } else if (event.keyCode === 87) {
        event.preventDefault();
        // W
        bar_2.up();
    } else if (event.keyCode === 83) {
        event.preventDefault();
        // S
        bar_2.down();
    } else if (event.keyCode === 32) {
        event.preventDefault();
        board.playing = !board.playing;
    }
});

//PINTA EN PANTALLA
board_view.draw();

//ANIMACION 
window.requestAnimationFrame(controller);

setTimeout(function () {
    ball.direction = -1;
}, 4000);

//CONTROL JUEGO
function controller() {
    board_view.play();
    window.requestAnimationFrame(controller);
}