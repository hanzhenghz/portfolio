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
      var page = path.split("/").pop().split(".")[0];

      // Initialize i18next
      i18next
          .use(i18nextXHRBackend)
          .init({
              backend: {
                  loadPath: 'locales/{{lng}}/' + page + '.json'
              },
              lng: 'en',
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

      // Add event listeners after the DOM has loaded
      window.addEventListener('DOMContentLoaded', (event) => {
          document.getElementById('selectEnglish').addEventListener('click', function() {
              i18next.changeLanguage('en');
              updateContent();
          });

          document.getElementById('selectChinese').addEventListener('click', function() {
              i18next.changeLanguage('zh');
              updateContent();
          });
      });
  });
});