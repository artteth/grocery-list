// Default grocery data template
const defaultGroceryData = [
    {
        category: "Молочные продукты",
        icon: "🥛",
        items: [
            { id: 1, name: "Молоко", icon: "🥛", need: true },
            { id: 2, name: "Яйца", icon: "🥚", need: true },
            { id: 3, name: "Сыр", icon: "🧀", need: false },
            { id: 4, name: "Масло сливочное", icon: "🧈", need: true }
        ]
    },
    {
        category: "Овощи и фрукты",
        icon: "🥬",
        items: [
            { id: 5, name: "Яблоки", icon: "🍎", need: false },
            { id: 6, name: "Бананы", icon: "🍌", need: true },
            { id: 7, name: "Помидоры", icon: "🍅", need: true },
            { id: 8, name: "Огурцы", icon: "🥒", need: false }
        ]
    },
    {
        category: "Мясо и рыба",
        icon: "🥩",
        items: [
            { id: 9, name: "Курица", icon: "🍗", need: true },
            { id: 10, name: "Рыба", icon: "🐟", need: false },
            { id: 11, name: "Фарш", icon: "🥩", need: true }
        ]
    },
    {
        category: "Бакалея",
        icon: "🍞",
        items: [
            { id: 12, name: "Хлеб", icon: "🍞", need: true },
            { id: 13, name: "Рис", icon: "🍚", need: false },
            { id: 14, name: "Макароны", icon: "🍝", need: false },
            { id: 15, name: "Картофель", icon: "🥔", need: true }
        ]
    },
    {
        category: "Напитки",
        icon: "☕",
        items: [
            { id: 16, name: "Кофе", icon: "☕", need: false },
            { id: 17, name: "Чай", icon: "🍵", need: false },
            { id: 18, name: "Сок", icon: "🧃", need: true }
        ]
    }
];

let groceryData = [];
let currentTab = 'all';
let db = null;
let isFirebaseInitialized = false;
let isEditMode = false;
let draggedItemId = null;
let touchStartY = 0;
let touchElement = null;
let pendingDeleteItems = {};
let isPendingDeleteMode = false;
let dragClone = null;
let autoScrollInterval = null;
let pendingDeleteCategory = null;
let isSaving = false;

// Pre-configured Firebase settings
const preConfiguredFirebase = {
    apiKey: "AIzaSyDXdQAqgdbVASNUIIXykvvQD61g6262Uztm8",
    authDomain: "food-bot-8cb9c.firebaseapp.com",
    projectId: "food-bot-8cb9c",
    storageBucket: "food-bot-8cb9c.firebasestorage.app",
    messagingSenderId: "353425559275",
    appId: "1:353425559275:web:ec33211ab9494f700e38ae"
};

// Check for saved Firebase config
function checkFirebaseConfig() {
    const savedConfig = localStorage.getItem('firebaseConfig');
    if (savedConfig) {
        try {
            const config = JSON.parse(savedConfig);
            initializeFirebase(config);
        } catch (e) {
            showConfigSection();
        }
    } else {
        initializeFirebase(preConfiguredFirebase);
    }
}

function showConfigSection() {
    document.getElementById('configSection').classList.remove('hidden');
    updateSyncStatus('Требуется настройка', true);
}

function saveFirebaseConfig() {
    const configInput = document.getElementById('firebaseConfigInput');
    try {
        const config = JSON.parse(configInput.value);
        localStorage.setItem('firebaseConfig', JSON.stringify(config));
        initializeFirebase(config);
        document.getElementById('configSection').classList.add('hidden');
        configInput.value = '';
    } catch (e) {
        alert('Неверный формат JSON. Пожалуйста, скопируйте конфигурацию целиком из Firebase Console.');
    }
}

function initializeFirebase(config) {
    try {
        firebase.initializeApp(config);
        db = firebase.firestore();
        isFirebaseInitialized = true;
        updateSyncStatus('Синхронизировано', false);
        loadOrCreateData();
    } catch (e) {
        console.error('Firebase initialization error:', e);
        updateSyncStatus('Ошибка подключения', true);
    }
}

function loadOrCreateData() {
    const listRef = db.collection('groceryList').doc('main');
    listRef.get().then(doc => {
        if (doc.exists) {
            groceryData = doc.data().items;
            renderList();
        } else {
            groceryData = JSON.parse(JSON.stringify(defaultGroceryData));
            saveData();
        }
    }).catch(err => {
        console.error('Error loading data:', err);
        updateSyncStatus('Ошибка загрузки', true);
    });

    listRef.onSnapshot(doc => {
        if (doc.exists && !isPendingDeleteMode && !isSaving) {
            groceryData = doc.data().items;
            renderList();
            updateSyncStatus('Синхронизировано', false);
        }
    });
}

function saveData() {
    if (!isFirebaseInitialized) return;
    isSaving = true;
    db.collection('groceryList').doc('main').set({
        items: groceryData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        setTimeout(() => { isSaving = false; }, 1000);
    }).catch(err => {
        console.error('Error saving data:', err);
        updateSyncStatus('Ошибка сохранения', true);
        isSaving = false;
    });
}

function updateSyncStatus(text, isError) {
    document.getElementById('syncText').textContent = text;
    const dot = document.getElementById('syncDot');
    if (isError) dot.classList.add('error');
    else dot.classList.remove('error');
}

function renderList() {
    const listContainer = document.getElementById('groceryList');
    listContainer.innerHTML = '';

    groceryData.forEach((category, catIndex) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category' + (isEditMode ? ' editing' : '');

        const categoryTitle = document.createElement('div');
        categoryTitle.className = 'category-title';
        categoryTitle.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px;';
        
        const titleLeft = document.createElement('div');
        titleLeft.style.cssText = 'display:flex;align-items:center;gap:8px;';
        titleLeft.innerHTML = `
            <div class="category-move-buttons">
                <button class="category-move-btn" onclick="moveCategoryUp(${catIndex})" title="Вверх">▲</button>
                <button class="category-move-btn" onclick="moveCategoryDown(${catIndex})" title="Вниз">▼</button>
            </div>
            <span class="category-icon">${category.icon}</span>
            ${category.category}
        `;
        
        const deleteCategoryBtn = document.createElement('button');
        deleteCategoryBtn.className = 'delete-category-btn';
        deleteCategoryBtn.innerHTML = '✕';
        deleteCategoryBtn.title = 'Удалить категорию';
        deleteCategoryBtn.onclick = (e) => { e.stopPropagation(); deleteCategory(catIndex, e); };

        categoryTitle.appendChild(titleLeft);
        categoryTitle.appendChild(deleteCategoryBtn);
        categoryDiv.appendChild(categoryTitle);

        if (isEditMode && category.items.length === 0) {
            const placeholder = document.createElement('div');
            placeholder.style.cssText = 'text-align:center;color:#999;padding:10px;font-size:14px;';
            placeholder.textContent = 'Перетащите продукт сюда';
            categoryDiv.appendChild(placeholder);
            categoryDiv.classList.add('empty-category');
            categoryDiv.dataset.categoryName = category.category;
            categoryDiv.ondragover = handleDragOverCategory;
            categoryDiv.ondragleave = handleDragLeaveCategory;
            categoryDiv.ondrop = handleDropOnCategory;
            categoryDiv.ontouchend = handleTouchEndOnCategory;
        }

        category.items.forEach((item) => {
            if (currentTab === 'ended' && !item.need) return;

            const itemDiv = document.createElement('div');
            itemDiv.className = `grocery-item ${item.need ? 'need' : 'have'}${isEditMode ? ' editing' : ''}`;
            itemDiv.dataset.itemId = item.id;
            
            if (isEditMode) {
                itemDiv.draggable = true;
                itemDiv.ondragstart = handleDragStart;
                itemDiv.ondragend = handleDragEnd;
                itemDiv.ondragover = handleDragOver;
                itemDiv.ondragleave = handleDragLeave;
                itemDiv.ondrop = handleDrop;
                itemDiv.ontouchstart = handleTouchStart;
                itemDiv.ontouchmove = handleTouchMove;
                itemDiv.ontouchend = handleTouchEnd;
            }
            itemDiv.innerHTML = `
                <div style="display:flex;align-items:center;gap:10px;flex:1;">
                    <span class="drag-handle">⋮⋮</span>
                    <div class="item-name" style="flex:1;">
                        <span class="item-icon">${item.icon}</span>
                        <span>${item.name}</span>
                    </div>
                    <span class="status-badge ${item.need ? 'status-need' : 'status-have'}" data-need="${item.need}" data-icon="${item.need ? '✕' : '✓'}">
                        ${item.need ? 'Закончилось' : 'Есть'}
                    </span>
                    <label class="toggle-switch">
                        <input type="checkbox" ${item.need ? '' : 'checked'} onchange="toggleItem(${item.id})">
                        <span class="toggle-slider"></span>
                    </label>
                    <button class="delete-btn" onclick="deleteItem(${item.id}, event)" title="Удалить" style="display:none;">✕</button>
                    <div class="delete-timer">
                        <div class="delete-timer-bar">
                            <div class="delete-timer-progress" id="timer-progress-${item.id}"></div>
                        </div>
                        <button class="delete-cancel-btn" onclick="cancelDelete(${item.id}, event)">Отмена</button>
                    </div>
                </div>
            `;
            if (isEditMode) {
                const deleteBtn = itemDiv.querySelector('.delete-btn');
                if (deleteBtn) deleteBtn.style.display = 'block';
            }
            categoryDiv.appendChild(itemDiv);
        });

        if (categoryDiv.children.length > 0) listContainer.appendChild(categoryDiv);
    });

    updateStats();
    const addForm = document.getElementById('addForm');
    const mainEditButton = document.getElementById('mainEditButton');
    if (currentTab === 'ended') {
        addForm.classList.add('hidden');
        mainEditButton.classList.remove('active');
    } else {
        if (!isEditMode) {
            addForm.classList.remove('hidden');
            mainEditButton.classList.add('active');
        } else {
            addForm.classList.add('hidden');
            mainEditButton.classList.remove('active');
        }
    }
    applyColumnsLayout();
    applyBadgeMode();
    requestAnimationFrame(() => requestAnimationFrame(() => updateStatusBadges()));
}

function toggleItem(itemId) {
    if (isEditMode || pendingDeleteItems[itemId]) return;
    groceryData.forEach(category => {
        const item = category.items.find(i => i.id === itemId);
        if (item) item.need = !item.need;
    });
    if (currentTab === 'ended') {
        const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
        if (itemElement && !itemElement.classList.contains('pending-delete')) {
            showPendingDelete(itemId, itemElement);
            saveData();
            return;
        }
    }
    renderList();
    saveData();
}

// Unified pending delete function - deleteItem: true = remove completely, false = mark as "have"
function showPendingDelete(itemId, itemElement, deleteItem = false) {
    itemElement.classList.add('pending-delete');
    isPendingDeleteMode = true;
    let timeLeft = 3000;
    let hasAnimated = false;

    const timerInterval = setInterval(() => {
        timeLeft -= 50;
        const progressBar = document.getElementById(`timer-progress-${itemId}`);
        if (progressBar && !hasAnimated) progressBar.style.width = (timeLeft / 3000 * 100) + '%';

        if (timeLeft <= 0 && !hasAnimated) {
            hasAnimated = true;
            clearInterval(timerInterval);
            itemElement.classList.add('sliding-out');
            setTimeout(() => {
                if (deleteItem) {
                    groceryData.forEach(category => {
                        const idx = category.items.findIndex(i => i.id === itemId);
                        if (idx !== -1) category.items.splice(idx, 1);
                    });
                } else {
                    groceryData.forEach(category => {
                        const item = category.items.find(i => i.id === itemId);
                        if (item) item.need = false;
                    });
                }
                delete pendingDeleteItems[itemId];
                isPendingDeleteMode = false;
                renderList();
                saveData();
            }, 500);
        }
    }, 50);
    pendingDeleteItems[itemId] = { timeoutId: timerInterval, element: itemElement };
}

function showPendingDeleteForRemoval(itemId, itemElement) {
    showPendingDelete(itemId, itemElement, true);
}

function cancelDelete(itemId, event) {
    event.stopPropagation();
    const pending = pendingDeleteItems[itemId];
    if (pending) {
        clearInterval(pending.timeoutId);
        pending.element.classList.remove('pending-delete');
        delete pendingDeleteItems[itemId];
        isPendingDeleteMode = false;
        groceryData.forEach(category => {
            const item = category.items.find(i => i.id === itemId);
            if (item) item.need = true;
        });
        renderList();
        saveData();
    }
}

function deleteCategory(categoryIndex, event) {
    if (event) event.stopPropagation();
    const categories = document.querySelectorAll('.category');
    const categoryElement = categories[categoryIndex];
    if (!categoryElement || pendingDeleteCategory) return;
    
    categoryElement.classList.add('pending-delete');
    const categoryTitle = categoryElement.querySelector('.category-title');
    const timerDiv = document.createElement('div');
    timerDiv.className = 'category-delete-timer';
    timerDiv.innerHTML = `
        <div class="category-delete-timer-bar">
            <div class="category-delete-timer-progress" id="category-timer-progress"></div>
        </div>
        <button class="category-delete-cancel-btn" onclick="cancelDeleteCategory(event)">Отмена</button>
    `;
    categoryTitle.appendChild(timerDiv);
    
    let timeLeft = 3000;
    const progressBar = document.getElementById('category-timer-progress');
    
    const timerInterval = setInterval(() => {
        timeLeft -= 50;
        if (progressBar) progressBar.style.width = (timeLeft / 3000 * 100) + '%';
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            categoryElement.classList.add('sliding-out');
            setTimeout(() => {
                groceryData.splice(categoryIndex, 1);
                pendingDeleteCategory = null;
                renderList();
                saveData();
            }, 500);
        }
    }, 50);
    
    pendingDeleteCategory = { categoryIndex, timeoutId: timerInterval, element: categoryElement };
}

function cancelDeleteCategory(event) {
    if (event) event.stopPropagation();
    if (pendingDeleteCategory) {
        clearInterval(pendingDeleteCategory.timeoutId);
        pendingDeleteCategory.element.classList.remove('pending-delete');
        pendingDeleteCategory = null;
        renderList();
    }
}

function moveCategoryUp(index) {
    if (index > 0) {
        [groceryData[index - 1], groceryData[index]] = [groceryData[index], groceryData[index - 1]];
        renderList();
        saveData();
    }
}

function moveCategoryDown(index) {
    if (index < groceryData.length - 1) {
        [groceryData[index], groceryData[index + 1]] = [groceryData[index + 1], groceryData[index]];
        renderList();
        saveData();
    }
}

// Drag and Drop handlers
function handleDragStart(e) {
    draggedItemId = parseInt(e.target.dataset.itemId);
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', draggedItemId);
    createDragClone(e.target);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.grocery-item').forEach(item => item.classList.remove('drag-over'));
    draggedItemId = null;
    stopAutoScroll();
    removeDragClone();
    touchElement = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragClone) updateDragClonePosition(e.clientY);
    const windowHeight = window.innerHeight;
    const scrollThreshold = 60;
    if (e.clientY < scrollThreshold) startAutoScroll(-1);
    else if (e.clientY > windowHeight - scrollThreshold) startAutoScroll(1);
    else stopAutoScroll();
}

function handleDragLeave(e) {
    const target = e.target.closest('.grocery-item');
    if (target) target.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    const target = e.target.closest('.grocery-item');
    if (target && draggedItemId) {
        target.classList.remove('drag-over');
        const targetItemId = parseInt(target.dataset.itemId);
        if (targetItemId && draggedItemId !== targetItemId) moveItemToPosition(draggedItemId, targetItemId);
    } else {
        const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
        const emptyCategory = elementBelow?.closest('.empty-category');
        if (emptyCategory && draggedItemId) {
            moveItemToEmptyCategory(emptyCategory);
            draggedItemId = null;
            return;
        }
    }
    stopAutoScroll();
    removeDragClone();
}

function handleTouchStart(e) {
    touchElement = e.target.closest('.grocery-item');
    touchStartY = e.touches[0].clientY;
    if (touchElement) {
        touchElement.classList.add('dragging');
        draggedItemId = parseInt(touchElement.dataset.itemId);
    }
}

function createDragClone(element) {
    removeDragClone();
    const isNeed = element.classList.contains('need');
    const itemName = element.querySelector('.item-name')?.textContent?.trim() || '';
    const itemIcon = element.querySelector('.item-icon')?.textContent || '📦';
    dragClone = document.createElement('div');
    dragClone.className = `drag-clone ${isNeed ? 'need' : 'have'}`;
    dragClone.innerHTML = `<span style="font-size:20px;">${itemIcon}</span><span style="font-weight:500;">${itemName}</span>`;
    document.body.appendChild(dragClone);
    updateDragClonePosition(touchStartY);
}

function updateDragClonePosition(y) {
    if (dragClone) {
        dragClone.style.left = '50%';
        dragClone.style.top = y + 'px';
    }
}

function removeDragClone() {
    if (dragClone) { dragClone.remove(); dragClone = null; }
}

function startAutoScroll(direction) {
    if (autoScrollInterval) return;
    autoScrollInterval = setInterval(() => {
        document.getElementById('groceryList').scrollBy({ top: direction * 20, behavior: 'auto' });
    }, 50);
}

function stopAutoScroll() {
    if (autoScrollInterval) { clearInterval(autoScrollInterval); autoScrollInterval = null; }
}

function handleTouchMove(e) {
    if (!touchElement) return;
    e.preventDefault();
    const touchY = e.touches[0].clientY;
    updateDragClonePosition(touchY);
    const elementBelow = document.elementFromPoint(e.touches[0].clientX, touchY);
    document.querySelectorAll('.grocery-item').forEach(item => item.classList.remove('drag-over'));
    const targetItem = elementBelow?.closest('.grocery-item');
    if (targetItem && targetItem !== touchElement) targetItem.classList.add('drag-over');
    document.querySelectorAll('.empty-category').forEach(cat => cat.classList.remove('drag-over'));
    const emptyCategory = elementBelow?.closest('.empty-category');
    if (emptyCategory) emptyCategory.classList.add('drag-over');
    const windowHeight = window.innerHeight;
    if (touchY < 60) startAutoScroll(-1);
    else if (touchY > windowHeight - 60) startAutoScroll(1);
    else stopAutoScroll();
}

function handleTouchEnd(e) {
    if (!touchElement) return;
    stopAutoScroll();
    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    let emptyCategory = elementBelow?.closest('.empty-category');
    if (!emptyCategory) {
        const allElements = document.elementsFromPoint(touch.clientX, touch.clientY);
        for (let el of allElements) {
            if (el.classList.contains('empty-category')) { emptyCategory = el; break; }
        }
    }
    if (emptyCategory && draggedItemId) {
        moveItemToEmptyCategory(emptyCategory);
        touchElement.classList.remove('dragging');
        removeDragClone();
        touchElement = null;
        touchStartY = 0;
        draggedItemId = null;
        return;
    }
    const targetItem = elementBelow?.closest('.grocery-item');
    if (targetItem && targetItem !== touchElement) {
        const targetItemId = parseInt(targetItem.dataset.itemId);
        const draggedId = parseInt(touchElement.dataset.itemId);
        if (targetItemId && draggedId) moveItemToPosition(draggedId, targetItemId);
    }
    touchElement.classList.remove('dragging');
    document.querySelectorAll('.grocery-item').forEach(item => item.classList.remove('drag-over'));
    document.querySelectorAll('.empty-category').forEach(cat => cat.classList.remove('drag-over'));
    touchElement = null;
    touchStartY = 0;
}

function moveItemToPosition(draggedId, targetId) {
    let draggedItem = null, draggedCatIndex = -1, draggedItemIndex = -1;
    for (let catIndex = 0; catIndex < groceryData.length; catIndex++) {
        const idx = groceryData[catIndex].items.findIndex(i => i.id === draggedId);
        if (idx !== -1) { draggedItem = groceryData[catIndex].items[idx]; draggedCatIndex = catIndex; draggedItemIndex = idx; break; }
    }
    if (!draggedItem) return;
    let targetCatIndex = -1, targetItemIndex = -1;
    for (let catIndex = 0; catIndex < groceryData.length; catIndex++) {
        const idx = groceryData[catIndex].items.findIndex(i => i.id === targetId);
        if (idx !== -1) { targetCatIndex = catIndex; targetItemIndex = idx; break; }
    }
    if (targetCatIndex === -1) return;
    groceryData[draggedCatIndex].items.splice(draggedItemIndex, 1);
    groceryData[targetCatIndex].items.splice(targetItemIndex, 0, draggedItem);
    renderList();
    saveData();
}

function handleDragOverCategory(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeaveCategory(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDropOnCategory(e) {
    e.preventDefault();
    const categoryDiv = e.currentTarget;
    categoryDiv.classList.remove('drag-over');
    if (draggedItemId) moveItemToEmptyCategory(categoryDiv);
}

function handleTouchEndOnCategory(e) {
    if (!touchElement) return;
    const categoryDiv = e.currentTarget;
    const draggedId = parseInt(touchElement.dataset.itemId);
    if (draggedId) { draggedItemId = draggedId; moveItemToEmptyCategory(categoryDiv); }
    touchElement.classList.remove('dragging');
    touchElement = null;
    touchStartY = 0;
}

function moveItemToEmptyCategory(categoryDiv) {
    if (!draggedItemId) return;
    let draggedItem = null, draggedCatIndex = -1, draggedItemIndex = -1;
    for (let catIndex = 0; catIndex < groceryData.length; catIndex++) {
        const idx = groceryData[catIndex].items.findIndex(i => i.id === draggedItemId);
        if (idx !== -1) { draggedItem = groceryData[catIndex].items[idx]; draggedCatIndex = catIndex; draggedItemIndex = idx; break; }
    }
    if (!draggedItem) return;
    const targetCategoryName = categoryDiv.dataset.categoryName;
    let targetCatIndex = -1;
    for (let catIndex = 0; catIndex < groceryData.length; catIndex++) {
        if (groceryData[catIndex].category === targetCategoryName) { targetCatIndex = catIndex; break; }
    }
    if (targetCatIndex === -1) return;
    groceryData[draggedCatIndex].items.splice(draggedItemIndex, 1);
    groceryData[targetCatIndex].items.push(draggedItem);
    renderList();
    saveData();
    draggedItemId = null;
}

function toggleEditMode() {
    isEditMode = !isEditMode;
    const editPanel = document.getElementById('editPanel');
    const addForm = document.getElementById('addForm');
    const mainEditButton = document.getElementById('mainEditButton');

    if (isEditMode) {
        editPanel.classList.add('active');
        addForm.classList.add('hidden');
        mainEditButton.classList.remove('active');
        document.getElementById('editAddForm').classList.add('hidden');
        document.getElementById('editAddCategoryForm').classList.add('hidden');
        Object.values(pendingDeleteItems).forEach(pending => {
            if (pending) { clearInterval(pending.timeoutId); pending.element.classList.remove('pending-delete'); }
        });
        pendingDeleteItems = {};
        isPendingDeleteMode = false;
        if (pendingDeleteCategory) { clearInterval(pendingDeleteCategory.timeoutId); pendingDeleteCategory.element.classList.remove('pending-delete'); pendingDeleteCategory = null; }
    } else {
        editPanel.classList.remove('active');
        if (currentTab === 'all') { addForm.classList.remove('hidden'); mainEditButton.classList.add('active'); }
        stopAutoScroll();
        removeDragClone();
        touchElement = null;
        draggedItemId = null;
    }
    renderList();
}

function showAddProductInput() {
    document.getElementById('editAddForm').classList.remove('hidden');
    document.getElementById('editAddCategoryForm').classList.add('hidden');
    document.getElementById('editNewItemInput').focus();
}

function showAddCategoryInput() {
    document.getElementById('editAddCategoryForm').classList.remove('hidden');
    document.getElementById('editAddForm').classList.add('hidden');
    document.getElementById('newCategoryName').focus();
}

function deleteItem(itemId, event) {
    if (!isEditMode) return;
    event.stopPropagation();
    if (pendingDeleteItems[itemId]) return;
    const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
    if (!itemElement) return;
    showPendingDeleteForRemoval(itemId, itemElement);
}

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    Object.values(pendingDeleteItems).forEach(pending => {
        if (pending) { clearInterval(pending.timeoutId); pending.element.classList.remove('pending-delete'); }
    });
    pendingDeleteItems = {};
    isPendingDeleteMode = false;
    if (pendingDeleteCategory) { clearInterval(pendingDeleteCategory.timeoutId); pendingDeleteCategory.element.classList.remove('pending-delete'); pendingDeleteCategory = null; }
    if (isEditMode) toggleEditMode();
    renderList();
}

function updateStats() {
    let needCount = 0, haveCount = 0;
    groceryData.forEach(category => {
        category.items.forEach(item => {
            if (item.need) needCount++;
            else haveCount++;
        });
    });
    document.getElementById('needCount').textContent = needCount;
    document.getElementById('haveCount').textContent = haveCount;
}

// Key press handlers
function handleKeyPress(event) { if (event.key === 'Enter') addNewItem(); }
function handleEditKeyPress(event) { if (event.key === 'Enter') addNewItemFromEdit(); }
function handleCategoryKeyPress(event) { if (event.key === 'Enter') addNewCategory(); }
function handleItemIconKeyPress(event) { if (event.key === 'Enter') (isEditMode ? addNewItemFromEdit : addNewItem)(); }

function addNewItem() {
    const input = document.getElementById('newItemInput');
    const iconInput = document.getElementById('newItemIconMain');
    addItemToList(input, iconInput);
}

function addNewItemFromEdit() {
    const input = document.getElementById('editNewItemInput');
    const iconInput = document.getElementById('newItemIcon');
    addItemToList(input, iconInput);
}

function addItemToList(input, iconInput) {
    const name = input.value.trim();
    const icon = iconInput.value.trim() || '📦';
    if (name && isFirebaseInitialized) {
        const newId = Date.now();
        if (groceryData.length > 0) groceryData[0].items.push({ id: newId, name, icon, need: true });
        else groceryData.push({ category: "Разное", icon: "📦", items: [{ id: newId, name, icon, need: true }] });
        input.value = '';
        iconInput.value = '📦';
        renderList();
        saveData();
    } else if (!isFirebaseInitialized) {
        alert('Сначала настройте Firebase для добавления товаров');
    }
}

function addNewCategory() {
    const nameInput = document.getElementById('newCategoryName');
    const iconInput = document.getElementById('newCategoryIcon');
    const name = nameInput.value.trim();
    const icon = iconInput.value.trim() || '📦';
    if (name && isFirebaseInitialized) {
        groceryData.push({ category: name, icon, items: [] });
        nameInput.value = '';
        iconInput.value = '📦';
        renderList();
        saveData();
    }
}

// Initialize
checkFirebaseConfig();
pendingDeleteItems = {};
pendingDeleteCategory = null;

// Settings
let selectedColumns = 1;
let selectedBadgeMode = 'text';

function loadColumnsSettings() {
    const savedColumns = localStorage.getItem('groceryColumns');
    selectedColumns = savedColumns ? parseInt(savedColumns) : 1;
    const savedBadge = localStorage.getItem('groceryBadgeMode');
    selectedBadgeMode = savedBadge || 'text';
    updateColumnsUI();
    updateBadgeUI();
    applyBadgeMode();
}

function updateColumnsUI() {
    document.querySelectorAll('#columnsOptions .column-option').forEach(option => {
        option.classList.toggle('active', parseInt(option.dataset.columns) === selectedColumns);
    });
}

function selectColumns(cols) {
    selectedColumns = cols;
    updateColumnsUI();
    localStorage.setItem('groceryColumns', selectedColumns.toString());
    applyColumnsLayout();
    setTimeout(closeSettings, 300);
}

function selectBadge(mode) {
    selectedBadgeMode = mode;
    updateBadgeUI();
    localStorage.setItem('groceryBadgeMode', mode);
    applyBadgeMode();
    setTimeout(closeSettings, 300);
}

function updateBadgeUI() {
    document.querySelectorAll('#badgeOptions .column-option').forEach(option => {
        option.classList.toggle('active', option.dataset.badge === selectedBadgeMode);
    });
}

function applyBadgeMode() {
    const groceryList = document.getElementById('groceryList');
    if (groceryList) {
        if (selectedBadgeMode === 'icon') groceryList.classList.add('show-icons');
        else groceryList.classList.remove('show-icons');
    }
}

function openSettings() {
    document.getElementById('settingsModalOverlay').classList.add('active');
    updateColumnsUI();
    updateBadgeUI();
}

function closeSettings() {
    document.getElementById('settingsModalOverlay').classList.remove('active');
}

function closeSettingsOnOverlay(event) {
    if (event.target.id === 'settingsModalOverlay') closeSettings();
}

function saveSettings() {
    localStorage.setItem('groceryColumns', selectedColumns.toString());
    applyColumnsLayout();
    closeSettings();
}

function applyColumnsLayout() {
    const groceryList = document.getElementById('groceryList');
    if (groceryList) groceryList.className = 'grocery-list columns-' + selectedColumns;
}

function updateStatusBadges() {
    document.querySelectorAll('.grocery-item').forEach(item => {
        const badge = item.querySelector('.status-badge');
        const itemName = item.querySelector('.item-name');
        const toggle = item.querySelector('.toggle-switch');
        if (!badge || !itemName || !toggle) return;
        const isNeed = badge.dataset.need === 'true';
        const textNeed = 'Закончилось';
        const textHave = 'Есть';
        const availableWidth = toggle.getBoundingClientRect().left - itemName.getBoundingClientRect().right - 15;
        badge.textContent = textNeed;
        void badge.offsetWidth;
        if (badge.scrollWidth > availableWidth) {
            badge.textContent = isNeed ? '✕' : '✓';
            badge.classList.add('status-icon');
        } else {
            badge.textContent = isNeed ? textNeed : textHave;
            badge.classList.remove('status-icon');
        }
    });
}

loadColumnsSettings();
setTimeout(updateStatusBadges, 500);
let resizeTimeout;
window.addEventListener('resize', () => { clearTimeout(resizeTimeout); resizeTimeout = setTimeout(updateStatusBadges, 300); });
