"use strict";

function _createForOfIteratorHelperLoose(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: !0 } : { done: !1, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// iOS 12 Compatibility Layer - Add polyfills for older browsers
(function () {
  'use strict';

  // Polyfill for Element.closest() - iOS 12 Safari support
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
      var el = this;
      if (!document.documentElement.contains(el)) return null;
      do {
        var i = null;
        // Simple selector check
        try {
          if (el.matches && el.matches(s)) return el;
        } catch (e) {
          // Fallback for older browsers without matches()
          if (el === document.documentElement) return null;
        }
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }

  // Polyfill for Element.matches() - older Safari support
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  }

  // Polyfill for Array.find() - ES6 support for iOS 12
  if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
      if (this == null) throw TypeError('Array.prototype.find called on null or undefined');
      if (typeof predicate !== 'function') throw TypeError('predicate must be a function');
      var list = Object(this);
      var thisArg = arguments[1];
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        if (predicate.call(thisArg, item, i, list)) return item;
      }
      return undefined;
    };
  }

  // Polyfill for String.prototype.trim()
  if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
  }

  // Polyfill for Object.assign() - iOS 12 support
  if (typeof Object.assign !== 'function') {
    Object.assign = function (target) {
      if (target == null) throw new TypeError('Cannot convert undefined or null to object');
      var to = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];
        if (nextSource == null) continue;
        for (var nextKey in nextSource) {
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    };
  }

  // Polyfill for Promise.prototype.finally()
  if (typeof Promise !== 'undefined' && !Promise.prototype["finally"]) {
    Promise.prototype["finally"] = function (callback) {
      return this.then(function (value) {
        return Promise.resolve(callback()).then(function () {
          return value;
        });
      }, function (reason) {
        return Promise.resolve(callback()).then(function () {
          throw reason;
        });
      });
    };
  }

  // Safe navigation helper - replaces optional chaining for old browsers
  window.safeGet = function (obj, path, defaultValue) {
    if (obj == null) return defaultValue;
    var keys = path.split('.');
    var result = obj;
    for (var i = 0; i < keys.length; i++) {
      if (result == null) return defaultValue;
      result = result[keys[i]];
    }
    return result !== undefined ? result : defaultValue;
  };

  // Safe method call helper
  window.safeCall = function (obj, method, args, defaultValue) {
    if (obj && typeof obj[method] === 'function') {
      return obj[method].apply(obj, args || []);
    }
    return defaultValue;
  };
  console.log('✅ iOS 12 compatibility layer loaded');
})();

// Default grocery data template
var defaultGroceryData = [{
  category: "Молочные продукты",
  icon: "🥛",
  items: [{
    id: 1,
    name: "Молоко",
    icon: "🥛",
    need: true
  }, {
    id: 2,
    name: "Яйца",
    icon: "🥚",
    need: true
  }, {
    id: 3,
    name: "Сыр",
    icon: "🧀",
    need: false
  }, {
    id: 4,
    name: "Масло сливочное",
    icon: "🧈",
    need: true
  }]
}, {
  category: "Овощи и фрукты",
  icon: "🥬",
  items: [{
    id: 5,
    name: "Яблоки",
    icon: "🍎",
    need: false
  }, {
    id: 6,
    name: "Бананы",
    icon: "🍌",
    need: true
  }, {
    id: 7,
    name: "Помидоры",
    icon: "🍅",
    need: true
  }, {
    id: 8,
    name: "Огурцы",
    icon: "🥒",
    need: false
  }]
}, {
  category: "Мясо и рыба",
  icon: "🥩",
  items: [{
    id: 9,
    name: "Курица",
    icon: "🍗",
    need: true
  }, {
    id: 10,
    name: "Рыба",
    icon: "🐟",
    need: false
  }, {
    id: 11,
    name: "Фарш",
    icon: "🥩",
    need: true
  }]
}, {
  category: "Бакалея",
  icon: "🍞",
  items: [{
    id: 12,
    name: "Хлеб",
    icon: "🍞",
    need: true
  }, {
    id: 13,
    name: "Рис",
    icon: "🍚",
    need: false
  }, {
    id: 14,
    name: "Макароны",
    icon: "🍝",
    need: false
  }, {
    id: 15,
    name: "Картофель",
    icon: "🥔",
    need: true
  }]
}, {
  category: "Напитки",
  icon: "☕",
  items: [{
    id: 16,
    name: "Кофе",
    icon: "☕",
    need: false
  }, {
    id: 17,
    name: "Чай",
    icon: "🍵",
    need: false
  }, {
    id: 18,
    name: "Сок",
    icon: "🧃",
    need: true
  }]
}];
var groceryData = [];
var currentTab = 'all';
var db = null;
var isFirebaseInitialized = false;
var isEditMode = false;
var draggedItemId = null;
var touchStartY = 0;
var touchElement = null;
var pendingDeleteItems = {};
var isPendingDeleteMode = false;
var dragClone = null;
var autoScrollInterval = null;
var pendingDeleteCategory = null;
var isSaving = false;

// Pre-configured Firebase settings
var preConfiguredFirebase = {
  apiKey: "AIzaSyDXdQAqgdbVASNUIIXykvvQD61g6262Uztm8",
  authDomain: "food-bot-8cb9c.firebaseapp.com",
  projectId: "food-bot-8cb9c",
  storageBucket: "food-bot-8cb9c.firebasestorage.app",
  messagingSenderId: "353425559275",
  appId: "1:353425559275:web:ec33211ab9494f700e38ae"
};

// Check for saved Firebase config
function checkFirebaseConfig() {
  var savedConfig = localStorage.getItem('firebaseConfig');
  if (savedConfig) {
    try {
      var config = JSON.parse(savedConfig);
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
  var configInput = document.getElementById('firebaseConfigInput');
  try {
    var config = JSON.parse(configInput.value);
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
    // Detect Firebase version
    var isFirebaseV8 = typeof firebase.initializeApp === 'function' && firebase.firestore === undefined;
    if (isFirebaseV8) {
      // Firebase 8.x syntax
      firebase.initializeApp(config);
      db = firebase.firestore();
      console.log('✅ Firebase 8.x initialized');
    } else {
      // Firebase 10.x syntax (compat mode)
      firebase.initializeApp(config);
      db = firebase.firestore();
      console.log('✅ Firebase 10.x initialized');
    }
    isFirebaseInitialized = true;
    updateSyncStatus('Синхронизировано', false);
    loadOrCreateData();
  } catch (e) {
    console.error('Firebase initialization error:', e);
    updateSyncStatus('Ошибка подключения', true);
  }
}
function loadOrCreateData() {
  var listRef = db.collection('groceryList').doc('main');
  listRef.get().then(function (doc) {
    if (doc.exists) {
      groceryData = doc.data().items;
      renderList();
    } else {
      groceryData = JSON.parse(JSON.stringify(defaultGroceryData));
      saveData();
    }
  })["catch"](function (err) {
    console.error('Error loading data:', err);
    updateSyncStatus('Ошибка загрузки', true);
  });
  listRef.onSnapshot(function (doc) {
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
  }).then(function () {
    setTimeout(function () {
      isSaving = false;
    }, 1000);
  })["catch"](function (err) {
    console.error('Error saving data:', err);
    updateSyncStatus('Ошибка сохранения', true);
    isSaving = false;
  });
}
function updateSyncStatus(text, isError) {
  document.getElementById('syncText').textContent = text;
  var dot = document.getElementById('syncDot');
  if (isError) dot.classList.add('error');else dot.classList.remove('error');
}
function renderList() {
  var listContainer = document.getElementById('groceryList');
  listContainer.innerHTML = '';
  groceryData.forEach(function (category, catIndex) {
    var categoryDiv = document.createElement('div');
    categoryDiv.className = 'category' + (isEditMode ? ' editing' : '');
    var categoryTitle = document.createElement('div');
    categoryTitle.className = 'category-title';
    categoryTitle.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px;';
    var titleLeft = document.createElement('div');
    titleLeft.style.cssText = 'display:flex;align-items:center;gap:8px;';
    titleLeft.innerHTML = "\n            <div class=\"category-move-buttons\">\n                <button class=\"category-move-btn\" onclick=\"moveCategoryUp(".concat(catIndex, ")\" title=\"\u0412\u0432\u0435\u0440\u0445\">\u25B2</button>\n                <button class=\"category-move-btn\" onclick=\"moveCategoryDown(").concat(catIndex, ")\" title=\"\u0412\u043D\u0438\u0437\">\u25BC</button>\n            </div>\n            <span class=\"category-icon\">").concat(category.icon, "</span>\n            ").concat(category.category, "\n        ");
    var deleteCategoryBtn = document.createElement('button');
    deleteCategoryBtn.className = 'delete-category-btn';
    deleteCategoryBtn.innerHTML = '✕';
    deleteCategoryBtn.title = 'Удалить категорию';
    deleteCategoryBtn.onclick = function (e) {
      e.stopPropagation();
      deleteCategory(catIndex, e);
    };
    categoryTitle.appendChild(titleLeft);
    categoryTitle.appendChild(deleteCategoryBtn);
    categoryDiv.appendChild(categoryTitle);
    if (isEditMode && category.items.length === 0) {
      var placeholder = document.createElement('div');
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
    category.items.forEach(function (item) {
      if (currentTab === 'ended' && !item.need) return;
      var itemDiv = document.createElement('div');
      itemDiv.className = "grocery-item ".concat(item.need ? 'need' : 'have').concat(isEditMode ? ' editing' : '');
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
      itemDiv.innerHTML = "\n                <div style=\"display:flex;align-items:center;gap:10px;flex:1;\">\n                    <span class=\"drag-handle\">\u22EE\u22EE</span>\n                    <div class=\"item-name\" style=\"flex:1;\">\n                        <span class=\"item-icon\">".concat(item.icon, "</span>\n                        <span>").concat(item.name, "</span>\n                    </div>\n                    <span class=\"status-badge ").concat(item.need ? 'status-need' : 'status-have', "\" data-need=\"").concat(item.need, "\" data-icon=\"").concat(item.need ? '✕' : '✓', "\">\n                        ").concat(item.need ? 'Закончилось' : 'Есть', "\n                    </span>\n                    <label class=\"toggle-switch\">\n                        <input type=\"checkbox\" ").concat(item.need ? '' : 'checked', " onchange=\"toggleItem(").concat(item.id, ")\">\n                        <span class=\"toggle-slider\"></span>\n                    </label>\n                    <button class=\"edit-product-btn\" onclick=\"openEditProductModal(").concat(item.id, ")\" title=\"\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C\">\u270F\uFE0F</button>\n                    <button class=\"delete-btn\" onclick=\"deleteItem(").concat(item.id, ", event)\" title=\"\u0423\u0434\u0430\u043B\u0438\u0442\u044C\" style=\"display:none;\">\u2715</button>\n                    <div class=\"delete-timer\">\n                        <div class=\"delete-timer-bar\">\n                            <div class=\"delete-timer-progress\" id=\"timer-progress-").concat(item.id, "\"></div>\n                        </div>\n                        <button class=\"delete-cancel-btn\" onclick=\"cancelDelete(").concat(item.id, ", event)\">\u041E\u0442\u043C\u0435\u043D\u0430</button>\n                    </div>\n                </div>\n            ");
      if (isEditMode) {
        var deleteBtn = itemDiv.querySelector('.delete-btn');
        if (deleteBtn) deleteBtn.style.display = 'block';
        var editBtn = itemDiv.querySelector('.edit-product-btn');
        if (editBtn) editBtn.style.display = 'block';
      }
      categoryDiv.appendChild(itemDiv);
    });
    if (categoryDiv.children.length > 0) listContainer.appendChild(categoryDiv);
  });
  updateStats();
  var addForm = document.getElementById('addForm');
  var mainEditButton = document.getElementById('mainEditButton');
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
  requestAnimationFrame(function () {
    return requestAnimationFrame(function () {
      return updateStatusBadges();
    });
  });
}
function toggleItem(itemId) {
  if (isEditMode || pendingDeleteItems[itemId]) return;
  groceryData.forEach(function (category) {
    var item = category.items.find(function (i) {
      return i.id === itemId;
    });
    if (item) item.need = !item.need;
  });
  if (currentTab === 'ended') {
    var itemElement = document.querySelector("[data-item-id=\"".concat(itemId, "\"]"));
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
function showPendingDelete(itemId, itemElement) {
  var deleteItem = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  itemElement.classList.add('pending-delete');
  isPendingDeleteMode = true;
  var timeLeft = 3000;
  var hasAnimated = false;
  var timerInterval = setInterval(function () {
    timeLeft -= 50;
    var progressBar = document.getElementById("timer-progress-".concat(itemId));
    if (progressBar && !hasAnimated) progressBar.style.width = timeLeft / 3000 * 100 + '%';
    if (timeLeft <= 0 && !hasAnimated) {
      hasAnimated = true;
      clearInterval(timerInterval);
      itemElement.classList.add('sliding-out');
      setTimeout(function () {
        if (deleteItem) {
          groceryData.forEach(function (category) {
            var idx = category.items.findIndex(function (i) {
              return i.id === itemId;
            });
            if (idx !== -1) category.items.splice(idx, 1);
          });
        } else {
          groceryData.forEach(function (category) {
            var item = category.items.find(function (i) {
              return i.id === itemId;
            });
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
  pendingDeleteItems[itemId] = {
    timeoutId: timerInterval,
    element: itemElement
  };
}
function showPendingDeleteForRemoval(itemId, itemElement) {
  showPendingDelete(itemId, itemElement, true);
}
function cancelDelete(itemId, event) {
  event.stopPropagation();
  var pending = pendingDeleteItems[itemId];
  if (pending) {
    clearInterval(pending.timeoutId);
    pending.element.classList.remove('pending-delete');
    delete pendingDeleteItems[itemId];
    isPendingDeleteMode = false;
    groceryData.forEach(function (category) {
      var item = category.items.find(function (i) {
        return i.id === itemId;
      });
      if (item) item.need = true;
    });
    renderList();
    saveData();
  }
}
function deleteCategory(categoryIndex, event) {
  if (event) event.stopPropagation();
  var categories = document.querySelectorAll('.category');
  var categoryElement = categories[categoryIndex];
  if (!categoryElement || pendingDeleteCategory) return;
  categoryElement.classList.add('pending-delete');
  var categoryTitle = categoryElement.querySelector('.category-title');
  var timerDiv = document.createElement('div');
  timerDiv.className = 'category-delete-timer';
  timerDiv.innerHTML = "\n        <div class=\"category-delete-timer-bar\">\n            <div class=\"category-delete-timer-progress\" id=\"category-timer-progress\"></div>\n        </div>\n        <button class=\"category-delete-cancel-btn\" onclick=\"cancelDeleteCategory(event)\">\u041E\u0442\u043C\u0435\u043D\u0430</button>\n    ";
  categoryTitle.appendChild(timerDiv);
  var timeLeft = 3000;
  var progressBar = document.getElementById('category-timer-progress');
  var timerInterval = setInterval(function () {
    timeLeft -= 50;
    if (progressBar) progressBar.style.width = timeLeft / 3000 * 100 + '%';
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      categoryElement.classList.add('sliding-out');
      setTimeout(function () {
        groceryData.splice(categoryIndex, 1);
        pendingDeleteCategory = null;
        renderList();
        saveData();
      }, 500);
    }
  }, 50);
  pendingDeleteCategory = {
    categoryIndex: categoryIndex,
    timeoutId: timerInterval,
    element: categoryElement
  };
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
    var _ref = [groceryData[index], groceryData[index - 1]];
    groceryData[index - 1] = _ref[0];
    groceryData[index] = _ref[1];
    renderList();
    saveData();
  }
}
function moveCategoryDown(index) {
  if (index < groceryData.length - 1) {
    var _ref2 = [groceryData[index + 1], groceryData[index]];
    groceryData[index] = _ref2[0];
    groceryData[index + 1] = _ref2[1];
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
  document.querySelectorAll('.grocery-item').forEach(function (item) {
    return item.classList.remove('drag-over');
  });
  draggedItemId = null;
  stopAutoScroll();
  removeDragClone();
  touchElement = null;
}
function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  if (dragClone) updateDragClonePosition(e.clientY);
  var windowHeight = window.innerHeight;
  var scrollThreshold = 60;
  if (e.clientY < scrollThreshold) startAutoScroll(-1);else if (e.clientY > windowHeight - scrollThreshold) startAutoScroll(1);else stopAutoScroll();
}
function handleDragLeave(e) {
  var target = e.target.closest('.grocery-item');
  if (target) target.classList.remove('drag-over');
}
function handleDrop(e) {
  e.preventDefault();
  var target = e.target.closest('.grocery-item');
  if (target && draggedItemId) {
    target.classList.remove('drag-over');
    var targetItemId = parseInt(target.dataset.itemId);
    if (targetItemId && draggedItemId !== targetItemId) moveItemToPosition(draggedItemId, targetItemId);
  } else {
    var elementBelow = document.elementFromPoint(e.clientX, e.clientY);
    var emptyCategory = elementBelow == null ? void 0 : elementBelow.closest('.empty-category');
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
  var _element$querySelecto, _element$querySelecto2;
  removeDragClone();
  var isNeed = element.classList.contains('need');
  var itemName = ((_element$querySelecto = element.querySelector('.item-name')) == null || (_element$querySelecto = _element$querySelecto.textContent) == null ? void 0 : _element$querySelecto.trim()) || '';
  var itemIcon = ((_element$querySelecto2 = element.querySelector('.item-icon')) == null ? void 0 : _element$querySelecto2.textContent) || '📦';
  dragClone = document.createElement('div');
  dragClone.className = "drag-clone ".concat(isNeed ? 'need' : 'have');
  dragClone.innerHTML = "<span style=\"font-size:20px;\">".concat(itemIcon, "</span><span style=\"font-weight:500;\">").concat(itemName, "</span>");
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
  if (dragClone) {
    dragClone.remove();
    dragClone = null;
  }
}
function startAutoScroll(direction) {
  if (autoScrollInterval) return;
  autoScrollInterval = setInterval(function () {
    document.getElementById('groceryList').scrollBy({
      top: direction * 20,
      behavior: 'auto'
    });
  }, 50);
}
function stopAutoScroll() {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval);
    autoScrollInterval = null;
  }
}
function handleTouchMove(e) {
  if (!touchElement) return;
  e.preventDefault();
  var touchY = e.touches[0].clientY;
  updateDragClonePosition(touchY);
  var elementBelow = document.elementFromPoint(e.touches[0].clientX, touchY);
  document.querySelectorAll('.grocery-item').forEach(function (item) {
    return item.classList.remove('drag-over');
  });
  var targetItem = elementBelow == null ? void 0 : elementBelow.closest('.grocery-item');
  if (targetItem && targetItem !== touchElement) targetItem.classList.add('drag-over');
  document.querySelectorAll('.empty-category').forEach(function (cat) {
    return cat.classList.remove('drag-over');
  });
  var emptyCategory = elementBelow == null ? void 0 : elementBelow.closest('.empty-category');
  if (emptyCategory) emptyCategory.classList.add('drag-over');
  var windowHeight = window.innerHeight;
  if (touchY < 60) startAutoScroll(-1);else if (touchY > windowHeight - 60) startAutoScroll(1);else stopAutoScroll();
}
function handleTouchEnd(e) {
  if (!touchElement) return;
  stopAutoScroll();
  var touch = e.changedTouches[0];
  var elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
  var emptyCategory = elementBelow == null ? void 0 : elementBelow.closest('.empty-category');
  if (!emptyCategory) {
    var allElements = document.elementsFromPoint(touch.clientX, touch.clientY);
    for (var _iterator = _createForOfIteratorHelperLoose(allElements), _step; !(_step = _iterator()).done;) {
      var el = _step.value;
      if (el.classList.contains('empty-category')) {
        emptyCategory = el;
        break;
      }
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
  var targetItem = elementBelow == null ? void 0 : elementBelow.closest('.grocery-item');
  if (targetItem && targetItem !== touchElement) {
    var targetItemId = parseInt(targetItem.dataset.itemId);
    var draggedId = parseInt(touchElement.dataset.itemId);
    if (targetItemId && draggedId) moveItemToPosition(draggedId, targetItemId);
  }
  touchElement.classList.remove('dragging');
  document.querySelectorAll('.grocery-item').forEach(function (item) {
    return item.classList.remove('drag-over');
  });
  document.querySelectorAll('.empty-category').forEach(function (cat) {
    return cat.classList.remove('drag-over');
  });
  touchElement = null;
  touchStartY = 0;
}
function moveItemToPosition(draggedId, targetId) {
  var draggedItem = null,
    draggedCatIndex = -1,
    draggedItemIndex = -1;
  for (var catIndex = 0; catIndex < groceryData.length; catIndex++) {
    var idx = groceryData[catIndex].items.findIndex(function (i) {
      return i.id === draggedId;
    });
    if (idx !== -1) {
      draggedItem = groceryData[catIndex].items[idx];
      draggedCatIndex = catIndex;
      draggedItemIndex = idx;
      break;
    }
  }
  if (!draggedItem) return;
  var targetCatIndex = -1,
    targetItemIndex = -1;
  for (var _catIndex2 = 0; _catIndex2 < groceryData.length; _catIndex2++) {
    var _idx = groceryData[_catIndex2].items.findIndex(function (i) {
      return i.id === targetId;
    });
    if (_idx !== -1) {
      targetCatIndex = _catIndex2;
      targetItemIndex = _idx;
      break;
    }
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
  var categoryDiv = e.currentTarget;
  categoryDiv.classList.remove('drag-over');
  if (draggedItemId) moveItemToEmptyCategory(categoryDiv);
}
function handleTouchEndOnCategory(e) {
  if (!touchElement) return;
  var categoryDiv = e.currentTarget;
  var draggedId = parseInt(touchElement.dataset.itemId);
  if (draggedId) {
    draggedItemId = draggedId;
    moveItemToEmptyCategory(categoryDiv);
  }
  touchElement.classList.remove('dragging');
  touchElement = null;
  touchStartY = 0;
}

// Feature detection for optional chaining and nullish coalescing
var supportsOptionalChaining = false;
try {
  eval('var x = {}?.prop');
  supportsOptionalChaining = true;
} catch (e) {
  supportsOptionalChaining = false;
}
var supportsNullishCoalescing = false;
try {
  eval('var y = null ?? "default"');
  supportsNullishCoalescing = true;
} catch (e) {
  supportsNullishCoalescing = false;
}

// Safe element getter with fallback for old browsers
function safeElementById(id) {
  return document.getElementById(id);
}
function moveItemToEmptyCategory(categoryDiv) {
  if (!draggedItemId) return;
  var draggedItem = null,
    draggedCatIndex = -1,
    draggedItemIndex = -1;
  for (var catIndex = 0; catIndex < groceryData.length; catIndex++) {
    var idx = groceryData[catIndex].items.findIndex(function (i) {
      return i.id === draggedItemId;
    });
    if (idx !== -1) {
      draggedItem = groceryData[catIndex].items[idx];
      draggedCatIndex = catIndex;
      draggedItemIndex = idx;
      break;
    }
  }
  if (!draggedItem) return;
  var targetCategoryName = categoryDiv.dataset.categoryName;
  var targetCatIndex = -1;
  for (var _catIndex4 = 0; _catIndex4 < groceryData.length; _catIndex4++) {
    if (groceryData[_catIndex4].category === targetCategoryName) {
      targetCatIndex = _catIndex4;
      break;
    }
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
  var editPanel = document.getElementById('editPanel');
  var addForm = document.getElementById('addForm');
  var mainEditButton = document.getElementById('mainEditButton');
  if (isEditMode) {
    editPanel.classList.add('active');
    addForm.classList.add('hidden');
    mainEditButton.classList.remove('active');
    document.getElementById('editAddForm').classList.add('hidden');
    document.getElementById('editAddCategoryForm').classList.add('hidden');
    Object.values(pendingDeleteItems).forEach(function (pending) {
      if (pending) {
        clearInterval(pending.timeoutId);
        pending.element.classList.remove('pending-delete');
      }
    });
    pendingDeleteItems = {};
    isPendingDeleteMode = false;
    if (pendingDeleteCategory) {
      clearInterval(pendingDeleteCategory.timeoutId);
      pendingDeleteCategory.element.classList.remove('pending-delete');
      pendingDeleteCategory = null;
    }
  } else {
    editPanel.classList.remove('active');
    if (currentTab === 'all') {
      addForm.classList.remove('hidden');
      mainEditButton.classList.add('active');
    }
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
  var itemElement = document.querySelector("[data-item-id=\"".concat(itemId, "\"]"));
  if (!itemElement) return;
  showPendingDeleteForRemoval(itemId, itemElement);
}
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab').forEach(function (t) {
    return t.classList.remove('active');
  });
  event.target.classList.add('active');
  Object.values(pendingDeleteItems).forEach(function (pending) {
    if (pending) {
      clearInterval(pending.timeoutId);
      pending.element.classList.remove('pending-delete');
    }
  });
  pendingDeleteItems = {};
  isPendingDeleteMode = false;
  if (pendingDeleteCategory) {
    clearInterval(pendingDeleteCategory.timeoutId);
    pendingDeleteCategory.element.classList.remove('pending-delete');
    pendingDeleteCategory = null;
  }
  if (isEditMode) toggleEditMode();
  renderList();
}
function updateStats() {
  var needCount = 0,
    haveCount = 0;
  groceryData.forEach(function (category) {
    category.items.forEach(function (item) {
      if (item.need) needCount++;else haveCount++;
    });
  });
  document.getElementById('needCount').textContent = needCount;
  document.getElementById('haveCount').textContent = haveCount;
}

// Key press handlers
function handleKeyPress(event) {
  if (event.key === 'Enter') addNewItem();
}
function handleEditKeyPress(event) {
  if (event.key === 'Enter') addNewItemFromEdit();
}
function handleCategoryKeyPress(event) {
  if (event.key === 'Enter') addNewCategory();
}
function handleItemIconKeyPress(event) {
  if (event.key === 'Enter') (isEditMode ? addNewItemFromEdit : addNewItem)();
}
function addNewItem() {
  var input = document.getElementById('newItemInput');
  var iconInput = document.getElementById('newItemIconMain');
  addItemToList(input, iconInput);
}
function addNewItemFromEdit() {
  var input = document.getElementById('editNewItemInput');
  var iconInput = document.getElementById('newItemIcon');
  addItemToList(input, iconInput);
}
function addItemToList(input, iconInput) {
  var name = input.value.trim();
  var icon = iconInput.value.trim() || '📦';
  if (name && isFirebaseInitialized) {
    var newId = Date.now();
    if (groceryData.length > 0) groceryData[0].items.push({
      id: newId,
      name: name,
      icon: icon,
      need: true
    });else groceryData.push({
      category: "Разное",
      icon: "📦",
      items: [{
        id: newId,
        name: name,
        icon: icon,
        need: true
      }]
    });
    input.value = '';
    iconInput.value = '📦';
    renderList();
    saveData();
  } else if (!isFirebaseInitialized) {
    alert('Сначала настройте Firebase для добавления товаров');
  }
}
function addNewCategory() {
  var nameInput = document.getElementById('newCategoryName');
  var iconInput = document.getElementById('newCategoryIcon');
  var name = nameInput.value.trim();
  var icon = iconInput.value.trim() || '📦';
  if (name && isFirebaseInitialized) {
    groceryData.push({
      category: name,
      icon: icon,
      items: []
    });
    nameInput.value = '';
    iconInput.value = '📦';
    renderList();
    saveData();
  }
}

// Edit product modal functions
var currentEditingItemId = null;
function openEditProductModal(itemId) {
  currentEditingItemId = itemId;

  // Find the item in groceryData
  var item = null;
  for (var _iterator2 = _createForOfIteratorHelperLoose(groceryData), _step2; !(_step2 = _iterator2()).done;) {
    var category = _step2.value;
    var found = category.items.find(function (i) {
      return i.id === itemId;
    });
    if (found) {
      item = found;
      break;
    }
  }
  if (!item) return;

  // Populate the modal with current values
  document.getElementById('editProductName').value = item.name;
  document.getElementById('editProductIcon').value = item.icon;

  // Show the modal
  document.getElementById('editProductModal').classList.add('active');

  // Focus on the name input
  document.getElementById('editProductName').focus();
}
function closeEditProductModal() {
  document.getElementById('editProductModal').classList.remove('active');
  currentEditingItemId = null;
}
function closeEditProductModalOnOverlay(event) {
  if (event.target.classList.contains('edit-product-modal-overlay')) {
    closeEditProductModal();
  }
}
function saveEditedProduct() {
  if (!currentEditingItemId) return;
  var newName = document.getElementById('editProductName').value.trim();
  var newIcon = document.getElementById('editProductIcon').value.trim() || '📦';
  if (!newName) {
    alert('Пожалуйста, введите название продукта');
    return;
  }

  // Find and update the item
  for (var _iterator3 = _createForOfIteratorHelperLoose(groceryData), _step3; !(_step3 = _iterator3()).done;) {
    var category = _step3.value;
    var item = category.items.find(function (i) {
      return i.id === currentEditingItemId;
    });
    if (item) {
      item.name = newName;
      item.icon = newIcon;
      break;
    }
  }

  // Close modal and re-render
  closeEditProductModal();
  renderList();
  saveData();
}

// Initialize
checkFirebaseConfig();
pendingDeleteItems = {};
pendingDeleteCategory = null;

// Check if Service Workers are supported (iOS 12 Safari has limited support)
if ('serviceWorker' in navigator) {
  console.log('✅ Service Worker API available');
} else {
  console.log('ℹ️ Service Worker API not supported - app will work without offline mode');
}

// Settings
var selectedColumns = 1;
var selectedBadgeMode = 'text';
function loadColumnsSettings() {
  var savedColumns = localStorage.getItem('groceryColumns');
  selectedColumns = savedColumns ? parseInt(savedColumns) : 1;
  var savedBadge = localStorage.getItem('groceryBadgeMode');
  selectedBadgeMode = savedBadge || 'text';
  updateColumnsUI();
  updateBadgeUI();
  applyBadgeMode();
}
function updateColumnsUI() {
  document.querySelectorAll('#columnsOptions .column-option').forEach(function (option) {
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
  document.querySelectorAll('#badgeOptions .column-option').forEach(function (option) {
    option.classList.toggle('active', option.dataset.badge === selectedBadgeMode);
  });
}
function applyBadgeMode() {
  var groceryList = document.getElementById('groceryList');
  if (groceryList) {
    if (selectedBadgeMode === 'icon') groceryList.classList.add('show-icons');else groceryList.classList.remove('show-icons');
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
  var groceryList = document.getElementById('groceryList');
  if (groceryList) groceryList.className = 'grocery-list columns-' + selectedColumns;
}
function updateStatusBadges() {
  document.querySelectorAll('.grocery-item').forEach(function (item) {
    var badge = item.querySelector('.status-badge');
    var itemName = item.querySelector('.item-name');
    var toggle = item.querySelector('.toggle-switch');
    if (!badge || !itemName || !toggle) return;
    var isNeed = badge.dataset.need === 'true';
    var textNeed = 'Закончилось';
    var textHave = 'Есть';
    var availableWidth = toggle.getBoundingClientRect().left - itemName.getBoundingClientRect().right - 15;
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
var resizeTimeout;
window.addEventListener('resize', function () {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(updateStatusBadges, 300);
});
