// i18n.js - Internationalization System for IRON Website
// Supports: French (fr), English (en), Arabic (ar)

class I18n {
    constructor() {
        this.currentLang = this.getStoredLanguage() || 'fr';
        this.translations = {};
        this.rtlLanguages = ['ar']; // Languages that use Right-to-Left
    }

    // Get stored language from localStorage
    getStoredLanguage() {
        return localStorage.getItem('iron-language');
    }

    // Store language preference
    setStoredLanguage(lang) {
        localStorage.setItem('iron-language', lang);
    }

    // Load translation file for a specific language
    async loadTranslations(lang) {
        try {
            const response = await fetch(`./locales/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${lang}.json`);
            }
            this.translations[lang] = await response.json();
            return true;
        } catch (error) {
            console.error(`Error loading translations for ${lang}:`, error);
            return false;
        }
    }

    // Get translation by key path (e.g., "nav.home")
    t(key, lang = this.currentLang) {
        const keys = key.split('.');
        let value = this.translations[lang];

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return key; // Return key if translation not found
            }
        }

        return value || key;
    }

    // Change language and update the page
    async changeLanguage(lang) {
        if (!['fr', 'en', 'ar'].includes(lang)) {
            console.error(`Language ${lang} is not supported`);
            return;
        }

        // Load translations if not already loaded
        if (!this.translations[lang]) {
            const loaded = await this.loadTranslations(lang);
            if (!loaded) return;
        }

        this.currentLang = lang;
        this.setStoredLanguage(lang);

        // Update HTML lang attribute
        document.documentElement.lang = lang;

        // Handle RTL for Arabic
        if (this.rtlLanguages.includes(lang)) {
            document.documentElement.dir = 'rtl';
            document.body.classList.add('rtl');
        } else {
            document.documentElement.dir = 'ltr';
            document.body.classList.remove('rtl');
        }

        // Update all elements with data-i18n attribute
        this.updatePageContent();

        // Update language selector active state
        this.updateLanguageSelector();

        // Dispatch custom event for language change
        window.dispatchEvent(new CustomEvent('languageChanged', {detail: {lang}}));
    }

    // Update all translatable elements on the page
    updatePageContent() {
        // Update elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);

            // Check if element should use innerHTML (for HTML content like <br>)
            if (element.hasAttribute('data-i18n-html')) {
                element.innerHTML = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update elements with data-i18n-placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        // Update elements with data-i18n-title attribute
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });

        // Update elements with data-i18n-alt attribute
        document.querySelectorAll('[data-i18n-alt]').forEach(element => {
            const key = element.getAttribute('data-i18n-alt');
            element.alt = this.t(key);
        });
    }

    // Update language selector buttons and dropdown
    updateLanguageSelector() {
        // Update dropdown items
        document.querySelectorAll('.lang-option').forEach(item => {
            const itemLang = item.getAttribute('data-lang');
            if (itemLang === this.currentLang) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update dropdown button display
        const flagMap = {
            'fr': '🇫🇷',
            'en': '🇬🇧',
            'ar': '🇦🇪'
        };
        const langMap = {
            'fr': 'FR',
            'en': 'EN',
            'ar': 'AR'
        };

        // Update both desktop and mobile dropdowns
        const currentFlags = document.querySelectorAll('.current-flag');
        const currentLangs = document.querySelectorAll('.current-lang');

        currentFlags.forEach(flag => {
            if (flag) flag.textContent = flagMap[this.currentLang];
        });

        currentLangs.forEach(lang => {
            if (lang) lang.textContent = langMap[this.currentLang];
        });
    }

    // Initialize the i18n system
    async init() {
        // Load initial language translations
        await this.loadTranslations(this.currentLang);

        // Set initial language
        await this.changeLanguage(this.currentLang);

        // Setup language selector buttons
        this.setupLanguageSelector();

        console.log(`✅ i18n initialized with language: ${this.currentLang}`);
    }

    // Setup event listeners for language selector dropdown
    setupLanguageSelector() {
        document.querySelectorAll('.lang-option').forEach(item => {
            item.addEventListener('click', async (e) => {
                e.preventDefault();
                const lang = item.getAttribute('data-lang');
                await this.changeLanguage(lang);

                // Close all dropdowns after language selection
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.classList.remove('show');
                });
                document.querySelectorAll('.btn-language').forEach(btn => {
                    btn.classList.remove('active');
                });
            });
        });
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLang;
    }

    // Get available languages
    getAvailableLanguages() {
        return ['fr', 'en', 'ar'];
    }
}

// Create global i18n instance
const i18n = new I18n();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        i18n.init();
    });
} else {
    i18n.init();
}

// Export for use in other scripts
window.i18n = i18n;

// Listen for language change events (optional - for custom handlers)
window.addEventListener('languageChanged', (event) => {
    console.log(`Language changed to: ${event.detail.lang}`);
});
