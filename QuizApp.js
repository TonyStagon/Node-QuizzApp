const readline = require('readline-sync');

class QuizApp {
    constructor(questions, totalQuizTime) {
        this.questions = questions;
        this.score = 0;
        this.totalQuizTime = totalQuizTime * 1000; // convert to ms
        this.timePerQuestion = 15 * 1000; // 15 seconds per question
    }

    async start() {
        console.log("Quiz starting... You have limited time per question!");
        let quizEndTime = Date.now() + this.totalQuizTime;
        let questionIndex = 0;

        while (questionIndex < this.questions.length && Date.now() < quizEndTime) {
            const question = this.questions[questionIndex];
            const timeLeft = quizEndTime - Date.now();

            await this.askQuestion(question, timeLeft)
                .then((correct) => {
                    if (correct) this.score++;
                })
                .catch((err) => console.log(err.message));

            questionIndex++;
        }

        console.log(`Quiz ended. Your final score is: ${this.score}/${this.questions.length}`);
    }

    async askQuestion(question, quizTimeLeft) {
        return new Promise((resolve, reject) => {
            console.log(question.text);
            const interval = setInterval(() => console.log('Time left for question:'), 1000);

            let questionTimeout = setTimeout(() => {
                clearInterval(interval);
                console.log('Time up for this question!');
                resolve(false);
            }, Math.min(this.timePerQuestion, quizTimeLeft));

            const answer = readline.question('Your answer: ');

            clearTimeout(questionTimeout);
            clearInterval(interval);

            if (answer === question.answer) {
                console.log('Correct!');
                resolve(true);
            } else {
                console.log('Incorrect!');
                resolve(false);
            }
        });
    }
}

// Example question set
const questions = [
    { text: 'What is 2 + 2?', answer: '4' },
    { text: 'What is the capital of France?', answer: 'Paris' },
    { text: 'Who is your  Facilitator in Code Tribe?', answer: 'Vukona' },
    { text: 'What is the main  runtime enviroment involved  in this project', answer: 'node.js' },
    { text: 'Which country has the highest life expectancy?', answer: 'Monaco' },
    { text: 'How many days in a week', answer: '7' },

    // Add more questions as needed
];

const quiz = new QuizApp(questions, 60); // 1-minute total quiz time
quiz.start();