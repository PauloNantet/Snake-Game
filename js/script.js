const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score--value");
const finalSore = document.querySelector(".final-score > span"); // Pega o span dentro do .final-score
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

const audio = new Audio("../assets/audio.mp3");

// Tamanha de cada parte da cobrinha
const size = 30;

// A cobrinha será um Array
const initialPosition = { x: 0, y: 0 };

let snake = [initialPosition];

// Contagem de pontos
const inclementScore = () => {
  // Atualiza o texto do elemento Score somando 10 ao valor atual
  // Score.innerText = score.innerText + 10;

  // Converte o texto do elemento score para um número inteiro, soma 10 e atualiza o texto do elemento com o novo valor.
  // score.innerText = parseInt(score.innerText) + 10;
  score.innerText = +score.innerText + 10; // Forma simplificada
};

// Gerando número aleatório
const randomNumber = (min, max) => {
  // Gera um número aleatório entre min e max, arredondado para o inteiro mais próximo
  return Math.round(Math.random() * (max - min) + min);
};

const randomPosition = () => {
  // define number como um valor aleatório entre 0 e a largura do canvas, menos o valor de size
  const number = randomNumber(0, canvas.width - size);
  // Arredonda number para o múltiplo de 30 mais próximo
  return Math.round(number / 30) * 30;
};

const randomColor = () => {
  const red = randomNumber(0, 255); // Gera um número aleatório entre 0 e 255
  const green = randomNumber(0, 255); // Gera um número aleatório entre 0 e 255
  const blue = randomNumber(0, 255); // Gera um número aleatório entre 0 e 255

  return `rgb(${red}, ${green}, ${blue} )`;
};

// A comida será um objeto
const food = {
  x: randomPosition(),
  y: randomPosition(),
  color: randomColor(),
};

let direction,
  loopId,
  gameActive = true;

// Desenhando a comida
const drawFood = () => {
  const { x, y, color } = food;

  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
  ctx.shadowBlur = 0;
};

// Criando a cobrinha
const drawSnake = () => {
  // Cor da cobrinha
  ctx.fillStyle = "#ddd";

  snake.forEach((position, index) => {
    // Cor da cabeça da cobrinha
    // Para cada posição no array snake, se a posição for a última (com índice snake.length - 1), define a cor de preenchimento (fillStyle) como branca (#fff)
    if (index == snake.length - 1) {
      ctx.fillStyle = "#fff";
    }

    ctx.fillRect(position.x, position.y, size, size);
  });
};

// Movendo a cobrinha
const movieSnake = () => {
  if (!direction) return;
  const head = snake[snake.length - 1];

  if (direction == "right") {
    snake.push({ x: head.x + size, y: head.y });
  }
  if (direction == "left") {
    snake.push({ x: head.x - size, y: head.y });
  }
  if (direction == "down") {
    snake.push({ x: head.x, y: head.y + size });
  }
  if (direction == "up") {
    snake.push({ x: head.x, y: head.y - size });
  }
  snake.shift();
};

// Desenhando as linhas
const drawGrid = () => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#191919";

  // Looping para desenhar as linhas
  for (let i = 30; i < canvas.width; i += 30) {
    ctx.beginPath();
    ctx.lineTo(i, 0);
    ctx.lineTo(i, 600);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(0, i);
    ctx.lineTo(600, i);
    ctx.stroke();
  }
};

// Checar se a cobrinha comeu a comida
const checkEat = () => {
  const head = snake[snake.length - 1];

  if (head.x == food.x && head.y == food.y) {
    inclementScore();

    snake.push(head);
    audio.play();

    let x = randomPosition();
    let y = randomPosition();

    while (snake.find((position) => position.x == x && position.y == y)) {
      x = randomPosition();
      y = randomPosition();
    }

    food.x = x;
    food.y = y;
    food.color = randomColor();
  }
};
// Checar a colisão
const checkCollision = () => {
  const head = snake[snake.length - 1];
  const canvasLimit = canvas.width - size;
  const neckIndex = snake.length - 2;

  const wallCollision =
    head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

  const selfCollision = snake.find((position, index) => {
    return index < neckIndex && position.x == head.x && position.y == head.y;
  });

  if (wallCollision || selfCollision) {
    // alert("Voce Perdeu!");
    gameOver();
  }
};
// Game Over
const gameOver = () => {
  gameActive = false; // Desabilita o controle
  direction = undefined;

  menu.style.display = "flex";
  finalSore.innerText = score.innerText;
  canvas.style.filter = "blur(4px)";

  ctx.clearRect(0, 0, 600, 600);
};

// Looping do game
const gameLoop = () => {
  if (!gameActive) return
  // Para o looping anterior para evitar erros
  clearInterval(loopId);
  // limpa a tela para fazer um novo desenho
  ctx.clearRect(0, 0, 600, 600);
  // Desenha o grid (as linhas)
  drawGrid();
  // Desenhando a comida
  drawFood();
  // Atualiza os valores da cobrinha
  movieSnake();
  // Desenha a cobrinha
  drawSnake();
  // checa a comida
  checkEat();
  // checa a colisão
  checkCollision();
  // Define a tempo e velocidade do looping
  loopId = setTimeout(() => {
    gameLoop();
  }, 100);
};

gameLoop();

document.addEventListener("keydown", ({ key }) => {
  if (!gameActive) return;
  if (key == "ArrowRight" && direction != "left") {
    direction = "right";
  }
  if (key == "ArrowLeft" && direction != "right") {
    direction = "left";
  }
  if (key == "ArrowDown" && direction != "up") {
    direction = "down";
  }
  if (key == "ArrowUp" && direction != "down") {
    direction = "up";
  }
});

buttonPlay.addEventListener("click", () => {
  score.innerText = "00";
  menu.style.display = "none";
  canvas.style.filter = "none";

  snake = [initialPosition];
  direction = undefined; // Reseta a direção
  gameActive = true; // Ativa o jogo novamente
  gameLoop(); // Inicia o loop do jogo
});
