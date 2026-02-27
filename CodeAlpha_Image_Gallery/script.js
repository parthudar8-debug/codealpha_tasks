const buttons = document.querySelectorAll(".filters button");
const cards = document.querySelectorAll(".card");

buttons.forEach(button => {
  button.addEventListener("click", () => {

    document.querySelector(".filters .active")
      .classList.remove("active");
    button.classList.add("active");

    const filter = button.getAttribute("data-filter");

    cards.forEach(card => {
      card.classList.remove("hide");

      if (filter !== "all" && !card.classList.contains(filter)) {
        card.classList.add("hide");
      }
    });

  });
});

// Basic image data
const imageData = [
    {
        id: 1,
        src: 'https://picsum.photos/seed/nature1/400/300.jpg',
        title: 'Mountain Paradise',
        category: 'nature',
        description: 'Majestic mountains touching clouds'
    },
    {
        id: 2,
        src: 'https://picsum.photos/seed/city1/400/300.jpg',
        title: 'Neon Dreams',
        category: 'city',
        description: 'City lights painting night sky'
    },
    {
        id: 3,
        src: 'https://picsum.photos/seed/people1/400/300.jpg',
        title: 'Human Stories',
        category: 'people',
        description: 'Captured moments of human emotion'
    },
    {
        id: 4,
        src: 'https://picsum.photos/seed/animals1/400/300.jpg',
        title: 'Wildlife Wonder',
        category: 'animals',
        description: 'Majestic creatures in their natural habitat'
    },
    {
        id: 5,
        src: 'https://picsum.photos/seed/nature2/400/300.jpg',
        title: 'Ocean Serenity',
        category: 'nature',
        description: 'Waves dancing under golden sun'
    },
    {
        id: 6,
        src: 'https://picsum.photos/seed/city2/400/300.jpg',
        title: 'Urban Geometry',
        category: 'city',
        description: 'Architectural marvels reaching for sky'
    },
    {
        id: 7,
        src: 'https://picsum.photos/seed/people2/400/300.jpg',
        title: 'Street Life',
        category: 'people',
        description: 'The vibrant pulse of city streets'
    },
    {
        id: 8,
        src: 'https://picsum.photos/seed/animals2/400/300.jpg',
        title: 'Furry Friends',
        category: 'animals',
        description: 'Adorable companions that steal our hearts'
    },
    {
        id: 9,
        src: 'https://picsum.photos/seed/nature3/400/300.jpg',
        title: 'Forest Magic',
        category: 'nature',
        description: 'Ancient woods whispering secrets'
    },
    {
        id: 10,
        src: 'https://picsum.photos/seed/city3/400/300.jpg',
        title: 'Midnight Metro',
        category: 'city',
        description: 'The city that never sleeps'
    },
    {
        id: 11,
        src: 'https://picsum.photos/seed/people3/400/300.jpg',
        title: 'Creative Souls',
        category: 'people',
        description: 'Artists expressing their inner world'
    },
    {
        id: 12,
        src: 'https://picsum.photos/seed/animals3/400/300.jpg',
        title: 'Sky Hunters',
        category: 'animals',
        description: 'Masters of the aerial domain'
    }
];

let currentFilter = 'all';
let currentImageIndex = 0;
let filteredImages = [...imageData];
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// DOM Elements
const gallery = document.getElementById('gallery');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDescription = document.getElementById('lightbox-description');
const closeBtn = document.querySelector('.close');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const themeToggle = document.getElementById('themeToggle');

// Initialize gallery
function initGallery() {
    renderGallery(imageData);
    setupEventListeners();
    initializeTheme();
}

// Initialize theme
function initializeTheme() {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }
}

// Theme toggle
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    localStorage.setItem('darkMode', isDarkMode);
}

// Render gallery
function renderGallery(images) {
    gallery.innerHTML = '';
    
    if (images.length === 0) {
        gallery.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: white; font-size: 1.2rem; padding: 3rem;">
                <p>No images found</p>
                <p style="opacity: 0.7; font-size: 0.9rem;">Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }
    
    images.forEach((image, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.innerHTML = `
            <img src="${image.src}" alt="${image.title}" loading="lazy">
            <div class="overlay">
                <h3>${image.title}</h3>
                <p>${image.description}</p>
                <div class="category-badge">${image.category}</div>
            </div>
        `;
        
        card.addEventListener('click', () => openLightbox(index));
        gallery.appendChild(card);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Search
    searchInput.addEventListener('input', (e) => {
        handleSearch(e.target.value);
    });
    
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });
    
    // Lightbox controls
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPreviousImage);
    nextBtn.addEventListener('click', showNextImage);
    
    // Close lightbox on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPreviousImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        } else {
            if (e.key === 't' || e.key === 'T') {
                toggleTheme();
            }
        }
    });
}

// Handle search
function handleSearch(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    
    if (term === '') {
        filteredImages = currentFilter === 'all' ? 
            [...imageData] : 
            imageData.filter(img => img.category === currentFilter);
    } else {
        filteredImages = imageData.filter(img => {
            const matchesSearch = 
                img.title.toLowerCase().includes(term) ||
                img.description.toLowerCase().includes(term) ||
                img.category.toLowerCase().includes(term);
            
            const matchesFilter = currentFilter === 'all' || img.category === currentFilter;
            
            return matchesSearch && matchesFilter;
        });
    }
    
    renderGallery(filteredImages);
}

// Handle filter
function handleFilter(e) {
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    currentFilter = e.target.dataset.filter;
    
    // Apply filter
    if (currentFilter === 'all') {
        filteredImages = [...imageData];
    } else {
        filteredImages = imageData.filter(img => img.category === currentFilter);
    }
    
    // Apply search if exists
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm !== '') {
        filteredImages = filteredImages.filter(img => 
            img.title.toLowerCase().includes(searchTerm) ||
            img.description.toLowerCase().includes(searchTerm)
        );
    }
    
    renderGallery(filteredImages);
}

// Lightbox functions
function openLightbox(index) {
    currentImageIndex = index;
    const image = filteredImages[index];
    
    lightboxImg.src = image.src;
    lightboxTitle.textContent = image.title;
    lightboxDescription.textContent = image.description;
    lightbox.style.display = 'block';
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showPreviousImage() {
    currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
    updateLightboxImage();
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    const image = filteredImages[currentImageIndex];
    lightboxImg.src = image.src;
    lightboxTitle.textContent = image.title;
    lightboxDescription.textContent = image.description;
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', initGallery);
