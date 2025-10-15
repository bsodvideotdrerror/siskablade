// Russian Old School Gaming - Enhanced Audio Player

// Track data
const tracks = {
    'letoiarbaleti.wav': { artist: 'Аким Апачев', title: 'Лето и арбалеты' },
    'donbas.wav': { artist: 'Аким Апачев', title: 'Донбасс' },
    'geran.wav': { artist: 'Аким Апачев', title: 'Герань' },
    'russianmat.wav': { artist: 'Аким Апачев', title: 'Russian Mat' },
    'xoxli.wav': { artist: 'Аким Апачев', title: 'Хохлы' }
};

// Audio player functionality
const audio = document.getElementById('audioPlayer');

// Main player controls
const playPauseBtn = document.getElementById('playPauseBtn');
const stopBtn = document.getElementById('stopBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const vodkaFill = document.getElementById('vodkaFill');
const volumeFill = document.getElementById('volumeFill');
const volumeSlider = document.getElementById('volumeSlider');
const volumeDisplay = document.getElementById('volumeDisplay');
const timeDisplay = document.getElementById('timeDisplay');
const playerTrackInfo = document.getElementById('playerTrackInfo');
const currentArtist = document.getElementById('currentArtist');
const currentTitle = document.getElementById('currentTitle');
const muteBtn = document.getElementById('muteBtn');

// Music player window controls
const playerPlayPauseBtn = document.getElementById('playerPlayPauseBtn');
const playerStopBtn = document.getElementById('playerStopBtn');
const playerPrevBtn = document.getElementById('playerPrevBtn');
const playerNextBtn = document.getElementById('playerNextBtn');
const playerVodkaMeter = document.getElementById('playerVodkaMeter');
const playerVodkaFill = document.getElementById('playerVodkaFill');
const playerVolumeSlider = document.getElementById('playerVolumeSlider');
const playerVolumeFill = document.getElementById('playerVolumeFill');
const playerVolumeDisplay = document.getElementById('playerVolumeDisplay');
const playerTimeDisplay = document.getElementById('playerTimeDisplay');
const playerMuteBtn = document.getElementById('playerMuteBtn');
const playerTrackTitle = document.getElementById('playerTrackTitle');
const playerTrackArtist = document.getElementById('playerTrackArtist');
const playerTrackTime = document.getElementById('playerTrackTime');

let isPlaying = false;
let progressInterval;
let currentTrackIndex = 0;
const trackList = Object.keys(tracks);
let volume = 0.7;
let isDragging = false;
let dragType = null; // 'volume' or 'progress'
let isMuted = false;
let previousVolume = 0.7; // Сохраняем предыдущую громкость для unmute
let isRestarting = false; // Флаг для отслеживания перезапуска

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded - Initializing...');
    console.log('quotes array length:', quotes.length);
    console.log('totalPages:', totalPages);
    
    // Initialize all systems immediately on page load
    initializeAllSystems();
});

// Desktop Functions

window.openStats = function() {
    // Scroll to gaming stats window
    const statsWindow = document.querySelector('.gaming-stats-window');
    if (statsWindow) {
        statsWindow.scrollIntoView({behavior: 'smooth'});
    }
}

window.openMusic = function() {
    // Scroll to vodka meter window
    const musicWindow = document.querySelector('.vodka-meter-window');
    if (musicWindow) {
        musicWindow.scrollIntoView({behavior: 'smooth'});
    }
}

window.openSystem = function() {
    // Scroll to system window
    const systemWindow = document.querySelector('.system-window');
    if (systemWindow) {
        systemWindow.scrollIntoView({behavior: 'smooth'});
    }
}

window.openProfile = function() {
    // Open Steam profile in new tab
    console.log('Opening Steam profile from Profile button...');
    try {
        const newWindow = window.open('https://steamcommunity.com/id/Siska_blade/', '_blank');
        if (!newWindow) {
            console.log('Popup blocked, trying alternative method');
            // Fallback if popup is blocked
            window.location.href = 'https://steamcommunity.com/id/Siska_blade/';
        }
    } catch (error) {
        console.error('Error opening Steam profile:', error);
        // Fallback method
        window.location.href = 'https://steamcommunity.com/id/Siska_blade/';
    }
}

function openSteam() {
    // Try to open Steam application only
    console.log('Opening Steam application...');
    try {
        // Try to open Steam app
        window.location.href = 'steam://open/main';
    } catch (error) {
        console.error('Error opening Steam:', error);
        alert('Не удалось открыть Steam. Убедитесь, что приложение установлено.');
    }
}

// Initialize Device Manager
function initializeDeviceManager() {
    // Add click event listeners to all category headers
    const categoryHeaders = document.querySelectorAll('.category-header');
    categoryHeaders.forEach(header => {
        header.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleCategory(this);
        });
    });
    
    // Add click event listeners to all device items
    const deviceItems = document.querySelectorAll('.device-item');
    deviceItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            selectDevice(this);
        });
        
        item.addEventListener('dblclick', function(e) {
            e.stopPropagation();
            showDeviceProperties(this);
        });
    });
}

function initializeAudioPlayer() {
    // Set initial volume
    audio.volume = volume;
    updateVolumeDisplay();
    updateMuteButton();
    
    // Track selection buttons
    document.querySelectorAll('.track-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const trackFile = btn.dataset.track;
            loadTrack(trackFile);
            
            // Update active button
            document.querySelectorAll('.track-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Control buttons
    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);
    if (stopBtn) stopBtn.addEventListener('click', stop);
    if (prevBtn) prevBtn.addEventListener('click', previousTrack);
    if (nextBtn) nextBtn.addEventListener('click', nextTrack);
    
    // Music player window controls
    if (playerPlayPauseBtn) playerPlayPauseBtn.addEventListener('click', togglePlay);
    if (playerStopBtn) playerStopBtn.addEventListener('click', stop);
    if (playerPrevBtn) playerPrevBtn.addEventListener('click', previousTrack);
    if (playerNextBtn) playerNextBtn.addEventListener('click', nextTrack);
    
    // Music player volume control
    if (playerVolumeSlider) {
        playerVolumeSlider.addEventListener('mousedown', startVolumeDrag);
        playerVolumeSlider.addEventListener('click', (e) => {
            if (!isDragging) {
                const rect = playerVolumeSlider.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newVolume = Math.max(0, Math.min(1, clickX / rect.width));
                setVolume(newVolume);
            }
        });
    }
    
    // Music player vodka meter
    if (playerVodkaMeter) {
        playerVodkaMeter.addEventListener('mousedown', startProgressDrag);
        playerVodkaMeter.addEventListener('click', (e) => {
            if (!isDragging) {
                if (audio.duration) {
                    const rect = playerVodkaMeter.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const newTime = (clickX / rect.width) * audio.duration;
                    audio.currentTime = newTime;
                    updateProgress();
                }
            }
        });
    }
    
    // Music player mute button
    if (playerMuteBtn) playerMuteBtn.addEventListener('click', toggleMute);
    
    // Device Manager functionality
    initializeDeviceManager();
    
    // Mute button
    if (muteBtn) muteBtn.addEventListener('click', toggleMute);
    
    // Volume control with drag
    if (volumeSlider) {
        volumeSlider.addEventListener('mousedown', startVolumeDrag);
        volumeSlider.addEventListener('click', (e) => {
            if (!isDragging) {
                const rect = volumeSlider.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newVolume = Math.max(0, Math.min(1, clickX / rect.width));
                setVolume(newVolume);
            }
        });
    }
    
    // Vodka meter (progress bar) control with drag
    const vodkaMeter = document.querySelector('.vodka-meter');
    if (vodkaMeter) {
        vodkaMeter.addEventListener('mousedown', startProgressDrag);
        vodkaMeter.addEventListener('click', (e) => {
            if (!isDragging) {
                if (audio.duration) {
                    const rect = vodkaMeter.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const newTime = (clickX / rect.width) * audio.duration;
                    audio.currentTime = newTime;
                    updateProgress();
                }
            }
        });
    }
    
    // Также добавим обработчик на сам vodka-fill для надежности
    if (vodkaFill) {
        vodkaFill.addEventListener('mousedown', startProgressDrag);
    }
    
    // Audio events
    audio.addEventListener('loadedmetadata', updateTimeDisplay);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextTrack);
    audio.addEventListener('canplay', () => {
        updateTimeDisplay();
    });
    
    // Load first track
    loadTrack(trackList[0]);
}

function loadTrack(trackFile) {
    audio.src = `assets/${trackFile}`;
    const trackData = tracks[trackFile];
    
    // Update main player
    if (currentArtist) currentArtist.textContent = trackData.artist;
    if (currentTitle) currentTitle.textContent = `«${trackData.title}»`;
    if (playerTrackInfo) playerTrackInfo.textContent = `♪ ${trackData.artist} — ${trackData.title}`;
    
    // Update music player window
    if (playerTrackTitle) playerTrackTitle.textContent = trackData.title;
    if (playerTrackArtist) playerTrackArtist.textContent = trackData.artist;
    if (playerTrackTime) playerTrackTime.textContent = '0:00';
    
    // Update current track index
    currentTrackIndex = trackList.indexOf(trackFile);
    
    // Reset progress
    if (vodkaFill) vodkaFill.style.width = '0%';
    if (playerVodkaFill) playerVodkaFill.style.width = '0%';
    updateTimeDisplay();
}

function togglePlay() {
    if (isPlaying) {
        pause();
    } else {
        play();
    }
}

function play() {
    audio.play().then(() => {
        isPlaying = true;
        if (playPauseBtn) playPauseBtn.textContent = '⏸';
        if (playerPlayPauseBtn) playerPlayPauseBtn.textContent = '⏸';
        startProgress();
    }).catch(e => {
        console.log('Autoplay blocked:', e);
        alert('Кликните для воспроизведения!');
    });
}

function pause() {
    audio.pause();
    isPlaying = false;
    if (playPauseBtn) playPauseBtn.textContent = '▶';
    if (playerPlayPauseBtn) playerPlayPauseBtn.textContent = '▶';
    stopProgress();
}

function stop() {
    audio.pause();
    audio.currentTime = 0;
    isPlaying = false;
    if (playPauseBtn) playPauseBtn.textContent = '▶';
    if (playerPlayPauseBtn) playerPlayPauseBtn.textContent = '▶';
    stopProgress();
    if (vodkaFill) vodkaFill.style.width = '0%';
    if (playerVodkaFill) playerVodkaFill.style.width = '0%';
    updateTimeDisplay();
}

function previousTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + trackList.length) % trackList.length;
    const trackFile = trackList[currentTrackIndex];
    loadTrack(trackFile);
    
    // Update active button
    document.querySelectorAll('.track-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.track === trackFile);
    });
    
    if (isPlaying) {
        play();
    }
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % trackList.length;
    const trackFile = trackList[currentTrackIndex];
    loadTrack(trackFile);
    
    // Update active button
    document.querySelectorAll('.track-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.track === trackFile);
    });
    
    if (isPlaying) {
        play();
    }
}

function setVolume(newVolume) {
    volume = newVolume;
    
    // Если пользователь увеличивает громкость, автоматически снимаем mute
    if (isMuted && newVolume > 0) {
        isMuted = false;
    }
    
    audio.volume = volume;
    if (volumeFill) volumeFill.style.width = (volume * 100) + '%';
    if (playerVolumeFill) playerVolumeFill.style.width = (volume * 100) + '%';
    updateVolumeDisplay();
    updateMuteButton();
}

function toggleMute() {
    isMuted = !isMuted;
    
    if (isMuted) {
        previousVolume = volume;
        audio.volume = 0;
        if (volumeFill) volumeFill.style.width = '0%';
        if (playerVolumeFill) playerVolumeFill.style.width = '0%';
    } else {
        audio.volume = previousVolume;
        volume = previousVolume;
        if (volumeFill) volumeFill.style.width = (volume * 100) + '%';
        if (playerVolumeFill) playerVolumeFill.style.width = (volume * 100) + '%';
    }
    
    updateVolumeDisplay();
    updateMuteButton();
}

function updateMuteButton() {
    const currentVolume = isMuted ? 0 : volume;
    
    if (currentVolume === 0) {
        // Звук выключен - показываем значок без звука
        if (muteBtn) {
            muteBtn.textContent = '🔇';
            muteBtn.classList.add('muted');
        }
        if (playerMuteBtn) {
            playerMuteBtn.textContent = '🔇';
            playerMuteBtn.classList.add('muted');
        }
    } else {
        // Звук включен - показываем обычный значок
        if (muteBtn) {
            muteBtn.textContent = '🔊';
            muteBtn.classList.remove('muted');
        }
        if (playerMuteBtn) {
            playerMuteBtn.textContent = '🔊';
            playerMuteBtn.classList.remove('muted');
        }
    }
}

function updateVolumeDisplay() {
    if (volumeDisplay) volumeDisplay.textContent = Math.round(volume * 100) + '%';
    if (playerVolumeDisplay) playerVolumeDisplay.textContent = Math.round(volume * 100) + '%';
}

function updateProgress() {
    if (audio.duration && !isDragging) {
        const progress = (audio.currentTime / audio.duration) * 100;
        if (vodkaFill) vodkaFill.style.width = progress + '%';
        if (playerVodkaFill) playerVodkaFill.style.width = progress + '%';
        updateTimeDisplay();
    } else if (isDragging) {
        updateTimeDisplay();
    }
}

function updateTimeDisplay() {
    const current = formatTime(audio.currentTime || 0);
    const duration = formatTime(audio.duration || 0);
    if (timeDisplay) timeDisplay.textContent = `${current} / ${duration}`;
    if (playerTimeDisplay) playerTimeDisplay.textContent = `${current} / ${duration}`;
    if (playerTrackTime) playerTrackTime.textContent = duration;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function startProgress() {
    progressInterval = setInterval(updateProgress, 100);
}

function stopProgress() {
    clearInterval(progressInterval);
}

// Random visitor counter
function updateCounter() {
    document.getElementById('visitorCount').textContent = '1337';
    document.getElementById('todayCount').textContent = '228';
}

// Guestbook quotes with pagination
const quotes = [
    "Potatosh 30 июл\nxui",
    "niżnauu 27 фев\nсотку закидывай,лох",
    "Fiss 2 окт. 2024 г.\nЯ СОСАЛ",
    "woordalaka 18 сен. 2024 г.\nруская вата)",
    "Genghis Khan 2 сен. 2024 г.\nharosh",
    "Well 4 ноя. 2023 г.\nПосле хорошей игры я добавил его, потому что он казался классным парнем. Мы общались несколько месяцев мы стали хорошими друзьями. Много стеб, много отличных каток в доту и, самое главное, настоящая дружба. Я пригласил его в мой дом для вечеринки dota lan.",
    "Я оце булочкi я б між них і брбрбрб, а потім достав свого бананчика і крутив би їх як діджей, як говорив мій дід - рука",
    "Well 4 ноя. 2023 г.\nОн сказал, что придет, поэтому я с нетерпением ожидал встречи с ним в реальной жизни. Когда он приехал ко мне домой, он толкнул меня к стене и начал покусывать мое очко, я почувствовал, как его мягкий характер врезался в мою ногу. Я ударил его, а затем постучал. Оказывается, это был Алексей. Не верьте этому парню",
    "RATAN 18 апр. 2022 г.\nсамый ужасный человек,не заходи больше в эту игру",
    "малыш 11 апр. 2016 г.\nsobaka ebu4aya",
    "[XP]_IIpopok☭ 14 июн. 2015 г.\ngood player in CS GO, i have enjoy to play with him",
    "Атя-тя-тя-тяй 16 фев. 2015 г.\nТварь крысиная"
];

// Auto-scroll variables
let currentPage = 1;
const quotesPerPage = 4;
const totalPages = Math.ceil(quotes.length / quotesPerPage);
let autoScrollInterval;

// Display quotes for current page
function displayQuotes() {
    const quotesContainer = document.getElementById('quotesContainer');
    console.log('displayQuotes called, quotesContainer:', quotesContainer);
    console.log('currentPage:', currentPage, 'quotesPerPage:', quotesPerPage);
    
    if (!quotesContainer) {
        console.error('quotesContainer not found!');
        return;
    }
    
    const startIndex = (currentPage - 1) * quotesPerPage;
    const endIndex = startIndex + quotesPerPage;
    const pageQuotes = quotes.slice(startIndex, endIndex);
    
    console.log('startIndex:', startIndex, 'endIndex:', endIndex, 'pageQuotes:', pageQuotes);
    
    quotesContainer.innerHTML = '';
    
    pageQuotes.forEach((quote, index) => {
        const quoteDiv = document.createElement('div');
        quoteDiv.className = 'quote';
        quoteDiv.innerHTML = quote.replace(/\n/g, '<br>');
        quotesContainer.appendChild(quoteDiv);
    });
    
    updateScrollDots();
}

// Update scroll dots indicator
function updateScrollDots() {
    const scrollDots = document.getElementById('scrollDots');
    console.log('updateScrollDots called, scrollDots:', scrollDots);
    console.log('totalPages:', totalPages, 'currentPage:', currentPage);
    
    if (!scrollDots) {
        console.error('scrollDots not found!');
        return;
    }
    
    scrollDots.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const dot = document.createElement('div');
        dot.className = `scroll-dot ${i === currentPage ? 'active' : ''}`;
        dot.onclick = () => goToPage(i);
        scrollDots.appendChild(dot);
    }
}

// Go to specific page
function goToPage(page) {
    console.log('goToPage called with page:', page);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        console.log('Updated currentPage to:', currentPage);
        displayQuotes();
        
        // Add page transition effect
        const quotesContainer = document.getElementById('quotesContainer');
        if (quotesContainer) {
            quotesContainer.style.opacity = '0.3';
            quotesContainer.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                quotesContainer.style.opacity = '1';
                quotesContainer.style.transform = 'translateY(0)';
            }, 200);
        }
    } else {
        console.log('Invalid page number:', page);
    }
}

// Auto scroll to next page
function autoScrollNext() {
    console.log('autoScrollNext called, currentPage:', currentPage, 'totalPages:', totalPages);
    const nextPage = currentPage === totalPages ? 1 : currentPage + 1;
    console.log('Moving to nextPage:', nextPage);
    goToPage(nextPage);
}

// Start auto scroll
function startAutoScroll() {
    console.log('startAutoScroll called');
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
    }
    autoScrollInterval = setInterval(autoScrollNext, 5000); // 5 seconds
    console.log('Auto scroll started, interval:', autoScrollInterval);
}

// Stop auto scroll
function stopAutoScroll() {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
    }
}

// Legacy function for random quotes (kept for compatibility)
function rotateQuotes() {
    console.log('rotateQuotes called, currentPage:', currentPage);
    displayQuotes();
    // No auto scroll - manual control only
}

// Enhanced glitch effect on hover
function initGlitchEffect() {
    const glitchElement = document.querySelector('.glitch');
    if (glitchElement) {
        glitchElement.addEventListener('mouseenter', () => {
            glitchElement.style.animation = 'glitch 0.05s infinite';
        });
        
        glitchElement.addEventListener('mouseleave', () => {
            glitchElement.style.animation = 'glitch 0.4s infinite';
        });
    }
}

// Drag & Drop functions
function startVolumeDrag(e) {
    isDragging = true;
    dragType = 'volume';
    document.addEventListener('mousemove', handleVolumeDrag);
    document.addEventListener('mouseup', stopDrag);
    e.preventDefault();
}

function startProgressDrag(e) {
    if (audio.duration) {
        isDragging = true;
        dragType = 'progress';
        vodkaFill.classList.add('dragging');
        document.addEventListener('mousemove', handleProgressDrag);
        document.addEventListener('mouseup', stopDrag);
        e.preventDefault();
        e.stopPropagation();
    }
}

function handleVolumeDrag(e) {
    if (isDragging && dragType === 'volume') {
        const rect = volumeSlider.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const newVolume = Math.max(0, Math.min(1, clickX / rect.width));
        setVolume(newVolume);
    }
}

function handleProgressDrag(e) {
    if (isDragging && dragType === 'progress' && audio.duration) {
        const vodkaMeter = document.querySelector('.vodka-meter');
        if (vodkaMeter) {
            const rect = vodkaMeter.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newTime = (clickX / rect.width) * audio.duration;
            audio.currentTime = newTime;
            
            // Обновляем пиво напрямую во время перетаскивания
            const progress = (newTime / audio.duration) * 100;
            vodkaFill.style.width = progress + '%';
            updateTimeDisplay();
        }
    }
}

function stopDrag() {
    isDragging = false;
    dragType = null;
    vodkaFill.classList.remove('dragging');
    document.removeEventListener('mousemove', handleVolumeDrag);
    document.removeEventListener('mousemove', handleProgressDrag);
    document.removeEventListener('mouseup', stopDrag);
}

// Device Manager functionality
function initializeDeviceManager() {
    // Expand/collapse categories (including nested ones)
    document.querySelectorAll('.category-header').forEach(header => {
        header.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            const category = header.parentElement;
            const content = category.querySelector('.category-content');
            const icon = header.querySelector('.expand-icon');
            
            if (content.style.display === 'none' || content.style.display === '') {
                content.style.display = 'block';
                icon.textContent = '▼';
                category.classList.add('expanded');
            } else {
                content.style.display = 'none';
                icon.textContent = '▶';
                category.classList.remove('expanded');
            }
        });
    });
    
    // Device item interactions
    document.querySelectorAll('.device-item').forEach(item => {
        item.addEventListener('click', () => {
            // Remove previous selection
            document.querySelectorAll('.device-item').forEach(i => i.classList.remove('selected'));
            // Add selection to clicked item
            item.classList.add('selected');
        });
        
        item.addEventListener('dblclick', () => {
            // Simulate device properties dialog
            const deviceName = item.querySelector('.device-name').textContent;
            alert(`Свойства устройства: ${deviceName}\n\nСтатус: Работает нормально\nДрайвер: Обновлен\nВерсия: 1.0.0`);
        });
    });
    
    // Toolbar button interactions
    document.querySelectorAll('.toolbar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.getAttribute('title');
            switch(title) {
                case 'Обновить':
                    updateDeviceStatus();
                    break;
                case 'Сканировать':
                    scanForDevices();
                    break;
                case 'Свойства':
                    showSelectedDeviceProperties();
                    break;
                case 'Справка':
                    showHelp();
                    break;
            }
        });
    });
}

function updateDeviceStatus() {
    // Simulate device status update
    const statusBar = document.querySelector('.status-bar span');
    if (statusBar) {
        statusBar.textContent = 'Обновление устройств...';
        setTimeout(() => {
            statusBar.textContent = 'Устройства: 15 | Проблемы: 0 | Готов к работе';
        }, 1000);
    }
}

function scanForDevices() {
    // Simulate device scanning
    const statusBar = document.querySelector('.status-bar span');
    if (statusBar) {
        statusBar.textContent = 'Сканирование новых устройств...';
        setTimeout(() => {
            statusBar.textContent = 'Устройства: 15 | Проблемы: 0 | Готов к работе';
        }, 1500);
    }
}

function showSelectedDeviceProperties() {
    const selectedDevice = document.querySelector('.device-item.selected');
    if (selectedDevice) {
        const deviceName = selectedDevice.querySelector('.device-name').textContent;
        alert(`Свойства устройства: ${deviceName}\n\nСтатус: Работает нормально\nДрайвер: Обновлен\nВерсия: 1.0.0\nПроизводитель: Microsoft Corporation`);
    } else {
        alert('Выберите устройство для просмотра свойств');
    }
}

function showHelp() {
    alert('Диспетчер устройств\n\nЭтот инструмент позволяет просматривать и управлять устройствами, подключенными к компьютеру.\n\n• Кликните на категорию для разворачивания/сворачивания\n• Двойной клик на устройство для просмотра свойств\n• Используйте кнопки панели инструментов для различных действий');
}

// Device Manager window functions
function openDeviceManager() {
    const deviceManager = document.getElementById('deviceManagerWindow');
    if (deviceManager) {
        deviceManager.style.display = 'block';
        // Prevent body scroll when device manager is open
        document.body.style.overflow = 'hidden';
    }
}

function closeDeviceManager() {
    const deviceManager = document.getElementById('deviceManagerWindow');
    if (deviceManager) {
        deviceManager.style.display = 'none';
        // Restore body scroll
        document.body.style.overflow = 'auto';
    }
}

// Device Manager functions
let selectedDevice = null;

function toggleCategory(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('.expand-icon');
    
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        icon.textContent = '▼';
    } else {
        content.style.display = 'none';
        icon.textContent = '▶';
    }
}

function selectDevice(deviceItem) {
    // Remove previous selection
    const previousSelected = document.querySelector('.device-item.selected');
    if (previousSelected) {
        previousSelected.classList.remove('selected');
    }
    
    // Select new device
    deviceItem.classList.add('selected');
    selectedDevice = deviceItem;
}

function showDeviceProperties(deviceItem) {
    const deviceName = deviceItem.querySelector('.device-name').textContent;
    alert(`Свойства устройства:\n\n${deviceName}\n\nСостояние: Работает нормально\nДрайвер: Установлен\nВерсия: 1.0.0`);
}

// Toolbar functions
function updateDevices() {
    alert('Обновление конфигурации оборудования...\n\nПоиск новых устройств...\nГотово!');
}

function scanDevices() {
    alert('Сканирование изменений оборудования...\n\nНайдено 0 новых устройств');
}

function showProperties() {
    if (selectedDevice) {
        showDeviceProperties(selectedDevice);
    } else {
        alert('Выберите устройство для просмотра свойств');
    }
}

function showHelp() {
    alert('Диспетчер устройств\n\n• Кликните на категорию для разворачивания\n• Выберите устройство для просмотра свойств\n• Двойной клик для быстрого доступа к свойствам');
}

// Menu functions
function showMenu(menuType) {
    // Hide all menus first
    hideMenu();
    
    // Show the selected menu
    const menu = document.getElementById(menuType + 'Menu');
    if (menu) {
        menu.style.display = 'block';
    }
    
    // Prevent event bubbling
    event.stopPropagation();
}

function hideMenu() {
    const menus = document.querySelectorAll('.dropdown-menu');
    menus.forEach(menu => {
        menu.style.display = 'none';
    });
}

function setView(viewType) {
    hideMenu();
    alert(`Режим просмотра изменен на: ${viewType}`);
}

function closeWindow() {
    hideMenu();
    alert('Закрытие диспетчера устройств...');
}

function showHelpContent() {
    hideMenu();
    alert('Содержание справки:\n\n• Обзор диспетчера устройств\n• Управление устройствами\n• Устранение неполадок');
}

function showHelpSearch() {
    hideMenu();
    alert('Поиск в справке:\n\nВведите ключевые слова для поиска...');
}

function showAbout() {
    hideMenu();
    alert('О программе\n\nДиспетчер устройств\nВерсия 1.0\n\n© 2024 Siskablade Gaming');
}

// Desktop icon functions


// Export functions for potential external use
window.RussianGaming = {
    updateCounter,
    rotateQuotes,
    initGlitchEffect,
    loadTrack,
    play,
    pause,
    stop,
    nextTrack,
    previousTrack,
    setVolume,
    toggleCategory,
    selectDevice,
    showDeviceProperties,
    updateDevices,
    scanDevices,
    showProperties,
    showHelp,
    showMenu,
    hideMenu,
    setView,
    closeWindow,
    showHelpContent,
    showHelpSearch,
    showAbout,
    openSteam
};

// Explicit global assignment
window.openSteam = openSteam;

// Debug: Test if functions are available
console.log('openSteam function available:', typeof window.openSteam);

// Taskbar functionality
let startMenuOpen = false;

function toggleStartMenu() {
    const startMenu = document.getElementById('startMenu');
    if (startMenuOpen) {
        startMenu.style.display = 'none';
        startMenuOpen = false;
    } else {
        startMenu.style.display = 'block';
        startMenuOpen = true;
    }
}

function shutdown() {
    if (confirm('Вы действительно хотите завершить работу?')) {
        alert('Система завершает работу...');
        // В реальном приложении здесь была бы логика выключения
    }
}

// Clock functionality
function updateClock() {
    const now = new Date();
    const timeElement = document.getElementById('taskbarTime');
    const dateElement = document.getElementById('taskbarDate');
    
    if (timeElement) {
        const time = now.toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
        timeElement.textContent = time;
    }
    
    if (dateElement) {
        const date = now.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        dateElement.textContent = date;
    }
}

// Update clock every second
setInterval(updateClock, 1000);
updateClock(); // Initial update

// Close start menu when clicking outside
document.addEventListener('click', function(event) {
    const startMenu = document.getElementById('startMenu');
    const startButton = document.querySelector('.start-button');
    
    if (startMenuOpen && 
        !startMenu.contains(event.target) && 
        !startButton.contains(event.target)) {
        startMenu.style.display = 'none';
        startMenuOpen = false;
    }
    
    // Close dropdown menus when clicking outside
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    const menuItems = document.querySelectorAll('.menu-item');
    
    let isMenuClick = false;
    menuItems.forEach(item => {
        if (item.contains(event.target)) {
            isMenuClick = true;
        }
    });
    
    if (!isMenuClick) {
        hideMenu();
    }
});

// Shutdown functions
function showShutdownDialog() {
    const dialog = document.getElementById('shutdownDialog');
    dialog.style.display = 'flex';
}

function hideShutdownDialog() {
    const dialog = document.getElementById('shutdownDialog');
    dialog.style.display = 'none';
}

function confirmShutdown() {
    hideShutdownDialog();
    startShutdownSequence();
}

function startShutdownSequence() {
    const shutdownScreen = document.getElementById('shutdownScreen');
    shutdownScreen.style.display = 'flex';
    
    // Animate progress bar
    const progressBar = document.getElementById('shutdownProgress');
    let progress = 0;
    
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        progressBar.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                shutdownScreen.style.display = 'none';
                showBootScreen();
            }, 1000);
        }
    }, 200);
}

function showBootScreen() {
    const bootScreen = document.getElementById('bootScreen');
    bootScreen.style.display = 'flex';
}

function powerOn() {
    console.log('Power button clicked!');
    const bootScreen = document.getElementById('bootScreen');
    if (bootScreen) {
        bootScreen.style.display = 'none';
        console.log('Hiding power button screen');
    }
    
    // Show boot sequence first, then show content
    document.body.classList.add('booting');
    showInitialBootScreen();
    startRetroBootSequence();
}

// Initial boot screen functions
function showInitialBootScreen() {
    const bootScreen = document.getElementById('initialBootScreen');
    bootScreen.style.display = 'flex';
}

function hideInitialBootScreen() {
    const bootScreen = document.getElementById('initialBootScreen');
    bootScreen.style.display = 'none';
}

// Retro boot sequence with typewriter effect
function startRetroBootSequence() {
    const consoleLines = [
        { id: 'console1', delay: 500, class: 'success', progress: 7 },
        { id: 'console2', delay: 1000, class: 'success', progress: 14 },
        { id: 'console3', delay: 1500, class: 'success', progress: 21 },
        { id: 'console4', delay: 2000, class: 'success', progress: 28 },
        { id: 'console5', delay: 2500, class: 'success', progress: 35 },
        { id: 'console6', delay: 3000, class: 'warning', progress: 42 },
        { id: 'console7', delay: 3500, class: 'success', progress: 49 },
        { id: 'console8', delay: 4000, class: 'success', progress: 56 },
        { id: 'console9', delay: 4500, class: 'success', progress: 63 },
        { id: 'console10', delay: 5000, class: 'success', progress: 70 },
        { id: 'console11', delay: 5500, class: 'warning', progress: 77 },
        { id: 'console12', delay: 6000, class: 'success', progress: 84 },
        { id: 'console13', delay: 6500, class: 'success', progress: 91 },
        { id: 'console14', delay: 7000, class: 'success', progress: 100 }
    ];
    
    let currentProgress = 0;
    const progressBar = document.getElementById('bootProgress');
    const progressPercent = document.getElementById('bootPercent');
    
    // Show console lines with typewriter effect and sync with progress
    consoleLines.forEach((line, index) => {
        setTimeout(() => {
            const element = document.getElementById(line.id);
            if (element) {
                element.classList.add(line.class);
                element.style.animationDelay = '0s';
                element.style.animation = 'typewriter 0.8s ease forwards';
            }
            
            // Update progress to match the line with smooth animation
            currentProgress = line.progress;
            if (progressBar) {
                progressBar.style.width = currentProgress + '%';
            }
            if (progressPercent) {
                progressPercent.textContent = currentProgress + '%';
            }
            
            // Complete boot sequence when last line is shown
            if (index === consoleLines.length - 1) {
                setTimeout(() => {
                    completeBootSequence();
                }, 1500); // Increased delay to allow progress bar to finish animating
            }
        }, line.delay);
    });
}

function initializeAllSystems() {
    // Initialize all systems
    initializeAudioPlayer();
    updateCounter();
    rotateQuotes();
    initGlitchEffect();
    
    // Debug: Check if game elements exist
    console.log('Game window exists:', !!document.getElementById('miniGame'));
    console.log('Game canvas exists:', !!document.getElementById('gameCanvas'));
    console.log('Score element exists:', !!document.getElementById('score'));
    console.log('quotesContainer exists:', !!document.getElementById('quotesContainer'));
    console.log('scrollDots exists:', !!document.getElementById('scrollDots'));
    
    // Update counter every 30 seconds
    setInterval(updateCounter, 30000);
    
    // Initialize Device Manager
    initializeDeviceManager();
}

function completeBootSequence() {
    // Initialize all systems
    initializeAllSystems();
    
    // Hide boot screen and show content
    hideInitialBootScreen();
    document.body.classList.remove('booting');
}

// Music player function
function openMusicPlayer() {
    const musicPlayer = document.getElementById('musicPlayer');
    if (musicPlayer) {
        musicPlayer.style.display = 'block';
    }
}

// Make functions globally available
window.toggleStartMenu = toggleStartMenu;
window.shutdown = shutdown;
window.openMusicPlayer = openMusicPlayer;