# Coy — "Discover" Tab & Double-Blind Matching App

A mobile-first, high-performance web application featuring a Tinder/Bumble-style **"Discover"** swipe deck built alongside a placeholder "Home" tab and a real-time "Matches" view. Built for the **Coy SDE Intern Assignment**.

Live Demo / Architecture Preview: Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and a persistent double-blind matching backend engine.

---

## Part A: Suggested Core Features for Coy (`app.getcoy.com`)

Based on our exploration of Coy's unique premise as an adult double-blind anonymous crush matching app, here are two high-impact core feature recommendations:

### 1. Context Clues & Relationship Badges (Privacy-Preserving Zero-Knowledge Hints)
* **What it is**: When a user secretly adds a crush, they can optionally select **one** standardized, whitelisted context tag:
  * *"From college / university"*
  * *"Met through mutual friends"*
  * *"Met at an event / social gathering"*
  * *"Colleague / work circle"*
  * *"From your contacts"*
  The recipient receives this single badge in their anonymous WhatsApp/SMS notification without revealing name, gender, or handle.
* **Why it is required**:
  * **Eliminates Recipient Conversion Drop-off**: Cold anonymous SMS/WhatsApp alerts often trigger suspicion of scam, phishing, or harassment from strangers. A verified context tag builds immediate authenticity and curiosity.
  * **Maintains Zero-Knowledge Security**: The badge leaks no identifying personal details, upholding Coy's fundamental double-blind guarantee.

### 2. Inactive Slot Reclamation & Cooldown Expiry (Eliminating "Slot Paralysis")
* **What it is**: Currently, Coy limits users to 3 free slots and makes crush additions permanent to prevent fishing. We propose an **Inactive Slot Reclamation System**:
  * If an invited crush has not registered within **45 days** and all scheduled reminder notifications have been sent, or if the recipient clicks the standard "Opt-out" link, that slot is safely archived and recycled back to the user's available quota.
* **Why it is required**:
  * **Relieves High-Friction "Slot Anxiety"**: Users hesitate to use their 3 free slots because they fear wasting one permanently on an inactive number or someone who never opens SMS.
  * **Anti-Fishing Protection**: The 45-day cooldown prevents rapid brute-force guessing while keeping users engaged and opening the app over their lifetime.

---

## Part B: Discover Tab Features & Specifications

### 1. 32 Seeded Diverse Profiles
- Seeded with 32 realistic profiles across top universities and cities (Delhi University, IITs, BITS, Amity, Bangalore, Mumbai).
- Includes name, age, verified badge, photo, college/city, bio, and interest tags.
- **Pre-Liked Profiles**: 8 seeded profiles have secretly liked the logged-in user in advance. When the user swipes right on any of them, an instant mutual match is triggered!

### 2. Gesture-Driven Swipe Experience
- **Framer Motion Physics**: Smooth drag gestures with proportional rotation (`rotate = x * 0.1`) and spring exit animations.
- **Tactile Stamps**:
  - Green **"LIKE"** badge tilts left when dragging right.
  - Red **"PASS"** badge tilts right when dragging left.
- **Desktop & Mobile Controls**:
  - Dragging via touch or mouse.
  - Desktop buttons for Pass (❌) and Like (💚).
  - Global keyboard navigation: `ArrowLeft` to Pass, `ArrowRight` to Like.
- **Strict Deduplication**: Once swiped, a profile **never** appears again in the user's feed.
- **Empty State**: Elegant empty card when all profiles are swiped, with one-click demo reset.

### 3. Double-Blind Matching & Privacy
- **Confidentiality by Design**: The `GET /api/feed` endpoint **never** leaks whether a profile has liked the user.
- **Mutual Match Celebration**: A match is created **only** when both parties have liked each other.
- **Confetti & Match Screen**: Instant full-screen celebratory modal with `canvas-confetti` fireworks, dual avatars, and quick actions ("Send a Message", "Keep Swiping").
- **Matches Tab**: Lists all mutual matches with avatars, timestamps, and an interactive chat preview with simulated instant replies.

### 4. Backend REST APIs
- `GET /api/feed`: Returns unswiped profiles for the active user.
- `POST /api/swipe`: Records `like` or `pass`, evaluates mutual match server-side, and returns `{ success: true, match: boolean, profile?: Profile }`.
- `GET /api/matches`: Returns all mutual matches for the active user.
- `POST /api/reset`: Resets demo swipes and restores all 32 seed profiles.
- **Persistence**: All swipes and matches persist across browser reloads via safe atomic JSON storage (`src/data/db.json`).

---

## Tech Stack
- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Coy dark theme & glassmorphism)
- **Animations & Gestures**: Framer Motion
- **Celebration Effects**: canvas-confetti
- **Icons**: Lucide React
- **Persistence**: Atomic file-based JSON store (`src/data/db.json`)

---

## Quick Start & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/manjot3093/coy-discover-tab.git
cd coy-discover-tab
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## Author & Candidate Information
- **Name**: Manjot Singh
- **Email**: manjot3093singh@gmail.com
- **WhatsApp**: +91 8825313581
- **Graduation Year**: 2027 (Amity University Jharkhand, B.Tech CSE)
- **Portfolio**: [manjot3093.dev](https://manjot3093.dev)
- **GitHub**: [github.com/manjot3093](https://github.com/manjot3093)
