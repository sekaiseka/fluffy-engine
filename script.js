// ひらがな↔カタカナ変換関数
function toKatakana(str) {
    return str.replace(/[\u3041-\u3096]/g, function(match) {
        return String.fromCharCode(match.charCodeAt(0) + 0x60);
    });
}

// ポケモンのデータ（カタカナで統一）
const pokemonData = [
    { name: "サンダース", baseSpeed: 130 },
    { name: "マニューラ", baseSpeed: 125 },
    { name: "ドラパルト", baseSpeed: 142 },
    { name: "ガブリアス", baseSpeed: 102 },
    { name: "ゲッコウガ", baseSpeed: 122 },
    { name: "ルカリオ", baseSpeed: 90 },
    { name: "カイリュー", baseSpeed: 80 },
    { name: "ポリゴン2", baseSpeed: 60 },
    { name: "ナマコブシ", baseSpeed: 5 }
];

// ページ読み込み時にポケモンリストをセット
window.onload = function() {
    let select = document.getElementById("pokemon");
    pokemonData.forEach(pokemon => {
        let option = document.createElement("option");
        option.value = pokemon.baseSpeed;
        option.text = pokemon.name;
        select.appendChild(option);
    });
};

// リアルタイム検索（ひらがな対応 & 部分一致強化）
function showSuggestions() {
    let input = document.getElementById("pokemonInput").value.trim();
    let suggestionBox = document.getElementById("suggestionBox");
    suggestionBox.innerHTML = "";
    if (input === "") return;
    
    let inputKatakana = toKatakana(input);
    let matches = pokemonData.filter(pokemon => pokemon.name.includes(input) || pokemon.name.includes(inputKatakana));
    
    matches.forEach(pokemon => {
        let div = document.createElement("div");
        div.innerText = pokemon.name;
        div.onclick = function() {
            document.getElementById("pokemonInput").value = pokemon.name;
            suggestionBox.innerHTML = "";
            calculateSpeed();
        };
        suggestionBox.appendChild(div);
    });
}

// 素早さ計算関数（入力時に自動計算）
document.getElementById("pokemonInput").addEventListener("input", calculateSpeed);

function calculateSpeed() {
    let inputName = document.getElementById("pokemonInput").value.trim();
    let baseSpeed = null;

    if (inputName) {
        let inputKatakana = toKatakana(inputName);
        let foundPokemon = pokemonData.find(pokemon => pokemon.name === inputName || pokemon.name === inputKatakana);
        if (foundPokemon) {
            baseSpeed = foundPokemon.baseSpeed;
        } else {
            document.getElementById("result").innerHTML = "<p>そのポケモンはデータにありません！</p>";
            return;
        }
    }

    if (baseSpeed === null) return;

    let maxSpeed = Math.floor(((2 * baseSpeed + 31 + (252 / 4)) * 50) / 100 + 5) * 1.1;
    let neutralSpeed = Math.floor(((2 * baseSpeed + 31 + (252 / 4)) * 50) / 100 + 5);
    let minSpeed = Math.floor(((2 * baseSpeed + 0 + (0 / 4)) * 50) / 100 + 5) * 0.9;

    document.getElementById("result").innerHTML = `
        <p><strong>最速 (S252+):</strong> ${Math.floor(maxSpeed)}</p>
        <p><strong>準速 (S252):</strong> ${Math.floor(neutralSpeed)}</p>
        <p><strong>無振り (S0):</strong> ${Math.floor((2 * baseSpeed * 50) / 100 + 5)}</p>
        <p><strong>最遅 (S0-):</strong> ${Math.floor(minSpeed)}</p>
    `;
}
