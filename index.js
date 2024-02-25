const cells = Array.from(document.querySelectorAll('.cells'))
const restartBtn = document.querySelector('.restart')
const players = new Map([
    ["FirstPlayer", "X"],
    ["SecondPlayer", "O"],
])
const countPlayer =  {
    "firstPlayer": 0,
    "secondPlayer": 0
}
let currentPlayer = players.get("FirstPlayer")
let freeCells = new Array(9).fill(null)
const overlay = document.querySelector(".overlay")
const overlayClose = document.querySelector(".close")
const winner = document.querySelector(".overlay-winner")
const overlayMove = document.querySelector(".overlay-move")
const firstCounter = document.querySelector(".counter-first")
const secondCounter = document.querySelector(".counter-second")
const clearScoreBtn = document.querySelector(".clear")
let gameMove = 1

const combinationToWin = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]

const startGame = () => {
    cells.forEach(cell => cell.addEventListener("click", cellClick))
}
const openWinningModal = (currentPlayer, gameMove) =>{
    overlay.classList.add("active")
    overlayMove.innerHTML = `На ходу: ${gameMove}`
    winner.innerHTML = `Победил: ${currentPlayer}`
}
const openDrawModal = (gameMove) => {
    overlay.classList.add("active")
    overlayMove.innerHTML = `На ходу: ${gameMove}`
    winner.innerHTML = `Ничья`
}
const closeModal = () =>{
    overlay.classList.remove("active")
}
overlayClose.addEventListener("click", closeModal)
const cellClick = (e) => {
    const id = e.target.id

    if (freeCells[id]) {
        return
    }
    gameMove++
    freeCells[id] = currentPlayer
    e.target.innerText = currentPlayer
    const winningCombination = checkWinner()
    if (winningCombination) {
        openWinningModal(currentPlayer,gameMove)
        gameMove = 1
        currentPlayer === players.get("FirstPlayer")? firstCounter.innerHTML = ++countPlayer.firstPlayer : secondCounter.innerHTML = ++countPlayer.secondPlayer
        disableCells()
        return
    }
    if (freeCells.every(cell => cell !== null)) {
        openDrawModal(gameMove)
        gameMove = 1
        return
    }
    currentPlayer = currentPlayer === players.get("FirstPlayer") ? players.get("SecondPlayer") : players.get("FirstPlayer")
}

const checkWinner = () => {
    return combinationToWin.some((combination) => {
      const [a, b, c] = combination
      return freeCells[a] ? freeCells[a] === freeCells[b] && freeCells[a] === freeCells[c] : false
    })
}

const disableCells = () => {
    cells.forEach((cell) => cell.removeEventListener("click", cellClick))
}

const clearScore = () =>{
    countPlayer.firstPlayer = 0
    countPlayer.secondPlayer = 0
    firstCounter.innerHTML = 0
    secondCounter.innerHTML = 0
}
clearScoreBtn.addEventListener("click", clearScore)
restartBtn.addEventListener("click", () => {
    freeCells.fill(null)
    currentPlayer = players.get("FirstPlayer")
    cells.forEach((cell) => {
      cell.innerHTML = ""
      cell.addEventListener("click", cellClick)
    })
})
startGame()