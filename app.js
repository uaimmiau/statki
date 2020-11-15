let tabPlayer = Array.from({
    length: 12
}, () => Array(12).fill(0));
let tabAi = Array.from({
    length: 12
}, () => Array(12).fill(0));
let elTabPlayer = Array.from({
    length: 12
}, () => Array(12).fill(0));
let elTabAi = Array.from({
    length: 12
}, () => Array(12).fill(0));
//Pomysł, połączyć z tabPlayer i stworzyć tablice tablic obiektów
let ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
const aiBoard = document.getElementById("aiBoard");
let playerBoard = document.getElementById("playerBoard");
const harbour = document.getElementById("harbour");
const DIM = tabAi.length;
const startButt = document.getElementById("start");
const autoButt = document.getElementById("auto");
const restartButt = document.getElementById("restart");
let direction = 0; //0 - horizontal, 1 - vertical
playerBoard.addEventListener("contextmenu", e => {
    e.preventDefault();
    if (direction == 0) {
        direction = 1;
    } else {
        direction = 0;
    }
})

const checkSurroundingH = (tab, x, y, size) => {
    for (let i = y - 1; i < y + 2; i++) {
        for (let j = x - 1; j < x + size + 1; j++) {
            if (tab[i][j] === 1) {
                // console.log("test")
                return false;
            }
        }
    }
    return true;
}
const checkSurroundingV = (tab, x, y, size) => {
    for (let i = y - 1; i < y + size + 1; i++) {
        for (let j = x - 1; j < x + 2; j++) {
            if (tab[i][j] === 1) {
                // console.log("test2")
                return false;
            }
        }
    }
    return true;
}

const addShipH = (tab, size) => {
    let validForAdd = true,
        startX, startY;
    do {
        startX = Math.floor(Math.random() * (10 - size) + 1);
        startY = Math.floor((Math.random() * 10) + 1);
        validForAdd = checkSurroundingH(tab, startX, startY, size);
    } while (!validForAdd)

    for (let i = startX; i < startX + size; i++) {
        tab[startY][i] = 1;
    }
}
const addShipV = (tab, size) => {
    let validForAdd = true,
        startX, startY;
    do {
        startX = Math.floor((Math.random() * 10) + 1);
        startY = Math.floor(Math.random() * (10 - size) + 1);
        validForAdd = checkSurroundingV(tab, startX, startY, size);
    } while (!validForAdd)

    for (let i = startY; i < startY + size; i++) {
        tab[i][startX] = 1;
    }
}

const engageAiPlacemant = (tab, ships) => {
    for (size of ships) {
        let direction = Math.round(Math.random());
        if (direction === 0) {
            addShipH(tab, size);
        } else {
            addShipV(tab, size);
        }
    }
}

const drawBoard = (tab, elTab, board, dim) => {
    board.innerHTML = "";
    for (let i = 1; i < dim - 1; i++) {
        let row = document.createElement("DIV");
        row.classList.add("row");
        for (let j = 1; j < dim - 1; j++) {
            let div = document.createElement("DIV");
            div.classList.add("tile");
            if (tab[i][j] == 1 && board == playerBoard)
                div.classList.add("tileOccupied");
            elTab[i][j] = div;
            row.appendChild(div);
        }
        board.appendChild(row);
    }
}

const drawOnBoardH = (board, i, j, size, tab, elTab, color, save) => {
    for (let k = 0; k < size; k++) {
        if (j < DIM - 1 && !(color != "#555555" && tab[i][j] == 1))
            elTab[i][j].style.backgroundColor = color;
        if (save)
            tab[i][j] = 1;
        j++;
    }
}

const drawOnBoardV = (board, i, j, size, tab, elTab, color, save) => {
    for (let k = 0; k < size; k++) {
        if (i < DIM - 1 && !(color != "#555555" && tab[i][j] == 1))
            elTab[i][j].style.backgroundColor = color;
        if (save)
            tab[i][j] = 1;
        i++;
    }
}

const setListeners = (board, size, ship) => {
    let i = 1,
        j = 1;
    for (child of board.children) {
        for (child2 of child.children) {
            let currentTile = child2;
            let obj = {
                tile: currentTile,
                i: i,
                j: j
            }

            function enter() {
                if (direction === 0) {
                    let newJ = obj.j;
                    if (obj.j > DIM - size - 1)
                        newJ = DIM - size - 1;
                    if (checkSurroundingH(tabPlayer, newJ, obj.i, size)) {
                        drawOnBoardH(board, obj.i, newJ, size, tabPlayer, elTabPlayer, "green", false);
                    } else {
                        drawOnBoardH(board, obj.i, newJ, size, tabPlayer, elTabPlayer, "red", false);
                    }
                } else {
                    let newI = obj.i;
                    if (obj.i > DIM - size - 1)
                        newI = DIM - size - 1;
                    if (checkSurroundingV(tabPlayer, obj.j, newI, size)) {
                        drawOnBoardV(board, newI, obj.j, size, tabPlayer, elTabPlayer, "green", false);
                    } else {
                        drawOnBoardV(board, newI, obj.j, size, tabPlayer, elTabPlayer, "red", false);
                    }
                }
            }
            currentTile.onmouseenter = enter;

            function leave() {
                if (direction === 0) {
                    let newJ = obj.j;
                    if (obj.j > DIM - size - 1)
                        newJ = DIM - size - 1;
                    drawOnBoardH(board, obj.i, newJ, size, tabPlayer, elTabPlayer, "transparent", false);
                } else {
                    let newI = obj.i;
                    if (obj.i > DIM - size - 1)
                        newI = DIM - size - 1;
                    drawOnBoardV(board, newI, obj.j, size, tabPlayer, elTabPlayer, "transparent", false);
                }
            }
            currentTile.onmouseleave = leave;
            currentTile.oncontextmenu = function context() {
                leave();
                if (direction === 1) {
                    direction = 0
                } else {
                    direction = 1
                }
                enter();
                if (direction === 1) {
                    direction = 0
                } else {
                    direction = 1
                }
            }

            function click() {
                if (direction === 0) {
                    let newJ = obj.j;
                    if (obj.j > DIM - size - 1)
                        newJ = DIM - size - 1;
                    if (checkSurroundingH(tabPlayer, newJ, obj.i, size)) {
                        drawOnBoardH(board, obj.i, newJ, size, tabPlayer, elTabPlayer, "#555555", true);
                        ship.remove();
                        size = 0;
                    }
                } else {
                    let newI = obj.i;
                    if (obj.i > DIM - size - 1)
                        newI = DIM - size - 1;
                    if (checkSurroundingV(tabPlayer, obj.j, newI, size)) {
                        drawOnBoardV(board, newI, obj.j, size, tabPlayer, elTabPlayer, "#555555", true);
                        ship.remove();
                        size = 0;
                    }
                }
            }
            currentTile.onclick = click;
            j++;
        }
        i++;
        j = 1;
    }
}


const colorMyTiles = (container, color) => {
    for (tile of container.children) {
        tile.style.backgroundColor = color;
    }
}

const drawHarbour = (harbour, ships) => {
    harbour.innerHTML = "";
    for (size of ships) {
        let ship = document.createElement("DIV");
        ship.classList.add("ship");
        for (let i = 0; i < size; i++) {
            let div = document.createElement("DIV");
            div.classList.add("tile");
            ship.appendChild(div);
        }
        ship.addEventListener("mouseenter", function enter() {
            ship.style.backgroundColor = "red";
        })
        ship.addEventListener("mouseleave", function leave() {
            ship.style.backgroundColor = "transparent";
        })
        let tmpSize = size;
        ship.addEventListener("click", function click() {
            for (child of harbour.children) {
                colorMyTiles(child, "transparent");
            }
            colorMyTiles(ship, "#555555");
            setListeners(playerBoard, tmpSize, ship);
        })
        harbour.appendChild(ship);
    }
}

engageAiPlacemant(tabAi, ships);
drawBoard(tabAi, elTabAi, aiBoard, DIM);
drawBoard(tabPlayer, elTabPlayer, playerBoard, DIM);
drawHarbour(harbour, ships);

let shotsFiredPlayer, shotsFiredComputer, hitPlayer, hitComputer, firedPlayer, firedComputer;
let prefferedTargets = [];

const restart = () => {
    tabPlayer = Array.from({
        length: 12
    }, () => Array(12).fill(0));
    tabAi = Array.from({
        length: 12
    }, () => Array(12).fill(0));
    elTabPlayer = Array.from({
        length: 12
    }, () => Array(12).fill(0));
    elTabAi = Array.from({
        length: 12
    }, () => Array(12).fill(0));
    playerBoard.onclick = e => {}
    aiBoard.innerHTML = "";
    playerBoard.innerHTML = "";
    engageAiPlacemant(tabAi, ships);
    drawBoard(tabAi, elTabAi, aiBoard, DIM);
    drawBoard(tabPlayer, elTabPlayer, playerBoard, DIM);
    drawHarbour(harbour, ships);
    startButt.disabled = false;
    autoButt.disabled = false;
}

const victory = winner => {
    setTimeout(function () {
        if (window.confirm(`${winner} wygrał! \n Odnowić grę?`)) {
            setTimeout(function () {
                restart();
            }, 5000)
        }
    }, 1000)
}

const revealAiPlacement = dim => {
    for (let i = 1; i < dim - 1; i++) {
        for (let j = 1; j < dim - 1; j++) {
            if (tabAi[i][j] == 1)
                elTabAi[i][j].classList.add("tileOccupied");
        }
    }
}

const checkVictory = () => {
    if (hitPlayer === 20) {
        victory("Gracz");
        return true
    } else if (hitComputer === 20) {
        revealAiPlacement(DIM);
        victory("Komputer");
        return true
    }
}

const playerTurn = turn => {
    if (checkVictory()) {
        return
    }
    playerBoard.onclick = e => {
        window.alert("Tura gracza!");
    }
    let i = 1,
        j = 1;
    for (child of aiBoard.children) {
        for (child2 of child.children) {
            let currentTile = child2;
            let obj = {
                i: i,
                j: j
            }
            currentTile.onclick = e => {
                if (firedPlayer != firedComputer) {
                    window.alert("Tura AI!")
                    return
                }
                if (shotsFiredPlayer[obj.i][obj.j] == 1)
                    return
                if (tabAi[obj.i][obj.j] == 1) {
                    currentTile.classList.add("hit");
                    hitPlayer++;
                } else {
                    currentTile.classList.add("miss");
                }
                shotsFiredPlayer[obj.i][obj.j] = 1;
                firedPlayer++;
                if (tabAi[obj.i][obj.j] == 1) {
                    firedComputer++;
                    nextTurn(turn)
                    return
                }
                nextTurn(!turn);
            }
            j++;
        }
        i++;
        j = 1;
    }
}

const aiTurn = turn => {
    if (checkVictory()) {
        return
    }
    playerBoard.onclick = e => {}
    let i, j;
    if (prefferedTargets.length != 0) {
        let first = prefferedTargets.shift();
        i = first[0];
        j = first[1];
    } else {
        i = Math.floor((Math.random() * 10) + 1);
        j = Math.floor((Math.random() * 10) + 1);
    }

    if (shotsFiredComputer[i][j] == 1 || i == 0 || j == 0 || i == 11 || j == 11) {
        aiTurn(turn)
        return
    }
    setTimeout(function () {
        if (tabPlayer[i][j] == 1) {
            elTabPlayer[i][j].classList.add("hit");
            hitComputer++;
            console.log("hit", i, j, hitComputer)
            shotsFiredComputer[i - 1][j - 1] = 1;
            shotsFiredComputer[i - 1][j + 1] = 1;
            shotsFiredComputer[i + 1][j - 1] = 1;
            shotsFiredComputer[i + 1][j + 1] = 1;
            prefferedTargets.push([i, j - 1]);
            prefferedTargets.push([i, j + 1]);
            prefferedTargets.push([i + 1, j]);
            prefferedTargets.push([i - 1, j]);
            shotsFiredComputer[i][j] = 1;
            firedComputer++;
            firedPlayer++;
            nextTurn(turn)
            return
        } else {
            elTabPlayer[i][j].classList.add("miss");
            shotsFiredComputer[i][j] = 1;
            firedComputer++;
        }
        nextTurn(!turn);
    }, 1000)
}

const nextTurn = turn => {
    if (turn) {
        playerTurn(turn);
    } else {
        aiTurn(turn);
    }
}

const engageFight = () => {
    let turn = true; //true - tura gracza, false - komputera
    shotsFiredPlayer = Array.from({
        length: 12
    }, () => Array(12).fill(0));
    shotsFiredComputer = Array.from({
        length: 12
    }, () => Array(12).fill(0));
    hitPlayer = 0, hitComputer = 0, firedPlayer = 0, firedComputer = 0;
    nextTurn(turn)
}

startButt.onclick = e => {
    if (harbour.children.length != 0) {
        window.alert("Przed rozpoczęciem walki należy rozstawić statki");
        return
    }
    engageFight()
    startButt.disabled = true;
    autoButt.disabled = true;
}

autoButt.onclick = e => {
    harbour.innerHTML = "";
    tabPlayer = Array.from({
        length: 12
    }, () => Array(12).fill(0));
    engageAiPlacemant(tabPlayer, ships);
    drawBoard(tabPlayer, elTabPlayer, playerBoard, DIM);
    console.log(tabPlayer)
}

restartButt.onclick = restart;