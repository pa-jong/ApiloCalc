// ==UserScript==
// @name         Floating Calculator (Compact and Fixed)
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Kalkulator z przyciskami, przeciąganiem i stałą wysokością (zwarty)
// @author       Pa-Jong
// @match        https://elektrone.apilo.com/*
// @require      https://pa-jong.github.io/ApiloCalc/apilocalc.user.js
// @updateURL    https://pa-jong.github.io/ApiloCalc/update.json
// @downloadURL  https://pa-jong.github.io/ApiloCalc/apilocalc.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Tworzenie ikony przycisku
    var button = document.createElement('button');
    button.innerHTML = '🧮'; // Ikona kalkulatora
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.zIndex = '1000';
    button.style.padding = '10px';
    button.style.fontSize = '20px';
    button.style.cursor = 'pointer';

    document.body.appendChild(button);

    // Tworzenie kalkulatora (początkowo ukryty)
    var calculator = document.createElement('div');
    calculator.style.position = 'fixed';
    calculator.style.top = '50px';
    calculator.style.right = '10px';
    calculator.style.zIndex = '1000';
    calculator.style.padding = '10px';
    calculator.style.backgroundColor = 'white';
    calculator.style.border = '1px solid #ccc';
    calculator.style.display = 'none'; // Ukryty na początku
    calculator.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    calculator.style.width = '160px';  // Stała szerokość kalkulatora
    calculator.style.height = '240px'; // Stała wysokość kalkulatora
    calculator.style.borderRadius = '10px';
    calculator.style.overflow = 'hidden'; // Zapobieganie rozciąganiu zawartości
    calculator.innerHTML = `
        <input id="calc-display" type="text" style="width: 140px; padding: 5px; font-size: 16px; margin-bottom: 10px; text-align: right;" disabled><br>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 3px;"> <!-- Odstęp między przyciskami 3px -->
            <button class="calc-btn" style="width: 30px; height: 30px;">7</button>
            <button class="calc-btn" style="width: 30px; height: 30px;">8</button>
            <button class="calc-btn" style="width: 30px; height: 30px;">9</button>
            <button class="calc-btn" style="width: 30px; height: 30px;">/</button>
            <button class="calc-btn" style="width: 30px; height: 30px;">4</button>
            <button class="calc-btn" style="width: 30px; height: 30px;">5</button>
            <button class="calc-btn" style="width: 30px; height: 30px;">6</button>
            <button class="calc-btn" style="width: 30px; height: 30px;">*</button>
            <button class="calc-btn" style="width: 30px; height: 30px;">1</button>
            <button class="calc-btn" style="width: 30px; height: 30px;">2</button>
            <button class="calc-btn" style="width: 30px; height: 30px;">3</button>
            <button class="calc-btn" style="width: 30px; height: 30px;">-</button>
            <button class="calc-btn" style="width: 30px; height: 30px;">0</button>
            <button class="calc-btn" style="width: 30px; height: 30px;">.</button>
            <button class="calc-btn" style="width: 30px; height: 30px;">+</button>
            <button class="calc-btn" style="width: 30px; height: 30px;">=</button>
            <button class="calc-btn" style="width: 63px; height: 30px; grid-column: span 2;">C</button> <!-- Zmniejszony przycisk C -->
        </div>
    `;
    document.body.appendChild(calculator);

    // Event listener dla przycisków kalkulatora
    var display = document.getElementById('calc-display');
    var currentInput = '';
    var expression = '';

    document.querySelectorAll('.calc-btn').forEach(function(button) {
        button.addEventListener('click', function() {
            var value = button.innerText;

            if (value === 'C') {
                currentInput = '';
                expression = '';
                display.value = '';
            } else if (value === '=') {
                try {
                    display.value = eval(expression);
                    expression = display.value;
                } catch (e) {
                    display.value = 'Error';
                    expression = '';
                }
            } else {
                currentInput += value;
                expression += value;
                display.value = currentInput;
            }
        });
    });

    // Funkcja przeciągania kalkulatora (bez zmiany rozmiaru)
    var isDragging = false;
    var offsetX, offsetY;

    calculator.addEventListener('mousedown', function(e) {
        if (e.target === document.getElementById('calc-display')) return;  // Ignorowanie kliknięć na wyświetlaczu
        isDragging = true;
        offsetX = e.clientX - calculator.getBoundingClientRect().left;
        offsetY = e.clientY - calculator.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            calculator.style.left = (e.clientX - offsetX) + 'px';
            calculator.style.top = (e.clientY - offsetY) + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // Obsługa kliknięcia w przycisk (pokazywanie/ukrywanie kalkulatora)
    button.addEventListener('click', function() {
        if (calculator.style.display === 'none') {
            calculator.style.display = 'block';
        } else {
            calculator.style.display = 'none';
        }
    });

})();
