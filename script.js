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
    die1: 0,
    die2: 0,
    curScore1: 0,
    curScore2: 0,
    totScore1: 0,
    totScore2: 0,
}
// Starting code - unlucky factor (percentage of throwing 1) 
let countAllP1 = 0;
let countOneP1 = 0;
let countAllP2 = 0;
let countOneP2 = 0;


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
    let unluckyP1 = Math.round(countOneP1 / countAllP1 * 100) + '%'
    let unluckyP2 = Math.round(countOneP2 / countAllP2 * 100) + '%'
    // Display in the end
    curLabelEl.forEach(el => el.innerText = 'unlucky');
    curEl.forEach((el, i) => el.innerText = eval('unluckyP' + (i + 1)));
}

function dispTotalScore(Score, curE, totE) {
    dieSt['tot' + Score] += Math.round(dieSt['cur' + Score]);
    dieSt['cur' + Score] = 0;
    totE.innerText = dieSt['tot' + Score];
    curE.innerText = 0;
    // If total pts above victory pts
    if (dieSt['tot' + Score] >= victoryPts) {
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
    if (dieSt.die1 === num) { diceEl[0].style.boxShadow = `0 0 4px ${color}` }
    if (dieSt.die2 === num) { diceEl[1].style.boxShadow = `0 0 4px ${color}` }
}

function calcCurScore(Score, curE, totE) {
    let { die1, die2 } = dieSt;
    if (turnP1) {
        countAllP1++; if (die1 === 1 || die2 === 1) { countOneP1++ }
    } else { countAllP2++; if (die1 === 1 || die2 === 1) { countOneP2++ } }
    if (die1 + die2 === 2) {
        boxShadow(1, 'Aqua');
        dieSt['cur' + Score] = 0;
        dispTotalScore(Score, curE, totE)
    } else {
        dieSt['cur' + Score] += (die1 + die2);
        if (die1 === 1 || die2 === 1) {
            boxShadow(1, 'Aqua');
            dieSt['cur' + Score] = dieSt['cur' + Score] / 3;
            dispTotalScore(Score, curE, totE)
        }
    }
}

function roll() {
    setTimeout(() => {
        // Generate a random dice roll
        let rand1 = Math.ceil(Math.random() * 6);
        let rand2 = Math.ceil(Math.random() * 6);
        dieSt.die1 = rand1;
        dieSt.die2 = rand2;
        // Calculate current score
        (turnP1)
            ? calcCurScore('Score1', curEl[0], totEl[0])
            : calcCurScore('Score2', curEl[1], totEl[1]);
        // Disaply current score
        if (dieSt.totScore1 < victoryPts && dieSt.totScore2 < victoryPts) {
            curEl[0].innerText = parseInt(dieSt.curScore1);
            curEl[1].innerText = parseInt(dieSt.curScore2);
        }
        // Display dice
        diceEl[0].setAttribute('class', `die fas fa-dice-${die(dieSt.die1)} fa-7x anim`);
        diceEl[1].setAttribute('class', `die fas fa-dice-${die(dieSt.die2)} fa-7x anim`);
    }, 100)
}

function rollHandle() {
    diceEl.forEach(die => die.style.boxShadow = '0 0 4px rgb(180, 0, 78)')
    roll()
    btnRoll.disabled = true;
    setTimeout(() => {
        // Disable button for 1s
        if (dieSt.totScore1 < victoryPts && dieSt.totScore2 < victoryPts) {
            btnRoll.disabled = false;
        }
        // Reset animation
        diceEl.forEach(die => die.classList.remove("anim"))
    }, 700)
}

function holdHandle() {
    (turnP1)
        ? dispTotalScore('Score1', curEl[0], totEl[0])
        : dispTotalScore('Score2', curEl[1], totEl[1])
}

function restartHandle() {
    if (dieSt.totScore1 < victoryPts && dieSt.totScore2 < victoryPts) {
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
    ['curScore1', 'curScore2', 'totScore1', 'totScore2'].forEach(score => dieSt[score] = 0);
    // Reset display
    [...totEl, ...curEl].forEach(disp => disp.innerText = 0);
    // Reset console (bad luck %)
    countAllP1 = countOneP1 = countAllP2 = countOneP2 = 0;
    // Reset current label
    curLabelEl.forEach(el => el.innerText = 'current');
}

btnNew.addEventListener('click', restartHandle)
btnHold.addEventListener('click', holdHandle)
btnRoll.addEventListener('click', rollHandle)

