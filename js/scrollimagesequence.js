// Image Sequence Controller - Simple version like video scroll playback
class ImageSequenceController {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.images = [];
        this.currentFrame = 0;
        this.totalFrames = 180;
        this.isReady = false;
        
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.readConfig();
        this.createCanvas();
        this.loadImages();
        this.setupScroll();
    }
    
    readConfig() {
        const container = document.getElementById('scrollContainer');
        if (container) {
            this.basePath = container.dataset.sequencePath || '../images/raw/glassvoice/glassvoice_vid/';
            this.totalFrames = parseInt(container.dataset.totalFrames) || 180;
            this.framePrefix = container.dataset.framePrefix || 'frame-';
            this.frameExtension = container.dataset.frameExtension || '.jpg';
            this.framePadding = parseInt(container.dataset.framePadding) || 1;
        }
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 1920;
        this.canvas.height = 1080;
        this.canvas.style.cssText = `
            position: sticky;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            max-width: 100vw;
            object-fit: fill;
            object-position: top left;
            z-index: -1;
        `;
        
        this.ctx = this.canvas.getContext('2d');
        
        const container = document.getElementById('scrollContainer');
        if (container) {
            container.appendChild(this.canvas);
        }
    }
    
    loadImages() {
        let loaded = 0;
        
        for (let i = 1; i <= this.totalFrames; i++) {
            const img = new Image();
            const frameNum = this.framePadding > 1 ? 
                i.toString().padStart(this.framePadding, '0') : i.toString();
            
            img.src = `${this.basePath}${this.framePrefix}${frameNum}${this.frameExtension}`;
            
            img.onload = () => {
                loaded++;
                if (loaded === this.totalFrames) {
                    this.isReady = true;
                    this.drawFrame(0);
                }
            };
            
            this.images[i - 1] = img;
        }
    }
    
    setupScroll() {
        const container = document.getElementById('scrollContainer');
        if (!container) return;
        
        // Force the container to be scrollable - override any CSS
        container.style.setProperty('height', '100vh', 'important');
        container.style.setProperty('overflow-y', 'scroll', 'important');
        container.style.setProperty('overflow-x', 'hidden', 'important');
        container.style.setProperty('scrollbar-width', 'none', 'important');
        container.style.setProperty('-ms-overflow-style', 'none', 'important');
        
        // Hide webkit scrollbar more aggressively
        const style = document.createElement('style');
        style.textContent = `
            #scrollContainer::-webkit-scrollbar {
                display: none !important;
                width: 0 !important;
            }
        `;
        document.head.appendChild(style);
        
        // Create invisible scrollable content
        const scrollContent = document.createElement('div');
        scrollContent.style.cssText = `
            height: 500vh !important;
            width: 1px;
            background: transparent;
            pointer-events: none;
        `;
        
        container.appendChild(scrollContent);
        
        // Listen to container scroll (not window scroll)
        container.addEventListener('scroll', () => {
            if (!this.isReady) return;
            
            const scrollTop = container.scrollTop;
            const maxScroll = container.scrollHeight - container.clientHeight;
            const progress = Math.min(scrollTop / maxScroll, 1);
            const targetFrame = Math.floor(progress * (this.totalFrames - 1));
            
            if (targetFrame !== this.currentFrame) {
                this.drawFrame(targetFrame);
                this.currentFrame = targetFrame;
                
                // Check if sequence is complete (near 100%)
                if (progress >= 0.98) {
                    this.enablePageScrolling();
                }
            }
        });
        

        
    }
    
    enablePageScrolling() {
        // Enable page scrolling when sequence is complete
        document.body.style.overflowY = 'auto';
        document.documentElement.style.overflowY = 'auto';
    }
    
    drawFrame(frameIndex) {
        if (frameIndex >= 0 && frameIndex < this.images.length) {
            const img = this.images[frameIndex];
            if (img && img.complete) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            }
        }
    }
}

// Top function (keep existing functionality)
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// Initialize
new ImageSequenceController();
