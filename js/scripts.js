// Плавная прокрутка для навигационных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 20,
                behavior: 'smooth'
            });
        }
    });
});

// Добавляем анимацию появления секций при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Наблюдаем за всеми секциями контента
document.querySelectorAll('.content-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

async function downloadFullPageScreenshot() {
    alert('Создание полного скриншота... Подождите 5-10 секунд.');

    // Сохраняем оригинальные стили
    const originalStyles = [];
    const sections = document.querySelectorAll('.content-section');

    // Делаем все секции видимыми и убираем трансформации
    sections.forEach(section => {
        originalStyles.push({
            element: section,
            opacity: section.style.opacity,
            transform: section.style.transform
        });
        section.style.opacity = '1';
        section.style.transform = 'none';
    });

    // Ждем применения стилей
    await new Promise(resolve => setTimeout(resolve, 500));

    // Снимаем скриншот ВСЕЙ страницы
    html2canvas(document.body, {
        scrollY: -window.scrollY, // учитываем прокрутку
        scale: 2, // немного уменьшаем качество для скорости
        useCORS: true,
        allowTaint: true,
        logging: true,
        width: document.body.scrollWidth,
        height: document.body.scrollHeight
    }).then(canvas => {
        // Восстанавливаем оригинальные стили
        originalStyles.forEach(style => {
            style.element.style.opacity = style.opacity;
            style.element.style.transform = style.transform;
        });

        // Скачиваем
        const link = document.createElement('a');
        link.download = 'full-page-screenshot.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(error => {
        console.error('Error:', error);
        alert('Ошибка! Используйте ручной способ: Ctrl+Shift+P → "screenshot full size"');
    });
}