// DATABASE MOCK (Representa a grande escala do portal)
const propertiesDatabase = [
    {
        id: 1,
        title: "Mansão Contemporânea Neoclássica",
        type: "casa",
        neighborhood: "Nova Brasília",
        price: 1850000,
        oldPrice: 2000000,
        beds: 4,
        baths: 4,
        sqm: 450,
        tag: "EXCLUSIVO",
        image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
        purpose: "comprar"
    },
    {
        id: 2,
        title: "Residência Minimalista com Piscina",
        type: "casa",
        neighborhood: "Centro",
        price: 240000,
        oldPrice: 270000,
        beds: 3,
        baths: 2,
        sqm: 180,
        tag: "-15% OFF",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
        purpose: "comprar"
    },
    {
        id: 3,
        title: "Terreno em Condomínio Fechado",
        type: "terreno",
        neighborhood: "Paraíso",
        price: 190000,
        oldPrice: 0,
        beds: 0,
        baths: 0,
        sqm: 360,
        tag: "OPORTUNIDADE",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
        purpose: "comprar"
    },
    {
        id: 4,
        title: "Apartamento Executivo Térreo",
        type: "apartamento",
        neighborhood: "Comercial",
        price: 220000,
        oldPrice: 240000,
        beds: 2,
        baths: 1,
        sqm: 75,
        tag: "ÚLTIMA UNIDADE",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
        purpose: "comprar"
    },
    {
        id: 5,
        title: "Ponto Comercial de Esquina",
        type: "comercial",
        neighborhood: "Centro",
        price: 850000,
        oldPrice: 0,
        beds: 0,
        baths: 2,
        sqm: 300,
        tag: "COMERCIAL",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
        purpose: "comprar"
    }
];

// STATE MANAGEMENT
let favorites = JSON.parse(localStorage.getItem('lima_favs')) || [];

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    renderShelves();
    renderMainGrid(propertiesDatabase);
    updateFavBadge();
    initFilters();
});

// CARD GENERATOR COMPONENT
function createPropertyCard(item) {
    const isFav = favorites.includes(item.id);
    const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price);
    const formattedOld = item.oldPrice ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.oldPrice) : '';

    return `
        <div class="card-property">
            <div class="card-media">
                <span class="card-tag">${item.tag}</span>
                <button class="btn-fav" onclick="toggleFavorite(${item.id})">
                    <i class="${isFav ? 'fas' : 'far'} fa-heart" style="${isFav ? 'color:#FF3B30' : ''}"></i>
                </button>
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="card-body">
                <div class="card-location"><i class="fas fa-map-marker-alt"></i> ${item.neighborhood}, Santana-AP</div>
                <h3 class="card-title">${item.title}</h3>
                <div class="card-specs">
                    <span><i class="fas fa-bed"></i> ${item.beds}</span>
                    <span><i class="fas fa-bath"></i> ${item.baths}</span>
                    <span><i class="fas fa-ruler-combined"></i> ${item.sqm}m²</span>
                </div>
                <div class="card-price-box">
                    ${formattedOld ? `<div class="price-old">${formattedOld}</div>` : ''}
                    <div class="price-current">${formattedPrice}</div>
                </div>
            </div>
        </div>
    `;
}

// RENDER SHELVES (NETFLIX STYLE)
function renderShelves() {
    const shelfMaisVistos = document.getElementById('shelfMaisVistos');
    const shelfOportunidades = document.getElementById('shelfOportunidades');

    if (shelfMaisVistos) {
        shelfMaisVistos.innerHTML = propertiesDatabase.map(item => createPropertyCard(item)).join('');
    }

    if (shelfOportunidades) {
        const cheapItems = propertiesDatabase.filter(item => item.price <= 250000);
        shelfOportunidades.innerHTML = cheapItems.map(item => createPropertyCard(item)).join('');
    }
}

// RENDER MAIN MARKETPLACE GRID
function renderMainGrid(data) {
    const grid = document.getElementById('mainPropertyGrid');
    const resultsCount = document.getElementById('resultsCount');

    if (!grid) return;

    if (data.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Nenhum imóvel encontrado com esses filtros.</p>`;
        resultsCount.innerText = 0;
        return;
    }

    grid.innerHTML = data.map(item => createPropertyCard(item)).join('');
    resultsCount.innerText = data.length;
}

// FAVORITES SYSTEM (LocalStorage)
function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('lima_favs', JSON.stringify(favorites));
    updateFavBadge();
    renderShelves();
    renderMainGrid(propertiesDatabase);
}

function updateFavBadge() {
    const badge = document.getElementById('favCount');
    if (badge) badge.innerText = favorites.length;
}

// FILTER SYSTEM
function initFilters() {
    const priceRange = document.getElementById('priceRange');
    const priceDisplay = document.getElementById('priceDisplay');
    const filterNeighborhood = document.getElementById('filterNeighborhood');

    if (priceRange) {
        priceRange.addEventListener('input', (e) => {
            const val = e.target.value;
            priceDisplay.innerText = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
            applyFilters();
        });
    }

    if (filterNeighborhood) {
        filterNeighborhood.addEventListener('change', applyFilters);
    }
}

function applyFilters() {
    const maxPrice = parseInt(document.getElementById('priceRange').value);
    const selectedNeighborhood = document.getElementById('filterNeighborhood').value;

    const filtered = propertiesDatabase.filter(item => {
        const matchesPrice = item.price <= maxPrice;
        const matchesNeighborhood = selectedNeighborhood === 'todos' || item.neighborhood === selectedNeighborhood;
        return matchesPrice && matchesNeighborhood;
    });

    renderMainGrid(filtered);
}