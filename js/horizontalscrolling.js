document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('workshorizontalsub1');
    let touchStartX = 0;
    let touchEndX = 0;
    let maxScrollLeft = slider.scrollWidth - slider.clientWidth;
    const flexContainer = document.querySelector('.works');
    const scrollLeftBtn = document.getElementById('scrollLeftBtn');
    const scrollRightBtn = document.getElementById('scrollRightBtn');

    let keepScrolling = false;
    let startHoverTime = 0;
    let isEasingOut = false;
    const maxSpeed = 6; // Maximum pixels per frame
    const easeDuration = 300; // Duration of the ease-in and ease-out in milliseconds

    function scrollContinuously(direction) {
        const now = Date.now();
        if (keepScrolling || isEasingOut) {
            let elapsedTime = now - startHoverTime;
            let speed = maxSpeed;

            if (keepScrolling) {
                // Ease-in
                if (elapsedTime < easeDuration) {
                    speed = (elapsedTime / easeDuration) * maxSpeed;
                }
            } else {
                // Ease-out
                if (elapsedTime < easeDuration) {
                    speed = maxSpeed - (elapsedTime / easeDuration) * maxSpeed;
                } else {
                    isEasingOut = false; // Stop the animation
                    return;
                }
            }

            slider.scrollBy({ left: direction * speed, behavior: 'auto' });
            requestAnimationFrame(() => scrollContinuously(direction));
        }
    }

    function setupScrollButton(button, direction) {
        button.addEventListener('mouseenter', () => {
            keepScrolling = true;
            isEasingOut = false;
            startHoverTime = Date.now();
            scrollContinuously(direction);
        });

        button.addEventListener('mouseleave', () => {
            keepScrolling = false;
            startHoverTime = Date.now(); // Reset the time for ease-out
        });
    }

    // Assuming scrollLeftBtn and scrollRightBtn are already defined
    setupScrollButton(scrollLeftBtn, -1); // -1 for left
    setupScrollButton(scrollRightBtn, 1); // 1 for right

    
    function handleSwipeOnButton(event) {
        touchEndX = event.changedTouches[0].screenX;
        if (touchEndX < touchStartX) {
            // Swipe left
            slider.scrollBy({ left: -slider.offsetWidth * 0.5, behavior: 'smooth' });
        } else if (touchEndX > touchStartX) {
            // Swipe right
            slider.scrollBy({ left: slider.offsetWidth * 0.5, behavior: 'smooth' });
        }
    }

    // Adding touch event listeners to both buttons
    [scrollLeftBtn, scrollRightBtn].forEach(btn => {
        btn.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            e.preventDefault(); // Prevents the default action to allow the swipe to be recognized
        });

        btn.addEventListener('touchend', handleSwipeOnButton);
    });
    
    let isMouseOverLeftBtn = true;
    let isMouseOverRightBtn = true;

    // Event listeners for scrollLeftBtn
    scrollLeftBtn.addEventListener('mouseenter', () => {
        isMouseOverLeftBtn = false;
    });
    scrollLeftBtn.addEventListener('mouseleave', () => {
        isMouseOverLeftBtn = true;
    });

    // Event listeners for scrollRightBtn
    scrollRightBtn.addEventListener('mouseenter', () => {
        isMouseOverRightBtn = false;
    });
    scrollRightBtn.addEventListener('mouseleave', () => {
        isMouseOverRightBtn = true;
    });
    

    // Show scroll buttons when hovering over the flex container
    flexContainer.addEventListener('mouseenter', () => {
        checkScrollButtons(); // Call checkScrollButtons to update button visibility based on scroll position
    });

    // Add mouseleave event listener to hide buttons
    flexContainer.addEventListener('mouseleave', () =>{
        if (isMouseOverLeftBtn && isMouseOverRightBtn) {
        scrollLeftBtn.style.display = 'none';
        scrollRightBtn.style.display = 'none';
        }
    })



    function checkScrollButtons() {
        
        if (slider.scrollLeft === 0) {
            scrollLeftBtn.style.display = 'none';
        } else {
            scrollLeftBtn.style.display = 'block';
        }

        if (slider.scrollLeft >= 1274.6666259765624) {
            scrollRightBtn.style.display = 'none';
        } else {
            scrollRightBtn.style.display = 'block';
        }
    }

        // Initial check in case the page loads at a scroll position
        checkScrollButtons();

        slider.addEventListener('scroll', checkScrollButtons);

});