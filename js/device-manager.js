// Device Manager JavaScript

let selectedDevice = null;
let currentView = 'type'; // type, connection, container, resources

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeDeviceManager();
});

function initializeDeviceManager() {
    // Close any open menus when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.menu-item') && !e.target.closest('.dropdown-menu')) {
            closeAllMenus();
        }
    });
}

// Menu functions
function showMenu(menuType) {
    closeAllMenus();
    const menu = document.getElementById(menuType + 'Menu');
    if (menu) {
        menu.style.display = 'block';
        menu.style.left = '0px';
        menu.style.top = '30px';
    }
}

function closeAllMenus() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.style.display = 'none';
    });
}

// Device category functions
function toggleCategory(header) {
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
}

// Device selection
function selectDevice(item) {
    // Remove previous selection
    document.querySelectorAll('.device-item').forEach(i => i.classList.remove('selected'));
    // Add selection to clicked item
    item.classList.add('selected');
    selectedDevice = item;
}

// Device properties
function showDeviceProperties(item) {
    const deviceName = item.querySelector('.device-name').textContent;
    const deviceIcon = item.querySelector('.device-icon').textContent;
    
    alert(`Свойства устройства: ${deviceName}\n\n${deviceIcon} Статус: Работает нормально\nДрайвер: Обновлен\nВерсия: 1.0.0\nПроизводитель: Microsoft Corporation\n\nНажмите OK для закрытия`);
}

// Toolbar functions
function updateDevices() {
    updateStatus('Обновление устройств...');
    setTimeout(() => {
        updateStatus('Устройства: 15 | Проблемы: 0 | Готов к работе');
    }, 1000);
}

function scanDevices() {
    updateStatus('Сканирование новых устройств...');
    setTimeout(() => {
        updateStatus('Устройства: 15 | Проблемы: 0 | Готов к работе');
    }, 1500);
}

function showProperties() {
    if (selectedDevice) {
        showDeviceProperties(selectedDevice);
    } else {
        alert('Выберите устройство для просмотра свойств');
    }
}

function showHelp() {
    alert('Диспетчер устройств\n\nЭтот инструмент позволяет просматривать и управлять устройствами, подключенными к компьютеру.\n\n• Кликните на категорию для разворачивания/сворачивания\n• Двойной клик на устройство для просмотра свойств\n• Используйте кнопки панели инструментов для различных действий\n• Меню "Вид" позволяет изменить способ отображения устройств');
}

// View menu functions
function changeView(viewType) {
    currentView = viewType;
    
    // Update menu selection
    document.querySelectorAll('#viewMenu .menu-option').forEach(option => {
        option.classList.remove('selected');
        option.textContent = option.textContent.replace('• ', '');
    });
    
    // Add selection to clicked option
    event.target.classList.add('selected');
    event.target.textContent = '• ' + event.target.textContent;
    
    // Update status
    updateStatus(`Режим просмотра изменен на: ${getViewName(viewType)}`);
}

function getViewName(viewType) {
    const names = {
        'type': 'Устройства по типу',
        'connection': 'Устройства по подключению',
        'container': 'Устройства по контейнеру',
        'resources': 'Ресурсы по типу'
    };
    return names[viewType] || 'Неизвестный режим';
}

// Status bar functions
function updateStatus(text) {
    const statusBar = document.getElementById('statusText');
    if (statusBar) {
        statusBar.textContent = text;
    }
}

// Window functions
function closeWindow() {
    if (confirm('Закрыть диспетчер устройств?')) {
        window.close();
    }
}

// Menu option handlers
document.addEventListener('DOMContentLoaded', function() {
    // View menu options
    document.querySelectorAll('#viewMenu .menu-option').forEach(option => {
        option.addEventListener('click', function() {
            const text = this.textContent.replace('• ', '');
            switch(text) {
                case 'Устройства по типу':
                    changeView('type');
                    break;
                case 'Устройства по подключению':
                    changeView('connection');
                    break;
                case 'Устройства по контейнеру':
                    changeView('container');
                    break;
                case 'Ресурсы по типу':
                    changeView('resources');
                    break;
                case 'Ресурсы по подключению':
                    changeView('resources');
                    break;
                case 'Показать скрытые устройства':
                    toggleHiddenDevices();
                    break;
                case 'Настроить...':
                    showCustomizeDialog();
                    break;
            }
            closeAllMenus();
        });
    });
    
    // File menu options
    document.querySelectorAll('#fileMenu .menu-option').forEach(option => {
        option.addEventListener('click', function() {
            const text = this.textContent;
            switch(text) {
                case 'Обновить':
                    updateDevices();
                    break;
                case 'Сканировать изменения оборудования':
                    scanDevices();
                    break;
                case 'Выход':
                    closeWindow();
                    break;
            }
            closeAllMenus();
        });
    });
    
    // Action menu options
    document.querySelectorAll('#actionMenu .menu-option').forEach(option => {
        option.addEventListener('click', function() {
            const text = this.textContent;
            switch(text) {
                case 'Обновить':
                    updateDevices();
                    break;
                case 'Сканировать изменения оборудования':
                    scanDevices();
                    break;
                case 'Удалить':
                    if (selectedDevice) {
                        if (confirm('Удалить выбранное устройство?')) {
                            selectedDevice.remove();
                            selectedDevice = null;
                            updateStatus('Устройство удалено');
                        }
                    } else {
                        alert('Выберите устройство для удаления');
                    }
                    break;
                case 'Отключить':
                    if (selectedDevice) {
                        if (confirm('Отключить выбранное устройство?')) {
                            selectedDevice.querySelector('.device-status').textContent = '✗';
                            selectedDevice.querySelector('.device-status').style.color = 'var(--red)';
                            selectedDevice.style.opacity = '0.5';
                            updateStatus('Устройство отключено');
                        }
                    } else {
                        alert('Выберите устройство для отключения');
                    }
                    break;
                case 'Свойства':
                    showProperties();
                    break;
            }
            closeAllMenus();
        });
    });
    
    // Help menu options
    document.querySelectorAll('#helpMenu .menu-option').forEach(option => {
        option.addEventListener('click', function() {
            const text = this.textContent;
            switch(text) {
                case 'Содержание':
                    showHelp();
                    break;
                case 'Поиск по справке':
                    alert('Функция поиска по справке не реализована');
                    break;
                case 'О программе':
                    alert('Диспетчер устройств v1.0\n\nСоздано для Siskablade\nВ стиле Windows 98\n\n© 2024 Russian Gaming');
                    break;
            }
            closeAllMenus();
        });
    });
});

function toggleHiddenDevices() {
    updateStatus('Переключение отображения скрытых устройств...');
    setTimeout(() => {
        updateStatus('Устройства: 15 | Проблемы: 0 | Готов к работе | Скрытые устройства: показаны');
    }, 500);
}

function showCustomizeDialog() {
    alert('Настройка диспетчера устройств\n\n• Изменить размер шрифта\n• Показать/скрыть панель инструментов\n• Настроить цвета\n• Изменить иконки\n\nФункция в разработке...');
}
