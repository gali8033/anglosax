const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const nrBoxes = 25;
const nrLetters = 5;
const nrRows = 5;
const colors = {
  success: '#2ecc71',
  error: '#e74c3c',
  correctLetter: '#2ecc71',
  memberLetter: '#f1c40f',
  nonMemberLetter: '#444444',
};

function makeAnnouncement(message, error) {
  let announcementBox = document.getElementById('announcementBox');
  announcementBox.innerHTML = message;
  if (error) {
    announcementBox.style.backgroundColor = colors.error;
  } else {
    announcementBox.style.backgroundColor = colors.success;
  }
  announcementBox.style.display = 'block';

  setTimeout(() => {
    announcementBox.style.display = 'none';
  }, 2000);
}

function getRandomWord() {
  let index = Math.floor((Math.random() * words.length) + 1);
  return words[index];
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

for (let row = 1; row <= nrRows; row++) {
  for (let letter = 1; letter <= nrLetters; letter++) {
    let input = '';
    if (row === 1) {
      input = "<input type='text' autocomplete='off' maxlength='1' class='noSelect inputBox' id='"+row+"-"+letter+"' />";
    } else {
      input = "<input type='text' autocomplete='off' maxlength='1' class='noSelect inputBox' id='"+row+"-"+letter+"' disabled/>";
    }
    inputContainer.innerHTML += input;
  }
}

// Alphabet boxes
const alphabetContainer = document.getElementById('alphabetContainer');
for (let i = 0; i < alphabet.length; i++) {
  let letter = alphabet[i];
  let letterButton = "<button class='noSelect letterBox' id='letter-"+letter.toLocaleLowerCase()+"'>"+letter+"</button>";
  if ((i+1)%10==0) {
    alphabetContainer.innerHTML += letterButton;
    alphabetContainer.innerHTML += "<br />"
  } else {
    alphabetContainer.innerHTML += letterButton;
  }
}
function inputLetterFromAlphabet(letterToInput) {
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
    inputLetterFromAlphabet(letter);
  } else if (id.includes("-")) {
      if (e.key === 'Enter') {
        // code for enter
      }
  } 
});

// Listen for clicks on the keyboard/alphabet written out
document.body.addEventListener('keypress', (e) =>{
  console.log(e.key)
  if (e.key === 'Enter') {
    checkWord();
  } else if (e.target.id.includes('-') && !e.target.id.includes('letter-') ) {
    e.target.value = e.key;
    return
  }
});

let guessBtn = document.getElementById('guessBtn');
let clearBtn = document.getElementById('clearBtn');
let restartBtn = document.getElementById('restartBtn');

// Listen for guess click
guessBtn.addEventListener('click', (e) => {
  e.preventDefault();
  checkWord();
});

// Listen for clear click
clearBtn.addEventListener('click', (e) => {
  e.preventDefault();
  clearLetter();
});

// Listen for restart click
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

  return 5
}

// Checks where the user is - letter number
function findLetter() {
  for (let row = 1; row <= nrRows; row++) {
    for (let letter = 1; letter <= nrLetters; letter++) {
      if (document.getElementById(row+'-'+letter).value === '') {
        if (letter-1 === 0) {
          return 5
        } else {
          return letter - 1
        }
      }
    }
  }

  return 5
}

function wordExists(word) {
  return words.includes(word.toLowerCase())
}

function getRowFromBoard(row) {
  let word = ""
  for (let i = 1; i <= 5;i++) {
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

let map = {
  "row1": {},
  "row2": {},
  "row3": {},
  "row4": {},
  "row5": {}
}

function giveLetterHints(row, guess) {
  const correctWordArray = correctWord.split('');
  const guessedWordArray = guess.split('');

  for (let i = 0; i < nrLetters; i++) {
    occurrences = 0
    for (let j = 0; j < nrLetters; j++) {
      if (guessedWordArray[i]===correctWordArray[j]) {
        occurrences++;
      }
    }
    if (guessedWordArray[i]===correctWordArray[i]) {
      map['row'+row][guessedWordArray[i]] = {
        occurrences: occurrences,
        marking: 1,
        timesMarked: 0,
      };
    } else if (correctWordArray.includes(guessedWordArray[i])) {
      map['row'+row][guessedWordArray[i]] = {
        occurrences: occurrences,
        marking: 0,
        timesMarked: 0,
      };
    } else {
      map['row'+row][guessedWordArray[i]] = {
        occurrences: occurrences,
        marking: -1,
        timesMarked: 0,
      };
    }
  }
  for (let i = 0; i < nrLetters; i++) {
    let input = document.getElementById(row+'-'+(i+1));
    if (map['row'+row][guessedWordArray[i]].occurrences 
    > map['row'+row][guessedWordArray[i]].timesMarked 
    && map['row'+row][guessedWordArray[i]].marking === 0) {
      // Mark yellow
      input.style.backgroundColor = colors.memberLetter;
      map['row'+row][guessedWordArray[i]].timesMarked += 1
      findAndMarkAlphabetLetter(guessedWordArray[i], 'member');
    } else if (guessedWordArray[i] !== correctWordArray[i] && map['row'+row][guessedWordArray[i]].marking === -1){
      findAndMarkAlphabetLetter(guessedWordArray[i], 'nonMember');
    } else if (guessedWordArray[i] === correctWordArray[i] && map['row'+row][guessedWordArray[i]].marking === 1) {
      input.style.backgroundColor = colors.correctLetter;
      findAndMarkAlphabetLetter(guessedWordArray[i], 'correct');
    }
  }
}

function toggleRow(row, disabled) {
  for (let letter = 1; letter <= 5; letter++) {
    document.getElementById(row+'-'+letter).disabled = disabled
  }
}

function highlightRow(row) {
  let writeArr = ['W','R','I','T','E'];
  for (let letter = 1; letter <= 5; letter++) {
    let input = document.getElementById(row+'-'+letter);
    input.placeholder = writeArr[letter-1];
  }
}


const correctWord = getRandomWord();
highlightRow(findRow())

function checkWord() {
  const row = findRow();

  // Get word
  let guess = getRowFromBoard(row).toLowerCase();

  if (guess.length === 5) {
    if (wordExists(guess)) {
      if (guess === correctWord) {
        makeAnnouncement('You have gussed the correct word', false);
      } else {
        makeAnnouncement('You have gussed the incorrect word', true);
      }

      // highlight Letters
      giveLetterHints(row, guess);

      // Disable Row
      toggleRow(row, true);
      
      // Enable Next Row
      toggleRow(row+1, false);

      // highlight row
      highlightRow(row+1);

    } else {
      makeAnnouncement('"'+guess+'" doesn\'t exist in our list', true);
    }
  } else {
    makeAnnouncement('The word is 5 letters', true);
  }


}