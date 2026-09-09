// 1. Canvas Sfondo Dinamico
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = Math.random() * 0.3 - 0.15;
    this.speedY = Math.random() * -0.3 - 0.1;
    this.opacity = Math.random() * 0.4 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.y < 0 || this.x < 0 || this.x > canvas.width) this.reset();
  }
  draw() {
    ctx.fillStyle = `rgba(56, 189, 248, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < 50; i++) particles.push(new Particle());

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

// 2. Dati della Storia (Con Nomi File Maiuscoli)
const journeyData = [
  {
    title: "Il Primo Sguardo 💙",
    date: "15 Settembre",
    img: "FOTO_1.JPG",
    desc: "Il giorno in cui tutto è iniziato senza che nemmeno ce ne rendessimo conto. Uno sguardo, un sorriso e l'inizio di qualcosa di speciale."
  },
  {
    title: "Chiacchierate Infinite 💬",
    date: "I primi giorni",
    img: "FOTO_2.JPG",
    desc: "Ore ed ore a scriverci fino a tarda notte. Non importava l'ora, parlare con te rendeva ogni momento unico."
  },
  {
    title: "La Nostra Canzone 🎧",
    date: "Musica insieme",
    img: "FOTO_8.JPG",
    desc: "Ascoltare i brani preferiti insieme. Un momento semplice ma pieno di significato."
  },
  {
    title: "Sempre Più Uniti 💍",
    date: "Oggi e Domani",
    img: "FOTO_3.JPG",
    desc: "Ogni singolo giorno trascorso insieme rende questo legame unico. E questo è solo il primo capitolo."
  }
];

let stepIndex = 0;

// 3. FASE 0 -> FASE 1 (Avvio Viaggio)
function startJourney() {
  gsap.to("#start-screen", {
    opacity: 0,
    scale: 1.05,
    duration: 0.6,
    ease: "power2.inOut",
    onComplete: () => {
      document.getElementById('start-screen').classList.add('hidden');
      const overlay = document.getElementById('journey-overlay');
      overlay.classList.remove('hidden');
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.5 });
      renderJourneyStep();
    }
  });
}

// 4. Gestione Tap Anywhere per Avanzare
function handleScreenTap(event) {
  if (stepIndex < journeyData.length - 1) {
    stepIndex++;
    renderJourneyStep();
  } else {
    finishJourney();
  }
}

function renderJourneyStep() {
  const data = journeyData[stepIndex];
  
  const progressPercent = ((stepIndex + 1) / journeyData.length) * 100;
  document.getElementById('progress-fill').style.width = `${progressPercent}%`;

  gsap.to("#journey-card", {
    opacity: 0,
    y: -20,
    duration: 0.2,
    ease: "power2.in",
    onComplete: () => {
      document.getElementById('j-badge').innerText = `Tappa ${stepIndex + 1} di ${journeyData.length}`;
      document.getElementById('j-title').innerText = data.title;
      document.getElementById('j-date').innerText = data.date;
      document.getElementById('j-img').src = data.img;
      document.getElementById('j-desc').innerText = data.desc;

      gsap.fromTo("#journey-card", 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  });
}

// 5. Transizione alla Dashboard Finale
function finishJourney() {
  gsap.to("#journey-overlay", {
    opacity: 0,
    scale: 0.95,
    duration: 0.6,
    onComplete: () => {
      document.getElementById('journey-overlay').classList.add('hidden');
      const dashboard = document.getElementById('main-dashboard');
      dashboard.classList.remove('hidden');
      
      gsap.fromTo(dashboard, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      );
    }
  });
}

function replayJourney() {
  stepIndex = 0;
  const overlay = document.getElementById('journey-overlay');
  overlay.classList.remove('hidden');
  gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.4 });
  renderJourneyStep();
}

// 6. Gestione Tabs Dashboard Finale
function switchTab(tabId, btn) {
  const currentTab = document.querySelector('.tab-pane.active');
  const targetTab = document.getElementById(tabId);

  if (currentTab === targetTab) return;

  document.querySelectorAll('.pill-btn').forEach(el => el.classList.remove('active'));
  btn.classList.add('active');

  gsap.to(currentTab, {
    opacity: 0,
    y: 10,
    duration: 0.2,
    onComplete: () => {
      currentTab.classList.remove('active');
      targetTab.classList.add('active');
      gsap.fromTo(targetTab,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3 }
      );
    }
  });
}

function selectSummaryStep(idx) {
  const data = journeyData[idx];
  
  gsap.to(".showcase-card", {
    opacity: 0.5,
    duration: 0.15,
    onComplete: () => {
      document.getElementById('summary-img').src = data.img;
      document.getElementById('summary-title').innerText = data.title;
      document.getElementById('summary-date').innerText = data.date;
      document.getElementById('summary-desc').innerText = data.desc;

      const cards = document.querySelectorAll('.step-card');
      cards.forEach((c, i) => c.classList.toggle('active', i === idx));

      gsap.to(".showcase-card", { opacity: 1, duration: 0.3 });
    }
  });
}

// 7. Caricamento Foto / Scatto
function addNewPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const photoGrid = document.getElementById('photo-grid');
    const newCard = document.createElement('div');
    newCard.className = 'photo-card';
    
    newCard.innerHTML = `
      <img src="${e.target.result}" alt="Nuovo ricordo">
      <div class="card-glow"></div>
    `;

    photoGrid.insertBefore(newCard, photoGrid.firstChild);
    gsap.fromTo(newCard, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" });
  };

  reader.readAsDataURL(file);
}

// 8. Scrittura e Salvataggio Lettere (Ora crea buste apribili!)
function saveLetter() {
  const titleInput = document.getElementById('letter-title-input');
  const bodyInput = document.getElementById('letter-body-input');

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!title || !body) {
    alert("Scrivi sia il titolo che il testo della lettera! 📝");
    return;
  }

  const lettersList = document.getElementById('letters-list');
  const today = new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });

  // Creazione della nuova lettera con la stessa struttura a busta
  const newLetter = document.createElement('div');
  newLetter.className = 'letter-envelope glass-box';
  newLetter.style.cssText = 'border: 1px solid rgba(56, 189, 248, 0.4); background: linear-gradient(145deg, rgba(15, 23, 42, 0.9), rgba(14, 165, 233, 0.12)); padding: 20px; border-radius: 18px; margin-top: 20px; cursor: pointer; transition: all 0.3s ease;';
  newLetter.setAttribute('onclick', 'toggleLetter(this)');

  newLetter.innerHTML = `
    <div class="letter-header" style="display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span class="envelope-icon" style="font-size: 1.5rem; transition: transform 0.3s ease;">✉️</span>
        <div>
          <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.2rem; color: #38bdf8; font-weight: 700; margin: 0;">
            ${escapeHtml(title)}
          </h3>
          <p style="font-size: 0.82rem; color: #94a3b8; margin: 2px 0 0 0;">Clicca per aprire la lettera</p>
        </div>
      </div>
      <span class="letter-date" style="font-size: 0.85rem; color: #38bdf8; font-weight: 600; background: rgba(56, 189, 248, 0.1); padding: 4px 10px; border-radius: 20px;">${today}</span>
    </div>

    <div class="letter-body-expandable" style="max-height: 0; overflow: hidden; opacity: 0; transition: max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease, margin-top 0.3s ease;">
      <div class="letter-content" style="font-size: 0.95rem; color: #e2e8f0; line-height: 1.7; white-space: pre-line; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
${escapeHtml(body)}
      </div>
    </div>
  `;

  lettersList.insertBefore(newLetter, lettersList.firstChild);

  titleInput.value = '';
  bodyInput.value = '';

  gsap.fromTo(newLetter, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
}

// 9. Invio Messaggi Chat Premium
function sendChatMessage() {
  const input = document.getElementById('chat-text-input');
  const text = input.value.trim();
  if (!text) return;

  const feed = document.getElementById('chat-feed-container');
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const msgRow = document.createElement('div');
  msgRow.className = 'msg-row sent';
  msgRow.innerHTML = `
    <div class="msg-bubble-glass">
      <p>${escapeHtml(text)}</p>
      <span class="msg-time">${timeStr} <span class="blue-tick">✓✓</span></span>
    </div>
  `;

  feed.appendChild(msgRow);
  input.value = '';
  feed.scrollTop = feed.scrollHeight;

  gsap.fromTo(msgRow, { opacity: 0, y: 15, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.4)" });
}

function handleChatSubmit(event) {
  if (event.key === 'Enter') {
    sendChatMessage();
  }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 10. Contatore Tempo
const startDate = new Date(2023, 8, 15);
function updateCounter() {
  const diff = new Date() - startDate;
  document.getElementById('days').innerText = Math.floor(diff / (1000 * 60 * 60 * 24));
  document.getElementById('hours').innerText = Math.floor((diff / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
  document.getElementById('minutes').innerText = Math.floor((diff / (1000 * 60)) % 60).toString().padStart(2, '0');
  document.getElementById('seconds').innerText = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
}
setInterval(updateCounter, 1000);
updateCounter();

// 11. Funzione per Aprire / Chiudere qualsiasi Lettera
function toggleLetter(card) {
  const body = card.querySelector('.letter-body-expandable');
  const icon = card.querySelector('.envelope-icon');
  
  const isOpen = card.classList.contains('open');

  if (isOpen) {
    card.classList.remove('open');
    body.style.maxHeight = '0';
    body.style.opacity = '0';
    body.style.marginTop = '0';
    if (icon) icon.innerText = '✉️';
  } else {
    card.classList.add('open');
    body.style.maxHeight = body.scrollHeight + 100 + 'px';
    body.style.opacity = '1';
    body.style.marginTop = '12px';
    if (icon) icon.innerText = '📩';
  }
}