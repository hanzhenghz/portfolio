 // Initial progress increment to simulate early loading phase
 let progress = 0;
 const progressBar = document.getElementById('progressBar');
 const increment = 5; // Adjust based on your needs

 const simulateInitialProgress = () => {
     const interval = setInterval(() => {
         if (progress < 50) { // Assuming DOMContentLoaded roughly accounts for 50% of the load time
             progress += increment;
             progressBar.style.width = progress + '%';
         } else {
             clearInterval(interval);
         }
     }, 100);
 };
 simulateInitialProgress();

 // DOMContentLoaded event
 document.addEventListener('DOMContentLoaded', () => {
     progress = 100; // Adjust assumption based on actual load time distribution
     progressBar.style.width = progress + '%';
 });

 // Window load event for finalizing the progress
 window.onload = () => {
     progress = 100;
     progressBar.style.width = progress + '%';
     document.getElementById('loadingScreen').style.display = 'none';
 };

 