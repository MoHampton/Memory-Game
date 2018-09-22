/*
 * Create a list that holds all of your cards
 */
let deck = document.querySelector('.deck');//const variables will not work...don't try it. :)
let cards = document.querySelectorAll('.card');
let count = 0; 
let count2 = 0; 
let currentList = []; 
let waitList = []; 
let timeStart = timeEnd = 0; 
let stopWatch;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

//Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

//Push cards in an array and shuffle (again)
function shuffleCards() {
	cards = Array.prototype.slice.call(cards);
    cards.forEach(function(card) {
        card.className = 'card';
    })
	cards = shuffle(cards);
	for (let i=0; i<cards.length; i++) {
		deck.appendChild(cards[i]);
	}
}

//Restart game & timer
function restart() {
    shuffleCards();
    count = 0; //set # of clicking to 0
    currentList = []; 
    waitList = []; 
    counting(); //restart the count
    starIt(); //recount starts
    document.querySelector('.timer').children[1].textContent = '0'; //set stopwatch to 0
    stopTimer();
}

//Update the stopwatch by calculating the time
function timeWatch() {//maybe a better function name later...
        timeEnd = performance.now();
        let total = Math.floor((timeEnd - timeStart)/1000);
        document.querySelector('.timer').children[1].textContent = total.toString();
}

//Stopwatch function 
function timer() {
    timeStart = performance.now();
    if (stopWatch) {
        stopTimer();
    }
    stopWatch = setInterval(timeWatch, 1000);
}

function stopTimer() {
    clearInterval(stopWatch);
}

//Restart game
function redo() {
    document.querySelector('.restart').addEventListener('click', restart)
}

//Flip card
function open(event) {
    event.className = 'card open show';
    waitList.push(event)
}

//Close no match card
function close(event) {
    event.className = 'card close';
}

//Count clicked cards
function counting() {
    document.querySelector('.moves').textContent = parseInt(count/2);
}

//Adjust the # of stars according to times of clicking cards
function removeStar() {
    let stars = document.querySelector('.stars').children;
    let thirdStar = document.querySelector('#thirdStar');
    let secondStar = document.querySelector('#secondStar');
    let firstStar = document.querySelector('#firstStar');
    if (count > 30) {
        //firstStar.parentNode.removeChild(firstStar);
        //stars.parentNode.removeChild(thirdStar);
        //stars.removeChild(stars.childNodes[2]);
        stars[2].innerHTML = '<i class="fa fa-star" style="color:lightgray;"></i>';
    } if (count > 36) {
        stars[1].innerHTML = '<i class="fa fa-star" style="color:lightgray;"></i>';
        //secondStar.parentNode.removeChild(secondStar);
    } if (count > 42) {
        stars[0].innerHTML = '<i class="fa fa-star" style="color:lightgray;"></i>';
        //firstStar.parentNode.removeChild(firstStar);
        //thirdStar.parentNode.removeChild(thirdStar);
    }
}
//Restart game with 3 stars
function starIt() {
    let stars = document.querySelector('.stars').children;
    for (let i=0; i<3; i++) {
        stars[i].innerHTML = '<i class="fa fa-star"></i>'
    }
}

//Modal when game is complete
function modal() {
    let currentTime = document.querySelector('.timer').children[1];
    let stars = document.querySelector('.stars').outerHTML;
    
    document.querySelector('.modal-time').textContent = currentTime.textContent; //Show score on modal
    document.querySelector('.modal').style.display = 'block';
    document.querySelector('.modal-stars').innerHTML = stars;
}
//Restart game by clicking the button
function playAgain() {
    document.querySelector('.modal-button').addEventListener('click', function() {
        document.querySelector('.modal').style.display = 'none';
        restart();
    })
}

function closeModal() {
    document.querySelector('.modal-close').addEventListener('click', function() {
        document.querySelector('.modal').style.display = 'none';
    }) 
}

//Start game function & count moves on the cards
function flip() {
    document.querySelector('.deck').addEventListener('click', function(e) {
        let target = e.target;
        if (document.querySelector('.timer').children[1].textContent == '0') {timer();}
        if (target.nodeName == 'LI' && !target.classList.contains('open') && !target.classList.contains('match') && count2<2) {         
            count += 1; 
            count2 += 1; //Only open two cards at a time
            counting(); 
            removeStar(); 
            open(target);
            if (waitList.length == 2) {
                if (waitList[0].firstElementChild.className == waitList[1].firstElementChild.className) { 
                    waitList.forEach(function(item) { 
                        item.className = 'card match animated rubberBand'; 
                        currentList.push(item) 
                        if (currentList.length >= 16) {
                            clearInterval(stopWatch);
                            modal(); 
                        }
                    })
                    count2 = 0;
                } else {
                    waitList.forEach(function(item) { 
                        item.className = 'card wrong animated shake' 
                        setTimeout(function() { 
                            item.className = 'card close';
                            count2 = 0;
                        }, 1000);
                    })

                }
                waitList = [] //Clear the waitList after matching                
            }
        }
    })
}

window.onload = function() {
    shuffleCards();
    redo();
    flip();
    playAgain();
    closeModal();
}