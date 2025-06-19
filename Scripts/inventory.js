window.addEventListener('load', () => {
  setTimeout(() => {
    const loadingScreen = document.getElementById("loading-screen");
    loadingScreen.style.display = "none";
  }, 2000); // simulate loading screen
});
// Sample Items Data
const items = [
    { name: "FOCUS HELM", bonus: "+5 FOCUS", rarity: "cyan" },
    { name: "STR GAUNTLETS", bonus: "+3 STR", rarity: "purple" },
    { name: "XP BOOST", bonus: "2x XP 1H", rarity: "yellow" },
    { name: "GOLDEN BADGE", bonus: "RARITY: EPIC", rarity: "gold" },
    { name: "AGILITY BOOTS", bonus: "+5 SPD", rarity: "cyan" },
    { name: "MANA POTION", bonus: "+10 INT", rarity: "blue" },
    { name: "STEEL ARMOR", bonus: "+8 DEF", rarity: "silver" },
    { name: "WISDOM TOME", bonus: "+7 INT", rarity: "purple" },
  ];
  
  // Rarity Colors
  const rarityColors = {
    cyan: "#0ff0fc",
    purple: "#b026ff",
    yellow: "#ffd700",
    gold: "#ffaa00",
    blue: "#00b4d8",
    silver: "#c0c0c0"
  };
  
  // Initialize Inventory
  function loadItems() {
    const grid = document.querySelector('.inventory-grid');
    grid.innerHTML = '';
    
    items.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'item';
      itemElement.style.borderColor = rarityColors[item.rarity] || "#0ff0fc";
      itemElement.innerHTML = `
        <div class="item-name">${item.name}</div>
        <div class="item-bonus">${item.bonus}</div>
      `;
      grid.appendChild(itemElement);
    });
  }
  
  // Skill Tree Toggle
  const skillTreeButton = document.getElementById('skill-tree-button');
  const skillTreePanel = document.querySelector('.skill-tree-panel');
  
  skillTreeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    skillTreePanel.classList.toggle('active');
  });
  
  // Close Panel When Clicking Outside
  document.addEventListener('click', () => {
    skillTreePanel.classList.remove('active');
  });
  
  // Prevent Panel Close When Clicking Inside
  skillTreePanel.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
  // Initialize
  loadItems();