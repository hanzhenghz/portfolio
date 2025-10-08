// Show loading screen immediately
document.documentElement.style.overflow = 'hidden';

let progress = 0;
let loadedResources = 0;
let totalResources = 0;
let progressBar;
let loadingScreen;

// Initialize as soon as DOM starts loading
function initLoadingScreen() {
    loadingScreen = document.getElementById('loadingScreen');
    progressBar = document.getElementById('progressBar');
    
    if (!loadingScreen || !progressBar) {
        // If elements don't exist yet, try again soon
        setTimeout(initLoadingScreen, 10);
        return;
    }
    
    // Make sure loading screen is visible
    loadingScreen.style.display = 'flex';
    loadingScreen.style.opacity = '1';
    
    // Count total resources to load
    countResources();
    
    // Start monitoring resource loading
    monitorLoading();
}

function countResources() {
    totalResources = 0; // Reset count
    
    // Count images (including those with srcset)
    const images = document.querySelectorAll('img');
    totalResources += images.length;
    
    // Count stylesheets
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    totalResources += stylesheets.length;
    
    // Count scripts with src
    const scripts = document.querySelectorAll('script[src]');
    totalResources += scripts.length;
    
    // Add base progress for DOM readiness
    totalResources += 1;
    
    console.log(`Total resources to load: ${totalResources}`);
}

function updateProgress(resourceName = '') {
    loadedResources++;
    progress = Math.min((loadedResources / totalResources) * 100, 100);
    
    console.log(`Loaded: ${resourceName} (${loadedResources}/${totalResources}) - ${progress.toFixed(1)}%`);
    
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
    
    // Hide loading screen when complete
    if (progress >= 100) {
        console.log('All resources loaded, hiding loading screen...');
        setTimeout(hideLoadingScreen, 300);
    }
}

function hideLoadingScreen() {
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.body.classList.add('loaded');
            document.documentElement.style.overflow = '';
        }, 500);
    }
}

function monitorLoading() {
    // Monitor images
    document.querySelectorAll('img').forEach((img, index) => {
        if (img.complete && img.naturalHeight !== 0) {
            // Image already loaded
            updateProgress(`Image ${index + 1} (cached)`);
        } else {
            // Wait for image to load
            img.addEventListener('load', () => {
                updateProgress(`Image ${index + 1}`);
            });
            img.addEventListener('error', () => {
                console.warn(`Failed to load image ${index + 1}:`, img.src);
                updateProgress(`Image ${index + 1} (error)`);
            });
        }
    });
    
    // Monitor stylesheets
    document.querySelectorAll('link[rel="stylesheet"]').forEach((link, index) => {
        if (link.sheet && link.sheet.cssRules) {
            // Stylesheet already loaded
            updateProgress(`Stylesheet ${index + 1} (cached)`);
        } else {
            link.addEventListener('load', () => {
                updateProgress(`Stylesheet ${index + 1}`);
            });
            link.addEventListener('error', () => {
                console.warn(`Failed to load stylesheet ${index + 1}:`, link.href);
                updateProgress(`Stylesheet ${index + 1} (error)`);
            });
        }
    });
    
    // Monitor scripts
    document.querySelectorAll('script[src]').forEach((script, index) => {
        script.addEventListener('load', () => {
            updateProgress(`Script ${index + 1}`);
        });
        script.addEventListener('error', () => {
            console.warn(`Failed to load script ${index + 1}:`, script.src);
            updateProgress(`Script ${index + 1} (error)`);
        });
    });
    
    // DOM readiness progress
    if (document.readyState === 'complete') {
        updateProgress('DOM Ready');
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            updateProgress('DOM Ready');
        });
    }
}

// Start immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoadingScreen);
} else {
    // DOM already loaded
    initLoadingScreen();
}

// Backup: ensure loading screen hides after page is fully loaded
window.addEventListener('load', () => {
    // If progress hasn't reached 100% yet, force completion
    if (progress < 100) {
        console.log('Window load event: forcing completion');
        while (loadedResources < totalResources) {
            updateProgress('Forced completion');
        }
    }
    
    // Backup timer - absolutely ensure loading screen disappears
    setTimeout(() => {
        if (loadingScreen && loadingScreen.style.display !== 'none') {
            console.log('Backup: forcing loading screen to hide');
            hideLoadingScreen();
        }
    }, 2000);
});