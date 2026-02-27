// ===== MUSIC PLAYER JAVASCRIPT =====

// Playlist data
const playlist = [
    {
        id: 1,
        title: "Finding Her",
        artist: "Local Artist",
        cover: "image/finding her.jpg",
        duration: "4:20",
        audioUrl: "song/Finding Her.mp3"
    },
    {
        id: 2,
        title: "Gehra Hua",
        artist: "Local Artist",
        cover: "image/gehar hua.jpg",
        duration: "3:45",
        audioUrl: "song/Gehra Hua.mp3"
    },
    {
        id: 3,
        title: "Awaara Angaara",
        artist: "Local Artist",
        cover: "image/aawaara angaara.jpg",
        duration: "4:10",
        audioUrl: "song/Awaara Angaara.mp3"
    },
    {
        id: 4,
        title: "Dooron Dooron",
        artist: "Local Artist",
        cover: "image/dooron dooron img.jpg",
        duration: "3:55",
        audioUrl: "song/Dooron Dooron.mp3"
    }
];

// ===== DOM ELEMENTS =====
const audioPlayer = document.getElementById('audioPlayer');
const albumCover = document.getElementById('albumCover');
const songTitle = document.getElementById('songTitle');
const artistName = document.getElementById('artistName');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const progressFill = document.getElementById('progressFill');
const progressHandle = document.getElementById('progressHandle');
const progressBar = document.querySelector('.progress-bar');
const volumeFill = document.getElementById('volumeFill');
const volumeHandle = document.getElementById('volumeHandle');
const volumeSlider = document.querySelector('.volume-slider');
const playPauseBtn = document.getElementById('playPauseBtn');
const playPauseIcon = document.getElementById('playPauseIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const playlistToggle = document.getElementById('playlistToggle');
const playlistContent = document.getElementById('playlistContent');

// Theme and Search Elements
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
const playlistHeader = document.getElementById('playlistHeader');
const playlistName = document.getElementById('playlistName');
const songCount = document.getElementById('songCount');

// ===== PLAYER STATE =====
let currentSongIndex = 0;
let isPlaying = false;
let isShuffled = false;
let repeatMode = 'off'; // 'off', 'one', 'all'
let shuffledPlaylist = [...playlist];
let currentTheme = 'dark';
let filteredPlaylist = [...playlist];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializePlayer();
    setupEventListeners();
    loadTheme();
    renderPlaylist();
    loadSong(currentSongIndex);
});

// ===== PLAYER INITIALIZATION =====
function initializePlayer() {
    // Set initial volume
    audioPlayer.volume = 0.7;
    updateVolumeUI(0.7);
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Play/Pause button
    playPauseBtn.addEventListener('click', togglePlayPause);
    
    // Control buttons
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    
    // Progress bar
    progressBar.addEventListener('click', seekTo);
    
    // Volume slider
    volumeSlider.addEventListener('click', setVolume);
    
    // Playlist toggle
    playlistToggle.addEventListener('click', togglePlaylist);
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    searchClear.addEventListener('click', clearSearch);
    
    // Audio events
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', updateDuration);
    audioPlayer.addEventListener('ended', handleSongEnd);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
}

// ===== PLAYLIST FUNCTIONS =====
function renderPlaylist() {
    playlistContent.innerHTML = '';
    const currentPlaylist = isShuffled ? shuffledPlaylist : filteredPlaylist;
    
    // Update song count
    const songCountText = currentPlaylist.length === 1 ? '1 song' : `${currentPlaylist.length} songs`;
    songCount.textContent = `(${songCountText})`;
    
    // Update playlist name based on current state
    if (searchInput.value.trim() !== '') {
        playlistName.textContent = 'Search Results';
    } else if (isShuffled) {
        playlistName.textContent = 'Shuffled Playlist';
    } else {
        playlistName.textContent = 'My Playlist';
    }
    
    currentPlaylist.forEach((song, index) => {
        const playlistItem = document.createElement('div');
        playlistItem.className = 'playlist-item';
        playlistItem.dataset.index = index;
        
        playlistItem.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" class="playlist-item-cover">
            <div class="playlist-item-info">
                <div class="playlist-item-title">${song.title}</div>
                <div class="playlist-item-artist">${song.artist}</div>
            </div>
            <div class="playlist-item-duration">${song.duration}</div>
        `;
        
        playlistItem.addEventListener('click', () => {
            const actualIndex = isShuffled ? 
                shuffledPlaylist.findIndex(s => s.id === song.id) : 
                filteredPlaylist.findIndex(s => s.id === song.id);
            currentSongIndex = actualIndex;
            loadSong(actualIndex);
            play();
        });
        
        playlistContent.appendChild(playlistItem);
    });
    
    updatePlaylistHighlight();
}

// ===== THEME FUNCTIONS =====
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    currentTheme = savedTheme;
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    if (currentTheme === 'dark') {
        themeIcon.className = 'fas fa-moon';
    } else {
        themeIcon.className = 'fas fa-sun';
    }
}

// ===== SEARCH FUNCTIONS =====
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredPlaylist = [...playlist];
        searchClear.classList.remove('visible');
    } else {
        filteredPlaylist = playlist.filter(song => 
            song.title.toLowerCase().includes(searchTerm) ||
            song.artist.toLowerCase().includes(searchTerm)
        );
        searchClear.classList.add('visible');
    }
    
    renderPlaylist();
}

function clearSearch() {
    searchInput.value = '';
    filteredPlaylist = [...playlist];
    searchClear.classList.remove('visible');
    renderPlaylist();
}

function updatePlaylistHighlight() {
    const currentPlaylist = isShuffled ? shuffledPlaylist : playlist;
    const currentSong = currentPlaylist[currentSongIndex];
    const playlistItems = document.querySelectorAll('.playlist-item');
    
    playlistItems.forEach((item, index) => {
        const itemSong = currentPlaylist[index];
        if (itemSong.id === currentSong.id) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// ===== PLAYBACK FUNCTIONS =====
function loadSong(index) {
    const currentPlaylist = isShuffled ? shuffledPlaylist : filteredPlaylist;
    const song = currentPlaylist[index];
    
    if (!song) return;
    
    // Update audio source
    audioPlayer.src = song.audioUrl;
    
    // Update UI
    albumCover.src = song.cover;
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    totalTimeEl.textContent = song.duration;
    
    // Reset progress
    progressFill.style.width = '0%';
    progressHandle.style.left = '0%';
    currentTimeEl.textContent = '0:00';
    
    // Update playlist highlight
    updatePlaylistHighlight();
    
    // Add fade-in animation
    albumCover.classList.add('fade-in');
    setTimeout(() => albumCover.classList.remove('fade-in'), 500);
}

function play() {
    audioPlayer.play();
    isPlaying = true;
    playPauseIcon.className = 'fas fa-pause';
    albumCover.classList.add('playing');
}

function pause() {
    audioPlayer.pause();
    isPlaying = false;
    playPauseIcon.className = 'fas fa-play';
    albumCover.classList.remove('playing');
}

function togglePlayPause() {
    if (isPlaying) {
        pause();
    } else {
        play();
    }
}

function playNext() {
    const currentPlaylist = isShuffled ? shuffledPlaylist : filteredPlaylist;
    
    if (currentSongIndex < currentPlaylist.length - 1) {
        currentSongIndex++;
    } else {
        currentSongIndex = 0; // Loop to beginning
    }
    
    loadSong(currentSongIndex);
    if (isPlaying) play();
}

function playPrevious() {
    const currentPlaylist = isShuffled ? shuffledPlaylist : filteredPlaylist;
    
    if (currentSongIndex > 0) {
        currentSongIndex--;
    } else {
        currentSongIndex = currentPlaylist.length - 1; // Loop to end
    }
    
    loadSong(currentSongIndex);
    if (isPlaying) play();
}

// ===== PROGRESS FUNCTIONS =====
function updateProgress() {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressFill.style.width = `${progress}%`;
    progressHandle.style.left = `${progress}%`;
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
}

function updateDuration() {
    totalTimeEl.textContent = formatTime(audioPlayer.duration);
}

function seekTo(e) {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seekTime = percent * audioPlayer.duration;
    
    audioPlayer.currentTime = seekTime;
    progressFill.style.width = `${percent * 100}%`;
    progressHandle.style.left = `${percent * 100}%`;
}

// ===== VOLUME FUNCTIONS =====
function setVolume(e) {
    const rect = volumeSlider.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    
    audioPlayer.volume = Math.max(0, Math.min(1, percent));
    updateVolumeUI(audioPlayer.volume);
}

function updateVolumeUI(volume) {
    const percent = volume * 100;
    volumeFill.style.width = `${percent}%`;
    volumeHandle.style.left = `${percent}%`;
}

// ===== CONTROL FUNCTIONS =====
function toggleShuffle() {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle('active');
    
    if (isShuffled) {
        // Create shuffled playlist
        shuffledPlaylist = [...playlist].sort(() => Math.random() - 0.5);
        // Find current song in shuffled playlist
        const currentSong = playlist[currentSongIndex];
        currentSongIndex = shuffledPlaylist.findIndex(s => s.id === currentSong.id);
    } else {
        // Find current song in original playlist
        const currentSong = shuffledPlaylist[currentSongIndex];
        currentSongIndex = playlist.findIndex(s => s.id === currentSong.id);
    }
    
    renderPlaylist();
}

function toggleRepeat() {
    const modes = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    repeatMode = modes[(currentIndex + 1) % modes.length];
    
    // Update button appearance
    repeatBtn.classList.remove('active');
    if (repeatMode === 'one') {
        repeatBtn.classList.add('active');
        repeatBtn.innerHTML = '<i class="fas fa-redo">1</i>';
    } else if (repeatMode === 'all') {
        repeatBtn.classList.add('active');
        repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
    } else {
        repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
    }
}

function handleSongEnd() {
    if (repeatMode === 'one') {
        audioPlayer.currentTime = 0;
        play();
    } else if (repeatMode === 'all' || currentSongIndex < (isShuffled ? shuffledPlaylist : filteredPlaylist).length - 1) {
        playNext();
    } else {
        pause();
    }
}

// ===== PLAYLIST UI FUNCTIONS =====
function togglePlaylist() {
    playlistToggle.classList.toggle('expanded');
    playlistContent.classList.toggle('expanded');
}

// ===== UTILITY FUNCTIONS =====
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function handleKeyboard(e) {
    // Prevent default for our keys
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            togglePlayPause();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            playPrevious();
            break;
        case 'ArrowRight':
            e.preventDefault();
            playNext();
            break;
        case 'ArrowUp':
            e.preventDefault();
            audioPlayer.volume = Math.min(1, audioPlayer.volume + 0.1);
            updateVolumeUI(audioPlayer.volume);
            break;
        case 'ArrowDown':
            e.preventDefault();
            audioPlayer.volume = Math.max(0, audioPlayer.volume - 0.1);
            updateVolumeUI(audioPlayer.volume);
            break;
        case 'KeyM':
            e.preventDefault();
            // Mute/Unmute
            if (audioPlayer.volume > 0) {
                audioPlayer.dataset.previousVolume = audioPlayer.volume;
                audioPlayer.volume = 0;
            } else {
                audioPlayer.volume = audioPlayer.dataset.previousVolume || 0.7;
            }
            updateVolumeUI(audioPlayer.volume);
            break;
    }
}

// ===== ERROR HANDLING =====
audioPlayer.addEventListener('error', (e) => {
    console.error('Audio error:', e);
    // Try to load next song
    playNext();
});

// Add touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

albumCover.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

albumCover.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next song
            playNext();
        } else {
            // Swipe right - previous song
            playPrevious();
        }
    }
}
