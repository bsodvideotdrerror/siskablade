// System Window JavaScript
let isSystemWindowDragging = false;
let systemWindowDragOffset = { x: 0, y: 0 };

// History data arrays
let cpuHistory = [];
let memoryHistory = [];

// System Window Functions
function openSystemWindow() {
    const systemWindow = document.getElementById('systemInfo');
    if (systemWindow) {
        systemWindow.style.display = 'block';
        systemWindow.style.position = 'fixed';
        systemWindow.style.left = '160px';
        systemWindow.style.top = '160px';
        systemWindow.style.zIndex = '1002';
        systemWindow.style.width = '500px';
        systemWindow.style.height = '400px';
        
        // Initialize system data
        initSystemData();
        
        // Initialize window dragging
        initSystemWindowDragging();
        
        console.log('System window opened');
    } else {
        console.error('System window element not found');
    }
}

function closeSystemWindow() {
    const systemWindow = document.getElementById('systemInfo');
    if (systemWindow) {
        systemWindow.style.display = 'none';
        console.log('System window closed');
    }
}

function initSystemData() {
    // Initialize system information display
    updateSystemDisplay();
    startSystemClock();
}

function updateSystemDisplay() {
    // Update basic system info
    updateSystemProperty('os-version', 'Microsoft Windows 98 4.10.1998');
    updateSystemProperty('cpu-info', 'Intel Core i5-12400F @ 2.50GHz');
    updateSystemProperty('cpu-cores', '6 cores, 12 threads');
    updateSystemProperty('ram-info', '16 GB DDR4-3200');
    updateSystemProperty('gpu-info', 'NVIDIA GeForce RTX 5060 Ti 16GB');
    updateSystemProperty('network-info', 'Ethernet 1000 Mbps');
    updateSystemProperty('audio-info', 'HyperX Gaming Headset');
    updateSystemProperty('keyboard-info', 'UGREEN KU102 Slim Mechanical');
    updateSystemProperty('mouse-info', 'Logitech G Pro X');
    updateSystemProperty('psu-info', 'Cougar 750W 80+ Gold');
    updateSystemProperty('motherboard-info', 'ASUS PRIME B660M-A');
    updateSystemProperty('bios-info', 'American Megatrends Inc. 2803');
    
    // Update Steam info
    updateSteamInfo();
    
    // Update storage devices
    updateStorageList();
    
    // Update monitors
    updateMonitorList();
    
    // Update system resources
    updateSystemResources();
}

function updateSteamInfo() {
    updateSystemProperty('steam-version', '2.0.98 (Build 2024.12.15)');
    updateSystemProperty('epic-version', 'Launcher 1.2.3 (Build 2024.11.28)');
    updateSystemProperty('rockstar-version', 'Launcher 2.0.7.4 (Build 2024.12.01)');
    updateSystemProperty('ethernet-status', '✓ Подключен (1000 Мбит/с)');
    updateSystemProperty('wifi-status', '✗ Отключен');
    updateSystemProperty('bluetooth-status', '✓ Активен');
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
    
    const storageDevices = [
        'SSD M.2 1TB (C:)',
        'SSD SATA 750GB (D:)',
        'HDD 3TB (E:)'
    ];
    
    storageList.innerHTML = '';
    storageDevices.forEach((device, index) => {
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
    
    const monitors = [
        'Xiaomi 27" 1920x1080 @ 180Hz',
        'Philips 24" 2560x1440 @ 60Hz',
        'SberTV 55" 3840x2160 @ 60Hz'
    ];
    
    monitorList.innerHTML = '';
    monitors.forEach((monitor, index) => {
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
    
    // Update CPU bar
    updateCpuBar(cpuUsage);
    
    // Update Memory bar
    updateMemoryBar(ramUsage);
    
    // Update history graphs
    updateCpuHistory(cpuUsage);
    updateMemoryHistory(ramUsage);
    
    // Update system stats
    updateSystemStats();
    
    // Update graphics stats
    updateGraphicsStats();
    
    // Update network stats
    updateNetworkStats();
}

function updateCpuBar(percentage) {
    const segments = document.getElementById('cpu-segments');
    const percentageDisplay = document.getElementById('cpu-percentage');
    
    if (segments && percentageDisplay) {
        segments.innerHTML = '';
        percentageDisplay.textContent = `${percentage}%`;
        
        const activeSegments = Math.floor((percentage / 100) * 60);
        
        for (let i = 0; i < 60; i++) {
            const segment = document.createElement('div');
            segment.className = 'cpu-segment';
            if (i < activeSegments) {
                segment.classList.add('active');
            }
            segments.appendChild(segment);
        }
    }
}

function updateMemoryBar(percentage) {
    const segments = document.getElementById('memory-segments');
    const usageDisplay = document.getElementById('memory-usage');
    
    if (segments && usageDisplay) {
        segments.innerHTML = '';
        const memoryMB = Math.floor((percentage / 100) * 16384);
        usageDisplay.textContent = `${memoryMB} МБ`;
        
        const activeSegments = Math.floor((percentage / 100) * 60);
        
        for (let i = 0; i < 60; i++) {
            const segment = document.createElement('div');
            segment.className = 'memory-segment';
            if (i < activeSegments) {
                segment.classList.add('active');
            }
            segments.appendChild(segment);
        }
    }
}

function updateSystemStats() {
    // Update physical memory
    updateSystemProperty('total-memory', '16384');
    updateSystemProperty('cached-memory', Math.floor(Math.random() * 2000) + 6000);
    updateSystemProperty('available-memory', Math.floor(Math.random() * 1000) + 3000);
    updateSystemProperty('free-memory', Math.floor(Math.random() * 500) + 1500);
    
    // Update kernel memory
    updateSystemProperty('paged-memory', Math.floor(Math.random() * 50) + 200);
    updateSystemProperty('nonpaged-memory', Math.floor(Math.random() * 20) + 100);
    
    // Update system stats
    updateSystemProperty('handles', Math.floor(Math.random() * 2000) + 10000);
    updateSystemProperty('threads', Math.floor(Math.random() * 100) + 400);
    updateSystemProperty('processes', Math.floor(Math.random() * 20) + 80);
    
    // Update uptime
    const uptime = getUptime();
    updateSystemProperty('uptime', uptime);
    
    // Update committed memory
    const committed = Math.floor(Math.random() * 2000) + 7000;
    updateSystemProperty('committed', `${committed} / 16384`);
}

function updateGraphicsStats() {
    const gpuUsage = Math.floor(Math.random() * 20) + 5;
    const vramUsed = Math.floor(Math.random() * 4000) + 1000;
    const temp = Math.floor(Math.random() * 15) + 40;
    const clock = Math.floor(Math.random() * 200) + 1700;
    
    updateSystemProperty('gpu-usage', `${gpuUsage}%`);
    updateSystemProperty('vram-usage', `${vramUsed} / 16384 МБ`);
    updateSystemProperty('gpu-temp', `${temp}°C`);
    updateSystemProperty('gpu-clock', `${clock} МГц`);
}

function updateNetworkStats() {
    const sent = (Math.random() * 2 + 1).toFixed(1);
    const received = (Math.random() * 3 + 2).toFixed(1);
    const ping = Math.floor(Math.random() * 20) + 5;
    
    updateSystemProperty('bytes-sent', `${sent} ГБ`);
    updateSystemProperty('bytes-received', `${received} ГБ`);
    updateSystemProperty('ping', `${ping} мс`);
}

function getUptime() {
    const startTime = new Date(Date.now() - Math.random() * 86400000); // Random time in last 24h
    const now = new Date();
    const diff = now - startTime;
    
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateCpuHistory(percentage) {
    // Add new data point
    cpuHistory.push(percentage);
    
    // Keep only last 50 points
    if (cpuHistory.length > 50) {
        cpuHistory.shift();
    }
    
    // Draw history graph
    drawHistoryGraph('cpu-history-points', cpuHistory, '#00ff00');
}

function updateMemoryHistory(percentage) {
    // Add new data point
    memoryHistory.push(percentage);
    
    // Keep only last 50 points
    if (memoryHistory.length > 50) {
        memoryHistory.shift();
    }
    
    // Draw history graph
    drawHistoryGraph('memory-history-points', memoryHistory, '#0000ff');
}

function drawHistoryGraph(containerId, data, color) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (data.length < 2) return;
    
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    // Create SVG for the graph
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    
    // Create path for the line
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '2');
    
    // Generate path data
    let pathData = '';
    for (let i = 0; i < data.length; i++) {
        const x = (i / (data.length - 1)) * width;
        const y = height - (data[i] / 100) * height;
        
        if (i === 0) {
            pathData += `M ${x} ${y}`;
        } else {
            pathData += ` L ${x} ${y}`;
        }
    }
    
    path.setAttribute('d', pathData);
    svg.appendChild(path);
    
    // Add some points for better visibility
    for (let i = 0; i < data.length; i += 5) {
        const x = (i / (data.length - 1)) * width;
        const y = height - (data[i] / 100) * height;
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '1');
        circle.setAttribute('fill', color);
        svg.appendChild(circle);
    }
    
    container.appendChild(svg);
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
    
    // Start performance monitor updates
    setInterval(updateSystemResources, 2000);
}

function updateSystemClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ru-RU');
    const dateString = now.toLocaleDateString('ru-RU');
    
    updateSystemProperty('system-time', timeString);
    updateSystemProperty('system-date', dateString);
}

function showTab(tabName, button) {
    console.log('Switching to tab:', tabName);
    
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        console.log('Hiding tab:', tab.id);
    });
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        console.log('Removing active from button:', btn.textContent);
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
        console.log('Showing tab:', selectedTab.id);
    } else {
        console.error('Tab not found:', tabName + 'Tab');
    }
    
    // Add active class to clicked button
    if (button) {
        button.classList.add('active');
        console.log('Activating button:', button.textContent);
    }
}

// Window dragging functionality
function initSystemWindowDragging() {
    const systemWindow = document.getElementById('systemInfo');
    const windowHeader = systemWindow.querySelector('.system-info-header');
    
    if (windowHeader) {
        windowHeader.addEventListener('mousedown', startSystemDrag);
        windowHeader.style.cursor = 'move';
    }
    
    document.addEventListener('mousemove', systemWindowDrag);
    document.addEventListener('mouseup', stopSystemWindowDrag);
}

function startSystemDrag(e) {
    const systemWindow = document.getElementById('systemInfo');
    isSystemWindowDragging = true;
    
    const rect = systemWindow.getBoundingClientRect();
    systemWindowDragOffset.x = e.clientX - rect.left;
    systemWindowDragOffset.y = e.clientY - rect.top;
    
    systemWindow.style.position = 'fixed';
    systemWindow.style.left = rect.left + 'px';
    systemWindow.style.top = rect.top + 'px';
    systemWindow.style.zIndex = '1003';
    systemWindow.classList.add('dragging');
    e.preventDefault();
}

function systemWindowDrag(e) {
    if (!isSystemWindowDragging) return;
    
    const systemWindow = document.getElementById('systemInfo');
    const x = e.clientX - systemWindowDragOffset.x;
    const y = e.clientY - systemWindowDragOffset.y;
    
    const maxX = window.innerWidth - systemWindow.offsetWidth;
    const maxY = window.innerHeight - systemWindow.offsetHeight;
    
    systemWindow.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
    systemWindow.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
}

function stopSystemWindowDrag() {
    if (isSystemWindowDragging) {
        const systemWindow = document.getElementById('systemInfo');
        systemWindow.classList.remove('dragging');
        isSystemWindowDragging = false;
    }
}

// Export functions to global scope
window.openSystemWindow = openSystemWindow;
window.closeSystemWindow = closeSystemWindow;
window.showTab = showTab;

// Also export as openSystemInfo for compatibility
window.openSystemInfo = openSystemWindow;
window.closeSystemInfo = closeSystemWindow;

// Debug: Test if functions are available
console.log('System window functions loaded:', {
    openSystemWindow: typeof window.openSystemWindow,
    closeSystemWindow: typeof window.closeSystemWindow,
    showTab: typeof window.showTab
});
