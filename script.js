const storedLanguage = localStorage.getItem('language');
const storedNrRows = localStorage.getItem('nrRows');
const alphabetEn = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const alphabetSwe = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Å', 'Ä', 'Ö'];
const keyboardEn = ['Q','W','E','R','T','Y','U','I','O','P','','A','S','D','F','G','H','J','K','L','','Enter','Z','X','C','V','B','N','M','Clear'];
const keyboardSwe = ['Q','W','E','R','T','Y','U','I','O','P','Å','','A','S','D','F','G','H','J','K','L','Ö','Ä','','Enter','Z','X','C','V','B','N','M','Clear'];

var language = 'en';
language = storedLanguage !== null ? storedLanguage : 'swe';
var alphabet = language === 'en' ? alphabetEn : alphabetSwe;
var keyboard = language === 'en' ? keyboardEn : keyboardSwe;
var words = language === 'en' ? wordsEn : wordsSwe;

const nrBoxes = 25;
const nrLetters = 5;
const minNrRows = 1;
const maxNrRows = 10;
const defaultNrRows = 6;
var nrRows = 3;
nrRows = storedNrRows !== null ? storedNrRows : defaultNrRows;
const colors = {
  success: '#2ecc71',
  error: '#e74c3c',
  correctLetter: '#2ecc71',
  memberLetter: '#f1c40f',
  nonMemberLetter: '#444444',
};

const correctWord = getRandomWord();

function getRandomWord() {
  let index = Math.floor((Math.random() * words.length) + 1);
  return words[index];
}

const rowsSelection = document.getElementById('rowsSelection');
rowsSelection.getElementsByTagName('option')[nrRows-1].selected = 'selected';

const toggleLanguageButton = document.getElementById('toggleLanguageBtn');
toggleLanguageButton.innerText = language === 'en' ? 'Byt till svenska' : 'Change to english';

toggleLanguageButton.addEventListener('click', (e) => {
  language = language === 'swe' ? 'en' : 'swe';
  toggleLanguageButton.innerText = language === 'en' ? 'Byt till svenska' : 'Change to english';
  localStorage.setItem('language', language);
  restart();
});

const cookiesPrompt = document.getElementById('cookiesPrompt');
const cookies = localStorage.getItem('cookies');

if (cookies === 'accepted') {
  cookiesPrompt.style.display = 'none';
}

const acceptCookiesBtn = document.getElementById('acceptCookiesBtn');
acceptCookiesBtn.addEventListener('click', (e) => {
  localStorage.setItem('cookies', 'accepted');
  cookiesPrompt.style.display = 'none';
});

function makeAnnouncement(message, error, timer) {
  let announcementBox = document.getElementById('announcementBox');
  announcementBox.innerHTML = message;
  if (error) {
    announcementBox.style.backgroundColor = colors.error;
  } else {
    announcementBox.style.backgroundColor = colors.success;
  }
  announcementBox.style.display = 'block';

  if (timer) {
    setTimeout(() => {
      announcementBox.style.display = 'none';
    }, 2000);
  }
}

// Input boxes (letter boxes)
const inputContainer = document.getElementById('inputContainer');

// Change input when filling input // Code from stackoverflow: https://stackoverflow.com/questions/15595652/focus-next-input-once-reaching-maxlength-value
inputContainer.onkeyup = (e) => {
  let target = e.target;
  let maxLength = parseInt(target.attributes["maxlength"].value, 10);
  let targetLength = target.value.length;

  if (targetLength >= maxLength) {
    let next = target;
    while (next = next.nextElementSibling) {
      if (next == null || next.disabled) {
        break;
      }

      if (next.tagName.toLowerCase() === "input") {
        next.focus();
        break;
      }
    }
  } else if (targetLength === 0) {
    let previous = target;
    while (previous = previous.previousElementSibling) {
      if (previous == null || previous.disabled)
        break;
      if (previous.tagName.toLowerCase() === "input") {
        previous.focus();
        break;
      }
    }
  }
};

function outputBoxes() {
  inputContainer.innerHTML = '';
  for (let row = 1; row <= nrRows; row++) {
    for (let letter = 1; letter <= nrLetters; letter++) {
      let element = '';
      if ((letter)%nrLetters === 0) {
        if (row === 1) {
          element = "<input type='text' autocomplete='off' maxlength='1' class='noSelect inputBox' id='"+row+"-"+letter+"' /><br />";
        } else {
          element = "<input type='text' autocomplete='off' maxlength='1' class='noSelect inputBox' id='"+row+"-"+letter+"' disabled/><br />";
        }
      } else if (row === 1) {
        element = "<input type='text' autocomplete='off' maxlength='1' class='noSelect inputBox' id='"+row+"-"+letter+"' />";
      } else {
        element = "<input type='text' autocomplete='off' maxlength='1' class='noSelect inputBox' id='"+row+"-"+letter+"' disabled/>";
      }
      inputContainer.innerHTML += element;
    }
  }
}
outputBoxes();

const alphabetContainer = document.getElementById('alphabetContainer');

function outputKeyboard() {
  alphabetContainer.innerHTML = '';
  let element = '';
  for (const key of keyboard) {
    if (key === 'Enter') {
      element = '<button class="letterBoxFunction primaryBtn" id="enterBtn">Guess</button>';
    } else if (key === 'Clear') {
      element = '<button class="letterBoxFunction primaryBtn" id="clearBtn">Clear</button>';
    } else if (key === '') {
      element = '<br />';
    } else {
      element = "<button class='noSelect letterBox primaryBtn' id='letter-"+key.toLocaleLowerCase()+"'>"+key+"</button>"
    }

    alphabetContainer.innerHTML += element;
  }
}

outputKeyboard();

function inputLetterFromKeyboard(letterToInput) {
  for (let row = 1; row <= nrRows; row++) {
    for (let letter = 1; letter <= nrLetters; letter++) {
      if (document.getElementById(row+'-'+letter).value === '') {
        let input = document.getElementById((row)+'-'+letter);
        if (!input.disabled) {
          input.value = letterToInput;
        }

        return
      }
    }
  }
}

// Listen for clicks on the keyboard/alphabet written out
document.body.addEventListener('click', (e) =>{
  e.preventDefault()
  let id = e.target.id;
  let letter = id.slice(-1).toUpperCase();
  if (id.includes("letter-") && alphabet.includes(letter)) {
    inputLetterFromKeyboard(letter);
  } else if (id.includes("-")) {
      if (e.key === 'Enter') {
        // code for enter
      }
  } 
});

// Listen for clicks on the keyboard/alphabet written out
document.body.addEventListener('keypress', (e) =>{
  if (e.key === 'Enter') {
    checkWord();
  } else if (e.target.id.includes('-') && !e.target.id.includes('letter-') ) {
    // e.target.value = e.key;
    // return
  }
});

// Listen for guess click
let enterBtn = document.getElementById('enterBtn');
enterBtn.addEventListener('click', (e) => {
  e.preventDefault();
  checkWord();
});

// Listen for clear click
let clearBtn = document.getElementById('clearBtn');
clearBtn.addEventListener('click', (e) => {
  e.preventDefault();
  clearLetter();
});

// Listen for restart click
let restartBtn = document.getElementById('restartBtn');
restartBtn.addEventListener('click', (e) => {
  e.preventDefault();
  restart();
});

// Clear Letter
function clearLetter() {
  const row = findRow();
  const letter = findLetter();
  let input = document.getElementById(row+'-'+letter);
  if (!input.disabled) {
    input.value = '';
  }
}

// Restart Game
function restart() {
  localStorage.setItem('nrRows', rowsSelection.value);

  location.reload();
}

// Checks where the user is - row number
function findRow() {
  for (let row = 1; row <= nrRows; row++) {
    for (let letter = 1; letter <= nrLetters; letter++) {
      if (document.getElementById(row+'-'+letter).value === '') {
        if (row > 1 && letter === 1 && document.getElementById(row+'-'+letter).value === '') {
          return row-1
        } else {
          return row
        }
      }
    }
  }

  return nrRows
}

// Checks where the user is - letter number
function findLetter() {
  for (let row = 1; row <= nrRows; row++) {
    for (let letter = 1; letter <= nrLetters; letter++) {
      if (document.getElementById(row+'-'+letter).value === '') {
        if (letter-1 === 0) {
          return nrLetters
        } else {
          return letter - 1
        }
      }
    }
  }

  return nrLetters
}

function wordExists(word) {
  return words.includes(word.toLowerCase())
}

function getWordFromBoard(row) {
  let word = ""
  for (let i = 1; i <= nrLetters;i++) {
    word+=document.getElementById(row+'-'+i).value;
  }
  return word
}

function findAndMarkAlphabetLetter(letter, type) {
  let color = '';
  if (type === 'correct') {
    color = colors.correctLetter;
  } else if (type === 'member') {
    color = colors.memberLetter;
  } else if (type === 'nonMember') {
    color = colors.nonMemberLetter;
  }

  let button = document.getElementById('letter-'+letter)
  button.style.backgroundColor = color;
}

let map = {}
for (let x = 1; x <= nrRows; x++) {
  map["row"+x] = { }
}

function giveLetterHints(row, guess) {
  const correctWordArray = correctWord.split('');
  const guessedWordArray = guess.split('');
  
  for (let i = 0; i < nrLetters; i++) {

    let occurrences = 0;
    for (let j = 0; j < nrLetters; j++) {
      if (guessedWordArray[i] === guessedWordArray[j]) {
        occurrences++;
      }
    }

    let guessed = guessedWordArray[i];
    let correct = correctWordArray[i];
    let mapItemExists = map['row'+row].hasOwnProperty(guessed);
    let letterObject = {
      letter: guessed,
      occurrences: occurrences,
      timesMarked: 0,
      index: 0,
    };

    if (guessed===correct) {
      if (!mapItemExists) {
        map['row'+row][guessed]= { marking: [1], ...letterObject };
      } else {
        map['row'+row][guessed].marking.push(1);
      }
    } else if (correctWordArray.includes(guessed)) {
      if (!mapItemExists) {
        map['row'+row][guessed] = { marking: [0], ...letterObject };
      } else {
        map['row'+row][guessed].marking.push(0);
      }
    } else {
      if (!mapItemExists) {
        map['row'+row][guessed] = { marking: [-1], ...letterObject };
      } else {
        map['row'+row][guessed].marking.push(-1);
      }
    }
  }

  for (let i = 0; i < nrLetters; i++) {
    let guessed = guessedWordArray[i];
    let input = document.getElementById(row+'-'+(i+1));
    let mapItem = map['row'+row][guessed];
    occurrences = mapItem.occurrences;
    let timesMarked = mapItem.timesMarked;

    if (mapItem.marking[mapItem.index] === 1) {
      input.style.backgroundColor = colors.correctLetter
      input.style.border = "2px solid "+colors.correctLetter;
      findAndMarkAlphabetLetter(guessed, 'correct');
    } else if (mapItem.marking[mapItem.index] === 0) {
      if (occurrences > timesMarked && mapItem.marking[mapItem.index-1] !== 0) {
        if (guessed === 'a') {
          console.log(occurrences)
          console.log(timesMarked)
        }
        input.style.backgroundColor = colors.memberLetter;
        input.style.border = "2px solid "+colors.memberLetter;
        findAndMarkAlphabetLetter(guessed, 'member');
        map['row'+row][guessed].timesMarked += 1;
      }
    } else if (mapItem.marking[mapItem.index] === -1) {
      input.style.backgroundColor = colors.nonMemberLetter
      input.style.border = "2px solid "+colors.nonMemberLetter;
      findAndMarkAlphabetLetter(guessed, 'nonMember');
    }

    mapItem.index += 1;
  }
}

function toggleRow(row, disabled) {
  for (let letter = 1; letter <= nrLetters; letter++) {
    document.getElementById(row+'-'+letter).disabled = disabled
  }
}

function highlightRow(row) {
  let writeArr = language === 'en' ? ['W','R','I','T','E'] : ['S','K','R','I','V'];
  for (let letter = 1; letter <= nrLetters; letter++) {
    let input = document.getElementById(row+'-'+letter);
    input.placeholder = writeArr[letter-1];
  }
}

highlightRow(findRow())

function checkWord() {
  const row = findRow();

  // Get word
  let guess = getWordFromBoard(row).toLowerCase();

  if (guess.length === nrLetters) {
    if (wordExists(guess)) {
      if (guess === correctWord) {
        makeAnnouncement('You have gussed the correct word!', false, false);

        // highlight Letters
        giveLetterHints(row, guess);
        
        // Disable Row
        toggleRow(row, true);
      } else {

        if (row === nrRows) {
          makeAnnouncement('Game Over! The correct word was "'+correctWord+'"', true, false);
        }

        // highlight Letters
        giveLetterHints(row, guess);

        // Disable Row
        toggleRow(row, true);
        
        // Enable Next Row
        toggleRow(row+1, false);

        // highlight row
        highlightRow(row+1);
      }
    } else {
      makeAnnouncement('"'+guess+'" doesn\'t exist in our list', true, true);
    }
  } else {
    makeAnnouncement('The word is '+nrLetters+' letters', true, true);
  }


}