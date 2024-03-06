const cells = Array.from(document.querySelectorAll('.cell'))
const restartBtn = document.querySelector('.restart')
const board = document.querySelector('.board')
const input = document.querySelector('input')
const enterBtn = document.querySelector('.enter')
const overlay = document.querySelector('.overlay')
const overlayClose = document.querySelector('.close')
const winner = document.querySelector('.overlay-winner')
const overlayMove = document.querySelector('.overlay-move')
const firstCounter = document.querySelector('.counter-first')
const secondCounter = document.querySelector('.counter-second')
const clearScoreBtn = document.querySelector('.clear')
const warning = document.querySelector('p')

const players = new Map([
  ['FirstPlayer', 'X'],
  ['SecondPlayer', 'O'],
])
const countPlayer = {
  firstPlayer: 0,
  secondPlayer: 0,
}
let currentPlayer = players.get('FirstPlayer')
let gameMove = 0
let boardSize = 3
let freeCells = []
let gameOver = false

const generateBoard = (boardSize, board) => {
  board.innerHTML = ''
  freeCells = new Array(boardSize * boardSize).fill(null)
  gameOver = false

  Array.from({ length: boardSize }).forEach((_, i) => {
    const row = document.createElement('div')
    row.classList.add('row')

    Array.from({ length: boardSize }).forEach((_, j) => {
      const cell = generateCell(i, j)
      row.appendChild(cell)
    })

    board.appendChild(row)
  })
}

const generateCell = (row, column) => {
  const cell = document.createElement('div')
  cell.classList.add('cell')
  cell.dataset.idRow = row
  cell.dataset.idCol = column
  cell.addEventListener('click', cellClick)
  return cell
}

const openWinningModal = (currentPlayer, gameMove) => {
  overlay.classList.add('active')
  overlayMove.innerHTML = `На ходу: ${gameMove}`
  winner.innerHTML = `Победил: ${currentPlayer}`
}

const openDrawModal = (gameMove) => {
  overlay.classList.add('active')
  overlayMove.innerHTML = `На ходу: ${gameMove}`
  winner.innerHTML = 'Ничья'
}

const closeModal = () => {
  overlay.classList.remove('active')
}

const cellClick = (e) => {
  if (gameOver) {
    return
  }

  const row = parseInt(e.target.dataset.idRow)
  const column = parseInt(e.target.dataset.idCol)

  if (freeCells[row * boardSize + column]) {
    return
  }

  gameMove++
  freeCells[row * boardSize + column] = currentPlayer
  e.target.innerText = currentPlayer

  if (checkWinner()) {
    openWinningModal(currentPlayer, gameMove)
    gameOver = true
    gameMove = 0
    updateCounter()
    return
  }

  if (freeCells.every((cell) => cell !== null)) {
    openDrawModal(gameMove)
    gameOver = true
    gameMove = 0
    return
  }

  currentPlayer =
    currentPlayer === players.get('FirstPlayer')
      ? players.get('SecondPlayer')
      : players.get('FirstPlayer')
}

const checkWinner = () => {
  const conditions = winningConditions()

  return conditions.some((condition) => {
    const symbols = condition.map((cell) => freeCells[cell])
    const uniqueSymbol = [...new Set(symbols)]

    return uniqueSymbol.length === 1 && uniqueSymbol[0] !== null
  })
}

const winningConditions = () => {
  const rows = Array.from(
    Array(boardSize),
    (_, i) => Array.from(Array(boardSize), (_, j) => i * boardSize + j)
  )
  const columns = Array.from(
    Array(boardSize),
    (_, i) => Array.from(Array(boardSize), (_, j) => i + j * boardSize)
  )
  const diagonals = [[], []]

  Array.from({ length: boardSize }).forEach((_, i) => {
    diagonals[0].push(i * (boardSize + 1))
    diagonals[1].push((i + 1) * (boardSize - 1))
  })

  return rows.concat(columns, diagonals)
}

const clearScore = () => {
  countPlayer.firstPlayer = 0
  countPlayer.secondPlayer = 0
  firstCounter.innerHTML = countPlayer.firstPlayer
  secondCounter.innerHTML = countPlayer.secondPlayer
}

const updateCounter = () => {
  currentPlayer === players.get('FirstPlayer')
    ? (firstCounter.innerHTML = ++countPlayer.firstPlayer)
    : (secondCounter.innerHTML = ++countPlayer.secondPlayer)
}

const resetGame = () => {
  freeCells.fill(null)
  currentPlayer = players.get('FirstPlayer')
  generateBoard(boardSize, board)
}

const resizeBoard = () => {
  const newSize = parseInt(input.value)
  if (!isNaN(newSize) && newSize > 0) {
    boardSize = newSize
    input.value = ''
    warning.textContent = ''
    clearScore()
    resetGame()
  } else {
    warning.textContent = 'Введите число!'
  }
}


overlayClose.addEventListener('click', closeModal)
clearScoreBtn.addEventListener('click', clearScore)
restartBtn.addEventListener('click', resetGame)
enterBtn.addEventListener('click', resizeBoard)

generateBoard(boardSize, board)
