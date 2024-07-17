document.addEventListener('DOMContentLoaded', function() {
    var footerDate = document.querySelector('#footer .footer-content p');
    if (footerDate) {
        footerDate.textContent = ` - 2024 Han Zheng`; // This sets the text content to the current year and your name.
    }
});