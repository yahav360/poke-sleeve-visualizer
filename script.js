// script.js

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');
const mainCard = document.getElementById('main-card');
const mainSleeve = document.getElementById('main-sleeve'); 
const removeSleeveBtn = document.getElementById('remove-sleeve');
const sleeveGrid = document.getElementById('sleeve-grid');

const sleeveColors = [
    '#EF4444', '#3B82F6', '#10B981', '#EAB308', 
    '#171717', '#EFEFEF', '#A855F7', '#EC4899'
];

function renderGrid() {
    sleeveGrid.innerHTML = '';
    
    sleeveColors.forEach(color => {
        // 1. Create the background square
        const sleeveBg = document.createElement('div');
        sleeveBg.className = 'mini-sleeve-bg';
        sleeveBg.style.backgroundColor = color; 
        
        // 2. Create the image
        const miniCard = document.createElement('img');
        miniCard.src = mainCard.src; 
        miniCard.className = 'mini-card';
        
        // 3. Put the image inside the colored background square
        sleeveBg.appendChild(miniCard);
        
        // 4. Click event changes the MAIN SLEEVE'S background color
        sleeveBg.addEventListener('click', () => {
            mainSleeve.style.backgroundColor = color;
        });
        
        // 5. Add to grid
        sleeveGrid.appendChild(sleeveBg);
    });
}

searchBtn.addEventListener('click', async () => {
    const searchTerm = searchInput.value.trim();
    if (!searchTerm) return; 

    searchResults.innerHTML = '<p class="loading-text">Searching the database...</p>';
    searchResults.classList.remove('hidden');

    try {
        // UPDATED: Added &orderBy=-set.releaseDate to pull the newest cards first
        const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:"*${searchTerm}*"&orderBy=-set.releaseDate`);
        const data = await response.json();

        searchResults.innerHTML = ''; 

        if (data.data.length === 0) {
            searchResults.innerHTML = '<p class="loading-text">No cards found. Try a different name!</p>';
            return;
        }

        data.data.forEach(card => {
            if (card.images && card.images.small) {
                const img = document.createElement('img');
                img.src = card.images.small;
                img.className = 'result-card';
                
                img.addEventListener('click', () => {
                    mainCard.src = card.images.large; 
                    mainSleeve.style.backgroundColor = 'transparent'; 
                    searchResults.classList.add('hidden'); 
                    renderGrid(); 
                });
                
                searchResults.appendChild(img);
            }
        });
    } catch (error) {
        searchResults.innerHTML = '<p class="loading-text">Error connecting to the database.</p>';
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

removeSleeveBtn.addEventListener('click', () => {
    mainSleeve.style.backgroundColor = 'transparent'; 
});

renderGrid();