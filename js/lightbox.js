document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href="#lightbox"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(event) {
      let lightboxImageSrc = event.currentTarget.getAttribute('data-lightbox-src');
      document.getElementById('lightbox-img').src = lightboxImageSrc;
      document.getElementById('lightbox').style.display = 'flex'; // Show the lightbox
      document.getElementById('lightbox').style.alignItems = 'center';
      document.getElementById('lightbox').style.justifyContent = 'center';
      history.replaceState(null, '', window.location.pathname + window.location.search); // Remove #lightbox from URL without affecting history
      event.preventDefault(); // Prevent the default anchor action
    });
  });

  document.getElementById('lightbox').addEventListener('click', function(event) {
    if (event.target.id !== 'lightbox-img') { // If the clicked element is not the lightbox image
      this.style.display = 'none'; // Hide the lightbox
      history.replaceState(null, '', window.location.pathname + window.location.search); // Ensure URL does not change to #close
    }
  });

  document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") { // Check if the pressed key is Escape
      closeLightbox(); // Call the closeLightbox function
    }
  });

  document.getElementById('lightbox-img').addEventListener('click', function(event) {
    event.stopPropagation(); // Stop the click from propagating to the lightbox container
  });
});


function openLightbox(event) {
  let lightboxImageSrc = event.currentTarget.getAttribute('data-lightbox-src');
  document.getElementById('lightbox-img').src = lightboxImageSrc;
  document.getElementById('lightbox').style.display = 'flex';
  document.getElementById('lightbox').style.alignItems = 'center';
  document.getElementById('lightbox').style.justifyContent = 'center';
  // Remove #lightbox from URL without affecting history
  history.replaceState(null, '', window.location.pathname + window.location.search);
  event.preventDefault();
}

// Function to close the lightbox and clean up the URL
function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
  // Ensure URL does not change in a way that affects browser history negatively
  history.replaceState(null, '', window.location.pathname + window.location.search);
}