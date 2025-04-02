document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("applyTypographyBtn").addEventListener("click", applyTypographyToText);
});

// Массив предлогов и союзов, после которых нужен неразрывный пробел
const wordsToFix = [
    'и', 'да', 'или', 'либо', 'но', 'даже', 'хотя', 'если',
    'как', 'когда', 'пока', 'в', 'на', 'под', 'с', 'о', 'об', 'для', 'за', 'без', 'из',
    'по', 'про', 'через', 'при', 'между', 'над', 'обо', 'к', 'о'
];

const regexList = wordsToFix.map(word => new RegExp(`(?<=\\s|^)${word}\\s(?=\\S)`, 'g'));

function applyTypography(text) {
    if (!text) {
        console.log("Ошибка: текст пустой!");
        return text;
    }

    console.log("Получен текст для обработки:", text);

    // Обрабатываем предлоги (добавляем неразрывный пробел &nbsp;)
    regexList.forEach((regex, index) => {
        text = text.replace(regex, (match) => {
            console.log(`Найдено: "${match.trim()}", заменяем на: "${wordsToFix[index]}&nbsp;"`);
            return wordsToFix[index] + '&nbsp;'; // Используем неразрывный пробел
        });
    });

    // Заменяем дефисы между словами
    text = text.replace(/(\S+)-(\S+)/g, '$1-&#8288;$2'); // Заменяем дефисы на неразрывный пробел

    // Заменяем кавычки « и »
    text = text.replace(/[«](.*?)[»]/g, '&laquo;$1&raquo;');

    // Заменяем тире на неразрывное тире
    text = text.replace(/\s—\s/g, '&nbsp;&mdash; ');

    console.log('После применения типографа:', text);
    return text;
}

function applyTypographyToText() {
    let inputText = document.getElementById('inputText').value.trim();

    console.log("Полученный текст из поля ввода:", inputText);

    // Создаем DOMParser для обработки HTML
    const parser = new DOMParser();
    const tempDiv = parser.parseFromString(inputText, 'text/html').body;

    // Функция для обхода текстовых узлов
    function walkTextNodes(node) {
        node.childNodes.forEach(child => {
            if (child.nodeType === 3) { // Только текстовые узлы
                console.log(`Обрабатываем текстовый узел: "${child.textContent.trim()}"`);
                child.textContent = applyTypography(child.textContent);
            } else {
                walkTextNodes(child); // Если это элемент, рекурсивно обрабатываем его детей
            }
        });
    }

    walkTextNodes(tempDiv); // Запускаем обход узлов

    // Записываем обратно результат без лишнего кодирования
    document.getElementById('outputText').value = tempDiv.innerHTML
        .replace(/&amp;nbsp;/g, '&nbsp;') // Убираем ошибочное кодирование
        .replace(/&amp;laquo;/g, '&laquo;')
        .replace(/&amp;raquo;/g, '&raquo;')
        .replace(/&amp;mdash;/g, '&mdash;')
        .replace(/&amp;#8288;/g, '&#8288;');
}
