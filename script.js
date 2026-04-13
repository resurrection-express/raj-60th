// ── Helpers ───────────────────────────────────────────────────────────────
function isAudio(entry) { return typeof entry === "object" && entry.type === "audio"; }
function wishSrc(entry) {
  return `videos/${encodeURIComponent(isAudio(entry) ? entry.audio : entry)}`;
}

// ── Elements ──────────────────────────────────────────────────────────────
const stackTrigger  = document.getElementById("stack-trigger");
const stackPreview  = document.getElementById("stack-preview");
const videoModal    = document.getElementById("video-modal");
const modalBackdrop = document.getElementById("modal-backdrop");
const modalCloseBtn = document.getElementById("modal-close-btn");
const mainVideo     = document.getElementById("main-video");
const mainAudio     = document.getElementById("main-audio");
const audioImage    = document.getElementById("audio-image");
const playerWrap    = document.querySelector(".modal-player-wrap");
const thumbStrip    = document.getElementById("thumb-strip");
const bentoGrid     = document.getElementById("bento-grid");

// ── Stack preview thumbnail ────────────────────────────────────────────────
stackPreview.src = wishSrc(wishes[0]);
stackPreview.addEventListener("loadedmetadata", () => {
  stackPreview.currentTime = 1;
});

// ── Build thumbnail strip ──────────────────────────────────────────────────
wishes.forEach((entry, i) => {
  const item = document.createElement("div");
  item.className = "thumb-item";
  item.dataset.index = i;

  if (isAudio(entry)) {
    const img = document.createElement("img");
    img.src = `photos/${encodeURIComponent(entry.image)}`;
    img.alt = "";
    item.appendChild(img);
  } else {
    const vid = document.createElement("video");
    vid.src = wishSrc(entry);
    vid.preload = "metadata";
    vid.playsInline = true;
    vid.muted = true;
    vid.controlsList = "nodownload";
    vid.addEventListener("loadedmetadata", () => { vid.currentTime = 1; });
    item.appendChild(vid);
  }

  item.addEventListener("click", () => switchTo(i));
  thumbStrip.appendChild(item);
});

// ── Modal open / close ─────────────────────────────────────────────────────
function openModal() {
  videoModal.hidden = false;
  document.body.style.overflow = "hidden";
  switchTo(0);
}

function closeModal() {
  mainVideo.pause();
  mainAudio.pause();
  videoModal.hidden = true;
  document.body.style.overflow = "";
}

stackTrigger.addEventListener("click", openModal);
stackTrigger.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") openModal();
});
modalBackdrop.addEventListener("click", closeModal);
modalCloseBtn.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !videoModal.hidden) closeModal();
});

// ── Switch wish ───────────────────────────────────────────────────────────
function switchTo(index) {
  const entry = wishes[index];

  // Stop both players
  mainVideo.pause();
  mainAudio.pause();

  if (isAudio(entry)) {
    // Show audio mode: image + audio controls
    mainVideo.style.display = "none";
    audioImage.src = `photos/${encodeURIComponent(entry.image)}`;
    audioImage.style.display = "block";
    mainAudio.src = wishSrc(entry);
    mainAudio.style.display = "block";
    mainAudio.load();
    mainAudio.play().catch(() => {});
  } else {
    // Show video mode
    audioImage.style.display = "none";
    mainAudio.style.display = "none";
    mainVideo.style.display = "block";
    mainVideo.src = wishSrc(entry);
    mainVideo.load();
    mainVideo.play().catch(() => {});
  }

  thumbStrip.querySelectorAll(".thumb-item").forEach((el) => {
    el.classList.toggle("active", parseInt(el.dataset.index) === index);
  });

  const active = thumbStrip.querySelector(".thumb-item.active");
  if (active) {
    active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }
}

// ── Photo grid ────────────────────────────────────────────────────────────
photos.forEach(({ file }) => {
  const item = document.createElement("div");
  item.className = "bento-item";

  const img = document.createElement("img");
  img.src = `photos/${encodeURIComponent(file)}`;
  img.alt = "";
  img.loading = "lazy";

  item.appendChild(img);
  bentoGrid.appendChild(item);
});
