# Grocery List App

## Project Overview

A single-page web application for managing a shared grocery shopping list. The app allows users to toggle items between "Закончилось" (Need to buy) and "Есть" (In stock) states, with real-time synchronization across multiple devices via Firebase.

**Live Demo:** https://artteth.github.io/grocery-list/

### Key Features

- **Product Categories:** 5 pre-defined categories (Dairy, Vegetables/Fruits, Meat/Fish, Groceries, Beverages)
- **Toggle Switches:** Visual on/off switches for each item's status
- **Two Views:** 
  - "Все продукты" — Full product list
  - "Закончилось" — Filtered view showing only items that need to be bought
- **Real-time Sync:** Firebase Firestore backend for cross-device synchronization
- **Add Items:** Users can add new products to the list
- **Responsive Design:** Mobile-friendly UI with gradient styling
- **Status Indicators:** Color-coded rows (red for "need", green for "have")

### Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Firebase Firestore (serverless)
- **Hosting:** GitHub Pages
- **Dependencies:** Firebase SDK 10.7.1 (loaded via CDN)

### Architecture

```
┌─────────────────┐     ┌──────────────────┐
│   GitHub Pages  │────▶│  Firebase CDN    │
│   (index.html)  │     │  (SDK scripts)   │
└────────┬────────┘     └──────────────────┘
         │
         ▼
┌─────────────────┐
│ Firebase        │
│ Firestore DB    │
│ (groceryList)   │
└─────────────────┘
```

**Data Structure:**
```javascript
{
  items: [
    {
      category: "Молочные продукты",
      icon: "🥛",
      items: [
        { id: 1, name: "Молоко", icon: "🥛", need: true },
        // ...
      ]
    }
  ]
}
```

## Firebase Configuration

The app uses a pre-configured Firebase project:

```json
{
  "apiKey": "AIzaSyDXdQAqgdbVASNUIIXykvvQD61g6262Uztm8",
  "authDomain": "food-bot-8cb9c.firebaseapp.com",
  "projectId": "food-bot-8cb9c",
  "storageBucket": "food-bot-8cb9c.firebasestorage.app",
  "messagingSenderId": "353425559275",
  "appId": "1:353425559275:web:ec33211ab9494f700e38ae"
}
```

### Firestore Rules (Test Mode)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Development

### Local Development

Open `index.html` directly in a browser:
```bash
open index.html
```

### Deploying to GitHub Pages

1. Make changes to `index.html`
2. Commit and push:
   ```bash
   git add index.html
   git commit -m "Description of changes"
   git push
   ```
3. Changes are live in 1-2 minutes at https://artteth.github.io/grocery-list/

### File Structure

```
food_bot/
├── index.html      # Single-file application (HTML + CSS + JS)
├── QWEN.md         # This documentation file
└── .git/           # Git repository
```

## UI Components

| Component | Description |
|-----------|-------------|
| Header | App title with sync status indicator |
| Tabs | Toggle between "All products" and "Ended" views |
| Stats | Counter showing items in each state |
| Grocery List | Scrollable list of categorized items |
| Toggle Switch | Visual checkbox for item status |
| Add Form | Input field + button for new items |

## Color Scheme

- **Primary Gradient:** `#667eea` → `#764ba2` (purple)
- **Header Gradient:** `#f093fb` → `#f5576c` (pink)
- **Need (Red):** `#ffcdd2` → `#ef9a9a`
- **Have (Green):** `#e8f5e9` / `#c8e6c9`

## Future Enhancements

Potential improvements:
- [ ] User authentication for private lists
- [ ] Multiple shopping lists support
- [ ] Quantity/amount fields
- [ ] Store/location assignments
- [ ] Export to shopping list apps
- [ ] Offline support with PWA
