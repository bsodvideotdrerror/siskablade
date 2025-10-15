// System Info JavaScript
let systemData = {
    os: 'Microsoft Windows 98',
    version: '4.10.1998',
    build: '1998',
    cpu: 'Intel Core i5-12400F @ 2.50GHz',
    cores: '6 cores, 12 threads',
    ram: '16 GB DDR4-3200',
    gpu: 'NVIDIA GeForce RTX 5060 Ti 16GB',
    storage: [
        'SSD M.2 1TB (C:)',
        'SSD SATA 750GB (D:)',
        'HDD 3TB (E:)'
    ],
    network: 'Ethernet 1000 Mbps',
    audio: 'HyperX Gaming Headset',
    keyboard: 'UGREEN KU102 Slim Mechanical',
    mouse: 'Logitech G Pro X',
    monitors: [
        'Xiaomi 27" 1920x1080 @ 180Hz',
        'Philips 24" 2560x1440 @ 60Hz',
        'SberTV 55" 3840x2160 @ 60Hz'
    ],
    psu: 'Cougar 750W 80+ Gold',
    motherboard: 'ASUS PRIME B660M-A',
    bios: 'American Megatrends Inc. 2803'
};

// System Info Functions
function openSystemInfo() {
    const systemWindow = document.getElementById('systemInfo');
    if (systemWindow) {
        systemWindow.style.display = 'block';
        // Ensure window is visible and on top
        systemWindow.style.position = 'fixed';
        systemWindow.style.left = '160px';
        systemWindow.style.top = '160px';
        systemWindow.style.zIndex = '1002';
        initSystemInfo();
    }
}

function closeSystemInfo() {
    const systemWindow = document.getElementById('systemInfo');
    if (systemWindow) {
        systemWindow.style.display = 'none';
    }
}

function initSystemInfo() {
    updateSystemDisplay();
    startSystemClock();
}

function updateSystemDisplay() {
    // Update basic system info
    updateSystemProperty('os-version', `${systemData.os} ${systemData.version}`);
    updateSystemProperty('cpu-info', systemData.cpu);
    updateSystemProperty('cpu-cores', systemData.cores);
    updateSystemProperty('ram-info', systemData.ram);
    updateSystemProperty('gpu-info', systemData.gpu);
    updateSystemProperty('network-info', systemData.network);
    updateSystemProperty('audio-info', systemData.audio);
    updateSystemProperty('keyboard-info', systemData.keyboard);
    updateSystemProperty('mouse-info', systemData.mouse);
    updateSystemProperty('psu-info', systemData.psu);
    updateSystemProperty('motherboard-info', systemData.motherboard);
    updateSystemProperty('bios-info', systemData.bios);
    
    // Update storage devices
    updateStorageList();
    
    // Update monitors
    updateMonitorList();
    
    // Update system resources
    updateSystemResources();
}

function updateSystemProperty(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function updateStorageList() {
    const storageList = document.getElementById('storageList');
    if (!storageList) return;
    
    storageList.innerHTML = '';
    systemData.storage.forEach((device, index) => {
        const item = document.createElement('div');
        item.className = 'system-item';
        item.innerHTML = `
            <div class="device-icon">💾</div>
            <div class="device-info">
                <div class="device-name">${device}</div>
                <div class="device-status">✓ Работает</div>
            </div>
        `;
        storageList.appendChild(item);
    });
}

function updateMonitorList() {
    const monitorList = document.getElementById('monitorList');
    if (!monitorList) return;
    
    monitorList.innerHTML = '';
    systemData.monitors.forEach((monitor, index) => {
        const item = document.createElement('div');
        item.className = 'system-item';
        item.innerHTML = `
            <div class="device-icon">🖥️</div>
            <div class="device-info">
                <div class="device-name">${monitor}</div>
                <div class="device-status">✓ Активен</div>
            </div>
        `;
        monitorList.appendChild(item);
    });
}

function updateSystemResources() {
    // Simulate system resource usage
    const cpuUsage = Math.floor(Math.random() * 30) + 10; // 10-40%
    const ramUsage = Math.floor(Math.random() * 20) + 60; // 60-80%
    const diskUsage = Math.floor(Math.random() * 15) + 45; // 45-60%
    
    updateSystemProperty('cpu-usage', `${cpuUsage}%`);
    updateSystemProperty('ram-usage', `${ramUsage}%`);
    updateSystemProperty('disk-usage', `${diskUsage}%`);
    
    // Update progress bars
    updateProgressBar('cpu-progress', cpuUsage);
    updateProgressBar('ram-progress', ramUsage);
    updateProgressBar('disk-progress', diskUsage);
}

function updateProgressBar(id, percentage) {
    const progressBar = document.getElementById(id);
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
        
        // Change color based on usage
        if (percentage > 80) {
            progressBar.style.backgroundColor = '#ff4444';
        } else if (percentage > 60) {
            progressBar.style.backgroundColor = '#ffaa44';
        } else {
            progressBar.style.backgroundColor = '#44ff44';
        }
    }
}

function startSystemClock() {
    updateSystemClock();
    setInterval(updateSystemClock, 1000);
}

function updateSystemClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ru-RU');
    const dateString = now.toLocaleDateString('ru-RU');
    
    updateSystemProperty('system-time', timeString);
    updateSystemProperty('system-date', dateString);
}

function refreshSystemInfo() {
    updateSystemResources();
    console.log('System information refreshed');
}

function showSystemProperties() {
    alert(`Свойства системы:\n\n${systemData.os} ${systemData.version}\nПроцессор: ${systemData.cpu}\nПамять: ${systemData.ram}\nВидеокарта: ${systemData.gpu}`);
}

// Export functions to global scope
window.openSystemInfo = openSystemInfo;
window.closeSystemInfo = closeSystemInfo;
window.refreshSystemInfo = refreshSystemInfo;
window.showSystemProperties = showSystemProperties;

// Debug: Test if functions are available
console.log('System info functions loaded:', {
    openSystemInfo: typeof window.openSystemInfo,
    closeSystemInfo: typeof window.closeSystemInfo,
    refreshSystemInfo: typeof window.refreshSystemInfo
});
