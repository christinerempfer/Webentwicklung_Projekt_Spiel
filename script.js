// #############################################################################
// WELCOME PAGE 
const playerNameInput = document.getElementById('playerName');
const startGameButton = document.getElementById('startGame');
const gameMenu = document.getElementById('gameMenu');
const welcomePage = document.getElementById('welcomePage');

// Spielername prüfen und Spiel starten Button aktivieren
playerNameInput.addEventListener('input', () => {
    startGameButton.disabled = playerNameInput.value.trim() === '';
});

// Spiel starten und Menü anzeigen
startGameButton.addEventListener('click', () => {
    welcomePage.classList.add('hidden');
    gameMenu.classList.remove('hidden');
    gameMenu.classList.add("visible");
    document.body.style.background = "url('wtqqnkYDYi2ifsWZVW2MT4-970-80.jpg.webp') no-repeat center center fixed";  // Hintergrund ändern
    document.body.style.backgroundSize = "cover"; // Hintergrundgröße setzen

});

// #############################################################################
//  GAME MENU
const quoteOptions = document.getElementById('quoteOptions');
const wordOptions = document.getElementById('wordOptions');
const playGameButton = document.getElementById('playGame');
const gamePage = document.getElementById('gamePage');
const playerDisplay = document.getElementById('playerDisplay');
const quoteButton = document.getElementById('quoteButton');
const wordButton = document.getElementById('wordButton');


// Event Listener für Zitat raten
quoteButton.addEventListener('click', () => {
    quoteOptions.classList.remove('hidden');  // Zeige Zitatoptionen
    wordOptions.classList.add('hidden');      // Verstecke Wortoptionen
    gameTypeSelect.value = 'quote';           // Setze Spieltyp auf 'quote'
    playGameButton.style.display = "block"; // Spiel starten Button anzeigen
});

// Event Listener für Wort raten
wordButton.addEventListener('click', () => {
    wordOptions.classList.remove('hidden');   // Zeige Wortoptionen
    quoteOptions.classList.add('hidden');     // Verstecke Zitatoptionen
    gameTypeSelect.value = 'word';            // Setze Spieltyp auf 'word'
    playGameButton.style.display = "block"; // Spiel starten Button anzeigen
});

// Wortlänge Slider aktualisieren
const wordLengthInput = document.getElementById('wordLength');
const wordLengthDisplay = document.getElementById('wordLengthDisplay');
wordLengthInput.addEventListener('input', () => {
    wordLengthDisplay.textContent = wordLengthInput.value;
});



// #############################################################################
// SET UP GAME WITH API CALLS

// Funktion zum Abrufen eines zufälligen Zitats
const wordDisplay = document.getElementById('wordDisplay');
const attemptsElement = document.getElementById('attempts');
const wrongGuessesElement = document.getElementById('wrongGuesses');
const messageElement = document.getElementById('message');

// Funktion zur Berechnung der Fehlversuche basierend auf der Länge des Textes
function calculateAttemptsBasedOnLength() {
    const uniqueLetters = new Set(selectedText.toLowerCase().replace(/[^a-z]/g, ""));
    const uniqueLetterCount = uniqueLetters.size;

    if (selectedText.split(" ").length > 10) {
        attempts = 2; // Sehr lange Zitate: Nur 1 Fehlversuch
    } else if (selectedText.split(" ").length <= 3) {
        attempts = 4; // Sehr kurze Zitate oder Wörter: Maximal 3 Fehlversuche
    } else {
        attempts = Math.max(2, Math.min(10, Math.round(10 - (uniqueLetterCount / 26) * 8)));
    }
}



// Am Ende des Spiels die Zeit berechnen
function calculateTime() {
    endTime = Date.now();
    timeElapsed = Math.round((endTime - startTime) / 1000); // Zeit in Sekunden
}

let timer = 0;
let timerInterval;

function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        document.getElementById('timer').textContent = timer;
    }, 1000);
}


// Funktion zur Initialisierung des Spiels
function setupGame() {
    displayedText = "";
    for (let char of selectedText) {
        if (char === " " || /[.,?!]/.test(char)) {
            displayedText += char; // Leerzeichen und Satzzeichen beibehalten
        } else {
            displayedText += "_"; // Unterstrich für Buchstaben
        }
    }
    wordDisplay.textContent = displayedText;
    attemptsElement.textContent = attempts;
    wrongGuessesElement.textContent = "";
    messageElement.textContent = "";
    newGameButton.classList.add('hidden'); // Verstecke den neuen Spiel-Button
    startTime = Date.now();
    // startTimer();
    resetLetterButtons(); // Buchstabenkontainer zurücksetzen
    wrongGuesses = 0; // Falsche Versuche zurücksetzen
    resetRightImagePosition();
}
    
function shortenQuote(quote) {
    const match = quote.match(/[^.!?]*[.!?]/); // Finde den ersten (Teil-)Satz
    return match ? match[0] : quote; // Verwende den ersten Satz oder das gesamte Zitat, wenn kein Satzzeichen gefunden wurde
}


// Funktion zum Abrufen eines zufälligen Zitats
async function fetchQuote(category) {
    const apiKey = 'RrZysyaLayghl49v6DyMEA==oHOpufn4N53ij6iB'; // API-Schlüssel
    const response = await fetch(`https://api.api-ninjas.com/v1/quotes?category=${category}`, {
        headers: {
            'X-Api-Key': apiKey
        }
    });

    if (response.ok) {
        const data = await response.json();
        selectedText = shortenQuote(data[0].quote); // Zitat kürzen auf den ersten Satz
        calculateAttemptsBasedOnLength(); // Versuche basierend auf Zitatlänge berechnen
        setupGame();
    } else {
        messageElement.textContent = "Fehler beim Abrufen des Zitats.";
    }
}

// Funktion zum Abrufen eines zufälligen Wortes
async function fetchRandomWord(lang, length) {
    const response = await fetch(`https://random-word-api.herokuapp.com/word?length=${length}&lang=${lang}`);

    if (response.ok) {
        const data = await response.json();
        selectedText = data[0]; // Zufälliges Wort auswählen
        //calculateAttemptsBasedOnLength(); // Versuche basierend auf Wortlänge berechnen
        attempts=1;
        setupGame();
    } else {
        messageElement.textContent = "Fehler beim Abrufen des Wortes.";
    }
    
    attempts=6;
    // selectedText = "Hase"; // das ist nützlich um das SPiel mit eine fixen Wort zu testen
    setupGame();
}





// Spiel starten
playGameButton.addEventListener('click', () => {
    const playerName = playerNameInput.value;
    playerDisplay.textContent = playerName;
    
    // Verstecke das Spielmenü, zeige die Spielseite
    gameMenu.classList.add('hidden');
    gamePage.classList.remove('hidden');
    gameMenu.classList.remove("visible");

    // Prüfe, welcher Spielmodus gewählt wurde
    if (gameTypeSelect.value === 'quote') {
        const category = document.getElementById('category').value;
        fetchQuote(category);   // Hole ein Zitat basierend auf der gewählten Kategorie
    } else if (gameTypeSelect.value === 'word') {
        const language = document.getElementById('language').value;
        const wordLength = wordLengthInput.value;
        fetchRandomWord(language, wordLength); // Hole ein Wort basierend auf Sprache und Länge
    }
    
});

// #############################################################################
//  THE LOGIC OF THE GAME
const letterButtons = document.querySelectorAll('.letter-btn');
const rightImage = document.getElementById('rightBottomImage');

let wrongGuesses = 0;  // Zähler für falsche Buchstaben
rightImage.style.right = "30px";

// Event Listener für jeden Buchstaben-Button hinzufügen
letterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const letter = button.textContent;  // Buchstabe aus dem Button holen
        handleLetterGuess(letter);          // Überprüfen, ob der Buchstabe korrekt ist

        // Button deaktivieren, nachdem er gewählt wurde
        button.disabled = true;
        // button.classList.add('disabled'); 
    });
});


// Beispiel-Funktion, um zu prüfen, ob das Wort vollständig geraten wurde
function isWordComplete() {
    return !displayedText.includes('_');
}

function updateDisplayedText(letter) {
    const wordDisplay = document.getElementById('wordDisplay'); // Hol dir die Wort/Zitat-Anzeige
    let updatedDisplay = '';

    // Durch das aktuelle Wort iterieren und Buchstaben aktualisieren
    for (let i = 0; i < selectedText.length; i++) {
        if (selectedText[i].toLowerCase() == letter.toLowerCase()) {
            updatedDisplay += selectedText[i];  // Richtig geratener Buchstabe
        } else if (displayedText[i] !== '_') {
            updatedDisplay += displayedText[i];  // Bereits aufgedeckter Buchstabe
        } else {
            updatedDisplay += '_';  // Noch nicht erratener Buchstabe
        }
    }

    displayedText = updatedDisplay;
    wordDisplay.textContent = displayedText;  // Aktualisiere die Anzeige
}


function updateButtonStyle(letter, isCorrect) {
    const button = Array.from(letterButtons).find(btn => btn.textContent.toLowerCase() === letter.toLowerCase());
    
    if (button) {
        button.disabled = true; // Button deaktivieren
        if (isCorrect) {
            button.style.backgroundColor = 'green'; // Richtig geraten -> grün
        } else {
            button.style.backgroundColor = 'red'; // Falsch geraten -> rot
        }
    }
}

const initialRightPosition = 20; // Startposition von rechts in Pixel
function updateRightImagePosition(remainingAttempts) {
    const screenWidth = window.innerWidth; // Bildschirmbreite
    const stepSize = screenWidth / attempts; // Schrittgröße berechnen

    // // Berechne die neue Position basierend auf den verbleibenden Versuchen
    let newRightPosition = initialRightPosition + (wrongGuesses *  stepSize);
    // console.log(newRightPosition)
    // console.log(screenWidth)
    console.log(stepSize)
    // console.log(remainingAttempts)

    // // Setze die neue Position
    // Beim handygrößen darf das männchen nicht ganz so weitlaufen
    if (screenWidth <= 480) {
        newRightPosition -= 100; // Ziehe 30 Pixel ab
    }
    rightImage.style.right = `${newRightPosition}px`;
}

function resetRightImagePosition() {
    wrongGuesses = 0; // Zurücksetzen der Fehlversuche
    rightImage.style.right = `${initialRightPosition}px`; // Setze die Position zurück
}



function handleLetterGuess(letter) {
    if (selectedText.toLowerCase().includes(letter.toLowerCase())) {
        // Buchstabe ist im Zitat/Wort enthalten
        console.log(`Der Buchstabe ${letter} ist korrekt!`);
        messageElement.textContent = `Der Buchstabe ${letter} ist korrekt!`;
        // Hier kannst du die Darstellung des Zitats/Wortes aktualisieren
        updateDisplayedText(letter)
        updateButtonStyle(letter, true)
    } else {
        // Falscher Buchstabe
        console.log(`Der Buchstabe ${letter} ist nicht in ${selectedText}`);
        messageElement.textContent = "Falsch! Versuche es erneut.";
        wrongGuesses++;
        attemptsElement.textContent = attempts-wrongGuesses;
        updateRightImagePosition(attempts-wrongGuesses);
        updateButtonStyle(letter, false)
    }

    checkGameStatus(); // Prüfen, ob das Spiel gewonnen/verloren wurde
}


// ############################################################################
// spiele zu ende
const congratulationsPage = document.getElementById('congratulationsPage');
const lostPage = document.getElementById('lostPage');

function checkGameStatus() {
    if (wrongGuesses >= attempts) {
        console.log("Spiel verloren!");
        messageElement.textContent = "Spiel verloren!"
        calculateTime();
        setTimeout(showLostPage, 500); // Zeige die Verliereseite an
        // Spiel beenden und entsprechende Nachricht anzeigen
    }

    if (isWordComplete()) {
        console.log("Spiel gewonnen!");
        messageElement.textContent = "Spiel gewonnen!"
        calculateTime();
        setTimeout(showCongratulationsPage, 1000);  // Zeige die Gratulationsseite an
        // Spiel beenden und entsprechende Nachricht anzeigen
    }
}


function showCongratulationsPage() {
    const wordBox = document.getElementById('wordBox');
    const attemptsCount = document.getElementById('attemptsCountWin');
    const timeTaken = document.getElementById('timeTakenWin');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const score = calculateScore(timeTaken, wrongGuesses);
    console.log(score)
    scoreDisplay.textContent = `Score: ${score}`;

    // Setze die Werte für das gewonnene Spiel
    wordBox.textContent = selectedText; // Das gesuchte Wort anzeigen
    wordBox.classList.add('win'); // Färbe die Box grün
    attemptsCount.textContent = wrongGuesses; // Gebrauchte Versuche
    timeTaken.textContent = `${timeElapsed} Sekunden`; // Benötigte Zeit anzeigen
    document.body.style.background = "url('unnamed_sad_happy.png') no-repeat center center fixed";  // Hintergrund ändern
    document.body.style.backgroundPosition = "cover";  // Positionie

    gamePage.classList.add('hidden'); // Verstecke die Spieleseite
    congratulationsPage.classList.remove('hidden'); // Zeige die Gratulationsseite an
}

function showLostPage() {
    const wordBoxLost = document.getElementById('wordBoxLost');
    const attemptsCount = document.getElementById('attemptsCountLose');
    const timeTaken = document.getElementById('timeTakenLose');

    // Setze die Werte
    wordBoxLost.textContent = selectedText; // Das gesuchte Wort anzeigen
    wordBoxLost.classList.add('lose'); // Färbe die Box rot
    attemptsCount.textContent = wrongGuesses; // Gebrauchte Versuche
    timeTaken.textContent = `${timeElapsed} Sekunden`; // Benötigte Zeit anzeigen
    
    // Hintergrund ändern, so dass es die gesamte Seite abdeckt
    document.body.style.background = "url('unnamed.png') no-repeat center center";  
    document.body.style.backgroundSize = "cover";  // Hintergrund so skalieren, dass er die gesamte Fläche abdeckt

    // Verstecke die Spieleseite und zeige die Lost Page an
    gamePage.classList.add('hidden'); 
    lostPage.classList.remove('hidden'); 
}



function resetLetterButtons() {
    const letterButtons = document.querySelectorAll('.letter-btn'); // Alle Buchstabenschaltflächen auswählen

    letterButtons.forEach(button => {
        button.disabled = false; // Button aktivieren
        button.style.backgroundColor = 'gray'; // Standardfarbe für den Button (grau oder jede gewünschte Farbe)
        button.classList.remove('disabled'); // Entferne die disabled-Klasse, falls vorhanden
    });
}


function handleButtonClick(action) {
    switch (action) {
        case 'playAgain':
            gamePage.classList.add('hidden');
            gameMenu.classList.remove('hidden');
            gameMenu.classList.add('visible');
            congratulationsPage.classList.add('hidden');
            lostPage.classList.add('hidden');
            document.body.style.background = "url('wtqqnkYDYi2ifsWZVW2MT4-970-80.jpg.webp') no-repeat center center fixed";  // Hintergrund ändern
            document.body.style.backgroundSize = "cover";
            break;
        case 'quit':
            gameMenu.classList.add('hidden');
            congratulationsPage.classList.add('hidden');
            lostPage.classList.add('hidden');
            welcomePage.classList.remove('hidden');
            document.body.style.background = "url('vecteezy_a-word-hello-by-handwriting-on-the-beach-and-sea-wave_15186988.jpeg') no-repeat center center fixed";  // Hintergrund ändern
            document.body.style.backgroundSize = "cover";
            break;
        default:
            break;
    }
}

// Füge Event Listener für die Verlustseite hinzu
document.getElementById('playAgainButtonWin').addEventListener('click', () => handleButtonClick('playAgain'));
document.getElementById('quitButtonWin').addEventListener('click', () => handleButtonClick('quit'));
document.getElementById('playAgainButtonLose').addEventListener('click', () => handleButtonClick('playAgain'));
document.getElementById('quitButtonLose').addEventListener('click', () => handleButtonClick('quit'));

function calculateScore(timeTaken, attempts) {
    let score = 0; // Initialize the score variable
    // Simple scoring logic: points based on time and attempts
    const maxTime = 60; // Max time limit for scoring, adjust as needed
    score = Math.max(0, (maxTime - timeElapsed) * 10 - attempts * 5); // Adjust scoring logic as needed
    return score;
}




