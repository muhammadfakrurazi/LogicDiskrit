function insert(symbol) {
    const input = document.getElementById('expression');
    input.value += symbol;
}

function clearInput() {
    document.getElementById('expression').value = '';
    document.getElementById('result').innerHTML = '';
}

function generateTable() {
    const expr = document.getElementById('expression').value;
    const resultDiv = document.getElementById('result');

    if (!expr) {
        resultDiv.innerHTML = '<p style="color:red; text-align:center;">Masukkan ekspresi logika terlebih dahulu!</p>';
        return;
    }

    const combinations = [
        { P: true, Q: true },
        { P: true, Q: false },
        { P: false, Q: true },
        { P: false, Q: false }
    ];

    let html = `
        <table>
            <thead>
                <tr>
                    <th>P</th>
                    <th>Q</th>
                    <th>Hasil (${expr})</th>
                </tr>
            </thead>
            <tbody>
    `;

    combinations.forEach(row => {
        const res = evaluateExpression(expr, row.P, row.Q);
        html += `
            <tr>
                <td>${row.P ? 'T' : 'F'}</td>
                <td>${row.Q ? 'T' : 'F'}</td>
                <td>${res ? 'T' : 'F'}</td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    resultDiv.innerHTML = html;
}

function evaluateExpression(expr, P, Q) {
    // Normalisasi operator ke bentuk JavaScript/Logika Standard
    let evalExpr = expr
        .replace(/P/g, P)
        .replace(/Q/g, Q)
        .replace(/¬true/g, 'false')
        .replace(/¬false/g, 'true')
        .replace(/∧/g, '&&')
        .replace(/∨/g, '||');

    // Penanganan implikasi (A → B disederhanakan menjadi !A || B)
    while (evalExpr.includes('→')) {
        evalExpr = evalExpr.replace(/([a-z]+)\s*→\s*([a-z]+)/g, '(!$1 || $2)');
    }

    // Penanganan biimplikasi (A ↔ B disederhanakan menjadi A === B)
    while (evalExpr.includes('↔')) {
        evalExpr = evalExpr.replace(/([a-z]+)\s*↔\s*([a-z]+)/g, '($1 === $2)');
    }

    try {
        return Function(`"use strict"; return (${evalExpr})`)();
    } catch (e) {
        return false;
    }
}
