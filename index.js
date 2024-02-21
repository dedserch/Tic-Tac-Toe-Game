const cells = Array.from(document.querySelectorAll('.cells'))
const restartBtn = document.querySelector('.restart')
const players = new Map()
players.set("FirstPlayer", "X")
players.set("SecondPlayer", "O")
let currentPlayer = players.get("FirstPlayer")
let freeCells = Array(9).fill(null)
const combinationToWin = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,5],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
]

const startGame = ()=>{
    cells.forEach( cells => cells.addEventListener("click",cellsClick))
}

const cellsClick = (e) =>{
    const id = e.target.id
    if(!freeCells[id]){
        freeCells[id] = currentPlayer
        e.target.innerText = currentPlayer
    }
    if(checkWinner() != false){
        alert(`Выиграл игрок с символом ${currentPlayer}`)
    }
    else if (freeCells.every(cells => cells != null) &&  !checkWinner()){
        alert("Ничья")
    }
    
    currentPlayer = currentPlayer == players.get("FirstPlayer")? players.get("SecondPlayer"):players.get("FirstPlayer") 
}

const checkWinner = () =>{
    for(let i = 0; i<combinationToWin.length; i++){
        const combination = combinationToWin[i]
        let [a,b,c] = combination
        if(freeCells[a] && freeCells[a] == freeCells[b] && freeCells[a] == freeCells[c]){
            return [a,b,c]
        }
    }
    return false
}


restartBtn.addEventListener("click", ()=>{
    freeCells.fill(null)
    currentPlayer = players.get("FirstPlayer")
    cells.forEach(cells => cells.innerHTML = '')
})


startGame()



