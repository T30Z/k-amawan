document.addEventListener('DOMContentLoaded', () => {
    const userLang = getUserLanguage();
    const defaultLang = 'en';
    
    fetch('translations.json')
        .then(response => response.json())
        .then(translations => {
            const selectedLang = translations[userLang] ? userLang : defaultLang;
            applyTranslations(translations[selectedLang]);
        })
        .catch(error => console.error('Error loading translation file:', error));
    
    function getUserLanguage() {
        const lang = navigator.language || navigator.userLanguage;
        return lang.split('-')[0]; // Extract the primary language code (e.g., "en" from "en-US")
    }

    function applyTranslations(translations) {
        document.getElementById('header-title').textContent = translations.header.title;
        document.getElementById('footer-link').textContent = translations.footer.link;
        document.getElementById('about').innerHTML = translations.about; // Changed from textContent to innerHTML
    }

    // Add click event listener to the close element
    document.getElementById('close').addEventListener('click', () => {
        document.getElementById('info').classList.add('close');
    });
});
