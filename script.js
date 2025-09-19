// A simple array of challenge objects.
// Each object contains a question, the correct answer(s), and a point value.
const challenges = [
    // Riddles
    { type: "Riddle", question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", answer: "echo", points: 10 },
    { type: "Riddle", question: "What has an eye but cannot see?", answer: "needle", points: 10 },
    { type: "Riddle", question: "What is full of holes but still holds water?", answer: "sponge", points: 10 },
    { type: "Riddle", question: "What has a neck but no head?", answer: "bottle", points: 10 },
    { type: "Riddle", question: "What gets wet while drying?", answer: "towel", points: 10 },
    
    // Trivia Questions
    { type: "Trivia", question: "What is the capital of France?", answer: "paris", points: 10 },
    { type: "Trivia", question: "Who painted the Mona Lisa?", answer: "leonardo da vinci", points: 10 },
    { type: "Trivia", question: "Which planet is known as the 'Red Planet'?", answer: "mars", points: 10 },
    { type: "Trivia", question: "In what year did the Titanic sink?", answer: "1912", points: 10 },
    { type: "Trivia", question: "What is the largest ocean on Earth?", answer: "pacific", points: 10 },

    // Math Puzzles
    { type: "Math", question: "What is 7 multiplied by 8?", answer: "56", points: 10 },
    { type: "Math", question: "If a shirt costs $20 and is 25% off, what's the new price?", answer: "15", points: 10 },
    { type: "Math", question: "What is the square root of 64?", answer: "8", points: 10 },
    { type: "Math", question: "What is 15 + 23 - 5?", answer: "33", points: 10 },
    { type: "Math", question: "What is the next number in the Fibonacci sequence: 1, 1, 2, 3, 5, 8, ...?", answer: "13", points: 10 },

    // Logic Puzzles
    { type: "Logic", question: "Which word does not belong: Apple, Orange, Banana, Potato?", answer: "potato", points: 10 },
    { type: "Logic", question: "Complete the series: 1, 4, 9, 16, ?", answer: "25", points: 10 },
    { type: "Logic", question: "I am always hungry, I must always be fed, the finger I lick will soon turn red. What am I?", answer: "fire", points: 10 },
    { type: "Logic", question: "What has a neck and no head, and wears a cap?", answer: "kettle", points: 10 },
    { type: "Logic", question: "A man is looking at a portrait. He says, 'Brothers and sisters I have none, but that man's father is my father's son.' Who is in the portrait?", answer: "his son", points: 10 },

    // Bonus and Penalty Squares
    { type: "Bonus", question: "Name a planet in our solar system (besides Earth).", answer: ["mars", "jupiter", "saturn", "venus", "neptune", "uranus", "mercury"], points: 15, isBonus: true },
    { type: "Bonus", question: "What is the total number of letters in the English alphabet?", answer: "26", points: 15, isBonus: true },
    { type: "Penalty", question: "Spell 'rhinoceros' correctly.", answer: "rhinoceros", points: 10, isPenalty: true, penaltyTime: 10 },
    { type: "Penalty", question: "Spell 'embarrassment' correctly.", answer: "embarrassment", points: 10, isPenalty: true, penaltyTime: 10 },
    { type: "Penalty", question: "Spell 'accommodate' correctly.", answer: "accommodate", points: 10, isPenalty: true, penaltyTime: 10 }
];
