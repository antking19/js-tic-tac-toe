/**
 * Global variables
 */
import { TURN, CELL_VALUE, GAME_STATUS } from "./constants.js";
import {
    getCellElementList,
    getCurrentTurnElement,
    getGameStatusElement,
    getReplayButton,
    getCellElementAtIdx,
} from "./selectors.js";
import { checkGameStatus } from "./utils.js";

let currentTurn = TURN.CROSS;
let cellValues = new Array(9).fill("");
let gameStatus = GAME_STATUS.PLAYING;

function toggleTurn() {
    // toggle turn
    currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;

    // update turn on DOM element
    const currentTurnElement = getCurrentTurnElement();
    if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
        currentTurnElement.classList.add(currentTurn);
    }
}

function updateGameStatus(newGameStatus) {
    gameStatus = newGameStatus;
    const gameStatusElement = getGameStatusElement();
    gameStatusElement.textContent = newGameStatus;
}

function showReplayButton() {
    const replayButton = getReplayButton();
    if (replayButton) replayButton.classList.add("show");
}

function hightlightCellWinValues(winPositions) {
    if (!Array.isArray(winPositions) || winPositions.length !== 3)
        throw new Error("Invalid highlight win");

    for (const position of winPositions) {
        const cellElement = getCellElementAtIdx(position);
        cellElement.classList.add("win");
    }
}

function handleCellClick(cell, index) {
    const isClicked =
        cell.classList.contains(TURN.CIRCLE) ||
        cell.classList.contains(TURN.CROSS);
    if (isClicked) return;

    // set selected cell
    cell.classList.add(currentTurn);

    cellValues[index] =
        currentTurn === TURN.CROSS ? CELL_VALUE.CROSS : CELL_VALUE.CIRCLE;

    const game = checkGameStatus(cellValues);

    // toggle turn
    toggleTurn();

    switch (game.status) {
        case GAME_STATUS.X_WIN:
        case GAME_STATUS.O_WIN: {
            updateGameStatus(game.status);
            showReplayButton();
            hightlightCellWinValues(game.winPositions);
            break;
        }

        case GAME_STATUS.ENDED: {
            updateGameStatus(game.status);
            showReplayButton();
            break;
        }

        default:
    }
}

function resetGame() {
    // reset gameStatus 'LOADING'
    const gameStatusElement = getGameStatusElement();
    if (gameStatusElement) {
        gameStatusElement.textContent = "LOADING";
    }

    // reset all cell value element
    // reset highlight win element
    const cellElementList = getCellElementList();
    if (cellElementList) {
        for (const cellElement of cellElementList) {
            cellElement.className = "";
        }
    }

    // reset currentTurn 'X'
    const currentTurnElement = getCurrentTurnElement();
    if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
        currentTurnElement.classList.add(TURN.CROSS);
    }

    // hide replay button
    const replayButton = getReplayButton();
    if (replayButton) {
        replayButton.classList.remove("show");
    }
}

function initResetGame() {
    // get replay button
    const replayButton = getReplayButton();
    if (!replayButton) return;

    replayButton.addEventListener("click", resetGame);
}

function initCellElementList() {
    const cellElementList = getCellElementList();

    cellElementList.forEach((cell, index) => {
        cell.dataset.id = index;
    });

    const cellList = document.getElementById("cellList");
    cellList.addEventListener("click", (event) => {
        let target = event.target;
        if (target.tagName !== "LI") return;
        handleCellClick(target, Number.parseInt(target.dataset.id));
    });
}

(() => {
    initCellElementList();
    initResetGame();
})();

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */
