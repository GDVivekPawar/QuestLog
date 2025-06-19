document.addEventListener('DOMContentLoaded', function() {
  // Quest data - can be expanded or loaded from an API
  const questData = {
      dailyMissions: [
          {
              title: "Morning Training",
              description: "Complete 100 push-ups, 100 sit-ups, 100 squats, and 10km running",
              reward: "+10 STR",
              completed: false
          },
          {
              title: "Dungeon Clear",
              description: "Clear the E-Rank dungeon in the western district",
              reward: "500 Gold",
              completed: false
          },
          {
              title: "Monster Hunt",
              description: "Defeat 10 goblins in the nearby forest",
              reward: "+5 AGI",
              completed: false
          },
          {
              title: "Item Collection",
              description: "Gather 20 medicinal herbs from the mountain",
              reward: "Healing Potion x5",
              completed: false
          }
      ],
      sideQuests: [
          {
              title: "Black Market",
              description: "Investigate the illegal magic item trade",
              reward: "Unknown Artifact",
              completed: false
          },
          {
              title: "Ancient Ruins",
              description: "Explore the newly discovered ruins in the east",
              reward: "Ancient Knowledge",
              completed: false
          },
          {
              title: "Guild Request",
              description: "Escort merchant caravan to next city",
              reward: "1200 Gold",
              completed: false
          },
          {
            title: "Guild Request",
            description: "Escort merchant caravan to next city",
            reward: "1200 Gold",
            completed: false
        },
        {
          title: "Guild Request",
          description: "Escort merchant caravan to next city",
          reward: "1200 Gold",
          completed: false
        }
      ]
  };

  window.addEventListener('load', () => {
    setTimeout(() => {
      const loadingScreen = document.getElementById("loading-screen");
      loadingScreen.style.display = "none";
    }, 2000); // simulate loading screen
  });

  // Generate quest sections
  const questContainer = document.getElementById('questContainer');
  
  // Create Daily Missions section
  createQuestSection('Daily Missions', 'dailyMissions');
  
  // Create Side Quests section
  createQuestSection('Side Quests', 'sideQuests');
  
  // Function to create a quest section
  function createQuestSection(title, questType) {
      const section = document.createElement('section');
      section.className = 'quest-section';
      
      const heading = document.createElement('h2');
      heading.textContent = title;
      section.appendChild(heading);
      
      const carousel = document.createElement('div');
      carousel.className = 'carousel';
      
      // Add quest cards to the carousel
      questData[questType].forEach(quest => {
          carousel.appendChild(createQuestCard(quest));
      });
      
      section.appendChild(carousel);
      questContainer.appendChild(section);
      
      // Initialize carousel functionality
      initCarousel(carousel);
  }
  
  // Function to create a quest card
  function createQuestCard(quest) {
      const card = document.createElement('div');
      card.className = 'quest-card';
      
      const title = document.createElement('h3');
      title.textContent = quest.title;
      card.appendChild(title);
      
      const description = document.createElement('p');
      description.textContent = quest.description;
      card.appendChild(description);
      
      const reward = document.createElement('div');
      reward.className = 'reward';
      reward.textContent = `Reward: ${quest.reward}`;
      card.appendChild(reward);
      
      const completeBtn = document.createElement('button');
      completeBtn.className = 'complete-btn';
      completeBtn.textContent = 'Complete';
      
      completeBtn.addEventListener('click', function() {
          quest.completed = true;
          card.style.opacity = '0.7';
          card.style.borderColor = '#4CAF50';
          this.textContent = 'Completed!';
          this.style.background = 'linear-gradient(to bottom, #9E9E9E, #616161)';
          this.disabled = true;
          
          // Add visual effect
          card.style.transform = 'scale(0.98)';
      });
      
      card.appendChild(completeBtn);
      
      return card;
  }
  
  // Function to initialize carousel behavior
  function initCarousel(carousel) {
      let isDown = false;
      let startX;
      let scrollLeft;

      carousel.addEventListener('mousedown', (e) => {
          isDown = true;
          carousel.style.cursor = 'grabbing';
          startX = e.pageX - carousel.offsetLeft;
          scrollLeft = carousel.scrollLeft;
      });

      carousel.addEventListener('mouseleave', () => {
          isDown = false;
          carousel.style.cursor = 'grab';
      });

      carousel.addEventListener('mouseup', () => {
          isDown = false;
          carousel.style.cursor = 'grab';
      });

      carousel.addEventListener('mousemove', (e) => {
          if(!isDown) return;
          e.preventDefault();
          const x = e.pageX - carousel.offsetLeft;
          const walk = (x - startX) * 2;
          carousel.scrollLeft = scrollLeft - walk;
      });

      // Touch support for mobile devices
      carousel.addEventListener('touchstart', (e) => {
          isDown = true;
          startX = e.touches[0].pageX - carousel.offsetLeft;
          scrollLeft = carousel.scrollLeft;
      });

      carousel.addEventListener('touchend', () => {
          isDown = false;
      });

      carousel.addEventListener('touchmove', (e) => {
          if(!isDown) return;
          const x = e.touches[0].pageX - carousel.offsetLeft;
          const walk = (x - startX) * 2;
          carousel.scrollLeft = scrollLeft - walk;
      });
  }
});