document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href="#lightbox"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(event) {
      let lightboxImageSrc = event.currentTarget.getAttribute('data-lightbox-src');
      document.getElementById('lightbox-img').src = lightboxImageSrc;
    });
  });

  document.getElementById('lightbox').addEventListener('click', function(event) {
    if (event.target.id !== 'lightboxImage') {
      location.href = '#close';
    }
  });

  document.getElementById('lightbox-img').addEventListener('click', function(event) {
    event.stopPropagation();
  });
});