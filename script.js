/* =========================================
   VÝBĚR PŘEDMĚTU A TÉMATU
========================================= */

const subjectSelect = document.getElementById("subjectSelect");
const topicSelect = document.getElementById("topicSelect");
const startTestButton = document.getElementById("startTest");
const testContainer = document.getElementById("testContainer");

// Změna předmětu
if (subjectSelect && topicSelect && startTestButton && testContainer) {
    subjectSelect.addEventListener("change", function () {
        const subject = subjectSelect.value;

        topicSelect.innerHTML =
            '<option value="">Vyber téma</option>';

        topicSelect.disabled = true;
        startTestButton.disabled = true;
        testContainer.innerHTML = "";

        if (!subject || !testDatabase[subject]) {
            topicSelect.innerHTML =
                '<option value="">Nejprve vyber předmět</option>';
            return;
        }

        const topics = testDatabase[subject];

        for (const [topicId, topic] of Object.entries(topics)) {
            const option = document.createElement("option");

            option.value = topicId;
            option.textContent = topic.name;

            topicSelect.appendChild(option);
        }

        topicSelect.disabled = false;
    });

    // Změna tématu
    topicSelect.addEventListener("change", function () {
        startTestButton.disabled = !topicSelect.value;
        testContainer.innerHTML = "";
    });

    // Spuštění testu
    startTestButton.addEventListener("click", function () {
        const subject = subjectSelect.value;
        const topic = topicSelect.value;

        const selectedTest = testDatabase[subject]?.[topic];

        if (!selectedTest) {
            return;
        }

        showTest(selectedTest);
    });
}

/* =========================================
   ZOBRAZENÍ TESTU
========================================= */

function showTest(test) {
    testContainer.innerHTML = "";

    const heading = document.createElement("h3");
    heading.textContent = test.name;
    testContainer.appendChild(heading);

    test.questions.forEach((q, index) => {
        const questionElement = document.createElement("div");
        questionElement.className = "question";

        const title = document.createElement("h4");
        title.textContent = `${index + 1}. ${q.question}`;

        questionElement.appendChild(title);

        q.answers.forEach((answer, answerIndex) => {
            const label = document.createElement("label");
            label.className = "answer";

            const input = document.createElement("input");
            input.type = "radio";
            input.name = `question-${index}`;
            input.value = answerIndex;

            label.appendChild(input);
            label.appendChild(
                document.createTextNode(" " + answer)
            );

            questionElement.appendChild(label);
        });

        testContainer.appendChild(questionElement);
    });

    const submitButton = document.createElement("button");
    submitButton.textContent = "Vyhodnotit test";
    submitButton.type = "button";
    submitButton.style.marginTop = "20px";

    submitButton.addEventListener("click", function () {
        checkTestAnswers(test);
    });

    testContainer.appendChild(submitButton);
}

/* =========================================
   VYHODNOCENÍ TESTU
========================================= */

function checkTestAnswers(test) {
    let score = 0;
    let unanswered = 0;

    test.questions.forEach((q, index) => {
        const selected = testContainer.querySelector(
            `input[name="question-${index}"]:checked`
        );

        if (!selected) {
            unanswered++;
        } else if (Number(selected.value) === q.correct) {
            score++;
        }
    });

    if (unanswered > 0) {
        alert(`Nezodpověděl jsi ještě ${unanswered} otázek.`);
        return;
    }

    const percentage = Math.round(
        (score / test.questions.length) * 100
    );

    let grade;

    if (percentage >= 90) {
        grade = "Výborně!";
    } else if (percentage >= 75) {
        grade = "Velmi dobře!";
    } else if (percentage >= 60) {
        grade = "Dobrá práce!";
    } else if (percentage >= 40) {
        grade = "Ještě to trochu procvič.";
    } else {
        grade = "Zkus si látku znovu projít.";
    }

    testContainer.innerHTML = `
        <div class="test-result">
            <h3>Výsledek: ${test.name}</h3>
            <p>${grade}</p>
            <p>Správně: ${score} z ${test.questions.length}</p>
            <p>Úspěšnost: ${percentage} %</p>
            <button id="retryTest" type="button">
                Opakovat test
            </button>
        </div>
    `;

    document.getElementById("retryTest").addEventListener(
        "click",
        function () {
            showTest(test);
        }
    );
}

/* =========================================
   PŘEPÍNÁNÍ SVĚTLÉHO A TMAVÉHO REŽIMU
========================================= */

const themeToggleBtn = document.getElementById("darkmode-toggle");
const themeCSS = document.getElementById("themeCSS");

if (themeToggleBtn && themeCSS) {
    const savedTheme = localStorage.getItem("theme") || "light";

    themeCSS.href =
        savedTheme === "dark" ? "dark.css" : "style.css";

    themeToggleBtn.checked = savedTheme === "dark";

    themeToggleBtn.addEventListener("change", function () {
        const theme = themeToggleBtn.checked ? "dark" : "light";

        themeCSS.href =
            theme === "dark" ? "dark.css" : "style.css";

        localStorage.setItem("theme", theme);
    });
}

/* =========================================
   ROZBALOVÁNÍ NAVIGACE
========================================= */

const navbar = document.getElementById("navbar");
const toggleBtn = document.getElementById("toggleBtn");

if (navbar && toggleBtn) {
    toggleBtn.addEventListener("click", function () {
        navbar.classList.toggle("collapsed");

        const isCollapsed =
            navbar.classList.contains("collapsed");

        toggleBtn.setAttribute(
            "aria-label",
            isCollapsed
                ? "Rozšířit navigaci"
                : "Zmenšit navigaci"
        );
    });
}


// Databáze předmětů, témat a otázek
const testDatabase = {
    matematika: {
        desetinna_cisla: {
            name: "Desetinná čísla",
            questions: [
                { question: "2,5 + 1,3", answers: ["4,8", "3,8", "2,8", "3,7"], correct: 1 },
                { question: "7,2 - 3,8", answers: ["4,4", "3,4", "4,6", "3,6"], correct: 1 },
                { question: "0,4 × 10", answers: ["4", "0,04", "40", "0,4"], correct: 0 },
                { question: "3,6 ÷ 0,6", answers: ["0,6", "6", "60", "5"], correct: 1 },
                { question: "0,25 jako zlomek", answers: ["1/4", "1/2", "2/5", "1/5"], correct: 0 },
                { question: "1,75 jako zlomek", answers: ["3/4", "7/4", "5/4", "7/5"], correct: 1 },
                { question: "Které číslo je největší?", answers: ["0,89", "0,9", "0,19", "0,09"], correct: 1 },
                { question: "Zaokrouhli 4,786 na setiny", answers: ["4,8", "4,79", "4,78", "4,7"], correct: 1 },
                { question: "Kolik je 12,5 + 0,75?", answers: ["12,575", "13,15", "12,25", "13,25"], correct: 3 },
                { question: "Kolik je 5 - 2,68?", answers: ["2,68", "2,42", "2,32", "3,32"], correct: 2 },
                { question: "Kolik je 1,2 × 3?", answers: ["3,2", "0,36", "36", "3,6"], correct: 3 },
                { question: "Kolik je 8,4 ÷ 2?", answers: ["2,4", "4,8", "4,2", "6,2"], correct: 2 },
                { question: "Kolik desetinných míst má číslo 0,305?", answers: ["3", "4", "1", "2"], correct: 0 },
                { question: "Zápis 6/10 desetinným číslem", answers: ["1,6", "6,0", "0,6", "0,06"], correct: 2 },
                { question: "Který zápis je stejný jako 2,50?", answers: ["2,05", "0,25", "2,5", "25"], correct: 2 }
            ]
        },
        zlomky: {
            name: "Zlomky",
            questions: [
                { question: "1/2 + 1/4", answers: ["2/6", "3/4", "1/6", "2/4"], correct: 1 },
                { question: "3/4 - 1/4", answers: ["1/2", "2/8", "1/4", "3/8"], correct: 0 },
                { question: "1/3 + 1/3", answers: ["2/3", "2/6", "1", "1/6"], correct: 0 },
                { question: "2/5 × 3/4", answers: ["3/10", "2/9", "5/20", "6/9"], correct: 0 },
                { question: "1/2 ÷ 1/4", answers: ["1/8", "1/2", "2", "4"], correct: 2 },
                { question: "Zkrať zlomek 6/8", answers: ["4/3", "3/4", "6/4", "2/4"], correct: 1 },
                { question: "Který zlomek je největší?", answers: ["1/4", "2/3", "1/2", "3/4"], correct: 3 },
                { question: "Zapiš 0,5 jako zlomek", answers: ["5/100", "1/2", "1/5", "2/5"], correct: 1 },
                { question: "Kolik je 2/3 z 12?", answers: ["4", "6", "9", "8"], correct: 3 },
                { question: "Společný jmenovatel pro 1/2 a 1/3 může být", answers: ["5", "3", "6", "2"], correct: 2 },
                { question: "Čitatel ve zlomku 5/9 je", answers: ["4", "14", "9", "5"], correct: 3 },
                { question: "Jmenovatel ve zlomku 7/10 je", answers: ["3", "10", "17", "7"], correct: 1 },
                { question: "Který zlomek odpovídá jedné čtvrtině?", answers: ["2/8", "2/4", "3/8", "4/6"], correct: 0 },
                { question: "Kolik je 5/6 - 1/6?", answers: ["4/12", "2/3", "5/6", "1/3"], correct: 1 },
                { question: "Převrácený zlomek k 2/7 je", answers: ["5/7", "2/7", "7/2", "-7/2"], correct: 2 }
            ]
        },
        procenta: {
            name: "Procenta",
            questions: [
                { question: "Kolik je 10 % z 250?", answers: ["2,5", "35", "2500", "25"], correct: 3 },
                { question: "Kolik je 25 % z 80?", answers: ["25", "10", "40", "20"], correct: 3 },
                { question: "Kolik je 50 % z 46?", answers: ["13", "26", "23", "92"], correct: 2 },
                { question: "Kolik je 20 % z 150?", answers: ["20", "45", "15", "30"], correct: 3 },
                { question: "Kolik je 75 % z 40?", answers: ["35", "25", "10", "30"], correct: 3 },
                { question: "30 z 100 je kolik procent?", answers: ["3 %", "30 %", "300 %", "70 %"], correct: 1 },
                { question: "0,15 jako procenta", answers: ["0,15 %", "15 %", "150 %", "1,5 %"], correct: 1 },
                { question: "Cena 200 Kč se zvýší o 10 %. Nová cena?", answers: ["20 Kč", "210 Kč", "190 Kč", "220 Kč"], correct: 3 },
                { question: "Cena 500 Kč se zlevní o 20 %. Nová cena?", answers: ["100 Kč", "400 Kč", "480 Kč", "600 Kč"], correct: 1 },
                { question: "1 % z 900 je", answers: ["1", "9", "19", "90"], correct: 1 },
                { question: "Kolik procent je 5 z 20?", answers: ["40 %", "25 %", "5 %", "20 %"], correct: 1 },
                { question: "Kolik je 40 % z 70?", answers: ["32", "28", "14", "21"], correct: 1 },
                { question: "Základ je 300 a část 60. Kolik je to procent?", answers: ["20 %", "25 %", "5 %", "60 %"], correct: 0 },
                { question: "O kolik procent se zvýšilo 50 na 60?", answers: ["15 %", "10 %", "25 %", "20 %"], correct: 3 },
                { question: "100 % z čísla 37 je", answers: ["3,7", "37", "0,37", "74"], correct: 1 }
            ]
        },
        rovnice: {
            name: "Rovnice",
            questions: [
                { question: "Vyřeš: x + 5 = 12", answers: ["x = 17", "x = 5", "x = 7", "x = 6"], correct: 2 },
                { question: "Vyřeš: x - 4 = 10", answers: ["x = 40", "x = 10", "x = 6", "x = 14"], correct: 3 },
                { question: "Vyřeš: 3x = 21", answers: ["x = 24", "x = 7", "x = 3", "x = 18"], correct: 1 },
                { question: "Vyřeš: x/4 = 6", answers: ["x = 24", "x = 2", "x = 1,5", "x = 10"], correct: 0 },
                { question: "Vyřeš: 2x + 3 = 11", answers: ["x = 4", "x = 5", "x = 7", "x = 14"], correct: 0 },
                { question: "Vyřeš: 5x - 10 = 15", answers: ["x = 3", "x = 1", "x = 7", "x = 5"], correct: 3 },
                { question: "Vyřeš: 4x = 36", answers: ["x = 9", "x = 8", "x = 40", "x = 32"], correct: 0 },
                { question: "Vyřeš: x + 8 = 8", answers: ["x = 8", "x = -8", "x = 1", "x = 0"], correct: 3 },
                { question: "Vyřeš: 7 - x = 2", answers: ["x = -5", "x = 2", "x = 5", "x = 9"], correct: 2 },
                { question: "Vyřeš: 2(x + 3) = 14", answers: ["x = 7", "x = 5", "x = 2", "x = 4"], correct: 3 },
                { question: "Vyřeš: 3x + 2 = 20", answers: ["x = 4", "x = 8", "x = 18", "x = 6"], correct: 3 },
                { question: "Vyřeš: 6x - 5 = 13", answers: ["x = 3", "x = 2", "x = 8", "x = 18"], correct: 0 },
                { question: "Vyřeš: 2x - 9 = 1", answers: ["x = 5", "x = 10", "x = -5", "x = 4"], correct: 0 },
                { question: "Vyřeš: 5(x - 1) = 20", answers: ["x = 15", "x = 4", "x = 3", "x = 5"], correct: 3 },
                { question: "Vyřeš: 3x + 4 = x + 12", answers: ["x = 8", "x = 2", "x = 4", "x = 6"], correct: 2 }
            ]
        },
        linearni_rovnice: {
            name: "Lineární rovnice",
            questions: [
                { question: "Vyřeš: 2x + 1 = 9", answers: ["x = 8", "x = 4", "x = 3", "x = 5"], correct: 1 },
                { question: "Vyřeš: 4x - 8 = 12", answers: ["x = 1", "x = 5", "x = 20", "x = 4"], correct: 1 },
                { question: "Vyřeš: 5x + 10 = 35", answers: ["x = 7", "x = 5", "x = 3", "x = 9"], correct: 1 },
                { question: "Vyřeš: 7x = 42", answers: ["x = 35", "x = 6", "x = 7", "x = 5"], correct: 1 },
                { question: "Vyřeš: 3x - 6 = 0", answers: ["x = 2", "x = 6", "x = 3", "x = -2"], correct: 0 },
                { question: "Vyřeš: 2x + 5 = x + 11", answers: ["x = 3", "x = 16", "x = 6", "x = 5"], correct: 2 },
                { question: "Vyřeš: 8x - 4 = 20", answers: ["x = 2", "x = 16", "x = 4", "x = 3"], correct: 3 },
                { question: "Vyřeš: 9 - 2x = 1", answers: ["x = 8", "x = 5", "x = -4", "x = 4"], correct: 3 },
                { question: "Vyřeš: 4(x + 2) = 24", answers: ["x = 6", "x = 2", "x = 8", "x = 4"], correct: 3 },
                { question: "Vyřeš: 2(x - 3) = 10", answers: ["x = 8", "x = 13", "x = 5", "x = 2"], correct: 0 },
                { question: "Vyřeš: 6x + 2 = 3x + 17", answers: ["x = 19", "x = 15", "x = 3", "x = 5"], correct: 3 },
                { question: "Vyřeš: 10x - 7 = 23", answers: ["x = 3", "x = 2", "x = 30", "x = 4"], correct: 0 },
                { question: "Vyřeš: 3(x + 1) = 18", answers: ["x = 6", "x = 5", "x = 4", "x = 3"], correct: 1 },
                { question: "Vyřeš: 12 - 3x = 0", answers: ["x = 4", "x = 3", "x = 9", "x = -4"], correct: 0 },
                { question: "Vyřeš: 5x + 2 = 2x + 20", answers: ["x = 6", "x = 18", "x = 4", "x = 7"], correct: 0 }
            ]
        },
        linearni_nerovnice: {
            name: "Lineární nerovnice",
            questions: [
                { question: "Vyřeš: x + 3 < 8", answers: ["x > 11", "x > 5", "x < 11", "x < 5"], correct: 3 },
                { question: "Vyřeš: 2x < 10", answers: ["x < 8", "x > 5", "x < 5", "x > 8"], correct: 2 },
                { question: "Vyřeš: x - 4 ≥ 2", answers: ["x ≥ -2", "x ≤ 6", "x ≥ 6", "x < 6"], correct: 2 },
                { question: "Vyřeš: 3x > 12", answers: ["x < 9", "x > 4", "x > 9", "x < 4"], correct: 1 },
                { question: "Vyřeš: 2x + 1 ≤ 7", answers: ["x ≤ 4", "x ≤ 3", "x ≥ 3", "x ≥ 4"], correct: 1 },
                { question: "Vyřeš: 5 - x > 2", answers: ["x < 3", "x < 7", "x > 7", "x > 3"], correct: 0 },
                { question: "Vyřeš: -2x > 8", answers: ["x < 4", "x > -4", "x < -4", "x > 4"], correct: 2 },
                { question: "Vyřeš: 4x - 8 ≥ 0", answers: ["x ≥ -2", "x ≤ 2", "x > 8", "x ≥ 2"], correct: 3 },
                { question: "Vyřeš: 7x ≤ 21", answers: ["x ≥ 7", "x ≤ 7", "x ≤ 3", "x ≥ 3"], correct: 2 },
                { question: "Vyřeš: x/2 > 6", answers: ["x > 3", "x < 3", "x > 12", "x < 12"], correct: 2 },
                { question: "Vyřeš: -3x ≤ 9", answers: ["x ≥ -3", "x ≤ -3", "x ≥ 3", "x ≤ 3"], correct: 0 },
                { question: "Vyřeš: 2x - 5 > 1", answers: ["x < -2", "x > 3", "x < 3", "x > -2"], correct: 1 },
                { question: "Vyřeš: 10 - 2x ≥ 4", answers: ["x ≥ 3", "x ≤ 7", "x ≥ 7", "x ≤ 3"], correct: 3 },
                { question: "Vyřeš: 3(x + 1) < 12", answers: ["x < 4", "x > 3", "x > 4", "x < 3"], correct: 3 },
                { question: "Vyřeš: x + 2 ≤ x + 5", answers: ["všechna reálná čísla", "x ≥ 3", "x ≤ 3", "žádné řešení"], correct: 0 }
            ]
        },
        soustavy_rovnic: {
            name: "Soustavy lineárních rovnic",
            questions: [
                { question: "Řešení: x + y = 5, x - y = 1", answers: ["x = 1, y = 4", "x = 4, y = 1", "x = 2, y = 3", "x = 3, y = 2"], correct: 3 },
                { question: "Řešení: x + y = 7, x = 4", answers: ["x = 4, y = 3", "x = 3, y = 4", "x = 7, y = 4", "x = 4, y = 7"], correct: 0 },
                { question: "Řešení: 2x + y = 8, y = 2", answers: ["x = 2, y = 2", "x = 3, y = 2", "x = 3, y = 3", "x = 4, y = 2"], correct: 1 },
                { question: "Řešení: x + y = 10, y = 6", answers: ["x = 6, y = 4", "x = 10, y = 6", "x = 4, y = 10", "x = 4, y = 6"], correct: 3 },
                { question: "Řešení: x - y = 2, x = 5", answers: ["x = 2, y = 5", "x = 5, y = 7", "x = 3, y = 5", "x = 5, y = 3"], correct: 3 },
                { question: "Řešení: 2x + 2y = 12, x = 4", answers: ["x = 6, y = 4", "x = 2, y = 4", "x = 4, y = 6", "x = 4, y = 2"], correct: 3 },
                { question: "Řešení: x + 2y = 9, x = 3", answers: ["x = 9, y = 3", "x = 3, y = 3", "x = 3, y = 6", "x = 6, y = 3"], correct: 1 },
                { question: "Řešení: x + y = 4, y = 1", answers: ["x = 3, y = 1", "x = 3, y = 4", "x = 1, y = 3", "x = 4, y = 1"], correct: 0 },
                { question: "Řešení: 3x + y = 11, x = 3", answers: ["x = 2, y = 3", "x = 3, y = 11", "x = 3, y = 2", "x = 4, y = 2"], correct: 2 },
                { question: "Řešení: x + y = 0, x = 5", answers: ["x = -5, y = 5", "x = 5, y = -5", "x = 0, y = 5", "x = 5, y = 5"], correct: 1 },
                { question: "Řešení: x - y = 4, y = 2", answers: ["x = 6, y = 4", "x = 6, y = 2", "x = 2, y = 6", "x = 4, y = 2"], correct: 1 },
                { question: "Řešení: 2x + y = 7, x = 2", answers: ["x = 5, y = 2", "x = 2, y = 3", "x = 3, y = 2", "x = 2, y = 7"], correct: 1 },
                { question: "Řešení: x + y = 12, x = 7", answers: ["x = 12, y = 7", "x = 5, y = 7", "x = 7, y = 12", "x = 7, y = 5"], correct: 3 },
                { question: "Řešení: x + 3y = 10, y = 2", answers: ["x = 10, y = 2", "x = 4, y = 2", "x = 4, y = 3", "x = 2, y = 4"], correct: 1 },
                { question: "Řešení: x + y = 9, x - y = 3", answers: ["x = 6, y = 3", "x = 3, y = 6", "x = 4, y = 5", "x = 5, y = 4"], correct: 0 }
            ]
        },
        vyjadreni_neznáme: {
            name: "Vyjádření neznámé ze vzorce",
            questions: [
                { question: "Ze vzorce O = 4a vyjádři a", answers: ["a = O/4", "a = 4 - O", "a = O - 4", "a = 4O"], correct: 0 },
                { question: "Ze vzorce v = s/t vyjádři s", answers: ["s = t/v", "s = v·t", "s = v + t", "s = v/t"], correct: 1 },
                { question: "Ze vzorce v = s/t vyjádři t", answers: ["t = s·v", "t = s/v", "t = v - s", "t = v/s"], correct: 1 },
                { question: "Ze vzorce S = a·b vyjádři b", answers: ["b = S·a", "b = a/S", "b = S/a", "b = S - a"], correct: 2 },
                { question: "Ze vzorce F = m·a vyjádři m", answers: ["m = F - a", "m = F/a", "m = a/F", "m = F·a"], correct: 1 },
                { question: "Ze vzorce C = 2πr vyjádři r", answers: ["r = C/π²", "r = C·2π", "r = C/(2π)", "r = 2πC"], correct: 2 },
                { question: "Ze vzorce y = x + 5 vyjádři x", answers: ["x = 5y", "x = y - 5", "x = 5 - y", "x = y + 5"], correct: 1 },
                { question: "Ze vzorce A = 3b vyjádři b", answers: ["b = 3A", "b = 3 - A", "b = A/3", "b = A - 3"], correct: 2 },
                { question: "Ze vzorce V = a³ vyjádři a", answers: ["a = V/3", "a = ∛V", "a = √V", "a = V³"], correct: 1 },
                { question: "Ze vzorce P = 2a + 2b vyjádři a", answers: ["a = (P - 2b)/2", "a = P/(2b)", "a = (P + 2b)/2", "a = P - 2b"], correct: 0 },
                { question: "Ze vzorce E = P·t vyjádři P", answers: ["P = E·t", "P = E/t", "P = E - t", "P = t/E"], correct: 1 },
                { question: "Ze vzorce d = 2r vyjádři r", answers: ["r = 2d", "r = d/2", "r = d²", "r = d + 2"], correct: 1 },
                { question: "Ze vzorce z = 5x vyjádři x", answers: ["x = 5z", "x = z/5", "x = 5 - z", "x = z - 5"], correct: 1 },
                { question: "Ze vzorce S = πr² vyjádři r", answers: ["r = √S · π", "r = S/π", "r = √(S/π)", "r = πS"], correct: 2 },
                { question: "Ze vzorce y = 2x - 3 vyjádři x", answers: ["x = (y - 3)/2", "x = 2y + 3", "x = (y + 3)/2", "x = y/2 - 3"], correct: 2 }
            ]
        },
        algebraicke_vzorce: {
            name: "Algebraické vzorce",
            questions: [
                { question: "Rozviň (a + b)²", answers: ["a² + ab + b²", "a² + 2ab + b²", "a² - 2ab + b²", "a² + b²"], correct: 1 },
                { question: "Rozviň (a - b)²", answers: ["a² - ab + b²", "a² - b²", "a² - 2ab + b²", "a² + 2ab + b²"], correct: 2 },
                { question: "Rozlož a² - b²", answers: ["a² - 2ab + b²", "(a - b)(a + b)", "(a + b)²", "(a - b)²"], correct: 1 },
                { question: "(x + 3)²", answers: ["x² + 6x + 9", "x² + 3x + 9", "x² + 9", "x² - 6x + 9"], correct: 0 },
                { question: "(x - 4)²", answers: ["x² + 8x + 16", "x² - 8x + 16", "x² - 16", "x² - 4x + 16"], correct: 1 },
                { question: "(x + 2)(x - 2)", answers: ["x² - 4x + 4", "x² + 4", "x² - 4", "x² + 4x + 4"], correct: 2 },
                { question: "(a + b)(a - b)", answers: ["a² - 2ab + b²", "a² + b²", "a² + 2ab + b²", "a² - b²"], correct: 3 },
                { question: "(x + 5)²", answers: ["x² - 10x + 25", "x² + 10x + 25", "x² + 25", "x² + 5x + 25"], correct: 1 },
                { question: "(x - 3)²", answers: ["x² - 9", "x² - 3x + 9", "x² + 6x + 9", "x² - 6x + 9"], correct: 3 },
                { question: "(2 + x)²", answers: ["x² - 4x + 4", "x² + 4x + 4", "x² + 2x + 4", "x² + 4"], correct: 1 },
                { question: "(2x + 1)²", answers: ["4x² + 4x + 1", "4x² + 1", "4x² + 2x + 1", "2x² + 4x + 1"], correct: 0 },
                { question: "(3x - 2)²", answers: ["9x² - 4", "9x² - 12x + 4", "9x² + 12x + 4", "3x² - 12x + 4"], correct: 1 },
                { question: "Rozlož x² + 6x + 9", answers: ["(x + 3)²", "(x - 3)²", "(x + 6)(x + 3)", "(x + 9)²"], correct: 0 },
                { question: "Rozlož x² - 10x + 25", answers: ["(x - 10)(x + 5)", "(x + 5)²", "(x - 25)²", "(x - 5)²"], correct: 3 },
                { question: "Rozviň (x + 1)(x + 4)", answers: ["x² + 5x + 4", "x² + 5", "x² + 4x + 4", "x² + 4x + 1"], correct: 0 }
            ]
        },
        obvody_obsahy: {
            name: "Obvody a obsahy",
            questions: [
                { question: "Obvod čtverce se stranou 4 cm", answers: ["16 cm²", "8 cm", "12 cm", "16 cm"], correct: 3 },
                { question: "Obsah čtverce se stranou 5 cm", answers: ["25 cm²", "10 cm²", "20 cm²", "25 cm"], correct: 0 },
                { question: "Obvod obdélníku 3 cm × 7 cm", answers: ["21 cm", "10 cm", "20 cm", "20 cm²"], correct: 2 },
                { question: "Obsah obdélníku 4 cm × 6 cm", answers: ["20 cm²", "24 cm²", "24 cm", "10 cm²"], correct: 1 },
                { question: "Obsah trojúhelníku se základnou 8 cm a výškou 5 cm", answers: ["13 cm²", "20 cm", "40 cm²", "20 cm²"], correct: 3 },
                { question: "Obvod trojúhelníku se stranami 3, 4, 5 cm", answers: ["60 cm", "9 cm", "12 cm²", "12 cm"], correct: 3 },
                { question: "Obvod čtverce se stranou 9 cm", answers: ["36 cm", "18 cm", "36 cm²", "81 cm"], correct: 0 },
                { question: "Obsah obdélníku 8 cm × 2 cm", answers: ["16 cm²", "20 cm²", "16 cm", "10 cm²"], correct: 0 },
                { question: "Obsah čtverce se stranou 7 m", answers: ["28 m²", "49 m", "49 m²", "14 m²"], correct: 2 },
                { question: "Obvod obdélníku 5 cm × 2 cm", answers: ["14 cm", "10 cm", "14 cm²", "7 cm"], correct: 0 },
                { question: "Obsah trojúhelníku a = 10 cm, výška 4 cm", answers: ["20 cm²", "20 cm", "14 cm²", "40 cm²"], correct: 0 },
                { question: "Obvod pravidelného šestiúhelníku se stranou 3 cm", answers: ["18 cm²", "36 cm", "18 cm", "9 cm"], correct: 2 },
                { question: "Obsah čtverce se stranou 12 cm", answers: ["144 cm", "48 cm²", "24 cm²", "144 cm²"], correct: 3 },
                { question: "Která jednotka je vhodná pro obsah?", answers: ["cm", "kg", "cm²", "cm³"], correct: 2 },
                { question: "Obvod útvaru znamená", answers: ["délku jeho hranice", "výšku útvaru", "plochu uvnitř", "objem tělesa"], correct: 0 }
            ]
        },
        polomer_prumer: {
            name: "Poloměr a průměr",
            questions: [
                { question: "Průměr kružnice s poloměrem 3 cm", answers: ["3 cm", "1,5 cm", "9 cm", "6 cm"], correct: 3 },
                { question: "Poloměr kružnice s průměrem 14 cm", answers: ["7 cm", "28 cm", "14 cm", "6 cm"], correct: 0 },
                { question: "Jaký vztah platí mezi d a r?", answers: ["d = r/2", "r = 2d", "d = 2r", "d = r²"], correct: 2 },
                { question: "Průměr je úsečka, která prochází", answers: ["tečným bodem vždy", "mimo kruh", "středem kružnice", "jen okrajem kruhu"], correct: 2 },
                { question: "Poloměr vede ze středu ke", answers: ["protilehlému středu", "kružnici", "obvodu čtverce", "vrcholu trojúhelníku"], correct: 1 },
                { question: "Je-li r = 8 cm, d =", answers: ["16 cm", "8 cm", "4 cm", "64 cm"], correct: 0 },
                { question: "Je-li d = 20 cm, r =", answers: ["5 cm", "10 cm", "40 cm", "20 cm"], correct: 1 },
                { question: "Která značka se běžně používá pro poloměr?", answers: ["V", "r", "S", "d"], correct: 1 },
                { question: "Která značka se běžně používá pro průměr?", answers: ["r", "a", "O", "d"], correct: 3 },
                { question: "Průměr kružnice je její nejdelší", answers: ["tečna", "poloměr", "tětiva", "oblouk"], correct: 2 },
                { question: "Poloměr 2,5 cm znamená průměr", answers: ["5 cm", "2,5 cm", "7,5 cm", "1,25 cm"], correct: 0 },
                { question: "Průměr 9 cm znamená poloměr", answers: ["9 cm", "4,5 cm", "3 cm", "18 cm"], correct: 1 },
                { question: "Dva poloměry tvoří", answers: ["obsah", "úhel", "průměr", "obvod"], correct: 2 },
                { question: "Poloměr je polovina", answers: ["obsahu", "plochy čtverce", "obvodu", "průměru"], correct: 3 },
                { question: "Když se poloměr zdvojnásobí, průměr se", answers: ["nezmění", "zčtyřnásobí", "také zdvojnásobí", "zmenší na polovinu"], correct: 2 }
            ]
        },
        obvod_obsah_kruhu: {
            name: "Obvod a obsah kruhu",
            questions: [
                { question: "Obvod kružnice se počítá vzorcem", answers: ["O = 2πr", "O = 4πr²", "O = πr²", "O = r²"], correct: 0 },
                { question: "Obsah kruhu se počítá vzorcem", answers: ["S = 2πr", "S = πd", "S = πr²", "S = 4πr²"], correct: 2 },
                { question: "Přibližná hodnota π je", answers: ["4,13", "3,41", "3,14", "2,14"], correct: 2 },
                { question: "Je-li r = 2 cm, obsah je přibližně", answers: ["12,56 cm²", "4 cm²", "12,56 cm", "6,28 cm²"], correct: 0 },
                { question: "Je-li r = 3 cm, obvod je přibližně", answers: ["18,84 cm²", "18,84 cm", "28,26 cm", "9,42 cm"], correct: 1 },
                { question: "Je-li průměr 10 cm, obvod je přibližně", answers: ["78,5 cm", "15,7 cm", "31,4 cm²", "31,4 cm"], correct: 3 },
                { question: "K výpočtu obsahu kruhu potřebujeme", answers: ["hmotnost", "poloměr", "výšku kvádru", "jen průměr bez vzorce"], correct: 1 },
                { question: "Kružnice je", answers: ["čtyřúhelník", "hranice kruhu", "trojúhelník", "celý prostor koule"], correct: 1 },
                { question: "Kruh zahrnuje", answers: ["plochu uvnitř kružnice", "jen střed", "jen obvodovou čáru", "jen poloměr"], correct: 0 },
                { question: "Pokud r = 1 cm, obsah je přibližně", answers: ["2 cm²", "1 cm²", "3,14 cm²", "6,28 cm²"], correct: 2 },
                { question: "Obvod kružnice s r = 5 cm je přibližně", answers: ["31,4 cm", "10 cm", "15,7 cm", "78,5 cm"], correct: 0 },
                { question: "Obsah kruhu s r = 4 cm je přibližně", answers: ["50,24 cm", "50,24 cm²", "16 cm²", "25,12 cm²"], correct: 1 },
                { question: "Vzorec O = πd používá", answers: ["obsah", "průměr", "poloměr na druhou", "objem"], correct: 1 },
                { question: "Jednotka obsahu kruhu může být", answers: ["cm²", "cm", "cm³", "km/h"], correct: 0 },
                { question: "Když se poloměr zdvojnásobí, obsah se zvětší", answers: ["dvakrát", "osmkrát", "čtyřikrát", "třikrát"], correct: 2 }
            ]
        },
        kuzel_jehlan: {
            name: "Kužel a jehlan",
            questions: [
                { question: "Kužel má podstavu ve tvaru", answers: ["čtverce", "trojúhelníku", "obdélníku", "kruhu"], correct: 3 },
                { question: "Jehlan má boční stěny obvykle ve tvaru", answers: ["kruhů", "obdélníků vždy", "pětiúhelníků vždy", "trojúhelníků"], correct: 3 },
                { question: "Objem kužele je", answers: ["V = 4πr²", "V = (1/3)πr²v", "V = πr²v", "V = 2πr"], correct: 1 },
                { question: "Objem jehlanu je", answers: ["V = Sₚ/v", "V = 2Sₚ + v", "V = Sₚv", "V = (1/3)Sₚv"], correct: 3 },
                { question: "Co označuje r ve vzorci kužele?", answers: ["hmotnost", "obvod", "poloměr podstavy", "výšku"], correct: 2 },
                { question: "Co označuje v ve vzorci objemu?", answers: ["objem", "výšku", "poloměr", "obvod"], correct: 1 },
                { question: "Kužel má kolik kruhových podstav?", answers: ["1", "0", "2", "3"], correct: 0 },
                { question: "Jehlan s čtvercovou podstavou má podstavu", answers: ["kruh", "čtverec", "trojúhelník", "kouli"], correct: 1 },
                { question: "Objem tělesa měříme například v", answers: ["cm³", "cm²", "cm", "kg"], correct: 0 },
                { question: "Kužel má jeden vrchol", answers: ["ne", "ano", "jen s hranatou podstavou", "jen pokud je nízký"], correct: 1 },
                { question: "Jehlan má jednu podstavu a", answers: ["žádné boční stěny", "dvě podstavy", "boční trojúhelníkové stěny", "jen kruhové stěny"], correct: 2 },
                { question: "Poloměr kruhové podstavy značíme", answers: ["r", "v", "S", "V"], correct: 0 },
                { question: "Těleso s kruhovou podstavou a špičkou je", answers: ["kvádr", "krychle", "jehlan vždy", "kužel"], correct: 3 },
                { question: "Objem kužele je třetina objemu válce se stejnou podstavou a výškou", answers: ["ne", "ano", "jen při r = 1", "jen při v = 1"], correct: 1 },
                { question: "Jehlan může mít podstavu ve tvaru", answers: ["pouze kruhu", "mnohoúhelníku", "koule", "oblouku"], correct: 1 }
            ]
        },
        krychle_kvadr: {
            name: "Krychle a kvádr",
            questions: [
                { question: "Krychle má stěny ve tvaru", answers: ["trojúhelníků", "kruhů", "čtverců", "obdélníků různých rozměrů vždy"], correct: 2 },
                { question: "Kvádr má celkem kolik stěn?", answers: ["4", "8", "6", "12"], correct: 2 },
                { question: "Krychle má kolik hran?", answers: ["12", "6", "10", "8"], correct: 0 },
                { question: "Kvádr má kolik vrcholů?", answers: ["12", "6", "8", "10"], correct: 2 },
                { question: "Vzorec objemu krychle je", answers: ["V = a²", "V = 4a", "V = 6a²", "V = a³"], correct: 3 },
                { question: "Vzorec povrchu krychle je", answers: ["S = a³", "S = 2a²", "S = 4a", "S = 6a²"], correct: 3 },
                { question: "Objem kvádru je", answers: ["V = 2(ab+ac+bc)", "V = abc", "V = ab", "V = a+b+c"], correct: 1 },
                { question: "Povrch kvádru je", answers: ["S = a+b+c", "S = abc", "S = 6a", "S = 2(ab + ac + bc)"], correct: 3 },
                { question: "Když má krychle hranu 4 cm, objem je", answers: ["64 cm³", "64 cm²", "16 cm³", "48 cm³"], correct: 0 },
                { question: "Když má krychle hranu 5 cm, povrch je", answers: ["150 cm²", "25 cm²", "125 cm²", "100 cm²"], correct: 0 },
                { question: "Kvádr o rozměrech 5, 2, 3 cm má objem", answers: ["10 cm³", "20 cm³", "30 cm³", "30 cm²"], correct: 2 },
                { question: "Povrch tělesa je součet obsahů jeho", answers: ["stěn", "hran", "objemů", "vrcholů"], correct: 0 },
                { question: "Krychle má všechny hrany", answers: ["různě dlouhé", "stejně dlouhé", "zakřivené", "nulové"], correct: 1 },
                { question: "Kvádr má protější stěny", answers: ["vždy kruhové", "vždy trojúhelníkové", "stejně velké", "vždy čtvercové"], correct: 2 },
                { question: "Jednotka objemu může být", answers: ["cm²", "cm³", "cm", "kg"], correct: 1 }
            ]
        },
        kruznice_kruh: {
            name: "Kružnice a kruh",
            questions: [
                { question: "Kružnice je", answers: ["čára tvořící hranici kruhu", "čtyřúhelník", "prostorové těleso", "celá plocha uvnitř"], correct: 0 },
                { question: "Kruh je", answers: ["jen poloměr", "jen obvodová čára", "kužel", "kružnice i plocha uvnitř"], correct: 3 },
                { question: "Vzdálenost středu od kružnice se nazývá", answers: ["poloměr", "tětiva", "tečna", "průměr"], correct: 0 },
                { question: "Úsečka spojující dva body kružnice se nazývá", answers: ["osa", "výška", "poloměr vždy", "tětiva"], correct: 3 },
                { question: "Přímka dotýkající se kružnice v jednom bodě je", answers: ["poloměr", "tečna", "sečna", "průměr"], correct: 1 },
                { question: "Přímka protínající kružnici ve dvou bodech je", answers: ["tečna", "osa souměrnosti vždy", "poloměr", "sečna"], correct: 3 },
                { question: "Průměr je nejdelší", answers: ["poloměr", "tečna", "oblouk", "tětiva kružnice"], correct: 3 },
                { question: "Obvod kružnice je délka", answers: ["plochy uvnitř", "objemu koule", "poloměru", "její hranice"], correct: 3 },
                { question: "Obsah kruhu se značí často", answers: ["m", "r", "S", "V"], correct: 2 },
                { question: "Číslo π se používá při výpočtech", answers: ["trojúhelníku vždy", "kruhu a kružnice", "čtverce pouze", "kvádru pouze"], correct: 1 },
                { question: "Kruh s poloměrem 1 cm má obsah přibližně", answers: ["2 cm²", "6,28 cm²", "1 cm²", "3,14 cm²"], correct: 3 },
                { question: "Poloměr 6 cm odpovídá průměru", answers: ["3 cm", "12 cm", "36 cm", "6 cm"], correct: 1 },
                { question: "Kružnice je množina bodů stejně vzdálených od", answers: ["podstavy kužele", "středu", "přímky vždy", "vrcholu čtverce"], correct: 1 },
                { question: "Kruh je rovinný", answers: ["úhel", "přímka", "útvar", "prostorové těleso"], correct: 2 },
                { question: "Plochu kruhu počítáme v jednotkách", answers: ["čtverečních", "kubických", "délkových", "hmotnostních"], correct: 0 }
            ]
        },
        rovnobezniky: {
            name: "Rovnoběžníky",
            questions: [
                { question: "Rovnoběžník má protější strany", answers: ["rovnoběžné", "zakřivené", "vždy různě dlouhé", "vždy kolmé"], correct: 0 },
                { question: "Obsah rovnoběžníku je", answers: ["S = a·vₐ", "S = 2πr", "S = a²", "S = a+b"], correct: 0 },
                { question: "Obdélník má všechny úhly", answers: ["45°", "90°", "180°", "60°"], correct: 1 },
                { question: "Kosočtverec má", answers: ["kruhovou podstavu", "všechny úhly 90° vždy", "všechny strany stejně dlouhé", "jen dvě strany"], correct: 2 },
                { question: "Kosodélník má protější strany", answers: ["vždy kolmé", "zakřivené", "stejně dlouhé a rovnoběžné", "vždy stejně dlouhé všechny"], correct: 2 },
                { question: "Obvod čtverce se stranou a", answers: ["a²", "4a", "2a", "a³"], correct: 1 },
                { question: "Obvod obdélníku se stranami a, b", answers: ["a+b", "2ab", "2(a+b)", "a·b"], correct: 2 },
                { question: "Čtverec je speciální případ", answers: ["obdélníku i kosočtverce", "trojúhelníku", "jehlanu", "kruhu"], correct: 0 },
                { question: "Součet vnitřních úhlů čtyřúhelníku", answers: ["270°", "360°", "180°", "90°"], correct: 1 },
                { question: "Úhlopříčky obdélníku jsou", answers: ["vždy nulové", "vždy kolmé", "vždy různě dlouhé", "stejně dlouhé"], correct: 3 },
                { question: "Úhlopříčky kosočtverce jsou na sebe", answers: ["zakřivené", "kolmé", "rovnoběžné", "vždy stejné jako strana"], correct: 1 },
                { question: "Výška rovnoběžníku je kolmá na", answers: ["vrchol", "obvod", "úhlopříčku vždy", "zvolenou základnu"], correct: 3 },
                { question: "Když a = 5 cm a vₐ = 3 cm, obsah je", answers: ["15 cm²", "16 cm²", "8 cm²", "15 cm"], correct: 0 },
                { question: "Čtyřúhelník má", answers: ["6 stran", "5 stran", "4 strany", "3 strany"], correct: 2 },
                { question: "Protilehlé strany rovnoběžníku jsou", answers: ["vždy různě dlouhé", "stejně dlouhé", "vždy zakřivené", "kolmé vždy"], correct: 1 }
            ]
        },
        trojuhelniky: {
            name: "Trojúhelníky",
            questions: [
                { question: "Součet vnitřních úhlů trojúhelníku je", answers: ["90°", "180°", "270°", "360°"], correct: 1 },
                { question: "Trojúhelník se třemi stejně dlouhými stranami je", answers: ["rovnostranný", "rovnoramenný", "pravoúhlý", "různostranný"], correct: 0 },
                { question: "Trojúhelník s jedním pravým úhlem je", answers: ["tupoúhlý", "rovnostranný", "pravoúhlý", "ostroúhlý"], correct: 2 },
                { question: "Obsah trojúhelníku je", answers: ["S = a·vₐ", "S = a + b + c", "S = a²", "S = (a·vₐ)/2"], correct: 3 },
                { question: "Obvod trojúhelníku se stranami 3, 4 a 5 cm je", answers: ["12 cm", "20 cm", "12 cm²", "7 cm"], correct: 0 },
                { question: "Trojúhelník má", answers: ["4 vrcholy", "3 strany", "2 strany", "5 úhlů"], correct: 1 },
                { question: "Rovnoramenný trojúhelník má", answers: ["všechny strany různé", "žádné stejně dlouhé strany", "dvě stejně dlouhé strany", "vždy pravý úhel"], correct: 2 },
                { question: "Kolik stupňů má pravý úhel?", answers: ["45°", "180°", "60°", "90°"], correct: 3 },
                { question: "Trojúhelník se všemi úhly menšími než 90° je", answers: ["ostroúhlý", "tupoúhlý", "pravoúhlý", "rovnoramenný vždy"], correct: 0 },
                { question: "Trojúhelník s úhlem větším než 90° je", answers: ["ostroúhlý", "tupoúhlý", "rovnostranný", "pravoúhlý"], correct: 1 },
                { question: "Pro trojúhelníkovou nerovnost platí, že součet délek dvou stran musí být", answers: ["vždy nulový", "menší než třetí strana", "větší než třetí strana", "stejný jako třetí strana"], correct: 2 },
                { question: "Trojúhelník se stranami 6, 6 a 6 je", answers: ["pravoúhlý", "různostranný", "tupoúhlý", "rovnostranný"], correct: 3 },
                { question: "Výška trojúhelníku je kolmá na", answers: ["protilehlý vrchol", "zvolenou základnu nebo její přímku", "obvod", "stranu vždy rovnoběžnou"], correct: 1 },
                { question: "Kolik výšek má trojúhelník?", answers: ["1", "2", "3", "4"], correct: 2 },
                { question: "Kolik vnitřních úhlů má trojúhelník?", answers: ["3", "2", "4", "6"], correct: 0 }
            ]
        },
        koule: {
            name: "Koule",
            questions: [
                { question: "Koule je", answers: ["rovinný útvar", "prostorové těleso", "čtyřúhelník", "jehlan"], correct: 1 },
                { question: "Objem koule se počítá vzorcem", answers: ["V = 4πr²", "V = πr²", "V = (4/3)πr³", "V = 2πr"], correct: 2 },
                { question: "Povrch koule se počítá vzorcem", answers: ["S = 4πr²", "S = πr³", "S = 2πr", "S = r²"], correct: 0 },
                { question: "Poloměr koule je vzdálenost od středu k", answers: ["jinému středu", "podstavě", "povrchu koule", "vrcholu krychle"], correct: 2 },
                { question: "Průměr koule je", answers: ["polovina poloměru", "dvojnásobek poloměru", "čtyřnásobek poloměru", "obsah koule"], correct: 1 },
                { question: "Je-li poloměr koule 3 cm, průměr je", answers: ["6 cm", "9 cm", "3 cm", "12 cm"], correct: 0 },
                { question: "Objem měříme v jednotkách", answers: ["cm", "cm²", "cm³", "kg"], correct: 2 },
                { question: "Povrch měříme v jednotkách", answers: ["cm³", "cm²", "cm", "km/h"], correct: 1 },
                { question: "Koule má", answers: ["šest čtvercových stěn", "osm vrcholů", "zakřivený povrch", "čtyři hrany"], correct: 2 },
                { question: "Který předmět připomíná kouli?", answers: ["kostka", "míč", "kniha", "krabice"], correct: 1 },
                { question: "Pokud se poloměr koule zdvojnásobí, její průměr se", answers: ["zdvojnásobí", "zmenší", "zčtyřnásobí", "nezmění"], correct: 0 },
                { question: "Ve vzorci V = (4/3)πr³ značí r", answers: ["objem", "povrch", "poloměr", "průměr"], correct: 2 },
                { question: "Koule nemá", answers: ["objem", "povrch", "střed", "rovinné hrany a vrcholy jako krychle"], correct: 3 },
                { question: "Koule s poloměrem 1 cm má objem přibližně", answers: ["4,19 cm³", "3,14 cm³", "12,56 cm³", "1 cm³"], correct: 0 },
                { question: "Povrch koule s poloměrem 2 cm je přibližně", answers: ["8π cm²", "16π cm²", "4π cm²", "2π cm²"], correct: 1 }
            ]
        },
        uhly: {
            name: "Úhly",
            questions: [
                { question: "Pravý úhel má", answers: ["90°", "45°", "180°", "360°"], correct: 0 },
                { question: "Přímý úhel má", answers: ["90°", "180°", "270°", "360°"], correct: 1 },
                { question: "Plný úhel má", answers: ["90°", "180°", "270°", "360°"], correct: 3 },
                { question: "Úhel menší než 90° je", answers: ["tupý", "přímý", "ostrý", "plný"], correct: 2 },
                { question: "Úhel větší než 90° a menší než 180° je", answers: ["ostrý", "tupý", "pravý", "plný"], correct: 1 },
                { question: "Součet úhlů v trojúhelníku je", answers: ["180°", "90°", "270°", "360°"], correct: 0 },
                { question: "Součet vnitřních úhlů čtyřúhelníku je", answers: ["180°", "90°", "360°", "270°"], correct: 2 },
                { question: "Úhel 45° je", answers: ["tupý", "přímý", "pravý", "ostrý"], correct: 3 },
                { question: "Úhel 120° je", answers: ["ostrý", "tupý", "pravý", "plný"], correct: 1 },
                { question: "Doplňkový úhel k 30° do 90° je", answers: ["60°", "150°", "30°", "90°"], correct: 0 },
                { question: "Vedlejší úhly mají součet", answers: ["90°", "270°", "180°", "360°"], correct: 2 },
                { question: "Úhel 0° je", answers: ["pravý", "ostrý", "plný", "nulový"], correct: 3 },
                { question: "Úhel 270° je", answers: ["ostrý", "dutý", "pravý", "přímý"], correct: 1 },
                { question: "Kolik stupňů má polovina plného úhlu?", answers: ["90°", "180°", "45°", "270°"], correct: 1 },
                { question: "Úhel 90° tvoří dvě navzájem", answers: ["rovnoběžné přímky", "kolmé přímky", "shodné kružnice", "zakřivené čáry"], correct: 1 }
            ]
        },
        prostorove_tvary: {
            name: "Prostorové tvary",
            questions: [
                { question: "Krychle má", answers: ["6 čtvercových stěn", "4 stěny", "2 vrcholy", "12 stěn"], correct: 0 },
                { question: "Kvádr má", answers: ["4 vrcholy", "6 stěn", "10 stěn", "12 vrcholů"], correct: 1 },
                { question: "Válec má", answers: ["jednu podstavu", "žádnou podstavu", "dvě kruhové podstavy", "šest čtvercových stěn"], correct: 2 },
                { question: "Kužel má", answers: ["dvě kruhové podstavy", "osm vrcholů", "šest stěn", "jednu kruhovou podstavu a vrchol"], correct: 3 },
                { question: "Koule má", answers: ["zakřivený povrch", "čtyři hrany", "šest stěn", "osm vrcholů"], correct: 0 },
                { question: "Objem kvádru se vypočítá", answers: ["V = a+b+c", "V = a·b·c", "V = 2(a+b)", "V = a²"], correct: 1 },
                { question: "Objem krychle se vypočítá", answers: ["V = 6a²", "V = 4a", "V = a³", "V = a²"], correct: 2 },
                { question: "Jednotka objemu je", answers: ["cm", "cm²", "kg", "cm³"], correct: 3 },
                { question: "Povrch tělesa je", answers: ["součet obsahů jeho stěn", "součet jeho vrcholů", "jeho hmotnost", "jeho výška"], correct: 0 },
                { question: "Kolik hran má krychle?", answers: ["6", "12", "8", "4"], correct: 1 },
                { question: "Kolik vrcholů má krychle?", answers: ["6", "12", "8", "10"], correct: 2 },
                { question: "Které těleso má kruhovou podstavu a zakřivený plášť?", answers: ["krychle", "jehlan", "kvádr", "válec"], correct: 3 },
                { question: "Jehlan má boční stěny obvykle ve tvaru", answers: ["trojúhelníků", "kruhů", "čtverců vždy", "oblouků"], correct: 0 },
                { question: "Síť tělesa je", answers: ["jeho objem", "rovinné rozložení jeho stěn", "jeho hmotnost", "jeho výška"], correct: 1 },
                { question: "Které těleso nemá žádné hrany ani vrcholy?", answers: ["krychle", "kvádr", "koule", "jehlan"], correct: 2 }
            ]
        },
        symetrie: {
            name: "Symetrie",
            questions: [
                { question: "Čtverec má kolik os souměrnosti?", answers: ["3", "4", "2", "6"], correct: 1 },
                { question: "Obdélník má kolik os souměrnosti?", answers: ["1", "6", "2", "4"], correct: 2 },
                { question: "Kruh má", answers: ["nekonečně mnoho os souměrnosti", "1 osu", "2 osy", "4 osy"], correct: 0 },
                { question: "Osová souměrnost vytváří obraz jako v", answers: ["teploměru", "kalkulačce", "lupě", "zrcadle"], correct: 3 },
                { question: "Středová souměrnost odpovídá otočení o", answers: ["360°", "180°", "90°", "45°"], correct: 1 },
                { question: "Rovnostranný trojúhelník má os souměrnosti", answers: ["2", "3", "1", "4"], correct: 1 },
                { question: "Který útvar má přesně jednu osu souměrnosti?", answers: ["rovnoramenný trojúhelník (obecně)", "čtverec", "kruh", "obecný různostranný trojúhelník"], correct: 0 },
                { question: "Obraz bodu v osové souměrnosti je od osy stejně vzdálený na", answers: ["středu kruhu", "stejné straně", "opačné straně", "libovolném místě"], correct: 2 },
                { question: "Při souměrnosti se zachovává", answers: ["jen barva", "hmotnost papíru", "jen poloha středu", "vzdálenost a tvar"], correct: 3 },
                { question: "Čtverec má středovou souměrnost?", answers: ["Ne", "Ano", "Jen při otočení o 45°", "Pouze pokud je obarvený"], correct: 1 },
                { question: "Obdélník má střed souměrnosti v", answers: ["mimo obdélník vždy", "průsečíku úhlopříček", "na libovolné straně", "každém vrcholu"], correct: 1 },
                { question: "Zrcadlový obraz podle osy je příkladem", answers: ["osové souměrnosti", "stejnolehlosti", "posunutí", "sčítání"], correct: 0 },
                { question: "Při středové souměrnosti zůstává bod a jeho obraz od středu", answers: ["na stejné straně v různé vzdálenosti", "kolmý na osu", "na opačných stranách ve stejné vzdálenosti", "vždy ve stejném bodě"], correct: 2 },
                { question: "Který útvar má nekonečně mnoho os souměrnosti?", answers: ["kruh", "čtverec", "obdélník", "pravidelný pětiúhelník"], correct: 0 },
                { question: "Souměrnost zachovává velikost útvaru?", answers: ["Ano", "Jen někdy náhodně", "Pouze u kruhu", "Ne"], correct: 0 }
            ]
        },
        geometricke_transformace: {
            name: "Geometrické transformace",
            questions: [
                { question: "Posunutí mění především", answers: ["počet stran", "jeho tvar", "jeho velikost", "polohu útvaru"], correct: 3 },
                { question: "Otočení probíhá kolem", answers: ["výšky", "pouze hrany", "obvodu", "daného bodu nebo středu"], correct: 3 },
                { question: "Osová souměrnost připomíná", answers: ["zvětšení", "posun vpřed", "dělení", "zrcadlení"], correct: 3 },
                { question: "Stejnolehlost může útvar", answers: ["vždy rozdělit", "zvětšit nebo zmenšit", "jen obarvit", "jen otočit"], correct: 1 },
                { question: "Posunutí zachovává tvar a", answers: ["velikost", "jen barvu", "hmotnost", "jen obvodovou barvu"], correct: 0 },
                { question: "Otočení o 360° vrátí útvar do", answers: ["původní polohy", "poloviční velikosti", "opačné polohy", "zrcadlového obrazu"], correct: 0 },
                { question: "Otočení o 180° kolem středu odpovídá", answers: ["středové souměrnosti", "osové souměrnosti vždy", "stejnolehlosti", "posunutí vždy"], correct: 0 },
                { question: "Při stejnolehlosti s koeficientem 2 se délky", answers: ["zmenší na polovinu", "nezmění", "zdvojnásobí", "zčtyřnásobí"], correct: 2 },
                { question: "Při stejnolehlosti s koeficientem 1 se velikost", answers: ["zdvojnásobí", "zmenší na polovinu", "vynuluje", "nezmění"], correct: 3 },
                { question: "Transformace je zobrazení, které přiřazuje", answers: ["teplotu", "hmotnost", "jen číselnou hodnotu", "obraz geometrického útvaru"], correct: 3 },
                { question: "Při posunutí se všechny body posunou", answers: ["stejným směrem a o stejnou vzdálenost", "různými směry náhodně", "na osu vždy", "do středu kruhu vždy"], correct: 0 },
                { question: "Zrcadlení podle přímky je", answers: ["rotace", "osová souměrnost", "stejnolehlost", "posunutí"], correct: 1 },
                { question: "Při otočení se vzdálenost bodu od středu otáčení", answers: ["zmenší na polovinu", "vždy zdvojnásobí", "vynuluje", "nemění"], correct: 3 },
                { question: "Stejnolehlost zachovává úhly?", answers: ["Jen úhly 90°", "Ne", "Ano", "Jen jeden úhel"], correct: 2 },
                { question: "Obraz podobného útvaru ve stejnolehlosti má", answers: ["žádné strany", "vždy jiný tvar", "vždy jiný počet stran", "stejný tvar"], correct: 3 }
            ]
        },
        trigonometrie: {
            name: "Trigonometrie",
            questions: [
                { question: "sin α v pravoúhlém trojúhelníku je", answers: ["protilehlá / přilehlá", "přepona / odvěsna", "přilehlá odvěsna / přepona", "protilehlá odvěsna / přepona"], correct: 3 },
                { question: "cos α je", answers: ["protilehlá odvěsna / přepona", "přepona / přilehlá", "protilehlá / přilehlá", "přilehlá odvěsna / přepona"], correct: 3 },
                { question: "tan α je", answers: ["přepona / protilehlá", "přilehlá / přepona", "přilehlá odvěsna / přepona", "protilehlá odvěsna / přilehlá odvěsna"], correct: 3 },
                { question: "Přepona leží naproti", answers: ["základně vždy", "pravému úhlu", "středu", "nejmenšímu úhlu vždy"], correct: 1 },
                { question: "sin 30° je", answers: ["√3", "1", "0", "0,5"], correct: 3 },
                { question: "cos 60° je", answers: ["0", "1", "0,5", "√3/2"], correct: 2 },
                { question: "sin 90° je", answers: ["0,5", "1", "-1", "0"], correct: 1 },
                { question: "cos 0° je", answers: ["0,5", "0", "1", "-1"], correct: 2 },
                { question: "tan 45° je", answers: ["0", "1", "√3", "0,5"], correct: 1 },
                { question: "V pravoúhlém trojúhelníku je jeden úhel", answers: ["45° vždy", "90°", "60°", "180°"], correct: 1 },
                { question: "Pro výpočet sinusu používáme odvěsnu a", answers: ["poloměr kruhu", "přeponu", "jen obvod", "objem"], correct: 1 },
                { question: "Pythagorova věta říká", answers: ["a² - b² = c", "a + b = c", "2a + 2b = c", "a² + b² = c²"], correct: 3 },
                { question: "Je-li odvěsna 3 a druhá 4, přepona je", answers: ["4", "7", "6", "5"], correct: 3 },
                { question: "sin α se v pravoúhlém trojúhelníku rovná", answers: ["poměru přepony a výšky", "obsahu trojúhelníku", "poměru protilehlé odvěsny a přepony", "součtu stran"], correct: 2 },
                { question: "Trigonometrie zkoumá vztahy mezi stranami a", answers: ["úhly", "objemem", "barvami", "hmotností"], correct: 0 }
            ]
        },
        vyrokova_logika: {
            name: "Výroková logika",
            questions: [
                { question: "Výrok je věta, o které lze určit", answers: ["hmotnost", "délku", "barvu", "pravdivost"], correct: 3 },
                { question: "Které z toho je výrok?", answers: ["Zavři dveře!", "Kolik je hodin?", "Ahoj!", "Praha je hlavní město ČR."], correct: 3 },
                { question: "Negace výroku „Prší“ je", answers: ["Neprší.", "Bude pršet.", "Prší a sněží.", "Možná prší."], correct: 0 },
                { question: "Konjunkce A ∧ B znamená", answers: ["ne A", "A a B", "A nebo B", "A právě tehdy, když B"], correct: 1 },
                { question: "Disjunkce A ∨ B znamená", answers: ["ne A", "A a B současně vždy", "A je nepravdivé", "A nebo B"], correct: 3 },
                { question: "Implikace A ⇒ B se čte", answers: ["A a B", "jestliže A, pak B", "ne A", "A právě tehdy, když B"], correct: 1 },
                { question: "Ekvivalence A ⇔ B znamená", answers: ["A právě tehdy, když B", "A nebo B", "jestliže A, pak B pouze", "ne A"], correct: 0 },
                { question: "Konjunkce je pravdivá, když", answers: ["oba jsou nepravdivé vždy", "první je nepravdivý", "oba výroky jsou pravdivé", "alespoň jeden je pravdivý"], correct: 2 },
                { question: "Disjunkce v běžné logice je nepravdivá, když", answers: ["oba výroky jsou nepravdivé", "první je pravdivý", "druhý je pravdivý", "oba jsou pravdivé"], correct: 0 },
                { question: "Otázka „Kolik je 2 + 2?“ je", answers: ["nepravdivý výrok", "není výrok", "ekvivalence", "pravdivý výrok"], correct: 1 },
                { question: "Výrok „2 + 2 = 4“ je", answers: ["pravdivý", "rozkaz", "nepravdivý", "otázka"], correct: 0 },
                { question: "Výrok „2 + 2 = 5“ je", answers: ["otázka", "rozkaz", "pravdivý", "nepravdivý"], correct: 3 },
                { question: "Symbol ¬A znamená", answers: ["negaci A", "ekvivalenci", "A nebo B", "A a B"], correct: 0 },
                { question: "Symbol ∧ označuje", answers: ["negaci", "disjunkci", "konjunkci", "implikaci"], correct: 2 },
                { question: "Symbol ⇒ označuje", answers: ["konjunkci", "ekvivalenci", "negaci", "implikaci"], correct: 3 }
            ]
        },
        mnoziny: {
            name: "Množiny a množinové operace",
            questions: [
                { question: "Průnik A ∩ B obsahuje prvky", answers: ["jen z B", "společné oběma množinám", "jen z A", "které nejsou v žádné"], correct: 1 },
                { question: "Sjednocení A ∪ B obsahuje", answers: ["jen prvky mimo A i B", "prvky z A nebo B", "jen prvky A", "jen společné prvky"], correct: 1 },
                { question: "A = {1,2,3}, B = {3,4}. A ∩ B =", answers: ["{3}", "{1,2,3,4}", "{1,2}", "{4}"], correct: 0 },
                { question: "A = {1,2,3}, B = {3,4}. A ∪ B =", answers: ["{4}", "{1,2,3,4}", "{1,2}", "{3}"], correct: 1 },
                { question: "A \\ B pro A={1,2,3}, B={3,4} je", answers: ["{1,2}", "{3}", "{4}", "{1,2,3,4}"], correct: 0 },
                { question: "Značka ∈ znamená", answers: ["je podmnožinou", "průnik", "patří do množiny", "sjednocení"], correct: 2 },
                { question: "Značka ⊆ znamená", answers: ["je podmnožinou", "patří jako prvek", "rozdíl", "průnik"], correct: 0 },
                { question: "Množina je", answers: ["rovnice", "soubor jednoznačně určených prvků", "geometrický úhel", "druh čísla"], correct: 1 },
                { question: "Prázdná množina se značí", answers: ["∈", "∅", "∞", "⊆"], correct: 1 },
                { question: "Počet prvků množiny {a,b,c} je", answers: ["3", "4", "1", "2"], correct: 0 },
                { question: "Množiny A a B jsou disjunktní, když", answers: ["nemají společné prvky", "obsahují jen čísla", "jsou totožné vždy", "mají stejné prvky"], correct: 0 },
                { question: "Pokud každý prvek A patří do B, pak A je", answers: ["sjednocením B", "průnikem prázdné množiny", "podmnožinou B", "rozdílem B"], correct: 2 },
                { question: "A = {2,4,6}. Patří 4 do A?", answers: ["Ano", "Jen pokud A je prázdná", "Nelze určit", "Ne"], correct: 0 },
                { question: "A = {1,3,5}. Patří 2 do A?", answers: ["Ano", "Vždy", "2 je prázdná množina", "Ne"], correct: 3 },
                { question: "Komplement množiny tvoří prvky univerzální množiny, které", answers: ["do dané množiny nepatří", "patří do všech množin", "jsou jen v průniku", "jsou větší než 10"], correct: 0 }
            ]
        },
    },
}
