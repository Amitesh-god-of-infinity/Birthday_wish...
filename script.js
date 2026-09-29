
const passwordGate = document.getElementById("passwordGate");
const passwordForm = document.getElementById("passwordForm");
const passwordInput = document.getElementById("passwordInput");
const passwordError = document.getElementById("passwordError");
const passwordToggle = document.getElementById("passwordToggle");

const PASSWORD_HASH = "3926ed10287b0c76b81b24559209a113e986e47553ae65f633725f37ca22bf33";
const ACCESS_KEY = "anweshaBirthdayUnlocked";

async function hashText(value) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, "0")).join("");
}

function unlockLetter() {
  sessionStorage.setItem(ACCESS_KEY, "true");
  passwordGate.classList.add("unlocked");
  setTimeout(() => passwordGate.setAttribute("aria-hidden", "true"), 800);
}

if (sessionStorage.getItem(ACCESS_KEY) === "true") {
  passwordGate.classList.add("unlocked");
  passwordGate.setAttribute("aria-hidden", "true");
}

passwordToggle.addEventListener("click", () => {
  const showing = passwordInput.type === "text";
  passwordInput.type = showing ? "password" : "text";
  passwordToggle.setAttribute("aria-pressed", String(!showing));
  passwordToggle.setAttribute("aria-label", showing ? "Show password" : "Hide password");
});

passwordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  passwordError.textContent = "";
  const entered = passwordInput.value;
  if (!entered) {
    passwordError.textContent = "Please enter the password.....";
    passwordInput.focus();
    return;
  }
  const hash = await hashText(entered);
  if (hash === PASSWORD_HASH) {
    unlockLetter();
  } else {
    passwordError.textContent = "That's not the password..... try again. ✦";
    passwordForm.classList.remove("shake");
    void passwordForm.offsetWidth;
    passwordForm.classList.add("shake");
    passwordInput.select();
  }
});


const content = document.getElementById("content");
const progress = document.querySelector(".progress");
const sectionCount = document.getElementById("sectionCount");
const beginBtn = document.getElementById("beginBtn");
const letterBtn = document.getElementById("letterBtn");
const musicBtn = document.getElementById("musicBtn");
const musicIcon = document.getElementById("musicIcon");
const audio = document.getElementById("bgAudio");
const memoryLeft = document.getElementById("memoryLeft");
const memoryRight = document.getElementById("memoryRight");

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#039;"}[ch]));
}

function isImportant(text) {
  const lower = text.toLowerCase();
  return importantPatterns.some(p => lower.includes(p.toLowerCase()));
}

function isVideo(src) { return /\.(mp4|webm|ogg)$/i.test(src); }

function createMedia(item, kind) {
  const wrap = document.createElement("figure");
  wrap.className = `media-slot ${kind === "video" ? "video" : "photo"}`;
  const frame = document.createElement("div");
  frame.className = "media-frame";

  if (kind === "video") {
    const video = document.createElement("video");
    video.src = item.src;
    video.controls = true;
    video.preload = "metadata";
    video.playsInline = true;
    video.setAttribute("aria-label", item.alt || "Shared video memory");
    if (item.poster) video.poster = item.poster;

    // Keep the birthday music and memory-video audio from fighting each other.
    video.addEventListener("play", () => {
      video.dataset.resumedMusic = (!audio.paused).toString();
      if (!audio.paused) audio.pause();
      musicIcon.textContent = "♫";
      musicBtn.setAttribute("aria-pressed", "false");
      musicBtn.style.color = "";
    });
    const resumeMusic = () => {
      if (video.dataset.resumedMusic === "true") {
        audio.play().then(() => {
          musicIcon.textContent = "♫";
          musicBtn.setAttribute("aria-pressed", "true");
          musicBtn.style.color = "#d8cbe2";
        }).catch(() => {});
      }
    };
    video.addEventListener("ended", resumeMusic);
    video.addEventListener("pause", () => {
      if (video.ended) return;
      // Do not automatically resume when the viewer manually pauses the video.
    });
    frame.appendChild(video);
  } else {
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt || "A shared memory";
    img.loading = "lazy";
    frame.appendChild(img);
  }
  wrap.appendChild(frame);
  content.appendChild(wrap);
}

function render() {
  birthdaySections.forEach((section, index) => {
    const wrap = document.createElement("article");
    wrap.className = "letter-section";
    wrap.id = `section-${index + 1}`;

    const marker = document.createElement("div");
    marker.className = "section-marker";
    marker.innerHTML = `<span>${String(index + 1).padStart(2,"0")}</span>`;
    wrap.appendChild(marker);

    section.forEach(paragraph => {
      const p = document.createElement("p");
      p.className = "letter-p";
      p.innerHTML = escapeHTML(paragraph);
      if (isImportant(paragraph)) p.classList.add("important");
      if (paragraph.trim().length <= 20 || /^\.+$/.test(paragraph.trim())) p.classList.add("pause");
      wrap.appendChild(p);
    });
    content.appendChild(wrap);

    photos.filter(p => p.afterSection === index + 1).forEach(item => createMedia(item, "photo"));
    videos.filter(v => v.afterSection === index + 1).forEach(item => createMedia(item, "video"));
  });
}
render();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("revealed");
  });
}, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
document.querySelectorAll(".letter-p").forEach(p => observer.observe(p));

const sidePool = photos.filter(p => !/family/i.test(p.src));
let lastSection = 0;
function updateSideMemories(active) {
  if (!memoryLeft || !memoryRight || active === lastSection) return;
  lastSection = active;
  memoryLeft.innerHTML = "";
  memoryRight.innerHTML = "";
  if (!active) return;

  const start = ((active - 1) * 2) % sidePool.length;
  const picks = [sidePool[start], sidePool[(start + 3) % sidePool.length], sidePool[(start + 6) % sidePool.length], sidePool[(start + 9) % sidePool.length]];
  [picks[0], picks[1]].forEach((item, i) => {
    if (!item) return;
    const card = document.createElement("div");
    card.className = `memory-card ${i === 0 ? "card-a" : "card-b"}`;
    card.innerHTML = `<img src="${escapeHTML(item.src)}" alt="">`;
    memoryLeft.appendChild(card);
    requestAnimationFrame(() => card.classList.add("active"));
  });
  [picks[2], picks[3]].forEach((item, i) => {
    if (!item) return;
    const card = document.createElement("div");
    card.className = `memory-card ${i === 0 ? "card-a" : "card-b"}`;
    card.innerHTML = `<img src="${escapeHTML(item.src)}" alt="">`;
    memoryRight.appendChild(card);
    requestAnimationFrame(() => card.classList.add("active"));
  });
}

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const pct = scrollable <= 0 ? 0 : Math.min(100, Math.max(0, window.scrollY / scrollable * 100));
  progress.style.width = pct + "%";

  const sections = [...document.querySelectorAll(".letter-section")];
  let active = 0;
  sections.forEach((s, i) => {
    const r = s.getBoundingClientRect();
    if (r.top <= window.innerHeight * .42) active = i + 1;
  });
  if (active > 0) {
    sectionCount.textContent = `${String(active).padStart(2,"0")} / ${String(sections.length).padStart(2,"0")}`;
    updateSideMemories(active);
  }
}
window.addEventListener("scroll", updateProgress, { passive:true });
window.addEventListener("resize", updateProgress);
updateProgress();

async function startMusic() {
  try {
    audio.volume = 0;
    await audio.play();
    musicIcon.textContent = "♫";
    musicBtn.setAttribute("aria-pressed", "true");
    musicBtn.style.color = "#d8cbe2";
    let volume = 0;
    const fadeIn = setInterval(() => {
      volume += 0.02;
      audio.volume = Math.min(volume, 0.25);
      if (volume >= 0.25) clearInterval(fadeIn);
    }, 80);
    return true;
  } catch (error) {
    console.log("Audio could not start:", error);
    return false;
  }
}

beginBtn.addEventListener("click", async () => {
  document.getElementById("letter").scrollIntoView({ behavior:"smooth", block:"start" });
  await startMusic();
});

letterBtn.addEventListener("click", () => {
  document.getElementById("top").scrollIntoView({ behavior:"smooth", block:"start" });
});

musicBtn.addEventListener("click", async () => {
  if (audio.paused) {
    await startMusic();
  } else {
    audio.pause();
    musicIcon.textContent = "♫";
    musicBtn.setAttribute("aria-pressed", "false");
    musicBtn.style.color = "";
  }
});

audio.addEventListener("error", () => {
  musicBtn.title = "Add your own assets/music.mp3 to enable music";
});
