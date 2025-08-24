// Game State Management
let gameState = {
    currentScreen: 'cover',
    currentMode: null,
    score: 0,
    level: 1,
    isGameActive: false
};

// Screen Navigation Functions
function startGame() {
    const coverScreen = document.getElementById('coverScreen');
    const gameScreen = document.getElementById('gameScreen');
    
    // Add transition effect
    coverScreen.style.transition = 'opacity 0.5s ease-out';
    coverScreen.style.opacity = '0';
    
    setTimeout(() => {
        coverScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        gameScreen.style.opacity = '0';
        
        // Fade in game screen
        setTimeout(() => {
            gameScreen.style.transition = 'opacity 0.5s ease-in';
            gameScreen.style.opacity = '1';
        }, 50);
        
        // Initialize game
        initializeGame();
    }, 500);
    
    gameState.currentScreen = 'game';
    gameState.isGameActive = true;
}

function backToCover() {
    const coverScreen = document.getElementById('coverScreen');
    const gameScreen = document.getElementById('gameScreen');
    
    // Reset game state completely
    gameState.currentScreen = 'cover';
    gameState.isGameActive = false;
    gameState.currentMode = null;
    gameState.score = 0; // Reset score to 0
    gameState.currentQuestion = 0; // Reset question counter
    
    // Clean up any game content
    const gameContent = document.querySelector('.game-content-overlay');
    if (gameContent) {
        gameContent.innerHTML = `
            <div class="game-header">
                <button class="back-button" onclick="backToCover()">← Back</button>
                <h2>Choose Your Challenge</h2>
            </div>
            <div class="game-options">
                <button class="option-btn addition" onclick="startAddition()">
                    <span class="option-icon" style="font-size: 2em;">➕</span>
                    <span class="option-text">Addition</span>
                </button>
                <button class="option-btn subtraction" onclick="startSubtraction()">
                    <span class="option-icon" style="font-size: 2em;">➖</span>
                    <span class="option-text">Subtraction</span>
                </button>
                <button class="option-btn mixed" onclick="startMixed()">
                    <span class="option-icon" style="font-size: 2em;">🔄</span>
                    <span class="option-text">Mixed Practice</span>
                </button>
            </div>
        `;
    }
    
    // Smooth transition back to cover
    gameScreen.style.transition = 'opacity 0.3s ease-out';
    gameScreen.style.opacity = '0';
    
    setTimeout(() => {
        gameScreen.style.display = 'none';
        coverScreen.style.display = 'flex';
        coverScreen.style.opacity = '1';
    }, 300);
}

function initializeGame() {
    console.log('Game initialized!');
}

// Game mode functions - simplified without difficulty selection
function startAddition() {
    gameState.currentMode = 'addition';
    // Set rural background for addition game
    const gameBackground = document.querySelector('.game-background img');
    if (gameBackground) {
        gameBackground.src = 'images/rural.png';
        gameBackground.alt = 'Rural Background';
    }
    startGamePlay('Addition Challenge', '➕');
}

function startSubtraction() {
    gameState.currentMode = 'subtraction';
    // Set basketball background for subtraction game
    const gameBackground = document.querySelector('.game-background img');
    if (gameBackground) {
        gameBackground.src = 'images/basketball.png';
        gameBackground.alt = 'Basketball Background';
    }
    startGamePlay('Subtraction Challenge', '➖');
}

function startMixed() {
    gameState.currentMode = 'mixed';
    // Set playgroup background for mixed practice
    const gameBackground = document.querySelector('.game-background img');
    if (gameBackground) {
        gameBackground.src = 'images/playgroup.png';
        gameBackground.alt = 'Playgroup Background';
    }
    startGamePlay('Mixed Practice', '🔄');
}

function startGamePlay(modeName, icon) {
    // Reset score for fresh start
    gameState.score = 0;
    // Directly start the practice without intermediate screen
    startPractice();
}

// Category-based emoji sets for each level type
const emojiCategories = {
    addition: ['🍎', '🍌', '🍊', '🍇', '🍓', '🍉', '🍒', '🍑', '🍍', '🥝'],  // Fruits only
    subtraction: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🥏'], // Balls only
    mixed: ['🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🥐', '🍩', '🍪']     // Food only
};

function startPractice() {
    const mode = gameState.currentMode;
    const modeName = mode === 'addition' ? 'Addition Challenge' : 
                    mode === 'subtraction' ? 'Subtraction Challenge' : 
                    'Mixed Practice';
    const icon = mode === 'addition' ? '➕' : 
                mode === 'subtraction' ? '➖' : '🔄';
    
    // Set up the game screen with proper header
    const gameContent = document.querySelector('.game-content-overlay');
    gameContent.innerHTML = `
        <div class="question-screen">
            <div class="question-header">
                <button class="back-button" onclick="backToCover()">← Back</button>
                <h2>${icon} ${modeName}</h2>
            </div>
            <div class="question-content">
                <div class="question-display" id="questionDisplay">
                    <p>Loading...</p>
                </div>
                <div class="answer-options" id="answerOptions">
                </div>
                <div class="score-display">
                    <span>Score: <span id="currentScore">${gameState.score}</span></span>
                </div>
            </div>
        </div>
    `;
    
    // Start first question
    generateQuestion();
}

function generateQuestion() {
    const mode = gameState.currentMode;
    let num1, num2, operation, correctAnswer, wrongAnswer;
    
    switch(mode) {
        case 'addition':
            num1 = Math.floor(Math.random() * 5) + 1; // 1-5
            num2 = Math.floor(Math.random() * (10 - num1)) + 1; // Ensure sum <= 10
            operation = '+';
            correctAnswer = num1 + num2;
            wrongAnswer = correctAnswer + (Math.random() > 0.5 ? 1 : -1);
            if (wrongAnswer < 1 || wrongAnswer > 10) wrongAnswer = correctAnswer + 2;
            if (wrongAnswer > 10) wrongAnswer = correctAnswer - 2;
            displayQuestion(num1, num2, operation, correctAnswer, wrongAnswer, mode);
            break;
            
        case 'subtraction':
            // For 4-year-olds: smaller numbers, visual counting
            num1 = Math.floor(Math.random() * 5) + 3; // 3-7 (easy to count)
            num2 = Math.floor(Math.random() * Math.min(3, num1 - 1)) + 1; // 1-2 or 1-3 max
            operation = '-';
            correctAnswer = num1 - num2;
            // Simple wrong answers close to correct
            wrongAnswer = correctAnswer + (Math.random() > 0.5 ? 1 : -1);
            if (wrongAnswer < 0 || wrongAnswer > 5) wrongAnswer = correctAnswer + 1;
            if (wrongAnswer < 0 || wrongAnswer > 5) wrongAnswer = correctAnswer - 1;
            displayQuestion(num1, num2, operation, correctAnswer, wrongAnswer, mode);
            break;
            
        case 'mixed':
            const isAddition = Math.random() > 0.5;
            if (isAddition) {
                num1 = Math.floor(Math.random() * 5) + 1;
                num2 = Math.floor(Math.random() * (10 - num1)) + 1;
                operation = '+';
            } else {
                num1 = Math.floor(Math.random() * 9) + 2;
                num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
                operation = '-';
            }
            correctAnswer = isAddition ? num1 + num2 : num1 - num2;
            wrongAnswer = correctAnswer + (Math.random() > 0.5 ? 1 : -1);
            if (wrongAnswer < 1 || wrongAnswer > 10) wrongAnswer = correctAnswer + 2;
            if (wrongAnswer > 10) wrongAnswer = correctAnswer - 2;
            displayQuestion(num1, num2, operation, correctAnswer, wrongAnswer, mode);
            break;
    }
}

function displayQuestion(num1, num2, operation, correctAnswer, wrongAnswer, type) {
    const questionDisplay = document.getElementById('questionDisplay');
    const answerOptions = document.getElementById('answerOptions');
    
    // Select emoji from category based on level type
    const categoryEmojis = emojiCategories[type];
    const randomEmoji = categoryEmojis[Math.floor(Math.random() * categoryEmojis.length)];
    
    // Create emoji strings for display
    const emoji1Str = randomEmoji.repeat(Math.max(1, parseInt(num1) || 1));
    const emoji2Str = randomEmoji.repeat(Math.max(1, parseInt(num2) || 1));
    
    // Shuffle answer positions
    const answers = [correctAnswer, wrongAnswer];
    const shuffled = answers.sort(() => Math.random() - 0.5);
    
    // Special subtraction visualization for 4-year-olds
    let questionHTML = '';
    if (operation === '-' && type === 'subtraction') {
        // Visual subtraction: show items being taken away
        questionHTML = `
            <div class="emoji-equation-vertical">

                <div class="equation-line">
                    <div class="emoji-vertical" style="font-size: 2em; line-height: 1.2; margin-bottom: 10px;">${emoji1Str}</div>
                </div>
                <div class="operator-line">
                    <span class="operator-large" style="background-color: #ff6b6b; color: white; padding: 8px 15px; border-radius: 20px; font-weight: bold; font-size: 18px;">
                        Take away ${num2} ${randomEmoji}
                    </span>
                </div>
                <div class="equals-line">
                    <span class="equals-large">=</span>
                    <span class="question-mark-large" style="font-size: 32px;">?</span>
                </div>
            </div>

        `;
    } else {
        // Regular display for addition
        questionHTML = `
            <div class="emoji-equation-vertical">
                <div class="equation-line">
                    <span class="emoji-count">${num1}</span>
                    <div class="emoji-vertical" style="font-size: 2em; line-height: 1.2;">${emoji1Str}</div>
                </div>
                <div class="operator-line">
                    <span class="operator-large" style="background-color: white; color: #333; padding: 10px 20px; border-radius: 10px; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">${operation}</span>
                </div>
                <div class="equation-line">
                    <span class="emoji-count">${num2}</span>
                    <div class="emoji-vertical" style="font-size: 2em; line-height: 1.2;">${emoji2Str}</div>
                </div>
                <div class="equals-line">
                    <span class="equals-large">=</span>
                    <span class="question-mark-large">?</span>
                </div>
            </div>
            <p class="instruction-vertical">Choose the correct number:</p>
        `;
    }
    
    questionDisplay.innerHTML = questionHTML;
    
    // Update answer options with enhanced feedback - normal button size
    answerOptions.innerHTML = `
        <button class="answer-btn" onclick="checkAnswer(${correctAnswer}, ${shuffled[0]}, this)">
            ${shuffled[0]}
        </button>
        <button class="answer-btn" onclick="checkAnswer(${correctAnswer}, ${shuffled[1]}, this)">
            ${shuffled[1]}
        </button>
    `;
    
    // Update score display
    const currentScore = document.getElementById('currentScore');
    if (currentScore) {
        currentScore.textContent = gameState.score;
    }
    
    addQuestionStyles();
}

function checkAnswer(correct, selected, button) {
    const isCorrect = correct === selected;
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(btn => btn.disabled = true);
    
    if (isCorrect) {
        gameState.score += 1;
        document.getElementById('currentScore').textContent = gameState.score;
        
        // Special subtraction effect for "taking away" emojis
        if (gameState.currentMode === 'subtraction') {
            showSubtractionTakeAwayEffect();
        } else {
            speakExcellent();
            showModeSpecificSuccessEffect('mixed', button);
        }
        
        setTimeout(() => {
            generateQuestion();
        }, 3000); // Longer delay for subtraction animation
    } else {
        // Error effects
        playErrorSound();
        showErrorEffect(button);
        
        // Show correct answer
        buttons.forEach(btn => {
            if (parseInt(btn.textContent) === correct) {
                btn.classList.add('correct-answer-glow');
            }
        });
        
        setTimeout(() => {
            generateQuestion();
        }, 2500);
    }
}

// Simplified subtraction take-away effect
function showSubtractionTakeAwayEffect() {
    const container = document.querySelector('.emoji-vertical');
    if (!container) return;
    
    const text = container.textContent.trim();
    const emoji = text.match(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{27BF}]/gu)?.[0] || '🍎';
    const total = (text.match(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{27BF}]/gu) || []).length || text.length;
    
    // Get take away number from operator text
    const operatorText = document.querySelector('.operator-large')?.textContent || '';
    const takeAway = parseInt(operatorText.match(/take away (\d+)/i)?.[1]) || 1;
    const remaining = total - takeAway;
    
    // Create simple animation
    container.innerHTML = '';
    for (let i = 0; i < total; i++) {
        const span = document.createElement('span');
        span.textContent = emoji;
        span.style.margin = '2px';
        span.style.display = 'inline-block';
        if (i >= remaining) {
            span.style.animation = 'emojiVanish 0.8s ease-out forwards';
            span.style.animationDelay = `${(i - remaining) * 0.2}s`;
        }
        container.appendChild(span);
    }
    
    setTimeout(speakExcellent, 1000 + takeAway * 200);
}

// Enhanced poof effect with multiple particle types
function createEnhancedPoofEffect(sourceElement) {
    if (!sourceElement) return;
    
    const rect = sourceElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create multiple particle types for richer effect
    const particleConfigs = [
        { emoji: '💨', size: 18, duration: 1200, spread: 15 },
        { emoji: '🌬️', size: 16, duration: 1000, spread: 20 },
        { emoji: '✨', size: 14, duration: 800, spread: 25 },
        { emoji: '⭐', size: 12, duration: 1500, spread: 30 }
    ];
    
    particleConfigs.forEach((config, index) => {
        const poof = document.createElement('div');
        poof.textContent = config.emoji;
        poof.style.cssText = `
            position: fixed;
            z-index: 1000;
            font-size: ${config.size}px;
            pointer-events: none;
            left: ${centerX + (Math.random() - 0.5) * config.spread}px;
            top: ${centerY + (Math.random() - 0.5) * config.spread}px;
            animation: poofFloat ${config.duration}ms ease-out forwards;
            transform-origin: center;
        `;
        
        document.body.appendChild(poof);
        
        setTimeout(() => {
            if (poof.parentNode) poof.remove();
        }, config.duration);
    });
}

// Create sparkle effects around disappearing emoji
function createSparkleEffects(sourceElement) {
    if (!sourceElement) return;
    
    const rect = sourceElement.getBoundingClientRect();
    
    for (let i = 0; i < 3; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-effect';
        sparkle.textContent = '✨';
        sparkle.style.cssText = `
            position: fixed;
            z-index: 1001;
            font-size: ${16 + Math.random() * 8}px;
            pointer-events: none;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
            animation: sparkleFloat ${800 + Math.random() * 400}ms ease-out forwards;
        `;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) sparkle.remove();
        }, 1200);
    }
}

// Enhanced poof effect with precise positioning and multiple particles
function createPoofEffect(sourceElement) {
    if (!sourceElement) return;
    
    const rect = sourceElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create multiple poof particles for more dramatic effect
    const particles = ['💨', '🌬️', '✨'];
    
    particles.forEach((particle, index) => {
        const poof = document.createElement('div');
        poof.textContent = particle;
        poof.style.position = 'fixed';
        poof.style.zIndex = '1000';
        poof.style.fontSize = (20 + Math.random() * 8) + 'px';
        poof.style.pointerEvents = 'none';
        poof.style.left = (centerX + (Math.random() - 0.5) * 20) + 'px';
        poof.style.top = (centerY + (Math.random() - 0.5) * 20) + 'px';
        
        // Enhanced animation with rotation and scaling
        poof.style.animation = 'poofFloat 1.2s ease-out forwards';
        poof.style.transformOrigin = 'center';
        
        document.body.appendChild(poof);
        
        // Remove after animation
        setTimeout(() => {
            if (poof.parentNode) {
                poof.parentNode.removeChild(poof);
            }
        }, 1200);
    });
}

// Mode-specific sound effects
function playSuccessSound(mode) {
    try {
        if (mode === 'addition') {
            createFireworksSound();
        } else if (mode === 'subtraction') {
            createClappingSound();
        } else if (mode === 'mixed') {
            speakExcellent();
        }
    } catch (e) {
        console.log('Sound play failed:', e);
    }
}

function playErrorSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 200;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.1;
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        console.log('Error sound failed:', e);
    }
}

// Removed fireworks and clapping sounds - now using excellent voice only

// Speak "Excellent" with high excitement (no echo)
function speakExcellent() {
    try {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance('Excellent!');
            utterance.lang = 'en-US';
            utterance.rate = 1.4; // Faster, more excited
            utterance.pitch = 1.6; // Higher pitch for excitement
            utterance.volume = 1.0; // Full volume
            speechSynthesis.speak(utterance);
            // Echo effect removed for cleaner sound
        }
    } catch (e) {
        console.log('Speech failed:', e);
    }
}

// Mode-specific visual effects
function showModeSpecificSuccessEffect(mode, buttonElement) {
    showExcellentEffect(buttonElement);
}

function showFireworksEffect(buttonElement) {
    for (let i = 0; i < 8; i++) {
        createFirework(buttonElement);
    }
    const gameContainer = document.querySelector('.game-container') || document.body;
    gameContainer.classList.add('success-flash');
    setTimeout(() => gameContainer.classList.remove('success-flash'), 1000);
}

function showClappingEffect(buttonElement) {
    for (let i = 0; i < 6; i++) {
        createClappingHands(buttonElement);
    }
    buttonElement.classList.add('success-animation');
}

function showExcellentEffect(buttonElement) {
    for (let i = 0; i < 10; i++) {
        createStarBurst(buttonElement);
    }
    const gameContainer = document.querySelector('.game-container') || document.body;
    gameContainer.classList.add('excellent-glow');
    setTimeout(() => gameContainer.classList.remove('excellent-glow'), 1500);
}

function showErrorEffect(buttonElement) {
    buttonElement.classList.add('error-animation');
    const gameContainer = document.querySelector('.game-container') || document.body;
    gameContainer.classList.add('shake');
    setTimeout(() => gameContainer.classList.remove('shake'), 500);
}

function createFirework(buttonElement) {
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.innerHTML = ['🎆', '🎇', '✨', '⭐'][Math.floor(Math.random() * 4)];
    firework.style.left = Math.random() * 100 + '%';
    firework.style.animationDuration = (Math.random() * 1 + 1) + 's';
    buttonElement.parentElement.appendChild(firework);
    setTimeout(() => firework.remove(), 2000);
}

function createClappingHands(buttonElement) {
    const hand = document.createElement('div');
    hand.className = 'clapping-hand';
    hand.innerHTML = '👏';
    hand.style.left = Math.random() * 100 + '%';
    hand.style.animationDuration = '0.5s';
    buttonElement.parentElement.appendChild(hand);
    setTimeout(() => hand.remove(), 500);
}

function createStarBurst(buttonElement) {
    const star = document.createElement('div');
    star.className = 'star-burst';
    star.innerHTML = '⭐';
    star.style.left = Math.random() * 100 + '%';
    star.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
    buttonElement.parentElement.appendChild(star);
    setTimeout(() => star.remove(), 1000);
}

function addQuestionStyles() {
    if (document.getElementById('questionStyles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'questionStyles';
    styles.textContent = `
        .question-screen {
            display: flex;
            flex-direction: column;
            height: 100vh;
            padding: 15px;
            box-sizing: border-box;
        }
        
        .question-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            flex-shrink: 0;
        }
        
        .back-button {
            background: rgba(255, 255, 255, 0.9);
            border: none;
            padding: 8px 12px;
            border-radius: 15px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            color: #333;
            backdrop-filter: blur(10px);
        }
        
        .question-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 15px;
            padding: 10px 0;
        }
        
        /* Vertical layout for mobile */
        .emoji-equation-vertical {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            width: 100%;
            max-width: 280px;
        }
        
        .equation-line {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            margin: 5px 0;
        }
        
        .operator-line, .equals-line {
            display: flex;
            align-items: center;
            gap: 15px;
            margin: 10px 0;
        }
        
        .emoji-vertical {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 3px;
            font-size: 28px;
            line-height: 1;
            max-width: 250px;
            min-height: 35px;
        }
        
        .emoji-count {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            background: rgba(255, 255, 255, 0.8);
            padding: 5px 10px;
            border-radius: 15px;
        }
        
        .operator-large, .equals-large, .question-mark-large {
            font-size: 36px;
            font-weight: bold;
            color: #333;
        }
        
        .instruction-vertical {
            font-size: 20px;
            color: #333;
            margin: 15px 0;
            text-align: center;
            font-weight: bold;
        }
        
        .answer-options {
            display: flex;
            flex-direction: column;
            gap: 12px;
            width: 100%;
            max-width: 180px;
            position: relative;
            margin: 0 auto;
            padding: 0 10px;
        }
        
        .answer-btn {
            background: rgba(255, 255, 255, 0.9);
            border: 2px solid #ddd;
            padding: 15px 12px;
            border-radius: 15px;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            width: 100%;
            position: relative;
            overflow: hidden;
            min-height: 50px;
        }
        
        .answer-btn:hover {
            background: rgba(255, 255, 255, 1);
            border-color: #4CAF50;
            transform: translateY(-2px);
        }
        
        .answer-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
        
        /* Mode-specific success animations */
        .success-animation {
            background: linear-gradient(135deg, #4CAF50, #45a049) !important;
            animation: successPulse 0.6s ease-in-out;
        }
        
        .error-animation {
            background: linear-gradient(135deg, #f44336, #da190b) !important;
            animation: errorShake 0.5s ease-in-out;
        }
        
        .correct-answer-glow {
            background: linear-gradient(135deg, #4CAF50, #45a049) !important;
            box-shadow: 0 0 20px rgba(76, 175, 80, 0.6);
            animation: glow 1s ease-in-out infinite alternate;
        }
        
        /* Fireworks effect */
        .firework {
            position: absolute;
            font-size: 24px;
            animation: fireworkBurst 2s ease-out forwards;
            pointer-events: none;
            z-index: 1000;
        }
        
        /* Clapping hands effect */
        .clapping-hand {
            position: absolute;
            font-size: 20px;
            animation: clapPop 0.5s ease-out forwards;
            pointer-events: none;
            z-index: 1000;
        }
        
        /* Star burst effect */
        .star-burst {
            position: absolute;
            font-size: 20px;
            animation: starExplode 1s ease-out forwards;
            pointer-events: none;
            z-index: 1000;
        }
        
        /* Screen effects */
        .success-flash {
            animation: screenFlash 1s ease-in-out;
        }
        
        .excellent-glow {
            animation: excellentGlow 1.5s ease-in-out;
        }
        
        .shake {
            animation: screenShake 0.5s ease-in-out;
        }
        
        /* Mobile responsive styles */
        @media (max-width: 480px) {
            .question-content {
                gap: 10px;
                padding: 5px 0;
            }
            
            .emoji-equation-vertical {
                gap: 8px;
                max-width: 250px;
            }
            
            .emoji-vertical {
                font-size: 24px;
                max-width: 220px;
            }
            
            .emoji-count {
                font-size: 16px;
                padding: 4px 8px;
            }
            
            .operator-large, .equals-large, .question-mark-large {
                font-size: 30px;
            }
            
            .instruction-vertical {
                font-size: 18px;
                margin: 10px 0;
            }
            
            .answer-options {
                gap: 10px;
                max-width: 160px;
            }
            
            .answer-btn {
                padding: 12px 10px;
                font-size: 22px;
                border-radius: 12px;
                min-height: 45px;
            }
            
            .game-header {
                margin-bottom: 20px;
                padding-top: 15px;
            }
            
            .back-button {
                padding: 8px 15px;
                font-size: 14px;
            }
            
            .game-header h2 {
                font-size: 1.5rem;
            }
        }
        
        @media (max-width: 375px) {
            .emoji-equation-vertical {
                max-width: 220px;
            }
            
            .emoji-vertical {
                font-size: 22px;
                max-width: 200px;
            }
            
            .answer-options {
                max-width: 140px;
            }
            
            .answer-btn {
                padding: 10px 8px;
                font-size: 20px;
                min-height: 40px;
            }
            
            .game-content-overlay {
                padding: 15px 10px;
            }
        }
        
        @media (max-height: 600px) {
            .question-content {
                gap: 8px;
            }
            
            .emoji-equation-vertical {
                gap: 6px;
            }
            
            .instruction-vertical {
                font-size: 16px;
                margin: 8px 0;
            }
            
            .answer-options {
                gap: 8px;
            }
            
            .answer-btn {
                padding: 10px 8px;
                font-size: 20px;
                min-height: 40px;
            }
            
            .game-header {
                margin-bottom: 15px;
                padding-top: 10px;
            }
        }
        
        /* Keyframe animations */
        @keyframes successPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        @keyframes poofFloat {
            0% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            50% {
                opacity: 0.8;
                transform: translateY(-20px) scale(1.2);
            }
            100% {
                opacity: 0;
                transform: translateY(-40px) scale(0.5);
            }
        }
        
        @keyframes emojiDisappear {
            0% {
                transform: scale(1) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: scale(0) rotate(360deg);
                opacity: 0;
            }
        }
        
        @keyframes errorShake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        @keyframes fireworkBurst {
            0% {
                opacity: 1;
                transform: translateY(0) scale(0.5);
            }
            50% {
                opacity: 1;
                transform: translateY(-30px) scale(1.2);
            }
            100% {
                opacity: 0;
                transform: translateY(-80px) scale(0.8);
            }
        }
        
        @keyframes clapPop {
            0% {
                opacity: 0;
                transform: scale(0);
            }
            50% {
                opacity: 1;
                transform: scale(1.2);
            }
            100% {
                opacity: 0;
                transform: scale(0.8);
            }
        }
        
        @keyframes starExplode {
            0% {
                opacity: 1;
                transform: translateY(0) rotate(0deg);
            }
            100% {
                opacity: 0;
                transform: translateY(-60px) rotate(360deg);
            }
        }
        
        @keyframes screenFlash {
            0%, 100% { background-color: transparent; }
            50% { background-color: rgba(255, 215, 0, 0.3); }
        }
        
        @keyframes excellentGlow {
            0%, 100% { background-color: transparent; }
            50% { background-color: rgba(255, 215, 0, 0.2); }
        }
        
        @keyframes screenShake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
            20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        @keyframes glow {
            from { box-shadow: 0 0 20px rgba(76, 175, 80, 0.6); }
            to { box-shadow: 0 0 30px rgba(76, 175, 80, 0.9); }
        }
        
        .score-display {
            font-size: 22px;
            font-weight: bold;
            color: #333;
            text-align: center;
            margin-top: 15px;
            background: rgba(255, 255, 255, 0.8);
            padding: 10px 20px;
            border-radius: 15px;
        }

        /* Enhanced emoji animation container styles */
        .emoji-animation-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 4px;
            margin: 10px 0;
            min-height: 40px;
            align-items: center;
            transition: all 0.3s ease;
        }

        .emoji-item {
            font-size: 28px;
            transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            display: inline-block;
            cursor: default;
            user-select: none;
            position: relative;
        }

        .emoji-item.disappearing {
            animation: emojiVanish 0.8s ease-out forwards;
        }

        @keyframes emojiVanish {
            0% {
                transform: scale(1) rotate(0deg) translateY(0);
                opacity: 1;
                filter: blur(0px);
            }
            50% {
                transform: scale(1.2) rotate(180deg) translateY(-10px);
                opacity: 0.8;
                filter: blur(1px);
            }
            100% {
                transform: scale(0) rotate(720deg) translateY(-30px);
                opacity: 0;
                filter: blur(3px);
            }
        }

        .sparkle-effect {
            position: absolute;
            font-size: 20px;
            animation: sparkleFloat 1s ease-out forwards;
            pointer-events: none;
            z-index: 1000;
        }

        @keyframes sparkleFloat {
            0% {
                opacity: 1;
                transform: scale(0) rotate(0deg);
            }
            50% {
                opacity: 1;
                transform: scale(1.5) rotate(180deg);
            }
            100% {
                opacity: 0;
                transform: scale(0) rotate(360deg) translateY(-40px);
            }
        }

        @keyframes emojiVanish {
            0% { transform: scale(1) rotate(0deg); opacity: 1; }
            100% { transform: scale(0) rotate(720deg); opacity: 0; }
        }
        
        @media (max-width: 480px) {
            .question-screen {
                padding: 10px;
            }
            
            .emoji-equation-vertical {
                gap: 12px;
            }
            
            .emoji-vertical {
                font-size: 24px;
                max-width: 200px;
                min-height: 30px;
            }
            
            .emoji-count {
                font-size: 16px;
                padding: 4px 8px;
            }
            
            .operator-large, .equals-large, .question-mark-large {
                font-size: 32px;
            }
            
            .instruction-vertical {
                font-size: 18px;
                margin: 12px 0;
            }
            
            .answer-options {
                max-width: 180px;
                gap: 12px;
            }
            
            .answer-btn {
                padding: 18px;
                font-size: 24px;
                border-radius: 18px;
            }
            
            .score-display {
                font-size: 20px;
                padding: 8px 15px;
            }
        }
    `;
    document.head.appendChild(styles);
}

function addGamePlayStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .game-play-screen {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            padding: 20px;
        }
        
        .game-play-header {
            display: flex;
            align-items: center;
            margin-bottom: 40px;
            padding-top: 20px;
        }
        
        .game-play-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        
        .game-area {
            text-align: center;
            background: rgba(255, 255, 255, 0.9);
            padding: 40px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            max-width: 300px;
            width: 100%;
        }
        
        .question-display h3 {
            color: #2c3e50;
            font-size: 1.8rem;
            margin-bottom: 15px;
        }
        
        .question-display p {
            color: #7f8c8d;
            font-size: 1.2rem;
            margin-bottom: 30px;
        }
        
        .start-practice-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 18px 40px;
            font-size: 1.3rem;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            font-weight: bold;
        }
        
        .start-practice-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
    `;
    document.head.appendChild(style);
}

// Touch and swipe support for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Swipe left to go back
    if (deltaX < -50 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (gameState.currentScreen === 'game') {
            backToCover();
        }
    }
});

// Prevent zoom on double tap
document.addEventListener('touchend', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
});

// Handle orientation change
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Math Adventure loaded!');
});

// Prevent context menu on long press
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});