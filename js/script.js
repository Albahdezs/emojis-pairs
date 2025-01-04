let flippedCards = [];
let matchedCards = 0;
let startTime;
let timer;
let gameActive = false;
let timerStarted = false; // Flag para saber si el cronómetro ya comenzó

const cardIcons = ["🍎", "🍌", "🍓", "🍇", "🍉", "🍊", "🍍", "🍑", "🍎", "🍌", "🍓", "🍇", "🍉", "🍊", "🍍", "🍑"];
const gameBoard = document.getElementById("game-board");
const timerDisplay = document.getElementById("timer");
const historyTable = document.getElementById("history-table");
const resetButton = document.getElementById("reset-btn");

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startTimer() {
  if (!gameActive) return;

  const elapsedTime = Math.floor((new Date() - startTime) / 1000); // Tiempo transcurrido en segundos

  // Calcular las horas, minutos y segundos
  const hours = Math.floor(elapsedTime / 3600);
  const minutes = Math.floor((elapsedTime % 3600) / 60);
  const seconds = elapsedTime % 60;

  // Formatear el tiempo a formato 00:00:00
  const formattedTime = `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`;
  timerDisplay.textContent = `Tiempo: ${formattedTime}`;

  // Llamar a startTimer cada segundo
  timer = setTimeout(startTimer, 1000);
}

// Función auxiliar para asegurarse de que las horas, minutos y segundos tengan siempre 2 dígitos
function padTime(time) {
  return time < 10 ? `0${time}` : time;
}

function handleCardClick(event) {
  const clickedCard = event.target;

  // Evitar hacer clic en la carta ya emparejada o si ya hay 2 cartas volteadas
  if (flippedCards.length === 2 || clickedCard === flippedCards[0] || clickedCard.classList.contains("matched")) {
    return;
  }

  // Si es el primer clic, iniciar el cronómetro
  if (!timerStarted) {
    timerStarted = true;
    startTime = new Date(); // Inicializa la hora de inicio
    startTimer(); // Comienza el cronómetro
  }

  // Voltear la carta
  clickedCard.classList.add("flipped");
  clickedCard.textContent = clickedCard.getAttribute("data-icon");
  flippedCards.push(clickedCard);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [firstCard, secondCard] = flippedCards;

  if (firstCard.getAttribute("data-icon") === secondCard.getAttribute("data-icon")) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchedCards += 2;

    // Si todas las cartas están emparejadas, termina el juego
    if (matchedCards === cardIcons.length) {
      clearTimeout(timer); // Detener el cronómetro
      const playerName = prompt("¡Felicidades! Ingresa tu nombre para guardar tu tiempo.");
      if (playerName) {
        addHistoryEntry(playerName, timerDisplay.textContent);
      }
    }

    flippedCards = [];
  } else {
    // Si no hay coincidencia, voltear las cartas nuevamente
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      flippedCards = [];
    }, 1000);
  }
}

function createCard(icon) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("data-icon", icon);
  card.addEventListener("click", handleCardClick);
  return card;
}

function startGame() {
  matchedCards = 0;
  flippedCards = [];
  gameActive = true;
  timerStarted = false; // Reiniciar el flag de inicio del cronómetro
  clearTimeout(timer); // Detener cualquier temporizador que esté activo

  shuffle(cardIcons);
  gameBoard.innerHTML = ""; // Limpiar el tablero de juego

  cardIcons.forEach(icon => {
    const card = createCard(icon);
    gameBoard.appendChild(card);
  });

  timerDisplay.textContent = "Tiempo: 00:00:00"; // Formato inicial
}

function addHistoryEntry(playerName, time) {
  const row = document.createElement("tr");
  const nameCell = document.createElement("td");
  const timeCell = document.createElement("td");

  nameCell.textContent = playerName;
  timeCell.textContent = time;
  row.appendChild(nameCell);
  row.appendChild(timeCell);
  historyTable.appendChild(row);
}

// Inicializar el juego al cargar la página
resetButton.addEventListener("click", startGame);

// Iniciar el juego
startGame();
