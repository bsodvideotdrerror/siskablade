// Music Player JavaScript (isolated scope)
(function() {
let currentTrackIndex = 0;
let isPlaying = false;
let audio = null;
let playlist = [
    { file: 'letoiarbaleti.wav', artist: 'Аким Апачев', title: 'Лето и арбалеты' },
    { file: 'donbas.wav', artist: 'Аким Апачев', title: 'Донбасс' },
    { file: 'geran.wav', artist: 'Аким Апачев', title: 'Герань' },
    { file: 'russianmat.wav', artist: 'Аким Апачев', title: 'Russian Mat' },
    { file: 'xoxli.wav', artist: 'Аким Апачев', title: 'Хохлы' }
];

// Music Player Functions
function openMusicPlayer() {
    const musicWindow = document.getElementById('musicPlayer');
    if (musicWindow) {
        musicWindow.style.display = 'block';
        // Ensure window is visible and on top
        musicWindow.style.position = 'fixed';
        musicWindow.style.left = '120px';
        musicWindow.style.top = '120px';
        musicWindow.style.zIndex = '1002';
        initMusicPlayer();
    }
}

function closeMusicPlayer() {
    const musicWindow = document.getElementById('musicPlayer');
    if (musicWindow) {
        musicWindow.style.display = 'none';
        stopMusic();
    }
}

function initMusicPlayer() {
    audio = document.getElementById('musicAudio');
    if (!audio) {
        // Create audio element if it doesn't exist
        audio = document.createElement('audio');
        audio.id = 'musicAudio';
        audio.preload = 'metadata';
        document.body.appendChild(audio);
    }
    
    updatePlaylist();
    loadTrack(currentTrackIndex);
}

function updatePlaylist() {
    const playlistContainer = document.getElementById('playlistContainer');
    if (!playlistContainer) return;
    
    playlistContainer.innerHTML = '';
    
    playlist.forEach((track, index) => {
        const trackItem = document.createElement('div');
        trackItem.className = 'playlist-item';
        if (index === currentTrackIndex) {
            trackItem.classList.add('active');
        }
        
        trackItem.innerHTML = `
            <div class="track-number">${index + 1}</div>
            <div class="track-info">
                <div class="track-title">${track.title}</div>
                <div class="track-artist">${track.artist}</div>
            </div>
            <div class="track-duration">--:--</div>
        `;
        
        trackItem.addEventListener('click', () => {
            selectTrack(index);
        });
        
        playlistContainer.appendChild(trackItem);
    });
}

function selectTrack(index) {
    currentTrackIndex = index;
    loadTrack(index);
    updatePlaylist();
}

function loadTrack(index) {
    if (!audio || !playlist[index]) return;
    
    const track = playlist[index];
    audio.src = `assets/${track.file}`;
    
    // Update track info display
    const trackTitle = document.getElementById('currentTrackTitle');
    const trackArtist = document.getElementById('currentTrackArtist');
    
    if (trackTitle) trackTitle.textContent = track.title;
    if (trackArtist) trackArtist.textContent = track.artist;
}

function playMusic() {
    if (!audio) return;
    
    if (isPlaying) {
        pauseMusic();
    } else {
        audio.play().then(() => {
            isPlaying = true;
            updatePlayButton();
        }).catch(error => {
            console.error('Error playing music:', error);
        });
    }
}

function pauseMusic() {
    if (!audio) return;
    
    audio.pause();
    isPlaying = false;
    updatePlayButton();
}

function stopMusic() {
    if (!audio) return;
    
    audio.pause();
    audio.currentTime = 0;
    isPlaying = false;
    updatePlayButton();
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    updatePlaylist();
    if (isPlaying) {
        audio.play();
    }
}

function previousTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    updatePlaylist();
    if (isPlaying) {
        audio.play();
    }
}

function updatePlayButton() {
    const playBtn = document.getElementById('musicPlayBtn');
    if (playBtn) {
        playBtn.textContent = isPlaying ? '⏸' : '▶';
    }
}

// Audio event listeners
function setupAudioEvents() {
    if (!audio) return;
    
    audio.addEventListener('ended', () => {
        nextTrack();
    });
    
    audio.addEventListener('loadedmetadata', () => {
        updateTrackDuration();
    });
}

function updateTrackDuration() {
    if (!audio) return;
    
    const duration = formatTime(audio.duration || 0);
    const playlistItems = document.querySelectorAll('.playlist-item');
    
    if (playlistItems[currentTrackIndex]) {
        const durationElement = playlistItems[currentTrackIndex].querySelector('.track-duration');
        if (durationElement) {
            durationElement.textContent = duration;
        }
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setupAudioEvents();
});

// Export functions to global scope
window.openMusicPlayer = openMusicPlayer;
window.closeMusicPlayer = closeMusicPlayer;
window.playMusic = playMusic;
window.pauseMusic = pauseMusic;
window.stopMusic = stopMusic;
window.nextTrack = nextTrack;
window.previousTrack = previousTrack;

// Debug: Test if functions are available
console.log('Music player functions loaded:', {
    openMusicPlayer: typeof window.openMusicPlayer,
    playMusic: typeof window.playMusic,
    nextTrack: typeof window.nextTrack
});

})();
