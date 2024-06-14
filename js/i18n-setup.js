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
      // Get the current page name
      var path = window.location.pathname;
      var page = path.split("/").pop().split(".")[0];;
      var selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
      

      console.log('Selected LANGUAGE:', selectedLanguage);
      console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
      
      // Initialize i18next
        i18next
            .use(i18nextXHRBackend)
            .init({
                backend: {
                    loadPath: 'locales/{{lng}}/' + page + '.json'
                },
                lng: localStorage.getItem('selectedLanguage'),
                fallbackLng: 'en',
                debug: true
            }, function(err, t) {
                // resources have been loaded
                updateContent();
            });

      // Update content based on current language
      function updateContent() {
          var elements = document.querySelectorAll('[data-i18n]');

          elements.forEach(function(element) {
              var key = element.getAttribute('data-i18n');
              element.innerHTML = i18next.t(key);
          });

          console.log(i18next.language);
      }

      document.addEventListener('DOMContentLoaded', (event) => {
        // Get the language select buttons
        var selectEnglish = document.getElementById('selectEnglish');
        var selectChinese = document.getElementById('selectChinese');
    
        // Get the previously selected language from localStorage
        var selectedLanguage = localStorage.getItem('selectedLanguage');
    
        // Update the appearance of the buttons based on the selected language
        if (selectedLanguage === 'en') {
            selectEnglish.classList.add('selected');
            selectChinese.classList.remove('selected');
        } else if (selectedLanguage === 'zh') {
            selectChinese.classList.add('selected');
            selectEnglish.classList.remove('selected');
        }
    
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
            // Update the language with i18next
            i18next.changeLanguage(language, function(err, t) {
                if (err) return console.log('something went wrong loading', err);
                updateContent();
            });
    
            // Update the appearance of the buttons
            if (language === 'en') {
                selectEnglish.classList.add('selected');
                selectChinese.classList.remove('selected');
            } else {
                selectChinese.classList.add('selected');
                selectEnglish.classList.remove('selected');
            }
    
            localStorage.setItem('selectedLanguage', language);
        }
    });

  });
});