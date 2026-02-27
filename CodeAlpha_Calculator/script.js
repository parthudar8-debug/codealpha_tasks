const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");
const themeToggle = document.getElementById("theme-toggle");

// Theme toggle functionality
themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme", themeToggle.checked ? "light" : "dark");
});

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    themeToggle.checked = true;
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.innerText;

        if (value === "C") {
            clearDisplay();
        } 
        else if (value === "DEL") {
            deleteLast();
        } 
        else if (value === "=") {
            calculate();
        } 
        else {
            append(value);
        }
    });
});

function append(value) {
    if (display.innerText === "0" || display.innerText === "Error") {
        display.innerText = value;
    } else {
        display.innerText += value;
    }
}

function clearDisplay() {
    display.innerText = "0";
}

function deleteLast() {
    display.innerText = display.innerText.slice(0, -1) || "0";
}

function calculate() {
    try {
        let expression = display.innerText.replace('%', '/100');
        display.innerText = eval(expression);
    } catch {
        display.innerText = "Error";
    }
}

// Keyboard Support
document.addEventListener("keydown", (e) => {
    if ("0123456789+-*/.%".includes(e.key)) {
        append(e.key);
    }
    if (e.key === "Enter") calculate();
    if (e.key === "Backspace") deleteLast();
    if (e.key === "Escape") clearDisplay();
});