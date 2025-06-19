// ======================
// Firebase Configuration
// ======================
const firebaseConfig = {
  apiKey: "AIzaSyCtYHbLYZJf2iVtRWqCv3PLUh82xt7DOF0",
  authDomain: "solo-leveling-tracker-631dc.firebaseapp.com",
  projectId: "solo-leveling-tracker-631dc",
  storageBucket: "solo-leveling-tracker-631dc.appspot.com",
  messagingSenderId: "816115021177",
  appId: "1:816115021177:web:4e9b6bca93f190f9e52ba8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Set auth persistence
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(() => console.log("Auth persistence set"))
  .catch(err => console.error("Persistence error:", err));

// ======================
// Page Initialization
// ======================
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on index.html
  if (document.getElementById('intro-animation')) {
    initLoginPage();
  } 
  // Check if we're on Home.html
  else if (document.getElementById('welcome-message')) {
    initHomePage();
  }
});

// ======================
// Login Page Functions
// ======================
function initLoginPage() {
  // Intro Animation
  const typingElement = document.querySelector('.typing-text');
  typingElement.textContent = "SYSTEM INITIALIZATION...";
  
  setTimeout(() => {
    document.getElementById('intro-animation').classList.add('hidden');
    document.getElementById('entry-screen').classList.remove('hidden');
  }, 3500);

  // Tab Switching
  const tabButtons = document.querySelectorAll('.tab-button');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  function showTab(tabId) {
    tabButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.tab === tabId);
    });
    loginForm.classList.toggle('active', tabId === 'login');
    signupForm.classList.toggle('active', tabId === 'signup');
  }

  tabButtons.forEach(button => {
    button.addEventListener('click', () => showTab(button.dataset.tab));
  });

  // Form Submissions
  if (document.getElementById('login-email')) {
    document.getElementById('login-form').addEventListener('submit', function(e) {
      e.preventDefault();
      handleLogin();
    });
  }

  if (document.getElementById('signup-email')) {
    document.getElementById('signup-form').addEventListener('submit', function(e) {
      e.preventDefault();
      handleSignup();
    });
  }
}

// ======================
// Authentication Functions
// ======================
async function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const errorElement = document.getElementById('login-error');
  
  errorElement.textContent = '';
  
  if (!email || !password) {
    errorElement.textContent = 'Email and password are required!';
    return;
  }

  try {
    // Try to sign in
    await auth.signInWithEmailAndPassword(email, password);
    const user = auth.currentUser;
    
    // Check if user has character data
    const userDoc = await db.collection('users').doc(user.uid).get();
    
    if (userDoc.exists) {
      await updateLoginStreak(userDoc);
      completeOnboarding();
    } else {
      showCharacterCreation();
    }
  } catch (error) {
    console.error('Login error:', error);
    handleAuthError(error, errorElement);
  }
}

async function handleSignup() {
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value.trim();
  const errorElement = document.getElementById('signup-error');
  
  errorElement.textContent = '';
  
  if (!email) {
    errorElement.textContent = 'Email is required!';
    return;
  }
  
  if (!password) {
    errorElement.textContent = 'Password is required!';
    return;
  }
  
  if (password.length < 6) {
    errorElement.textContent = 'Password must be at least 6 characters';
    return;
  }

  try {
    // Create new user
    await auth.createUserWithEmailAndPassword(email, password);
    showCharacterCreation();
  } catch (error) {
    console.error('Signup error:', error);
    handleAuthError(error, errorElement);
  }
}

function handleAuthError(error, errorElement) {
  switch (error.code) {
    case 'auth/user-not-found':
      errorElement.textContent = 'No hunter found with this email';
      break;
    case 'auth/wrong-password':
      errorElement.textContent = 'Incorrect access code';
      break;
    case 'auth/email-already-in-use':
      errorElement.textContent = 'This email is already registered';
      break;
    case 'auth/weak-password':
      errorElement.textContent = 'Access code must be at least 6 characters';
      break;
    case 'auth/invalid-email':
      errorElement.textContent = 'Invalid email format';
      break;
    default:
      errorElement.textContent = error.message;
  }
}

// ======================
// Character Creation
// ======================
function showCharacterCreation() {
  document.getElementById('entry-screen').classList.add('hidden');
  document.getElementById('character-creation').classList.remove('hidden');

  // Class selection
  document.querySelectorAll('.class-option').forEach(option => {
    option.addEventListener('click', function() {
      document.querySelectorAll('.class-option').forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
    });
  });

  // Confirm character
  document.getElementById('confirm-character').addEventListener('click', async () => {
    const hunterName = document.getElementById('hunter-name').value.trim();
    const selectedClass = document.querySelector('.class-option.selected')?.dataset.class;
    
    if (!hunterName || !selectedClass) {
      alert('Please select a class and enter your hunter name!');
      return;
    }

    try {
      await saveCharacter(hunterName, selectedClass);
      showTutorial();
    } catch (error) {
      console.error('Character creation error:', error);
      alert('Failed to create character. Please try again.');
    }
  });
}

async function saveCharacter(name, className) {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user');
  
  await db.collection('users').doc(user.uid).set({
    name: name,
    class: className,
    xp: 0,
    rank: 'E',
    stats: getBaseStats(className),
    lastActive: new Date().toISOString(),
    streak: 1,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    missions: [],
    achievements: [],
    inventory: []
  });
}

function getBaseStats(className) {
  const stats = {
    tank: { strength: 15, intelligence: 5, agility: 8, defense: 15 },
    hunter: { strength: 10, intelligence: 10, agility: 15, defense: 10 },
    mage: { strength: 5, intelligence: 15, agility: 10, defense: 8 }
  };
  return stats[className];
}

// ======================
// Tutorial Flow
// ======================
function showTutorial() {
  document.getElementById('character-creation').classList.add('hidden');
  document.getElementById('tutorial').classList.remove('hidden');
  
  const steps = document.querySelectorAll('.tutorial-step');
  let currentStep = 0;
  
  function showStep(index) {
    steps.forEach((step, i) => {
      step.classList.toggle('active', i === index);
    });
  }
  
  document.getElementById('next-tutorial').addEventListener('click', () => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);
    } else {
      completeOnboarding();
    }
  });
  
  document.getElementById('skip-tutorial').addEventListener('click', completeOnboarding);
  showStep(0);
}

// ======================
// Onboarding Completion
// ======================
function completeOnboarding() {
  const tempLoader = document.createElement('div');
  tempLoader.className = 'fullscreen center';
  tempLoader.innerHTML = `
    <h2>Entering the HQ...</h2>
    <div class="loader-bar">
      <div class="loader-fill"></div>
    </div>
  `;
  document.body.appendChild(tempLoader);
  
  const user = auth.currentUser;
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  db.collection('users').doc(user.uid).get()
    .then(doc => {
      if (doc.exists) {
        setTimeout(() => {
          window.location.href = './Pages/Home.html';
        }, 2000);
      } else {
        showCharacterCreation();
      }
    })
    .catch(error => {
      console.error("Firestore check failed:", error);
      window.location.href = 'index.html';
    });
}

// ======================
// Home Page Functions
// ======================
function initHomePage() {
  auth.onAuthStateChanged(user => {
    if (!user) {
      window.location.href = '../index.html';
    } else {
      loadUserData();
      displayRandomQuote();
    }
  });
}

async function loadUserData() {
  const loadingScreen = document.getElementById('loading-screen');
  const welcomeElement = document.getElementById('welcome-message');
  const streakElement = document.getElementById('streak-message');
  
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const userDoc = await db.collection('users').doc(user.uid).get();
    
    if (userDoc.exists) {
      const userData = userDoc.data();
      welcomeElement.textContent = `Welcome to the HQ, ${userData.name}!`;
      streakElement.textContent = `Current streak: ${userData.streak || 1} days`;
    } else {
      throw new Error("No character data found");
    }
  } catch (error) {
    console.error("Error loading data:", error);
    welcomeElement.textContent = "Error loading hunter data";
    streakElement.textContent = error.message;
  } finally {
    loadingScreen.classList.add('hidden');
  }
}

function displayRandomQuote() {
  const quotes = [
    "\"If the PAIN doesn't kill me, it will only make me STRONGER\"",
    "\"I'm not a hero. I'm just a hunter who does what he wants.\"",
    "\"The weak should fear the strong. That's the natural order of things.\"" //ai use internet for motivation quotes

  ];
  document.getElementById('random-quote').textContent = 
    quotes[Math.floor(Math.random() * quotes.length)];
}

// ======================
// Utility Functions
// ======================
async function updateLoginStreak(userDoc) {
  const user = auth.currentUser;
  const userData = userDoc.data();
  const lastActive = userData.lastActive ? new Date(userData.lastActive) : new Date();
  const today = new Date();
  
  lastActive.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const dayDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
  let newStreak = userData.streak || 1;

  if (dayDiff === 1) newStreak += 1;
  else if (dayDiff > 1) newStreak = 1;

  await db.collection('users').doc(user.uid).update({
    lastActive: new Date().toISOString(),
    streak: newStreak
  });
}

// // ======================
// // Exports
// // ======================
// export { db, auth };