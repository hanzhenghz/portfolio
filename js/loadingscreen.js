let progress = 0;
let loadedElements = 0;
let totalElements = 0;
const progressBar = document.getElementById('progressBar');

document.body.style.overflow = 'hidden';

// Function to update the progress bar
const updateProgressBar = () => {
    progress = (loadedElements / totalElements) * 100;
    progressBar.style.width = progress + '%';
    if (progress >= 100) {
        // Hide the loading screen when all elements are loaded
        setTimeout(() => {
            document.getElementById('loadingScreen').style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 500); // Adjust delay as needed
    }
};

// Function to handle the load and error events for each element
const handleLoadEvent = () => {
    loadedElements++;
    progress = (loadedElements / totalElements) * 100;
    updateProgressBar();
};

// Detect loadable elements
const loadableElements = document.querySelectorAll('img, script, link[rel="stylesheet"], video');
totalElements = loadableElements.length;

loadableElements.forEach(element => {
    const isImg = element.tagName === 'IMG';
    const isVideo = element.tagName === 'VIDEO';

    if (isImg && element.complete) {
        handleLoadEvent();
    } else {
        element.onload = handleLoadEvent;
        element.onerror = handleLoadEvent; // Handle errors
    }
});

window.onload = function() {
    // Assuming the loading process is complete here
    document.getElementById('loadingScreen').style.display = 'none';
    document.body.style.overflow = 'auto';
}