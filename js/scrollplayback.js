function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.body.scrollLeft = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    document.documentElement.scrollLeft = 0; // For Chrome, Firefox, IE and Opera
}

function throttle(func, limit) {
let lastFunc;
let lastRan;
return function() {
    const context = this;
    const args = arguments;
    if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
    } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function() {
            if ((Date.now() - lastRan) >= limit) {
                func.apply(context, args);
                lastRan = Date.now();
            }
        }, limit - (Date.now() - lastRan));
    }
}
}

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('scrollVideo');
    const scrollContainer = document.getElementById('scrollContainer');
    const progressBar = document.getElementById('progressBar');

    const updateVideoPlayback = () => {

        if (video.getBoundingClientRect().top >= 0) { 
        const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        const scrollFraction = scrollContainer.scrollTop / maxScroll;
        const videoTime = video.duration * scrollFraction;
        video.currentTime = videoTime; 
        }
    }; 

    const throttledScrollHandler = throttle(updateVideoPlayback, 50); // Adjust the 100ms limit as needed

    scrollContainer.addEventListener('scroll', throttledScrollHandler);
    // If there was intended code for the second DOMContentLoaded listener, it should be included here.
})

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('scrollVideo');
    // Other initialization code...

    // Listen to the video's time update to handle overflow toggling
    video.addEventListener('timeupdate', () => {
        if (video.currentTime >= video.duration) {
            // Video has finished playing, enable page scrolling and hide overlay
            document.body.style.overflowY = 'auto';
            document.documentElement.style.overflowY = 'auto';
        } else {
            // Video is still playing, disable page scrolling and show overlay
            document.body.style.overflowY = 'hidden';
            document.documentElement.style.overflowY = 'hidden';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('scrollVideo');
    const overlay = document.getElementById('videoOverlay');

    const checkVideoPosition = () => {
        // Check the video's position relative to the viewport
        if (video.getBoundingClientRect().top < 0) {
            // Video is above the viewport, show the overlay to block interaction
            overlay.style.display = 'block';
        } else {
            // Video is not above the viewport, hide the overlay to allow interaction
            overlay.style.display = 'none';
        }
    };

    // Set an interval to periodically check the video's position
    setInterval(checkVideoPosition, 10); // Check every 100 milliseconds
});