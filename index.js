const cells = Array.from(document.querySelectorAll('.cell'))
const restartBtn = document.querySelector('.restart')
const board = document.querySelector('.board')
const inputSize = document.querySelector('.input-size')
const enterBtn = document.querySelector('.enter')
const overlay = document.querySelector('.overlay')
const overlayClose = document.querySelector('.close')
const winner = document.querySelector('.overlay-winner')
const overlayMove = document.querySelector('.overlay-move')
const firstCounter = document.querySelector('.counter-first')
const secondCounter = document.querySelector('.counter-second')
const clearScoreBtn = document.querySelector('.clear')
const warning = document.querySelector('p')
const inputRules = document.querySelector('.input-rules')

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
let winningLength = 3

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

  if (checkWinner(winningLength)) {
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

const checkWinner = (winningLength) => {
  const conditions = winningConditions(winningLength)

  return conditions.some((condition) => {
    const symbols = condition.map((cell) => freeCells[cell])
    const uniqueSymbol = [...new Set(symbols)]

    return uniqueSymbol.length === 1 && uniqueSymbol[0] !== null
  })
}

const winningConditions = (winningLength) => {
  const rows = Array.from(
    Array(boardSize),
    (_, i) => Array.from(Array(boardSize), (_, j) => i * boardSize + j)
  )
  const columns = Array.from(
    Array(boardSize),
    (_, i) => Array.from(Array(boardSize), (_, j) => i + j * boardSize)
  )
  const diagonals = []

  Array.from({ length: boardSize - winningLength + 1 }).forEach((_, i) => {
    Array.from({ length: boardSize - winningLength + 1 }).forEach((_, j) => {
      const diagonal = Array.from({ length: winningLength }).map(
        (_, k) => (i + k) * boardSize + j + k
      )
      diagonals.push(diagonal)
    })
  })

  Array.from({ length: boardSize - winningLength + 1 }).forEach((_, i) => {
    Array.from({ length: boardSize - winningLength + 1 }).forEach((_, j) => {
      const diagonal = Array.from({ length: winningLength }).map(
        (_, k) => (i + k) * boardSize + j + winningLength - 1 - k
      )
      diagonals.push(diagonal)
    })
  })

  const checkSubarray = (array, length) =>
    Array.from({ length: array.length - length + 1 }).map((_, i) => array.slice(i, i + length))

  const addSubarrays = (arrays) =>
    arrays.reduce((acc, cur) => acc.concat(checkSubarray(cur, winningLength)), [])

  return addSubarrays(rows).concat(addSubarrays(columns)).concat(diagonals)
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
  gameMove = 0
  generateBoard(boardSize, board)
  winningConditions(winningLength)
}

const customGame = () => {
  const newSize = parseInt(inputSize.value)
  const newWinningLength = parseInt(inputRules.value)
  if (!isNaN(newSize) && newSize > 0 && newWinningLength > 0 && !isNaN(newWinningLength)) {
    if(newSize <= 10 && newWinningLength <= 10){
      boardSize = newSize
      winningLength = newWinningLength
      inputSize.value = ''
      inputRules.value = ''
      warning.textContent = ''
      clearScore()
      resetGame()
    }
    else  {
      warning.textContent = 'Введите промежуток от 1 до 10!'
    }
  } else {
    warning.textContent = 'Заполните все поля ввода цифрами!'
  }
}

overlayClose.addEventListener('click', closeModal)
clearScoreBtn.addEventListener('click', clearScore)
restartBtn.addEventListener('click', resetGame)
enterBtn.addEventListener('click', customGame)

generateBoard(boardSize, board)
