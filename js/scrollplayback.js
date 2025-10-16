function topFunction() {
    document.body.scrollTop = 0;
    document.body.scrollLeft = 0;
    document.documentElement.scrollTop = 0;
    document.documentElement.scrollLeft = 0;
}

// Improved throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Use requestAnimationFrame for smoother performance
function rafThrottle(callback) {
    let requestId = null;
    let lastArgs;
    
    const later = (context) => () => {
        requestId = null;
        callback.apply(context, lastArgs);
    };
    
    const throttled = function(...args) {
        lastArgs = args;
        if (requestId === null) {
            requestId = requestAnimationFrame(later(this));
        }
    };
    
    throttled.cancel = () => {
        cancelAnimationFrame(requestId);
        requestId = null;
    };
    
    return throttled;
}

class VideoScrollController {
    constructor() {
        this.video = null;
        this.scrollContainer = null;
        this.overlay = null;
        this.progressBar = null;
        
        this.isVideoReady = false;
        this.lastScrollTop = 0;
        this.lastVideoTime = 0;
        
        this.init();
    }
    
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.video = document.getElementById('scrollVideo');
            this.scrollContainer = document.getElementById('scrollContainer');
            this.overlay = document.getElementById('videoOverlay');
            this.progressBar = document.getElementById('progressBar');
            
            if (!this.video || !this.scrollContainer) {
                console.error('Required elements not found');
                return;
            }
            
            this.setupVideoEvents();
            this.setupScrollHandler();
            this.setupOverlayControl();
        });
    }
    
    setupVideoEvents() {
        let initialSetup = false;
        
        // Wait for video metadata to load
        this.video.addEventListener('loadedmetadata', () => {
            this.isVideoReady = true;
            console.log('Video ready for scroll control');
        });
        
        // Only set to 0 on first load, not every time frames load
        this.video.addEventListener('canplay', () => {
            if (!initialSetup) {
                this.video.currentTime = 0; // Only set to beginning once
                initialSetup = true;
                console.log('Video initial setup complete');
            }
        });
        
        // Handle video errors
        this.video.addEventListener('error', (e) => {
            console.error('Video error:', e);
            this.isVideoReady = false;
        });
        
        // Prevent video from auto-playing
        this.video.addEventListener('play', () => {
            this.video.pause();
        });
    }
    
    setupScrollHandler() {
        // Use RAF-based throttling for smoother performance
        const optimizedScrollHandler = rafThrottle(() => {
            this.updateVideoPlayback();
            this.updateProgressBar();
        });
        
        this.scrollContainer.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    }
    
    updateVideoPlayback() {
        if (!this.isVideoReady || !this.video.duration || this.video.readyState < 2) return;
        
        const scrollTop = this.scrollContainer.scrollTop;
        
        // Only update if scroll position changed significantly
        if (Math.abs(scrollTop - this.lastScrollTop) < 1) return;
        
        // Check if video is in viewport
        const videoRect = this.video.getBoundingClientRect();
        if (videoRect.top > window.innerHeight || videoRect.bottom < 0) return;
        
        const maxScroll = this.scrollContainer.scrollHeight - this.scrollContainer.clientHeight;
        const scrollFraction = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
        const targetTime = this.video.duration * scrollFraction;
        
        // Only update if time difference is significant and video is ready for seeking
        if (Math.abs(targetTime - this.video.currentTime) > 0.05 && !this.video.seeking) {
            try {
                this.video.currentTime = targetTime;
                this.lastVideoTime = targetTime;
                console.log(`Seeking to: ${targetTime.toFixed(2)}s`);
            } catch (e) {
                console.warn('Failed to set video time:', e);
            }
        }
        
        // Control horizontal overflow based on video progress
        this.controlHorizontalOverflow(scrollFraction);
        
        this.lastScrollTop = scrollTop;
    }
    
    updateProgressBar() {
        if (!this.progressBar || !this.video.duration) return;
        
        const progress = (this.video.currentTime / this.video.duration) * 100;
        this.progressBar.style.width = `${progress}%`;
    }
    
    controlHorizontalOverflow(scrollFraction) {
        // Hide horizontal overflow until video reaches 95% completion
        const videoProgress = this.video.currentTime / this.video.duration;
        const shouldHideHorizontalScroll = videoProgress < 0.95;
        
        if (shouldHideHorizontalScroll) {
            // Hide horizontal scrolling
            document.body.style.overflowX = 'hidden';
            document.documentElement.style.overflowX = 'hidden';
            this.scrollContainer.style.overflowX = 'hidden';
        } else {
            // Allow horizontal scrolling when video is near the end
            document.body.style.overflowX = 'auto';
            document.documentElement.style.overflowX = 'auto';
            this.scrollContainer.style.overflowX = 'auto';
            console.log('Horizontal scrolling enabled - video nearly complete');
        }
    }
    
    setupOverlayControl() {
        // Use intersection observer for better performance
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (this.overlay) {
                        this.overlay.style.display = entry.isIntersecting ? 'none' : 'block';
                    }
                    
                    // Control body overflow based on video visibility and progress
                    const videoProgress = this.video.currentTime / this.video.duration;
                    const isVideoComplete = videoProgress >= 0.95;
                    const shouldHideVerticalOverflow = entry.isIntersecting && !isVideoComplete;
                    
                    document.body.style.overflowY = shouldHideVerticalOverflow ? 'hidden' : 'auto';
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px'
            });
            
            observer.observe(this.video);
        } else {
            // Fallback for older browsers
            this.setupLegacyOverlayControl();
        }
    }
    
    setupLegacyOverlayControl() {
        const checkVideoPosition = throttle(() => {
            const videoRect = this.video.getBoundingClientRect();
            const isVisible = videoRect.top < window.innerHeight && videoRect.bottom > 0;
            
            if (this.overlay) {
                this.overlay.style.display = isVisible ? 'none' : 'block';
            }
            
            const videoProgress = this.video.currentTime / this.video.duration;
            const isVideoComplete = videoProgress >= 0.95;
            const shouldHideVerticalOverflow = isVisible && !isVideoComplete;
            
            document.body.style.overflowY = shouldHideVerticalOverflow ? 'hidden' : 'auto';
        }, 100);
        
        window.addEventListener('scroll', checkVideoPosition, { passive: true });
        window.addEventListener('resize', checkVideoPosition, { passive: true });
    }
}

// Initialize the controller
new VideoScrollController();