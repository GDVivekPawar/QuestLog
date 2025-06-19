
// Function to calculate rank based on level
function calculateRank(level) {
  if (level >= 50) return 'S';
  if (level >= 40) return 'A';
  if (level >= 30) return 'B';
  if (level >= 20) return 'C';
  if (level >= 10) return 'D';
  return 'E';
}

window.addEventListener('DOMContentLoaded', () => {
  // Use Firebase v8 global objects
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  // Check authentication
  auth.onAuthStateChanged(async (user) => {
    const loadingScreen = document.getElementById("loading-screen");
    const welcomeHeading = document.getElementById("welcome-heading") || document.querySelector(".welcome-heading");
    
    if (!user) {
      console.log('No user, redirecting...');
      window.location.href = '../../index.html';
      return;
    }

    try {
      // Get user data from Firestore
      const userDoc = await db.collection('users').doc(user.uid).get();
      
      if (!userDoc.exists) {
        console.error('No user data found');
        welcomeHeading.textContent = "No hunter data found";
        loadingScreen.style.display = "none";
        return;
      }

      const userData = userDoc.data();
      
      // Update UI with real data
      updateProfileUI(userData);
      
      // Show model viewer after data is loaded
      const modelContainer = document.getElementById("modelContainer");
      if (modelContainer) modelContainer.classList.remove("hidden");
      if (loadingScreen) loadingScreen.style.display = "none";
      const profileContainer = document.querySelector(".profile-container");
      if (profileContainer) profileContainer.style.display = "flex";
    } catch (error) {
      console.error('Error loading profile:', error);
      if (loadingScreen) loadingScreen.style.display = "none";
      if (welcomeHeading) welcomeHeading.textContent = "Error loading hunter data";
    }
  });

  function updateProfileUI(userData) {
    // Welcome message with username
    const welcomeElement = document.getElementById("welcome-heading") || document.querySelector(".welcome-heading");
    if (welcomeElement) welcomeElement.textContent = `Welcome, ${userData.name || 'Hunter'}`;
    
    // Rank
    const rank = calculateRank(userData.level || 1);
    const rankElement = document.querySelector('.top-rank h2');
    if (rankElement) rankElement.textContent = `Current Rank: ${rank}`;
    
    // XP Bar
    const currentXP = userData.xp || 0;
    const xpNeeded = (userData.level || 1) * 100;
    const xpPercentage = Math.min((currentXP / xpNeeded) * 100, 100);
    
    const xpTextElement = document.getElementById('xp-text');
    if (xpTextElement) xpTextElement.textContent = `${currentXP} / ${xpNeeded}`;
    
    const xpFillElement = document.getElementById('xp-fill');
    if (xpFillElement) xpFillElement.style.width = `${xpPercentage}%`;
    
    // Stats
    const statsContainer = document.querySelector('.middle-stats') || document.getElementById('stats-container');
    if (statsContainer) {
      statsContainer.innerHTML = ''; // Clear existing dummy stats
      
      if (userData.stats) {
        // Create stat boxes for each stat
        Object.entries(userData.stats).forEach(([stat, value]) => {
          const statBox = document.createElement('div');
          statBox.className = 'stat-box';
          statBox.innerHTML = `
            <span class="stat-name">${stat.toUpperCase()}</span>
            <span class="stat-value">${value}</span>
          `;
          statsContainer.appendChild(statBox);
        });
      }
      
      // Level
      const levelBox = document.createElement('div');
      levelBox.className = 'stat-box';
      levelBox.innerHTML = `
        <span class="stat-name">LEVEL</span>
        <span class="stat-value">${userData.level || 1}</span>
      `;
      statsContainer.prepend(levelBox);
    }
    
    // Streak
    const streakElement = document.getElementById('streak-number');
    if (streakElement) streakElement.textContent = userData.streak || 0;
    
    // Flame size based on streak
    const flame = document.getElementById('flame');
    if (flame) {
      const streak = userData.streak || 0;
      const newSize = 50 + Math.min(streak * 5, 100);
      flame.style.width = `${newSize}px`;
    }
  }
});

// Remove the old streak counter
window.updateStreak = undefined;