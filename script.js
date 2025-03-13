let scarfActive = false;
let windActive = false;
let enemyWindActive = false;

let pokemonData = {
    "ガブリアス": 102,
    "サンダー": 100,
    "カイリュー": 80,
    "ゲンガー": 110,
    "ルカリオ": 90
}; // 追加可能

const hiraMap = {
    "が": "ガ", "ぎ": "ギ", "ぐ": "グ", "げ": "ゲ", "ご": "ゴ",
    "ざ": "ザ", "じ": "ジ", "ず": "ズ", "ぜ": "ゼ", "ぞ": "ゾ",
    "だ": "ダ", "ぢ": "ヂ", "づ": "ヅ", "で": "デ", "ど": "ド",
    "ば": "バ", "び": "ビ", "ぶ": "ブ", "べ": "ベ", "ぼ": "ボ",
    "ぱ": "パ", "ぴ": "ピ", "ぷ": "プ", "ぺ": "ペ", "ぽ": "ポ"
};

function toKatakana(str) {
    return str.replace(/[\u3041-\u3096]/g, match => hiraMap[match] || String.fromCharCode(match.charCodeAt(0) + 96));
}

function toggleScarf() {
    scarfActive = !scarfActive;
    updateButtonStyles();
    calculateSpeed();
}

function toggleWind() {
    windActive = !windActive;
    updateButtonStyles();
    calculateSpeed();
}

function toggleEnemyWind() {
    enemyWindActive = !enemyWindActive;
    updateButtonStyles();
    calculateSpeed();
}

function updateButtonStyles() {
    document.getElementById("scarfButton").style.backgroundColor = scarfActive ? "#4CAF50" : "#ccc";
    document.getElementById("windButton").style.backgroundColor = windActive ? "#4CAF50" : "#ccc";
    document.getElementById("enemyWindButton").style.backgroundColor = enemyWindActive ? "#4CAF50" : "#ccc";
}

function showSuggestions() {
    let input = document.getElementById("pokemonInput").value;
    let suggestionBox = document.getElementById("suggestionBox");
    suggestionBox.innerHTML = "";

    if (input.length === 0) return;

    let katakanaInput = toKatakana(input);
    let filtered = Object.keys(pokemonData).filter(name => name.includes(katakanaInput));

    filtered.slice(0, 6).forEach(name => {
        let div = document.createElement("div");
        div.textContent = name;
        div.onclick = function () {
            document.getElementById("pokemonInput").value = name;
            suggestionBox.innerHTML = "";
            calculateSpeed();
        };
        suggestionBox.appendChild(div);
    });
}

function calculateSpeed() {
    let userSpeed = parseFloat(document.getElementById("userSpeed").value);
    let pokemonName = document.getElementById("pokemonInput").value;
    let katakanaName = toKatakana(pokemonName);

    if (!pokemonData[katakanaName]) return;

    let baseSpeed = pokemonData[katakanaName];
    if (enemyWindActive) baseSpeed *= 2; // 相手が追い風・すいすいの場合

    let results = {
        "最速スカーフ": Math.floor(baseSpeed * 1.5 * 1.1),
        "準速スカーフ": Math.floor(baseSpeed * 1.5),
        "最速": Math.floor(baseSpeed * 1.1),
        "準速": Math.floor(baseSpeed),
        "無振り": Math.floor(baseSpeed * 0.9),
        "最遅": Math.floor(baseSpeed * 0.5)
    };

    let adjustedSpeed = userSpeed;
    if (scarfActive) adjustedSpeed *= 1.5;
    if (windActive) adjustedSpeed *= 2;

    let tableHTML = "<div class='result-table'>";
    for (let key in results) {
        let color = adjustedSpeed
            ? (adjustedSpeed > results[key] ? "rgba(255, 0, 0, 0.3)" : adjustedSpeed < results[key] ? "rgba(0, 0, 255, 0.3)" : "rgba(255, 255, 0, 0.3)")
            : "transparent"; // 自分の素早さ未入力なら色なし
        tableHTML += `<div class='result-row' style="background:${color};"><span>${key}</span><span>${results[key]}</span></div>`;
    }
    tableHTML += "</div>";

    document.getElementById("result").innerHTML = tableHTML;
}
