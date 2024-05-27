i18next
  .use(i18nextXHRBackend)
  .init({
    lng: 'zh',
    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json'
    }
  }, function(err, t) {
    if (err) {
      console.log('Error initializing i18next:', err);
      return;
    }
    // update all elements with a `data-i18n` attribute
    var elems = document.querySelectorAll('[data-i18n]');
    elems.forEach(function(elem) {
      var key = elem.getAttribute('data-i18n');
      elem.textContent = i18next.t(key);
    });
  });