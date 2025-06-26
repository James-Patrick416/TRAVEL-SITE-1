// ========== Intro Overlay ==========
const overlay = document.getElementById('overlay');
const startBtn = document.getElementById('start-button');

// Set button text and styles from config
overlay.style.backdropFilter = `blur(${config.intro.blurAmount})`;
overlay.style.background = `rgba(255, 255, 255, ${config.intro.overlayOpacity})`;
startBtn.textContent = config.intro.buttonText;

// ✅ Prevent overlay from showing again during session
if (!sessionStorage.getItem('intro-shown')) {
  document.body.classList.remove('loaded');
  overlay.style.display = 'flex';
  overlay.classList.remove('fade-out');
} else {
  overlay.style.display = 'none';
  document.body.classList.add('loaded');
}

// 🎬 When user clicks "Start Exploring"
startBtn.addEventListener('click', () => {
  overlay.classList.add('fade-out');
  setTimeout(() => {
    overlay.style.display = 'none';
    document.body.classList.add('loaded');
    sessionStorage.setItem('intro-shown', 'yes');
  }, 1200);
});


// ========== Load Destinations (GET) ==========
fetch("https://travel-site-1-ep8o.onrender.com/destinations")
  .then(res => res.json())
  .then(data => {
    const grid = document.getElementById('card-grid');
    data.forEach((dest, index) => {
      const card = document.createElement('div');
      card.className = `flip-card drop-delay-${index}`;
      card.dataset.index = index;
      card.innerHTML = `
        <div class="flip-card-inner">
          <div class="flip-card-front" style="background-image: url('${dest.image}')"></div>
          <div class="flip-card-back">
            <h3>${dest.title}</h3>
            <p>${dest.info}</p>
            <div class="card-actions">
              <button class="book-btn">Book Now</button>
              <button class="fav-icon" data-title="${dest.title}">&#10084;</button>
            </div>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    document.querySelectorAll('.flip-card').forEach(card => {
      observer.observe(card);
    });
  });

// ========== Flip Cards ==========
document.addEventListener('click', function (e) {
  const card = e.target.closest('.flip-card');
  if (!card) return;
  document.querySelectorAll('.flip-card.flipped').forEach(c => {
    if (c !== card) c.classList.remove('flipped');
  });
  card.classList.toggle('flipped');
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('drop-in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

// ========== Booking Modal ==========
const modal = document.getElementById('booking-modal');
const modalTitle = document.getElementById('modal-destination');
const closeBtn = document.querySelector('.close-modal');

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('book-btn')) {
    const card = e.target.closest('.flip-card');
    const title = card.querySelector('h3')?.textContent || 'Your Destination';
    modalTitle.textContent = `Book: ${title}`;
    modal.classList.add('show');
  }
});

closeBtn.addEventListener('click', () => modal.classList.remove('show'));
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('show');
});

// ========== Booking Form (POST) ==========
const bookingForm = document.getElementById('booking-form');
const confirmPopup = document.getElementById('confirmation-popup');
const confirmMsg = document.getElementById('confirmation-message');

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = bookingForm.elements['name'].value;
  const email = bookingForm.elements['email'].value;
  const destination = modalTitle.textContent.replace('Book: ', '');

  fetch("https://travel-site-1-ep8o.onrender.com/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, destination })
  }).then(() => {
    confirmMsg.textContent = `Booking Confirmed for ${destination}! 🎉`;
    confirmPopup.classList.add('show');
    setTimeout(() => confirmPopup.classList.remove('show'), 3000);
    bookingForm.reset();
    modal.classList.remove('show');
  });
});

// ========== Search ==========
const searchInput = document.getElementById('search-input');
const noResults = document.getElementById('no-results');

searchInput.addEventListener('input', function () {
  const query = this.value.toLowerCase();
  const cards = document.querySelectorAll('.flip-card');
  let matchCount = 0;

  cards.forEach(card => {
    const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
    const match = title.includes(query);
    card.style.display = match ? 'block' : 'none';
    if (match) matchCount++;
  });

  noResults.style.display = matchCount === 0 ? 'block' : 'none';
});

// ========== Favorites API (GET, POST, DELETE, PATCH) ==========
const favoriteInput = document.getElementById('favorite-input');
const addFavoriteBtn = document.getElementById('add-favorite');
const favoritesList = document.getElementById('favorites-list');

function fetchFavorites() {
  fetch("https://travel-site-1-ep8o.onrender.com/favorites")
    .then(res => res.json())
    .then(data => renderFavorites(data));
}

function renderFavorites(favorites) {
  favoritesList.innerHTML = '';
  favorites.forEach(fav => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="fav-name">${fav.name}</span>
  <button type="button" data-id="${fav.id}" class="remove-fav">×</button>
  <button type="button" data-id="${fav.id}" data-name="${fav.name}" class="edit-fav">✏️</button>
      `;
    favoritesList.appendChild(li);
  });
  updateCardHearts(favorites);
}

function updateCardHearts(favorites) {
  document.querySelectorAll('.fav-icon').forEach(btn => {
    const title = btn.dataset.title;
    const isFav = favorites.some(fav => fav.name === title);
    btn.classList.toggle('active', isFav);
  });
}

addFavoriteBtn.addEventListener('click', (e) => {
  const scrollY = window.scrollY;
  e.preventDefault()// stops scroll to top behavior
  const value = favoriteInput.value.trim();
  if (!value) return;

  fetch("https://travel-site-1-ep8o.onrender.com/favorites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: value })
  }).then(() => {
    favoriteInput.value = '';
    fetchFavorites();
    window.scrollTo(0, scrollY); // restore scroll position
  });
});

favoritesList.addEventListener('click', (e) => {
  e.preventDefault(); // prevent any form button reload
  const id = e.target.dataset.id;

  if (e.target.classList.contains('remove-fav')) {
    fetch(`https://travel-site-1-ep8o.onrender.com/favorites/${id}`, { method: "DELETE" })
      .then(() => fetchFavorites());
  }

  if (e.target.classList.contains('edit-fav')) {
    const currentName = e.target.dataset.name;
    const newName = prompt("Edit favorite name:", currentName);
    if (!newName || newName === currentName) return;

    fetch(`https://travel-site-1-ep8o.onrender.com/favorites/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName })
    }).then(() => fetchFavorites());
  }
});

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('fav-icon')) {
    const title = e.target.dataset.title;

    fetch("https://travel-site-1-ep8o.onrender.com/favorites")
      .then(res => res.json())
      .then(favorites => {
        const match = favorites.find(f => f.name === title);
        if (match) {
          fetch(`https://travel-site-1-ep8o.onrender.com/favorites/${match.id}`, { method: "DELETE" })
            .then(() => fetchFavorites());
        } else {
          fetch("https://travel-site-1-ep8o.onrender.com/favorites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: title })
          }).then(() => fetchFavorites());
        }
      });
  }
});

fetchFavorites();

// ========== Text Animations ==========
const textElements = [
  { el: document.querySelector('h1'), delay: 'delay-1' },
  { el: document.querySelector('p'), delay: 'delay-2' }
];

const textObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('text-animate');
      textObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

textElements.forEach(item => {
  if (item.el) {
    item.el.classList.add(item.delay);
    textObserver.observe(item.el);
  }
});
