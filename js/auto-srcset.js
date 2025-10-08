document.addEventListener('DOMContentLoaded', () => {
    // Auto-generate srcset for images with data-auto-srcset attribute
    document.querySelectorAll('img[data-auto-srcset]').forEach(img => {
        const basePath = img.dataset.autoSrcset;
        const extension = img.src.split('.').pop();
        
        // Generate srcset for your 3 fixed sizes
        img.srcset = `${basePath}/1280.jpg 1280w, ${basePath}/1920.jpg 1920w, ${basePath}/3840.jpg 3840w`;
        img.sizes = "(max-width: 1280px) 100vw, (max-width: 1920px) 100vw, 100vw";
    });
});