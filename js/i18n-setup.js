// Function to load a script
function loadScript(src, callback) {
  var script = document.createElement('script');
  script.src = src;
  script.onload = callback;
  document.head.appendChild(script);
}

// Load i18next and i18nextXHRBackend
loadScript('https://cdnjs.cloudflare.com/ajax/libs/i18next/21.6.3/i18next.min.js', function() {
loadScript('https://cdnjs.cloudflare.com/ajax/libs/i18next-xhr-backend/3.2.2/i18nextXHRBackend.min.js', function() {
    
    document.addEventListener('DOMContentLoaded', function() {
        // Example based on URL path
        if (window.location.pathname === '/index.html') {
            console.log('This is the index page. Initializing...');
            // Place your initialization code here
            initializeMyProcess();
        }
    });
    
    function initializeMyProcess() {
        // Your initialization code
        console.log('Process initialized.');
    }
    
    
    // Get the current page name
    var path = window.location.pathname;
    var page = path.split("/").pop().split(".")[0];
    
            // If the page name is empty, default to 'index'
        if (page === '') {
            page = 'index';
        } else {
            // If the page name is not empty, remove the extension
            page = path.split("/").pop().split(".")[0];;
        }
    
    var selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    
    // Determine the correct path based on folder nesting
    var pathDepth = window.location.pathname.split('/').length - 2;
    var basePath = '';
    for (var i = 0; i < pathDepth; i++) {
        basePath += '../';
    }
    // If we're in a subfolder, adjust the path
    if (window.location.pathname.includes('/works/')) {
        basePath = '../';
    }
    
    // Initialize i18next with multiple namespaces
        i18next
            .use(i18nextXHRBackend)
            .init({
                backend: {
                    loadPath: function(lngs, namespaces) {
                        // Load common namespace for all pages, and page-specific namespace
                        if (namespaces[0] === 'common') {
                            return basePath + 'locales/{{lng}}/common.json';
                        } else {
                            return basePath + 'locales/{{lng}}/' + page + '.json';
                        }
                    },
                    allowMultiLoading: true,
                    crossDomain: false
                },
                lng: selectedLanguage,
                fallbackLng: 'en',
                debug: true,
                load: 'languageOnly',
                preload: ['en', 'zh'],
                saveMissing: false,
                ns: ['common', 'page'],
                defaultNS: 'page'
            }, function(err, t) {
                if (err) {
                    console.log('Error during i18next initialization:', err);
                } else {
                    console.log('i18next initialized successfully.');
                }
                // resources have been loaded
                updateContent();
            });

    // Update content based on current language
    function updateContent() {
        var elements = document.querySelectorAll('[data-i18n]');

        elements.forEach(function(element) {
            var key = element.getAttribute('data-i18n');
            var namespace = element.getAttribute('data-i18n-ns') || 'page';
            
            // If namespace is specified, use it; otherwise try both namespaces
            if (namespace === 'common') {
                element.innerHTML = i18next.t(key, { ns: 'common' });
            } else {
                // Try page namespace first, then common as fallback
                var translation = i18next.t(key, { ns: 'page' });
                if (translation === key) {
                    translation = i18next.t(key, { ns: 'common' });
                }
                element.innerHTML = translation;
            }
        });

        console.log('Current language:', i18next.language);
    }

    
        // Get the language select buttons
        var selectEnglish = document.getElementById('selectEnglish');
        var selectChinese = document.getElementById('selectChinese');
    
        // Update the appearance of the buttons based on the selected language
        function updateButtonStates() {
            var currentLang = localStorage.getItem('selectedLanguage') || 'en';
            selectEnglish.classList.remove('selected');
            selectChinese.classList.remove('selected');
            
            if (currentLang === 'en') {
                selectEnglish.classList.add('selected');
            } else if (currentLang === 'zh') {
                selectChinese.classList.add('selected');
            }
        }
        
        // Initialize button states
        updateButtonStates();
    
        // Add event listeners to the buttons
        if (selectEnglish) {
            selectEnglish.addEventListener('click', function() {
                console.log('English button clicked');
                selectLanguage('en');
            });
        }
    
        if (selectChinese) {
            selectChinese.addEventListener('click', function() {
                console.log('Chinese button clicked');
                selectLanguage('zh');
            });
        }
    
        // Function to select a language
        function selectLanguage(language) {
            console.log('Selecting language:', language);
            
            // Store the language first
            localStorage.setItem('selectedLanguage', language);
            
            // Update the language with i18next
            i18next.changeLanguage(language, function(err, t) {
                if (err) {
                    console.log('Error changing language:', err);
                    return;
                }
                console.log('Language changed to:', i18next.language);
                updateContent();
            });
    
            // Update the appearance of the buttons
            selectEnglish.classList.remove('selected');
            selectChinese.classList.remove('selected');
            
            if (language === 'en') {
                selectEnglish.classList.add('selected');
            } else if (language === 'zh') {
                selectChinese.classList.add('selected');
            }
        }

        document.addEventListener('click', function(event) {
    });
  });
});