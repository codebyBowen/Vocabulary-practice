let words = [];
let translations = [];
let notMasteredWords = [];
let notMasteredTranslations = [];
let currentIndex = 0;
let currentArray = 'initial';
let isAutoPronounceOn = false;
let isLoopPronunciationOn = false;
let loopInterval;

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
    updateNotMasteredList();
    hideInputSection();
    showProgressBar();
}

function isNonEnglish(text) {
    return /[\u4e00-\u9fa5]/.test(text);
}

function updateDisplay() {
    const wordDisplay = document.getElementById('word-display');
    const translationDisplay = document.getElementById('translation');
    const currentWords = currentArray === 'initial' ? words : notMasteredWords;
    
    if (currentWords.length > 0) {
        wordDisplay.textContent = currentWords[currentIndex];
        translationDisplay.textContent = '';
        updateProgressBar();
        if (isAutoPronounceOn) {
            pronounceWord();
        }
        if (isLoopPronunciationOn) {
            stopLoopPronunciation();
            startLoopPronunciation();
        }
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
    } else {
        currentIndex = currentWords.length - 1;
    }
    updateDisplay();
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

function masterWord() {
    if (currentArray === 'notMastered' && notMasteredWords.length > 0) {
        notMasteredWords.splice(currentIndex, 1);
        notMasteredTranslations.splice(currentIndex, 1);
        updateNotMasteredList();
    }
    nextWord();
}

function notMasterWord() {
    if (currentArray === 'initial' && words.length > 0) {
        if (!notMasteredWords.includes(words[currentIndex])) {
            notMasteredWords.push(words[currentIndex]);
            notMasteredTranslations.push(translations[currentIndex]);
            updateNotMasteredList();
        }
    }
    nextWord();
}

function pronounceWord() {
    const currentWords = currentArray === 'initial' ? words : notMasteredWords;
    if (currentWords.length > 0) {
        const wordToSpeak = currentWords[currentIndex].split(' ')[0];
        const utterance = new SpeechSynthesisUtterance(wordToSpeak);
        utterance.lang = 'en-US';
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
    switchBtn.textContent = currentArray === 'initial' ? 'Practice difficult words' : 'Back to all words';
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const darkModeBtn = document.getElementById('dark-mode-btn');
    darkModeBtn.innerHTML = document.body.classList.contains('dark-mode') ? 
        '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

function updateNotMasteredList() {
    const list = document.getElementById('not-mastered-list');
    list.innerHTML = '';
    notMasteredWords.forEach((word, index) => {
        const li = document.createElement('li');
        li.textContent = `${word} - ${notMasteredTranslations[index]}`;
        list.appendChild(li);
    });
}

function hideInputSection() {
    document.getElementById('input-section').style.display = 'none';
}

function showProgressBar() {
    document.getElementById('progress-bar-container').style.display = 'flex';
}

function updateProgressBar() {
    const progressBar = document.querySelector('.progress');
    const progressNumber = document.querySelector('.progress-number');
    const currentWords = currentArray === 'initial' ? words : notMasteredWords;
    const progress = ((currentIndex + 1) / currentWords.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressNumber.textContent = `${currentIndex + 1}/${currentWords.length}`;
}

function toggleAutoPronounce() {
    isAutoPronounceOn = !isAutoPronounceOn;
    const autoPronounceBtn = document.querySelector('.btn-group button:nth-child(2)');
    autoPronounceBtn.textContent = isAutoPronounceOn ? 'Auto-Pronounce: On' : 'Auto-Pronounce: Off';
    if (isAutoPronounceOn) {
        pronounceWord();
    }
}

function toggleLoopPronunciation() {
    isLoopPronunciationOn = !isLoopPronunciationOn;
    const loopBtn = document.getElementById('loop-btn');
    if (isLoopPronunciationOn) {
        loopBtn.textContent = 'Loop Pronunciation: On';
        loopBtn.classList.add('loop-active');
        startLoopPronunciation();
    } else {
        loopBtn.textContent = 'Loop Pronunciation: Off';
        loopBtn.classList.remove('loop-active');
        stopLoopPronunciation();
    }
}

function startLoopPronunciation() {
    pronounceWord(); // Pronounce immediately when starting
    loopInterval = setInterval(pronounceWord, 2000); // Pronounce every 2 seconds
}

function stopLoopPronunciation() {
    clearInterval(loopInterval);
}

function endPractice() {
    document.getElementById('progress-bar-container').style.display = 'none';
    document.getElementById('input-section').style.display = 'block';
    currentIndex = 0;
    stopLoopPronunciation();
    isLoopPronunciationOn = false;
    document.getElementById('loop-btn').textContent = 'Loop Pronunciation: Off';
    document.getElementById('loop-btn').classList.remove('loop-active');
    updateDisplay();
}

function downloadCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Word,Translation\n";
    notMasteredWords.forEach((word, index) => {
        csvContent += `${word},${notMasteredTranslations[index]}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "not_mastered_words.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}