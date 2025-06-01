
// Prompt Generator Core Logic (日本語UI対応)

// カテゴリJSON（prompt_categories_ja_ui.json）を読み込む前提
let categories = [];
let fixedPrompts = {
  positive: [],
  negative: []
};

// UIで選択されたタグを保持
const selectedTags = new Set();
let selectedLoras = [];

// 使用するLoRA一覧（事前に決定）
const availableLoras = [
  { label: "Nakamura Regura Style", value: "<lora:Nakamura_Regura_Style_XL:0.8>" },
  { label: "Pussy Lily XL", value: "<lora:Pussy_Lily_v5_XL:0.6>" },
  { label: "Eyes High Definition", value: "<lora:Eyes_High_Definition-00007:0.5>" },
  { label: "Hair Style", value: "<lora:hair_style:0.4>" }
];

// カテゴリデータをロード
async function loadCategories(jsonUrl) {
  const res = await fetch(jsonUrl);
  categories = await res.json();
  renderUI(categories);
  renderLoraSelector();
}

// 固定プロンプトをロード
async function loadFixedPrompts(jsonUrl) {
  const res = await fetch(jsonUrl);
  fixedPrompts = await res.json();
}

// UI描画
function renderUI(data) {
  const container = document.getElementById('category-container');
  container.innerHTML = '';

  data.forEach(category => {
    const groupBox = document.createElement('div');
    groupBox.className = 'category-box';

    const title = document.createElement('h3');
    title.textContent = `${category.group}｜${category.label}`;
    groupBox.appendChild(title);

    category.tags.forEach(tag => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = tag.value;
      checkbox.onchange = () => toggleTag(tag.value);
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(` ${tag.label}`));
      groupBox.appendChild(label);
    });

    container.appendChild(groupBox);
  });
}

// LoRA選択UI描画
function renderLoraSelector() {
  const loraContainer = document.getElementById('lora-container');
  availableLoras.forEach(lora => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = lora.value;
    checkbox.onchange = () => toggleLora(lora.value);
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(` ${lora.label}`));
    loraContainer.appendChild(label);
  });
}

// LoRAの追加・削除
function toggleLora(value) {
  if (selectedLoras.includes(value)) {
    selectedLoras = selectedLoras.filter(v => v !== value);
  } else {
    selectedLoras.push(value);
  }
}

// タグ追加・削除
function toggleTag(tagValue) {
  if (selectedTags.has(tagValue)) {
    selectedTags.delete(tagValue);
  } else {
    selectedTags.add(tagValue);
  }
}

// プロンプト生成
function generatePrompt() {
  const selectedArray = Array.from(selectedTags);
  const positive = [...fixedPrompts.positive_prompt, ...selectedArray].join(', ');
  const negative = fixedPrompts.negative_prompt.join(', ');
  const lora = selectedLoras.join(', ');

  document.getElementById('positive-output').textContent = positive;
  document.getElementById('negative-output').textContent = negative;
  document.getElementById('lora-output').textContent = lora;
}

// コピー機能
function copyToClipboard(targetId) {
  const text = document.getElementById(targetId).textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert("Copied to clipboard");
  });
}

// 初期化
loadCategories('./prompt_categories_ja_ui.json');
loadFixedPrompts('./fixed_prompts_narou_style.json');
