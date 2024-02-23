const cells = Array.from(document.querySelectorAll('.cells'))
const restartBtn = document.querySelector('.restart')
const players = new Map([
    ["FirstPlayer", "X"],
    ["SecondPlayer", "O"],
])
let currentPlayer = players.get("FirstPlayer")
let freeCells = new Array(9).fill(null)

const combinationToWin = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 5],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]

const startGame = () => {
    cells.forEach(cell => cell.addEventListener("click", cellClick))
}

const cellClick = (e) => {
    const id = e.target.id

    if (freeCells[id]) {
        return
    }

    freeCells[id] = currentPlayer
    e.target.innerText = currentPlayer

    const winner = checkWinner();
    if (winner) {
        alert(`Победитель: ${currentPlayer}`)
        return
    }
    if (freeCells.every(cell => cell !== null)) {
        alert("Ничья")
        return
    }

    currentPlayer = currentPlayer === players.get("FirstPlayer") ? players.get("SecondPlayer") : players.get("FirstPlayer")
}

const checkWinner = () => {
    for (let i = 0; i < combinationToWin.length; i++) {
        const combination = combinationToWin[i]
        const [a, b, c] = combination
        if (freeCells[a] && freeCells[a] === freeCells[b] && freeCells[a] === freeCells[c]) {
            return combination
        }
    }
    return false
}

restartBtn.addEventListener("click", () => {
    freeCells.fill(null)
    currentPlayer = players.get("FirstPlayer")
    cells.forEach(cell => cell.innerHTML = "")
})
startGame()