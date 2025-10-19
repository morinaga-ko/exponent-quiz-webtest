{\rtf1\ansi\ansicpg932\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // script.js\
\
// --- \uc0\u35373 \u23450  ---\
const TIME_LIMIT = 120; // \uc0\u20840 \u20307 \u21046 \u38480 \u26178 \u38291 \u65288 \u31186 \u65289 \u65306 2\u20998 \
const ALERT_THRESHOLD = 30; // \uc0\u12479 \u12452 \u12510 \u12540 \u12364 \u36196 \u12367 \u12394 \u12427 \u38334 \u20516 \u65288 \u31186 \u65289 \
const NUM_QUESTIONS = 10; // \uc0\u20986 \u38988 \u25968 \
const varNames = ['x', 'a', 'b', 'y']; // \uc0\u20351 \u29992 \u12377 \u12427 \u22793 \u25968 \
\
let timeRemaining = TIME_LIMIT;\
let timerInterval;\
let currentQuestionIndex = 0;\
let QUIZ_QUESTIONS = []; // \uc0\u29983 \u25104 \u12373 \u12428 \u12383 \u21839 \u38988 \u12487 \u12540 \u12479 \u12434 \u26684 \u32013 \
let questionStartTime = Date.now(); // \uc0\u21508 \u21839 \u38988 \u12398 \u38283 \u22987 \u26178 \u38291 \
let totalTimeTaken = 0; // \uc0\u20840 \u20307 \u32076 \u36942 \u26178 \u38291 \u65288 \u12511 \u12522 \u31186 \u65289 \
\
// --- DOM\uc0\u35201 \u32032  ---\
const timerDisplay = document.getElementById('timer-display');\
const quizContainer = document.getElementById('quiz-container');\
const quizForm = document.getElementById('quiz-form');\
const questionArea = document.getElementById('question-area');\
const nextButton = document.getElementById('next-button');\
const resultsDiv = document.getElementById('results');\
\
// --- \uc0\u12518 \u12540 \u12486 \u12451 \u12522 \u12486 \u12451 \u38306 \u25968  ---\
function getRandomInt(min, max) \{\
    min = Math.ceil(min);\
    max = Math.floor(max);\
    return Math.floor(Math.random() * (max - min + 1)) + min;\
\}\
\
// LaTeX\uc0\u12398 \u12496 \u12483 \u12463 \u12473 \u12521 \u12483 \u12471 \u12517 \u12434 \u12456 \u12473 \u12465 \u12540 \u12503 \u12377 \u12427 \u38306 \u25968 \
function escapeLatex(latex) \{\
    // MathJax\uc0\u12398 \u25968 \u24335 \u12434 JavaScript\u12398 \u25991 \u23383 \u21015 \u12522 \u12486 \u12521 \u12523 \u12392 \u12375 \u12390 \u23433 \u20840 \u12395 \u26684 \u32013 \u12377 \u12427 \u12383 \u12417 \u12395 \u20108 \u37325 \u12496 \u12483 \u12463 \u12473 \u12521 \u12483 \u12471 \u12517 \u12434 \u20351 \u29992 \
    return latex.replace(/\\\\/g, '\\\\\\\\');\
\}\
\
// --- 1. \uc0\u21839 \u38988 \u33258 \u21205 \u29983 \u25104 \u27231 \u33021  ---\
function generateQuestion(qIndex) \{\
    // \uc0\u20197 \u21069 \u12398 \u22238 \u31572 \u12391 \u25552 \u20379 \u12373 \u12428 \u12383 \u21839 \u38988 \u29983 \u25104 \u12525 \u12472 \u12483 \u12463 \u12434 \u32173 \u25345 \
    const operation = getRandomInt(1, 3);\
    let questionText = "";\
    let correctAnswerLatex = "";\
    let correctValue = 0;\
    const varName = varNames[getRandomInt(0, varNames.length - 1)];\
\
    switch (operation) \{\
        case 1: // \uc0\u31309 \u12398 \u27861 \u21063  (a^m * a^n)\
            let m = getRandomInt(2, 5);\
            let n = getRandomInt(2, 5);\
            questionText = `\uc0\u27425 \u12398 \u35336 \u31639 \u12434 \u25351 \u25968 \u27861 \u21063 \u12395 \u24467 \u12387 \u12390 \u34892 \u12356 \u12394 \u12373 \u12356 \u12290 \\n$$$\{varName\}^$\{m\} \\\\cdot $\{varName\}^$\{n\}$$`;\
            correctValue = m + n;\
            correctAnswerLatex = `$$\{varName\}^$\{correctValue\}$`;\
            break;\
\
        case 2: // \uc0\u21830 \u12398 \u27861 \u21063  (a^m / a^n)\
            let m_q = getRandomInt(3, 7);\
            let n_q = getRandomInt(1, 6);\
            questionText = `\uc0\u27425 \u12398 \u35336 \u31639 \u12434 \u25351 \u25968 \u27861 \u21063 \u12395 \u24467 \u12387 \u12390 \u34892 \u12356 \u12394 \u12373 \u12356 \u12290 \\n$$\\\\frac\{$\{varName\}^$\{m_q\}\}\{$\{varName\}^$\{n_q\}\}$$`;\
            correctValue = m_q - n_q;\
            if (correctValue >= 0) \{\
                correctAnswerLatex = `$$\{varName\}^$\{correctValue\}$`;\
            \} else \{\
                correctAnswerLatex = `$$\\\\frac\{1\}\{$\{varName\}^$\{-correctValue\}\}$$`;\
            \}\
            break;\
\
        case 3: // \uc0\u20906 \u20055 \u12398 \u27861 \u21063  ((base*a^m)^n)\
            let m_p = getRandomInt(2, 4);\
            let n_p = getRandomInt(2, 3);\
            let base_p = getRandomInt(1, 3);\
            let base_str = base_p === 1 ? varName : base_p + varName;\
            questionText = `\uc0\u27425 \u12398 \u35336 \u31639 \u12434 \u25351 \u25968 \u27861 \u21063 \u12395 \u24467 \u12387 \u12390 \u34892 \u12356 \u12394 \u12373 \u12356 \u12290 \\n$$($\{base_str\}^$\{m_p\})^$\{n_p\}$$`;\
            correctValue = m_p * n_p;\
            let coeff = base_p === 1 ? '' : `$\{base_p\}^$\{n_p\}`;\
            correctAnswerLatex = `$$\{coeff === '' ? '' : coeff + ' '\}$\{varName\}^$\{correctValue\}$`;\
            break;\
    \}\
    \
    // \uc0\u36984 \u25246 \u32930 \u12434 \u29983 \u25104 \u12377 \u12427 \u12525 \u12472 \u12483 \u12463 \u12399 \u31777 \u30053 \u21270 \u12375 \u12289 \u27491 \u35299 \u12392 3\u12388 \u12398 \u35492 \u31572 \u65288 \u12521 \u12531 \u12480 \u12512 \u12394 \u25351 \u25968 \u65289 \u12392 \u12377 \u12427 \
    let options = [];\
    let correctOptionIndex = getRandomInt(0, 3);\
    let usedValues = new Set([correctAnswerLatex]);\
\
    for (let i = 0; i < 4; i++) \{\
        let optionLatex;\
        if (i === correctOptionIndex) \{\
            optionLatex = correctAnswerLatex;\
        \} else \{\
            let wrongValue;\
            let attempt = 0;\
            do \{\
                // \uc0\u35492 \u31572 \u12399 \u27491 \u35299 \u20516 \u12363 \u12425 \u12521 \u12531 \u12480 \u12512 \u12395 \u12378 \u12425 \u12377 \
                let offset = getRandomInt(-3, 3);\
                wrongValue = correctValue + offset;\
                \
                // \uc0\u36000 \u12398 \u25351 \u25968 \u12420 \u20998 \u25968 \u12398 \u24418 \u24335 \u12434 \u35519 \u25972 \
                if (wrongValue < 0 && operation === 2) \{\
                    optionLatex = `$$\\\\frac\{1\}\{$\{varName\}^$\{-wrongValue\}\}$$`;\
                \} else if (operation === 3 && base_p !== 1) \{\
                    let wrongCoeff = base_p === 1 ? '' : `$\{base_p\}^$\{n_p\}`;\
                    optionLatex = `$$\{wrongCoeff === '' ? '' : wrongCoeff + ' '\}$\{varName\}^$\{wrongValue\}$`;\
                \} else \{\
                    optionLatex = `$$\{varName\}^$\{wrongValue\}$`;\
                \}\
                \
                attempt++;\
                if (attempt > 10) \{ break; \}\
            \} while (usedValues.has(optionLatex) || optionLatex === correctAnswerLatex);\
\
            usedValues.add(optionLatex);\
        \}\
        options.push(\{ \
            text: escapeLatex(optionLatex), \
            isCorrect: (i === correctOptionIndex),\
            userTime: 0 // \uc0\u22238 \u31572 \u26178 \u38291 \u12434 \u35352 \u37682 \u12377 \u12427 \u12503 \u12525 \u12497 \u12486 \u12451 \
        \});\
    \}\
\
    return \{\
        questionNumber: qIndex + 1,\
        question: questionText,\
        answerOptions: options\
    \};\
\}\
\
\
// --- 2. 1\uc0\u21839 \u12372 \u12392 \u12398 \u34920 \u31034 \u12392 \u20999 \u12426 \u26367 \u12360  ---\
function renderCurrentQuestion() \{\
    if (currentQuestionIndex >= NUM_QUESTIONS) \{\
        // \uc0\u20840 \u21839 \u38988 \u32066 \u20102 \
        submitQuiz();\
        return;\
    \}\
\
    const q = QUIZ_QUESTIONS[currentQuestionIndex];\
    \
    // \uc0\u21839 \u38988 \u12398 \u34920 \u31034 \u12434 \u26356 \u26032 \
    questionArea.innerHTML = `\
        <div class="question-block" id="q$\{currentQuestionIndex\}">\
            <div class="question-title">\uc0\u21839 $\{q.questionNumber\} / $\{NUM_QUESTIONS\}</div>\
            <div class="question-text">\
                $\{q.question.replace(/\\n/g, '<br>')\}\
            </div>\
            $\{q.answerOptions.map((option, oIndex) => `\
                <div class="answer-option">\
                    <input type="radio" id="q$\{currentQuestionIndex\}o$\{oIndex\}" name="current_question" value="$\{oIndex\}">\
                    <label for="q$\{currentQuestionIndex\}o$\{oIndex\}">$\{option.text\}</label>\
                </div>\
            `).join('')\}\
        </div>\
    `;\
    \
    // \uc0\u27425 \u12408 \u12508 \u12479 \u12531 \u12398 \u12486 \u12461 \u12473 \u12488 \u12434 \u35373 \u23450 \
    nextButton.textContent = (currentQuestionIndex < NUM_QUESTIONS - 1) ? '\uc0\u27425 \u12398 \u21839 \u38988 \u12408 ' : '\u25505 \u28857 \u12377 \u12427 ';\
\
    // MathJax\uc0\u12434 \u20877 \u12524 \u12531 \u12480 \u12522 \u12531 \u12464 \
    if (window.MathJax) \{\
        window.MathJax.typesetPromise();\
    \}\
    \
    // \uc0\u21839 \u38988 \u38283 \u22987 \u26178 \u38291 \u12434 \u35352 \u37682 \
    questionStartTime = Date.now();\
    \
    // \uc0\u12501 \u12457 \u12540 \u12512 \u12392 \u12508 \u12479 \u12531 \u12434 \u34920 \u31034 \
    quizForm.style.display = 'block';\
    nextButton.style.display = 'block';\
    resultsDiv.style.display = 'none';\
\}\
\
\
// --- 3. \uc0\u27425 \u12398 \u21839 \u38988 \u12408 /\u22238 \u31572 \u36865 \u20449  ---\
function handleNextQuestion() \{\
    const q = QUIZ_QUESTIONS[currentQuestionIndex];\
    const selectedAnswer = quizForm.querySelector('input[name="current_question"]:checked');\
    \
    // \uc0\u22238 \u31572 \u26178 \u38291 \u12434 \u35352 \u37682 \
    const timeTaken = Date.now() - questionStartTime;\
    totalTimeTaken += timeTaken;\
    \
    let userAnswerIndex = -1;\
    if (selectedAnswer) \{\
        userAnswerIndex = parseInt(selectedAnswer.value);\
        q.userAnswerIndex = userAnswerIndex; // \uc0\u12518 \u12540 \u12470 \u12540 \u12398 \u22238 \u31572 \u12434 \u20445 \u23384 \
        q.userTime = timeTaken; // \uc0\u22238 \u31572 \u26178 \u38291 \u12434 \u21839 \u38988 \u12487 \u12540 \u12479 \u12395 \u35352 \u37682 \
    \} else \{\
        q.userAnswerIndex = -1; // \uc0\u28961 \u22238 \u31572 \
        q.userTime = timeTaken; // \uc0\u28961 \u22238 \u31572 \u12391 \u12418 \u35336 \u28204 \u26178 \u38291 \u12434 \u35352 \u37682 \
    \}\
\
    // \uc0\u27425 \u12398 \u21839 \u38988 \u12408 \
    currentQuestionIndex++;\
    renderCurrentQuestion();\
\}\
\
\
// --- 4. \uc0\u25505 \u28857 \u12392 \u32080 \u26524 \u34920 \u31034  ---\
function submitQuiz() \{\
    clearInterval(timerInterval); // \uc0\u20840 \u20307 \u12479 \u12452 \u12510 \u12540 \u12434 \u20572 \u27490 \
    \
    let score = 0;\
    \
    // \uc0\u21508 \u21839 \u38988 \u12398 \u27491 \u35492 \u21028 \u23450 \u12392 \u12473 \u12467 \u12450 \u35336 \u31639 \
    QUIZ_QUESTIONS.forEach(q => \{\
        const correctAnswerIndex = q.answerOptions.findIndex(opt => opt.isCorrect);\
        if (q.userAnswerIndex === correctAnswerIndex) \{\
            score++;\
            q.isCorrect = true;\
        \} else \{\
            q.isCorrect = false;\
        \}\
    \});\
\
    // \uc0\u32080 \u26524 \u12469 \u12510 \u12522 \u12540 \
    const totalSeconds = (totalTimeTaken / 1000).toFixed(2);\
    const avgTimePerQuestion = (totalTimeTaken / NUM_QUESTIONS / 1000).toFixed(2);\
    \
    resultsDiv.innerHTML = `\
        <h2>\uc0\u25505 \u28857 \u32080 \u26524 </h2>\
        <p><strong>\uc0\u27491 \u35299 \u25968 :</strong> $\{score\} / $\{NUM_QUESTIONS\} \u21839 </p>\
        <p><strong>\uc0\u27491 \u31572 \u29575 :</strong> $\{((score / NUM_QUESTIONS) * 100).toFixed(1)\}%</p>\
        <hr>\
        <h3>\uc0\u26178 \u38291 \u35336 \u28204 \u32080 \u26524 </h3>\
        <p><strong>\uc0\u21512 \u35336 \u35299 \u31572 \u26178 \u38291 :</strong> $\{totalSeconds\} \u31186 </p>\
        <p><strong>\uc0\u21839 \u38988 \u12354 \u12383 \u12426 \u12398 \u24179 \u22343 \u26178 \u38291 :</strong> $\{avgTimePerQuestion\} \u31186 </p>\
        \
        <div style="margin-top: 20px;">\
            <h4>\uc0\u21839 \u38988 \u12372 \u12392 \u12398 \u22238 \u31572 \u26178 \u38291 </h4>\
            <ul>\
                $\{QUIZ_QUESTIONS.map(q => `\
                    <li style="color: $\{q.isCorrect ? 'green' : 'red'\};">\
                        \uc0\u21839 $\{q.questionNumber\}: \
                        $\{q.userTime ? (q.userTime / 1000).toFixed(2) + '\uc0\u31186 ' : '\u28961 \u22238 \u31572 '\} \
                        ($\{q.isCorrect ? '\uc0\u27491 \u35299 ' : '\u19981 \u27491 \u35299 '\})\
                    </li>\
                `).join('')\}\
            </ul>\
        </div>\
    `;\
\
    // \uc0\u25505 \u28857 \u24460 \u12398 \u34920 \u31034 \u20999 \u12426 \u26367 \u12360 \
    quizForm.style.display = 'none';\
    questionArea.innerHTML = ''; // \uc0\u21839 \u38988 \u12456 \u12522 \u12450 \u12434 \u12463 \u12522 \u12450 \
    nextButton.style.display = 'none';\
    resultsDiv.style.display = 'block';\
\}\
\
\
// --- 5. \uc0\u20840 \u20307 \u12479 \u12452 \u12510 \u12540 \u27231 \u33021  ---\
function startTimer() \{\
    timerInterval = setInterval(() => \{\
        timeRemaining--;\
\
        const minutes = Math.floor(timeRemaining / 60);\
        const seconds = timeRemaining % 60;\
        const formattedTime = `$\{String(minutes).padStart(2, '0')\}:$\{String(seconds).padStart(2, '0')\}`;\
        \
        timerDisplay.textContent = `\uc0\u27531 \u12426 \u26178 \u38291 : $\{formattedTime\}`;\
\
        // \uc0\u9733  \u26178 \u38291 \u12364 \u19968 \u23450 \u25968 \u65288 30\u31186 \u65289 \u12434 \u20999 \u12387 \u12383 \u12425 \u36196 \u12367 \u12377 \u12427 \u20966 \u29702  \u9733 \
        if (timeRemaining <= ALERT_THRESHOLD) \{\
            timerDisplay.classList.add('timer-alert');\
        \}\
\
        // \uc0\u12479 \u12452 \u12512 \u12450 \u12483 \u12503 \u12398 \u20966 \u29702 \
        if (timeRemaining <= 0) \{\
            clearInterval(timerInterval);\
            timerDisplay.textContent = "\uc0\u26178 \u38291 \u20999 \u12428 \u65281 \u33258 \u21205 \u12391 \u25505 \u28857 \u12375 \u12414 \u12377 \u12290 ";\
            timerDisplay.classList.add('timer-alert'); \
            submitQuiz(); // \uc0\u26178 \u38291 \u20999 \u12428 \u12391 \u24375 \u21046 \u30340 \u12395 \u25505 \u28857 \
            return;\
        \}\
\
    \}, 1000); // 1\uc0\u31186 \u12372 \u12392 \u12395 \u23455 \u34892 \
\}\
\
// --- \uc0\u21021 \u26399 \u21270  ---\
document.addEventListener('DOMContentLoaded', () => \{\
    // \uc0\u21839 \u38988 \u12434 \u20107 \u21069 \u12395 \u29983 \u25104 \
    for (let i = 0; i < NUM_QUESTIONS; i++) \{\
        QUIZ_QUESTIONS.push(generateQuestion(i));\
    \}\
    \
    // \uc0\u12508 \u12479 \u12531 \u12395 \u38306 \u25968 \u12434 \u21106 \u12426 \u24403 \u12390 \
    nextButton.addEventListener('click', handleNextQuestion);\
    \
    // \uc0\u26368 \u21021 \u12398 \u21839 \u38988 \u12434 \u34920 \u31034 \u12375 \u12289 \u12479 \u12452 \u12510 \u12540 \u12434 \u38283 \u22987 \
    renderCurrentQuestion();\
    startTimer();\
\});}