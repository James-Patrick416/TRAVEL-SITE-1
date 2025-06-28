#   TRAVEL-SITE-1

# 🌍 Travel Booking Web App

An interactive front-end + JSON backend travel experience that allows users to explore destinations, search, flip cards, favorite trips, and make bookings — built using **HTML**, **CSS**, **JavaScript**, and **JSON Server**.

---

## ✈️ Live Demo

- **Frontend**: [GitHub Pages Live](https://james-patrick416.github.io/TRAVEL-SITE-1/)
- **Backend**: [Render JSON API](https://travel-site-1-ep8o.onrender.com)

---

## 📁 Project Structure

TRAVEL-SITE-1/
│
├── index.html # Main HTML layout
├── script.js # All DOM & API logic
├── config.js # Intro screen config
├── style.css # All styling and animations
├── destinations.json # JSON API data (destinations, bookings, favorites)
├── package.json # JSON server config and dependencies
├── server.js # Express-style JSON server setup
└── images/ # Static assets (used in destinations)
├── india.jpg
├── shanghai.jpg
├── uk.jpg
└── plane.jpg


---

## 🚀 Features

- ✅ **Intro overlay** with blur and animation (uses `config.js`)
- ✅ **Dynamic destination cards** with 3D flip animation
- ✅ **Search bar** to filter destinations live
- ✅ **Booking modal** with confirmation popup
- ✅ **Favorites system** (add/edit/delete stored in `favorites`)
- ✅ **Intersection animations** (cards + text on scroll)
- ✅ **Fully integrated frontend-backend via JSON Server API**

---

## ⚙️ Backend (Render)

Built with `json-server` and deployed on [Render](https://render.com/).

### API Endpoints:

- `GET /destinations` — all destination cards
- `POST /bookings` — booking submission
- `GET /favorites` — list all favorites
- `POST /favorites` — add a new favorite
- `DELETE /favorites/:id` — remove favorite
- `PATCH /favorites/:id` — rename a favorite

---

## 🛠️ How to Run Locally

### 1. Clone this repo:
```bash
git clone https://github.com/james-patrick416/TRAVEL-SITE-1.git
cd TRAVEL-SITE-1

## Install backend dependencies:
```bash npm install

## Run the JSON Server:
```bash node server.js
Visit: http://localhost:3000/destinations to test

## Open index.html in a browser
