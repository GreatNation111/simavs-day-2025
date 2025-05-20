document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded. Checking unlocked state:', localStorage.getItem('unlocked'));
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff6f91', '#ffafbd', '#ffc3a0'],
    });

    setTimeout(() => {
        confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.6 },
            colors: ['#ff6f91', '#ffafbd', '#ffc3a0'],
        });
    }, 1000);

    // Reset unlocked state on page load to require password each time
    localStorage.removeItem('unlocked');
    console.log('Unlocked state reset on page load. Awaiting password.');
    document.querySelector('.private-section').style.display = 'none';

    setupQuiz();
    setupTypewriter(); // Separate function for typewriter to ensure proper initialization
});


// Typewriter Effect
function setupTypewriter() {
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        // Clear existing content to prevent cursor persistence
        typewriterElement.innerHTML = '';
        new Typed('#typewriter', {
            strings: [
                'Wishing you a day full of love...',
                'from miles away! 🎂💕'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 1000,
            loop: true,
            showCursor: false // Explicitly hide cursor
        });
    } else {
        console.error('Typewriter element (#typewriter) not found.');
    }
}

// Password Protection
const correctPassword = 'ourfirstcall'; // Updated to the new shared secret

function checkPassword() {
    const input = document.getElementById('password-input').value;
    const errorMessage = document.getElementById('error-message');
    const prompt = document.getElementById('password-prompt');
    const privateSection = document.querySelector('.private-section');

    if (input === correctPassword) {
        localStorage.setItem('unlocked', 'true');
        prompt.style.display = 'none';
        privateSection.style.display = 'block';
        window.scrollTo(0, document.getElementById('private').offsetTop);
        // Send event to Google Analytics
        gtag('event', 'unlock_private_section', {
            'event_category': 'Engagement',
            'event_label': 'Private Section Unlocked'
        });
    } else {
        errorMessage.textContent = 'Oops, that’s not it! Try again?';
    }
}

// Show Password Prompt on Private Section Click
document.querySelector('.private-btn').addEventListener('click', (e) => {
    e.preventDefault();
    if (localStorage.getItem('unlocked') !== 'true') {
        document.getElementById('password-prompt').style.display = 'flex';
    } else {
        window.scrollTo(0, document.getElementById('private').offsetTop);
    }
});

// Add Enter key and click-outside functionality for private section
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password-input');
    const unlockBtn = document.querySelector('#unlock-btn');
    const prompt = document.getElementById('password-prompt');

    if (passwordInput && unlockBtn && prompt) {
        // Unlock with Enter key
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                unlockBtn.click();
            }
        });

        // Dismiss prompt on click outside
        prompt.addEventListener('click', (e) => {
            if (e.target === prompt) {
                prompt.style.display = 'none';
                console.log('Password prompt dismissed.');
            }
        });
    }
});

// Slideshow
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
    // Send slideshow navigation event to Google Analytics
    gtag('event', 'slideshow_navigation', {
        'event_category': 'Engagement',
        'event_label': `Slide ${slideIndex}`
    });
}

function showSlides(n) {
    let slides = document.getElementsByClassName('slide');
    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    slides[slideIndex - 1].style.display = 'block';
}

// Quiz Logic
function setupQuiz() {
    console.log('Setting up quiz functionality.');

    const userNameInput = document.getElementById('user-name');
    const nameInputDiv = document.getElementById('name-input');
    const quizForm = document.getElementById('quiz-form');
    const resultDiv = document.getElementById('quiz-result');
    const viewScoresBtn = document.getElementById('view-scores');
    const scoreListDiv = document.getElementById('score-list');
    const adminPanel = document.getElementById('admin-panel');
    const adminPasswordInput = document.getElementById('admin-password');
    const adminContent = document.getElementById('admin-content');
    const adminMessage = document.getElementById('admin-message');

    if (!userNameInput || !nameInputDiv || !quizForm || !resultDiv || !viewScoresBtn || !scoreListDiv || !adminPanel || !adminPasswordInput || !adminContent || !adminMessage) {
        console.error('One or more quiz or admin elements missing:', {
            userNameInput,
            nameInputDiv,
            quizForm,
            resultDiv,
            viewScoresBtn,
            scoreListDiv,
            adminPanel,
            adminPasswordInput,
            adminContent,
            adminMessage
        });
        return;
    }

    window.startQuiz = function () {
        console.log('startQuiz function called.');
        const nameValue = userNameInput.value.trim();
        if (nameValue) {
            nameInputDiv.style.display = 'none';
            quizForm.style.display = 'block';
            console.log('Quiz started for user:', nameValue);
        } else {
            alert('Please enter your name!');
            console.log('Name input empty.');
        }
    };

    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Quiz form submitted.');
    
        const answers = { 
            q1: 'a',  // Ice Cream
            q2: 'a',  // Kitten
            q3: 'c',  // Listening to Music
            q4: 'b',  // Pink
            q5: 'b',  // Strawberry
            q6: 'b',  // Drake
            q7: 'b',  // Cigarettes After Sex
            q8: 'b',  // Going on a Picnic
            q9: 'b',  // Tokyo
            q10: 'c'  // Spring
        };
        let score = 0;
        const formData = new FormData(quizForm);
        const userName = userNameInput.value.trim();
        const answerLabels = {
            q1: { a: 'Ice Cream', b: 'Chocolate Cake', c: 'Cupcakes' },
            q2: { a: 'Kitten', b: 'Puppy', c: 'Bunny' },
            q3: { a: 'Watching Movies', b: 'Reading', c: 'Listening to Music' },
            q4: { a: 'Blue', b: 'Pink', c: 'Yellow' },
            q5: { a: 'Apple', b: 'Strawberry', c: 'Mango' },
            q6: { a: 'The Weeknd', b: 'Drake', c: 'Billie Eilish' },
            q7: { a: 'The 1975', b: 'Cigarettes After Sex', c: 'Arctic Monkeys' },
            q8: { a: 'Binge-watching Shows', b: 'Going on a Picnic', c: 'Shopping' },
            q9: { a: 'New York', b: 'Tokyo', c: 'Paris' },
            q10: { a: 'Summer', b: 'Autumn', c: 'Spring' }
        };
        const results = [];
    
        const checkAnswer = (questionNum, answer, correct) => {
            const qKey = `q${questionNum}`;
            const correctLabel = answerLabels[qKey][correct];
            if (!answer) {
                results.push(`Question ${questionNum}: Incorrect. Correct answer is ${correctLabel} (you didn't select an answer)`);
                console.log(`Question ${questionNum}: No answer selected.`);
                return;
            }
            const userLabel = answerLabels[qKey][answer] || 'invalid';
            if (answer === correct) {
                score++;
                results.push(`Question ${questionNum}: Correct (${correctLabel})`);
            } else {
                results.push(`Question ${questionNum}: Incorrect. Correct answer is ${correctLabel} (you chose ${userLabel})`);
            }
            console.log(`Question ${questionNum} processed: Answer=${answer}, Correct=${correct}`);
        };
    
        for (let i = 1; i <= 10; i++) {
            checkAnswer(i, formData.get(`q${i}`), answers[`q${i}`]);
        }
    
        console.log('Displaying quiz results...');
        resultDiv.innerHTML = `You got ${score}/10! Thanks for celebrating Simav! 🎉<br><br><strong>Results:</strong><br>${results.join('<br>')}`;
        console.log('Quiz results displayed:', { score, userName, results });
    
        // Send quiz submission event to Google Analytics
        gtag('event', 'quiz_submission', {
            'event_category': 'Engagement',
            'event_label': 'Quiz Submitted',
            'value': score
        });
    
        if (userName) {
            let storedResults = [];
            try {
                const storedData = localStorage.getItem('quizResults');
                storedResults = storedData ? JSON.parse(storedData) : [];
                if (!Array.isArray(storedResults)) {
                    console.warn('Stored quizResults is not an array, resetting to empty array.');
                    storedResults = [];
                }
                storedResults = storedResults.filter(result => result.name && result.name.trim() !== '');
            } catch (e) {
                console.error('Error parsing quizResults from localStorage:', e.message);
                storedResults = [];
            }
    
            storedResults.push({ name: userName, score, timestamp: new Date().toLocaleString() });
            try {
                localStorage.setItem('quizResults', JSON.stringify(storedResults));
                console.log('Quiz results saved to localStorage:', storedResults);
            } catch (e) {
                console.error('Error saving quizResults to localStorage:', e.message);
                alert('Failed to save score. Try clearing browser storage and refreshing the page.');
            }
    
            viewScoresBtn.style.display = 'block';
            console.log('View scores button displayed.');
        } else {
            console.warn('User name is empty. Not saving score to localStorage.');
        }
    });

    window.viewScores = function () {
        console.log('viewScores function called.');
        if (!scoreListDiv) {
            console.error('Score list element (#score-list) not found in DOM.');
            return;
        }

        let storedResults = [];
        try {
            const storedData = localStorage.getItem('quizResults');
            storedResults = storedData ? JSON.parse(storedData) : [];
            if (!Array.isArray(storedResults)) {
                console.warn('Stored quizResults is not an array, resetting to empty array.');
                storedResults = [];
            }
            storedResults = storedResults.filter(result => result.name && result.name.trim() !== '' && result.score !== undefined);
        } catch (e) {
            console.error('Error parsing quizResults from localStorage:', e.message);
            storedResults = [];
        }

        scoreListDiv.innerHTML = storedResults.length > 0
            ? '<h3>Scores:</h3>' + storedResults.map(result => `${result.name}: ${result.score}/10 (${result.timestamp})`).join('<br>')
            : 'No scores yet!';
        scoreListDiv.style.display = 'block';
        console.log('Scores displayed:', storedResults);
    };

    window.checkAdminPassword = function () {
        const password = adminPasswordInput.value;
        const correctPassword = 'MoonlitTalk';
        if (password === correctPassword) {
            adminContent.style.display = 'block';
            adminPanel.style.display = 'none'; // Hide the entire admin panel on success
            adminMessage.textContent = 'Admin access granted! 🎉';
            console.log('Admin panel unlocked.');
        } else {
            adminMessage.textContent = 'Incorrect password. Try again?';
            console.log('Incorrect admin password entered.');
        }
    };

    window.viewAdminScores = function () {
        let storedResults = [];
        try {
            const storedData = localStorage.getItem('quizResults');
            storedResults = storedData ? JSON.parse(storedData) : [];
            if (!Array.isArray(storedResults)) {
                console.warn('Stored quizResults is not an array, resetting to empty array.');
                storedResults = [];
            }
            storedResults = storedResults.filter(result => result.name && result.name.trim() !== '' && result.score !== undefined);
        } catch (e) {
            console.error('Error parsing quizResults from localStorage:', e.message);
            storedResults = [];
        }
        adminMessage.innerHTML = storedResults.length > 0
            ? '<strong>All Scores:</strong><br>' + storedResults.map(result => `${result.name}: ${result.score}/10 (${result.timestamp})`).join('<br>')
            : 'No scores yet!';
        console.log('Admin scores displayed:', storedResults);
    };

    window.resetAdminScores = function () {
        localStorage.removeItem('quizResults');
        adminMessage.textContent = 'All scores have been reset! 🔄';
        console.log('Admin reset scores.');
    };
    
    document.getElementById('show-admin').addEventListener('click', function(e) {
        e.preventDefault();
        adminPanel.style.display = 'block';
        console.log('Admin panel triggered.');
    });

    // Add Enter key and click-outside functionality for admin panel
    document.addEventListener('DOMContentLoaded', () => {
        adminPasswordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                checkAdminPassword();
            }
        });

        adminPanel.addEventListener('click', (e) => {
            if (e.target === adminPanel) {
                adminPanel.style.display = 'none';
                console.log('Admin panel dismissed.');
            }
        });
    });
}