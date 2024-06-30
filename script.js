let words = [];
let translations = [];
let notMasteredWords = [];
let notMasteredTranslations = [];
let currentIndex = 0;
let currentArray = 'initial'; // 'initial' or 'notMastered'

function processInput() {
    const input = document.getElementById('input-string').value;
    const entries = input.split(/\d+\./).map(entry => entry.trim()).filter(entry => entry !== '');
    words = [];
    translations = [];
    notMasteredWords = [];
    notMasteredTranslations = [];
    
    entries.forEach(entry => {
        const parts = entry.split(/\s+/);
        let englishPart = [];
        let chinesePart = [];
        
        for (let part of parts) {
            if (isNonEnglish(part)) {
                chinesePart.push(part);
            } else {
                englishPart.push(part);
            }
        }
        
        words.push(englishPart.join(' '));
        translations.push(chinesePart.join(' '));
    });

    currentIndex = 0;
    currentArray = 'initial';
    updateDisplay();
    updateSwitchArrayButton();
}

function isNonEnglish(text) {
    return /[\u4e00-\u9fa5]/.test(text);  // This regex specifically matches Chinese characters
}

function updateDisplay() {
    const wordDisplay = document.getElementById('word-display');
    const translationDisplay = document.getElementById('translation');
    const currentWords = currentArray === 'initial' ? words : notMasteredWords;
    
    if (currentWords.length > 0) {
        wordDisplay.textContent = currentWords[currentIndex];
        translationDisplay.textContent = '';  // Always hide translation initially
    } else {
        wordDisplay.textContent = 'No words to display';
        translationDisplay.textContent = '';
    }
}

function toggleTranslation() {
    const translationDisplay = document.getElementById('translation');
    const currentTranslations = currentArray === 'initial' ? translations : notMasteredTranslations;
    if (translationDisplay.textContent === '') {
        translationDisplay.textContent = currentTranslations[currentIndex];
    } else {
        translationDisplay.textContent = '';
    }
}

function previousWord() {
    const currentWords = currentArray === 'initial' ? words : notMasteredWords;
    if (currentIndex > 0) {
        currentIndex--;
        updateDisplay();
    }
}

function masterWord() {
    if (currentArray === 'notMastered' && notMasteredWords.length > 0) {
        notMasteredWords.splice(currentIndex, 1);
        notMasteredTranslations.splice(currentIndex, 1);
    }
    nextWord();
}

function notMasterWord() {
    if (currentArray === 'initial' && words.length > 0) {
        notMasteredWords.push(words[currentIndex]);
        notMasteredTranslations.push(translations[currentIndex]);
    }
    nextWord();
}

function nextWord() {
    const currentWords = currentArray === 'initial' ? words : notMasteredWords;
    if (currentIndex < currentWords.length - 1) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }
    updateDisplay();
}

function pronounceWord() {
    const currentWords = currentArray === 'initial' ? words : notMasteredWords;
    if (currentWords.length > 0) {
        const wordToSpeak = currentWords[currentIndex].split(' ')[0]; // Get only the first word
        const utterance = new SpeechSynthesisUtterance(wordToSpeak);
        utterance.lang = 'en-US'; // Set language to US English
        speechSynthesis.speak(utterance);
    }
}

function switchArray() {
    currentArray = currentArray === 'initial' ? 'notMastered' : 'initial';
    currentIndex = 0;
    updateDisplay();
    updateSwitchArrayButton();
}

function updateSwitchArrayButton() {
    const switchBtn = document.getElementById('switch-array-btn');
    switchBtn.textContent = currentArray === 'initial' ? 'Switch to Not Mastered Words' : 'Switch to Initial Words';
}

//test