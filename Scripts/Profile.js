// profile.js
import 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';

window.addEventListener('DOMContentLoaded', () => {
    const modelContainer = document.getElementById("modelContainer");
    setTimeout(() => {
      modelContainer.classList.remove("hidden");
      document.getElementById("loading-screen").style.display = "none";
      document.querySelector(".profile-container").style.display = "flex";
    }, 2000);
  });


window.addEventListener('load', () => {
  setTimeout(() => {
    const loadingScreen = document.getElementById("loading-screen");
    loadingScreen.style.display = "none";
  }, 2000); // simulate loading screen
});

// === STREAK TRACKER ===
function updateStreak() {
    const streakKey = 'user-streak';
    const lastUsedKey = 'last-used-date';
  
    const today = new Date().toDateString();
    const lastUsed = localStorage.getItem(lastUsedKey);
    let streak = parseInt(localStorage.getItem(streakKey)) || 0;
  
    if (lastUsed !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
  
      if (new Date(lastUsed).toDateString() === yesterday.toDateString()) {
        streak += 1;
      } else {
        streak = 1;
      }
  
      localStorage.setItem(streakKey, streak);
      localStorage.setItem(lastUsedKey, today);
    }
  
    const streakText = document.getElementById('streak-number');
    const flame = document.getElementById('flame');
  
    if (streakText && flame) {
      streakText.innerText = streak;
      const newSize = 50 + Math.min(streak * 5, 100); // Cap growth at +100px
      flame.style.width = `${newSize}px`;
    }
  }
  
  updateStreak();
  
  