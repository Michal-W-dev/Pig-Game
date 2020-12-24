'use strict';

// Selecting elements
const btnRoll = document.querySelector('.btn--roll')
const btnNew = document.querySelector('.btn--new')
const btnHold = document.querySelector('.btn--hold')

const playerEl = document.querySelectorAll('.player')
const nameEl = document.querySelectorAll('.name')
const totEl = document.querySelectorAll('.score')
const curEl = document.querySelectorAll('.current-score')
const diceEl = document.querySelectorAll('.die')
const curLabelEl = document.querySelectorAll('.current-label')

// Starting conditions
let turnP1 = true;
const victoryPts = 100;

const dieSt = {
    die: [0, 0],
    curScore: [0, 0],
    totScore: [0, 0]
}
// Starting code - unlucky factor (percentage of throwing 1) 
const countAll = [0, 0];
const countOne = [0, 0];


function die(face) {
    return (face === 1) ? 'one'
        : (face === 2) ? 'two'
            : (face === 3) ? 'three'
                : (face === 4) ? 'four'
                    : (face === 5) ? 'five'
                        : (face === 6) ? 'six' : null;
}

function unlucky() {
    // Unlucky factor (percentage of throwing 1) 
    curLabelEl.forEach(el => el.innerText = 'unlucky');
    curEl.forEach((el, i) => el.innerText = `${Math.round(countOne[i] / countAll[i] * 100)} %`);
}

function dispTotalScore(i, curE, totE) {
    let { totScore, curScore } = dieSt;
    totScore[i] += Math.round(curScore[i]);
    curScore[i] = 0;
    totE.innerText = totScore[i];
    curE.innerText = 0;
    // If total pts above victory pts
    if (totScore[i] >= victoryPts) {
        if (turnP1) { playerEl[0].classList.add("player--winner") }
        else { playerEl[1].classList.add("player--winner") };
        btnRoll.disabled = true;
        btnHold.disabled = true;
        // Unlucky factor (percentage of throwing 1) 
        unlucky()
    }
    // Change turn
    turnP1 = !turnP1;
    playerEl.forEach(p => p.classList.toggle("player--active"))
}

function boxShadow(num, color) {
    if (dieSt.die[0] === num) { diceEl[0].style.boxShadow = `0 0 4px ${color}` }
    if (dieSt.die[1] === num) { diceEl[1].style.boxShadow = `0 0 4px ${color}` }
}

function calcCurScore(i, curE, totE) {
    let { die } = dieSt;
    if (turnP1) {
        countAll[0]++; if (die[0] === 1 || die[1] === 1) { countOne[0]++ }
    } else { countAll[1]++; if (die[0] === 1 || die[1] === 1) { countOne[1]++ } }
    if (die[0] + die[1] === 2) {
        boxShadow(1, 'Aqua');
        dieSt.curScore[i] = 0;
        dispTotalScore(i, curE, totE)
    } else {
        dieSt.curScore[i] += (die[0] + die[1]);
        if (die[0] === 1 || die[1] === 1) {
            boxShadow(1, 'Aqua');
            dieSt.curScore[i] = dieSt.curScore[i] / 3;
            dispTotalScore(i, curE, totE)
        }
    }
}

function roll() {
    setTimeout(() => {
        // Generate a random dice roll
        let rand1 = Math.ceil(Math.random() * 6);
        let rand2 = Math.ceil(Math.random() * 6);
        dieSt.die[0] = rand1;
        dieSt.die[1] = rand2;
        // Calculate current score
        (turnP1)
            ? calcCurScore(0, curEl[0], totEl[0])
            : calcCurScore(1, curEl[1], totEl[1]);
        // Disaply current score
        if (dieSt.totScore[0] < victoryPts && dieSt.totScore[1] < victoryPts) {
            curEl[0].innerText = parseInt(dieSt.curScore[0]);
            curEl[1].innerText = parseInt(dieSt.curScore[1]);
        }
        // Display dice
        diceEl[0].setAttribute('class', `die fas fa-dice-${die(dieSt.die[0])} fa-7x anim`);
        diceEl[1].setAttribute('class', `die fas fa-dice-${die(dieSt.die[1])} fa-7x anim`);
    }, 100)
}

function rollHandle() {
    diceEl.forEach(die => die.style.boxShadow = '0 0 4px rgb(180, 0, 78)')
    roll()
    btnRoll.disabled = true;
    setTimeout(() => {
        // Disable button for 0.7s
        if (dieSt.totScore[0] < victoryPts && dieSt.totScore[1] < victoryPts) {
            btnRoll.disabled = false;
        }
        // Reset animation
        diceEl.forEach(die => die.classList.remove("anim"))
    }, 700)
}

function holdHandle() {
    (turnP1)
        ? dispTotalScore(0, curEl[0], totEl[0])
        : dispTotalScore(1, curEl[1], totEl[1])
}

function restartHandle() {
    if (dieSt.totScore[0] < victoryPts && dieSt.totScore[1] < victoryPts) {
        // If game restarted before (victory points), change turn
        turnP1 = !turnP1;
        playerEl.forEach(p => p.classList.toggle("player--active"))
    } else {
        // If game restarted after (victory points), remove victory background & enable buttons
        playerEl.forEach(p => p.classList.remove("player--winner"));
        btnRoll.disabled = false;
        btnHold.disabled = false;
    }
    // Reset dieState
    dieSt.curScore[0] = dieSt.curScore[1] = dieSt.totScore[0] = dieSt.totScore[1] = 0;
    // Reset ulucky factor
    countAll[0] = countOne[0] = countAll[1] = countOne[1] = 0;
    // Reset display
    [...totEl, ...curEl].forEach(disp => disp.innerText = 0);
    // Reset current label
    curLabelEl.forEach(el => el.innerText = 'current');
}

btnNew.addEventListener('click', restartHandle)
btnHold.addEventListener('click', holdHandle)
btnRoll.addEventListener('click', rollHandle)
