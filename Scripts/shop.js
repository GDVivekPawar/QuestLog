window.addEventListener('load', () => {
    setTimeout(() => {
      const loadingScreen = document.getElementById("loading-screen");
      loadingScreen.style.display = "none";
    }, 2000); // simulate loading screen
  });
  
document.addEventListener('DOMContentLoaded', function() {

    const cardsGrid = document.querySelector('.cards-grid');
    const companionBubble = document.querySelector('.companion-speech-bubble');
    const companionMessage = document.querySelector('.companion-message');
    const companionImage = document.querySelector('.companion-image');
    
    // Sound effects
    const hoverSound = document.getElementById('hoverSound');
    const flipSound = document.getElementById('flipSound');
    const claimSound = document.getElementById('claimSound');
    
    // Companion messages for different items
    const companionMessages = {
        default: "Select an item, Hunter",
        common: "A basic item, but useful nonetheless",
        rare: "This could give you an edge in battle",
        epic: "Now this is a worthy acquisition",
        legendary: "The Shadow Monarch approves of this choice",
        monarch: "This item carries my essence. Choose wisely"
    };
    
    // Sample items with ranks and rarities
    const items = [
        {
            id: 1,
            name: "Novice Hunter's Ring",
            description: "Basic ring for beginner hunters",
            icon: "💍",
            unlockCondition: "Reach Level 10",
            bonus: "+10% Energy Regeneration",
            rank: "D",
            rarity: "common"
        },
        {
            id: 2,
            name: "Dragon's Scale Armor",
            description: "Armor forged from C-rank dragon scales",
            icon: "🛡️",
            unlockCondition: "Defeat a C-rank dragon",
            bonus: "+30 Defense, +15% Fire Resistance",
            rank: "C",
            rarity: "rare"
        },
        {
            id: 3,
            name: "Elixir of Vitality",
            description: "Restores health and removes debuffs",
            icon: "🧪",
            unlockCondition: "Complete 50 daily quests",
            bonus: "Instant 50% HP recovery",
            rank: "B",
            rarity: "rare"
        },
        {
            id: 4,
            name: "Gate Key",
            description: "Teleport to any cleared dungeon",
            icon: "🔑",
            unlockCondition: "Clear 30 different dungeons",
            bonus: "Dungeon teleportation",
            rank: "A",
            rarity: "epic"
        },
        {
            id: 5,
            name: "Cursed Dagger",
            description: "Grows stronger with each kill",
            icon: "🗡️",
            unlockCondition: "Achieve 500 monster kills",
            bonus: "+1 Attack per kill (max +50)",
            rank: "S",
            rarity: "legendary"
        },
        {
            id: 6,
            name: "Monarch's Crown",
            description: "Symbol of the ruler of shadows",
            icon: "👑",
            unlockCondition: "Become the Shadow Monarch",
            bonus: "Unlocks all shadow soldier abilities",
            rank: "S",
            rarity: "monarch"
        }
    ];

    // Create particles for S-rank items
    function createParticles(element) {
        const particles = [];
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random size between 2px and 5px
            const size = Math.random() * 3 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random position within element
            const x = Math.random() * element.offsetWidth;
            const y = Math.random() * element.offsetHeight;
            
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            // Random animation
            const duration = Math.random() * 3 + 2;
            particle.style.animation = `float ${duration}s infinite ease-in-out`;
            
            element.appendChild(particle);
            particles.push(particle);
        }
        
        return particles;
    }

    // Create cards for each item
    function createItemCards(filterRank = 'all') {
        cardsGrid.innerHTML = '';
        
        items.forEach(item => {
            if (filterRank !== 'all' && item.rank !== filterRank) return;
            
            const card = document.createElement('div');
            card.className = `card rank-${item.rank}`;
            card.dataset.id = item.id;
            card.dataset.rarity = item.rarity;
            
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <div class="item-image">${item.icon}</div>
                        <h3 class="item-name">${item.name}</h3>
                        <p class="item-description">${item.description}</p>
                        <div class="item-rank">${item.rank}-Rank</div>
                        <button class="claim-btn">Claim</button>
                    </div>
                    <div class="card-back">
                        <div class="unlock-condition">
                            <h3>Unlock Condition</h3>
                            <p>${item.unlockCondition}</p>
                        </div>
                        <div class="item-bonus">
                            <h3>Bonus Effect</h3>
                            <p>${item.bonus}</p>
                        </div>
                        <button class="back-btn">Back</button>
                    </div>
                </div>
            `;
            
            cardsGrid.appendChild(card);
            
            // Add particles to S-rank items
            if (item.rank === 'S') {
                createParticles(card);
            }
        });
    }

    // Initial card creation
    createItemCards();

    // Filter buttons functionality
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            createItemCards(this.dataset.rank);
        });
    });

    // Companion interaction
    companionImage.addEventListener('click', function() {
        companionBubble.classList.toggle('visible');
    });

    // Update companion message based on item rarity
    function updateCompanionMessage(rarity) {
        const message = companionMessages[rarity] || companionMessages.default;
        companionMessage.textContent = message;
        companionBubble.classList.add('visible');
        
        // Hide after delay
        setTimeout(() => {
            companionBubble.classList.remove('visible');
        }, 3000);
    }

    // Add hover effects with sound
    document.addEventListener('mouseover', function(e) {
        const card = e.target.closest('.card');
        if (card) {
            hoverSound.currentTime = 0;
            hoverSound.play();
            
            // Update companion message on hover
            const rarity = card.dataset.rarity;
            updateCompanionMessage(rarity);
        }
    });

    // Add click event to flip cards
    document.addEventListener('click', function(e) {
        const card = e.target.closest('.card');
        if (card && !e.target.closest('button')) {
            flipSound.currentTime = 0;
            flipSound.play();
            card.classList.toggle('flipped');
        }
    });

    // Add back button functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('back-btn')) {
            flipSound.currentTime = 0;
            flipSound.play();
            e.target.closest('.card').classList.remove('flipped');
        }
    });

    // Add claim button functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('claim-btn')) {
            claimSound.currentTime = 0;
            claimSound.play();
            
            const itemId = e.target.closest('.card').dataset.id;
            const item = items.find(i => i.id == itemId);
            
            // Special companion message for claimed item
            companionMessage.textContent = `You have claimed: ${item.name}`;
            companionBubble.classList.add('visible');
            
            setTimeout(() => {
                companionBubble.classList.remove('visible');
            }, 3000);
            
            alert(`Claimed: ${item.name}\n${item.bonus}`);
        }
    });
});