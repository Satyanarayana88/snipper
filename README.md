# Snip — URL Shortener

A minimal, modern URL shortener built with vanilla JavaScript and Firebase.

## Features

- **Create Short URLs** — Generate short 6-character codes for long URLs
- **View All URLs** — Browse all your shortened links in one place
- **Instant Redirect** — Fast lookup and redirect to original URLs
- **Copy to Clipboard** — One-click copy for easy sharing

## Tech Stack

- HTML, CSS, Vanilla JavaScript
- Firebase Firestore (database)
- Firebase Hosting

## Design

Clean glassmorphism UI with a dark theme, featuring:
- Moody charcoal background
- Warm amber accent colors
- Backdrop blur effects
- Syne font for headings, DM Mono for URLs

## Setup

1. Clone the repository
2. Configure Firebase in `firebase-config.js`
3. Enable Firestore Database in Firebase Console
4. Deploy using Firebase Hosting or serve locally

## Project Structure

```
snip/
├── index.html         # Main app (Create & My URLs views)
├── redirect.html      # Redirect handler
├── style.css          # Glassmorphism styling
├── app.js             # Main application logic
├── redirect.js        # Redirect logic
└── firebase-config.js # Firebase configuration
```

## How It Works

1. User enters a long URL
2. App generates a random 6-character code
3. Saves the mapping to Firestore
4. Returns a short URL like `yoursite.com/redirect.html?code=abc123`
5. When visited, the short URL redirects to the original

---

Built with ❤️ for learning Firebase and web development
