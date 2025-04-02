document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("applyTypographyBtn").addEventListener("click", applyTypographyToText);
});

function applyTypography(text) {
    if (!text) {
        console.log("Ошибка: текст пустой!");
        return text;
    }

    console.log("Получен текст для обработки:", text);

    // Массив предлогов и союзов, после которых нужен неразрывный пробел
    const wordsToFix = [
        'и', 'да', 'или', 'либо', 'но', 'даже', 'хотя', 'если',
        'как', 'когда', 'пока', 'в', 'на', 'под', 'с', 'о', 'об', 'для', 'за', 'без', 'из',
        'по', 'про', 'через', 'при', 'между', 'над', 'обо', 'к', 'о'
    ];

    wordsToFix.forEach(word => {
        const regex = new RegExp(`(?<=\\s|^)${word}\\s(?=\\S)`, 'g');
        text = text.replace(regex, (match) => {
            console.log(`Найдено: "${match.trim()}", заменяем на: "${word}&nbsp;"`);
            return word + '&nbsp;';
        });
    });

    // Заменяем дефисы между словами
    text = text.replace(/(\S+)-(\S+)/g, '$1-&#8288;$2'); // Заменяем дефисы на неразрывный пробел

    console.log('После применения типографа:', text);
    return text;
}

function applyTypographyToText() {
    let inputText = document.getElementById('inputText').value.trim();

    console.log("Полученный текст из поля ввода:", inputText);

    // Создаем временный элемент для работы с HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = inputText;

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
        .replace(/&amp;#8288;/g, '&#8288;'); 
}
