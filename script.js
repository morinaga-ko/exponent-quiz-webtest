// script.js

// --- タイマー設定 ---
const TIME_LIMIT = 120; // 制限時間（秒）：2分 = 120秒
const ALERT_THRESHOLD = 30; // タイマーが赤くなる閾値（秒）
let timeRemaining = TIME_LIMIT;
const timerDisplay = document.getElementById('timer-display');
const quizForm = document.getElementById('quiz-form');
let timerInterval;

// --- 1. タイマー機能 ---
function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;

        // 残り時間を MM:SS 形式に整形
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        timerDisplay.textContent = `残り時間: ${formattedTime}`;

        // ★ 時間が一定数（30秒）を切ったら赤くする処理 ★
        if (timeRemaining <= ALERT_THRESHOLD) {
            timerDisplay.classList.add('timer-alert');
        }

        // タイムアップの処理
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = "時間切れ！自動で採点します。";
            timerDisplay.classList.add('timer-alert');
            submitQuiz(); // 時間切れで強制的に採点
            return;
        }

    }, 1000); // 1秒ごとに実行
}

// --- 2. 問題表示機能 ---
function renderQuiz() {
    let quizHTML = '';
    quizData.questions.forEach((q, qIndex) => {
        quizHTML += `
            <div class="question-block" id="q${qIndex}">
                <div class="question-text">
                    問${q.questionNumber}. ${q.question.replace(/\n/g, '<br>')}
                </div>
                ${q.answerOptions.map((option, oIndex) => `
                    <div class="answer-option">
                        <input type="radio" id="q${qIndex}o${oIndex}" name="question${qIndex}" value="${oIndex}">
                        <label for="q${qIndex}o${oIndex}">${option.text}</label>
                    </div>
                `).join('')}
            </div>
        `;
    });
    quizForm.innerHTML = quizHTML;
    
    // MathJaxを再レンダリングして数式を表示
    if (window.MathJax) {
        window.MathJax.typesetPromise();
    }
}

// --- 3. 採点機能 ---
function submitQuiz() {
    clearInterval(timerInterval); // タイマーを停止
    let score = 0;
    const totalQuestions = quizData.questions.length;

    quizData.questions.forEach((q, qIndex) => {
        const questionBlock = document.getElementById(`q${qIndex}`);
        const selectedAnswer = quizForm.querySelector(`input[name="question${qIndex}"]:checked`);
        let isCorrect = false;

        // 正解の選択肢を見つける
        const correctAnswerOption = q.answerOptions.findIndex(opt => opt.isCorrect);
        const correctAnswerText = q.answerOptions[correctAnswerOption].text;

        // 回答が選択されているか確認
        if (selectedAnswer) {
            const userAnswerIndex = parseInt(selectedAnswer.value);
            if (userAnswerIndex === correctAnswerOption) {
                isCorrect = true;
                score++;
            }

            // 選択した回答をハイライト
            const selectedLabel = quizForm.querySelector(`label[for="${selectedAnswer.id}"]`);
            if (isCorrect) {
                selectedLabel.style.backgroundColor = '#d4edda'; // 緑
            } else {
                selectedLabel.style.backgroundColor = '#f8d7da'; // 赤
            }
        }
        
        // 正解を表示
        const correctLabel = quizForm.querySelector(`label[for="q${qIndex}o${correctAnswerOption}"]`);
        if (correctLabel) {
            correctLabel.innerHTML += `<span class="correct-answer"> &nbsp; &nbsp; (正解)</span>`;
            correctLabel.style.border = '2px solid green';
        }
    });

    // 結果を表示
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h2>採点結果</h2>
        <p>正解数: ${score} / ${totalQuestions} 問</p>
        <p>正答率: ${((score / totalQuestions) * 100).toFixed(1)}%</p>
    `;
    
    // 採点後はボタンを無効化
    document.querySelector('button').disabled = true;
}


// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', () => {
    renderQuiz();
    startTimer();
});