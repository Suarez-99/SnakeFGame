document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('Cam');
    const ctx = canvas.getContext("2d");
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const cellSize = 20;

    canvas.width = window.innerWidth * 0.5;
    canvas.height = window.innerHeight * 0.5;

    const canvasx = Math.floor(canvas.width / cellSize);
    const canvasy = Math.floor(canvas.height / cellSize);

    let matrix = Array.from({ length: canvasx }, () => Array(canvasy).fill(0));
    let gameInterval;
    let paused = false;
    let secondsElapsed = 0;

    const game = {
        level: 1
    };

    const jugador = {
        x: 1,
        y: 1,
        dir: 1, // Initial direction set to right
        tam: 1,
        puntos: 0,
        matrizCola: [],
        xAnt: 0,
        yAnt: 0
    };

    const puntoComida = {
        x: 0,
        y: 0,
        comida: 1
    };

    function crearComid() {
        do {
            puntoComida.x = Math.floor(Math.random() * canvasx);
            puntoComida.y = Math.floor(Math.random() * canvasy);
        } while (matrix[puntoComida.x][puntoComida.y] === 1);
    }

    function renderComid() {
        ctx.fillStyle = "red";
        ctx.fillRect(puntoComida.x * cellSize, puntoComida.y * cellSize, cellSize, cellSize);
    }

    function renderMatriz() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        jugador.matrizCola.forEach(([x, y]) => {
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        });
        ctx.fillRect(jugador.x * cellSize, jugador.y * cellSize, cellSize, cellSize);
    }

    function renderizadorJugador() {
        jugador.xAnt = jugador.x;
        jugador.yAnt = jugador.y;

        switch (jugador.dir) {
            case 0: jugador.y -= 1; break;
            case 1: jugador.x += 1; break;
            case 2: jugador.y += 1; break;
            case 3: jugador.x -= 1; break;
        }

        jugador.x = (jugador.x + canvasx) % canvasx;
        jugador.y = (jugador.y + canvasy) % canvasy;

        for (let i = 0; i < jugador.matrizCola.length; i++) {
            if (jugador.matrizCola[i][0] === jugador.x && jugador.matrizCola[i][1] === jugador.y) {
                clearInterval(gameInterval);
                alert('Game Over! Press OK to restart.');
                window.location.reload();
                return;
            }
        }

        jugador.matrizCola.push([jugador.xAnt, jugador.yAnt]);
        if (jugador.matrizCola.length > jugador.puntos) {
            jugador.matrizCola.shift();
        }

        if (jugador.x === puntoComida.x && jugador.y === puntoComida.y) {
            jugador.puntos++;
            scoreDisplay.innerText = `Score: ${jugador.puntos}`;
            crearComid();
        }
    }

    function gameLoop() {
        renderizadorJugador();
        renderMatriz();
        renderComid();
    }

    function startGame() {
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 100);
    }

    function updateTimer() {
        setInterval(() => {
            if (!paused) {
                secondsElapsed++;
                timerDisplay.innerText = `Time: ${secondsElapsed}`;
            }
        }, 1000);
    }

    document.addEventListener("keydown", function(e) {
        if (e.keyCode === 32) { // Spacebar for pause/resume
            paused = !paused;
            if (paused) {
                clearInterval(gameInterval);
            } else {
                startGame();
            }
        } else if (!paused) {
            if (e.keyCode === 37 && jugador.dir !== 1) { // Left arrow
                jugador.dir = 3;
            } else if (e.keyCode === 38 && jugador.dir !== 2) { // Up arrow
                jugador.dir = 0;
            } else if (e.keyCode === 39 && jugador.dir !== 3) { // Right arrow
                jugador.dir = 1;
            } else if (e.keyCode === 40 && jugador.dir !== 0) { // Down arrow
                jugador.dir = 2;
            }
        }
    });

    document.getElementById('left').addEventListener('click', function() {
        if (jugador.dir !== 1) jugador.dir = 3;
    });

    document.getElementById('up').addEventListener('click', function() {
        if (jugador.dir !== 2) jugador.dir = 0;
    });

    document.getElementById('right').addEventListener('click', function() {
        if (jugador.dir !== 3) jugador.dir = 1;
    });

    document.getElementById('down').addEventListener('click', function() {
        if (jugador.dir !== 0) jugador.dir = 2;
    });

    crearComid();
    startGame();
    updateTimer();
});
