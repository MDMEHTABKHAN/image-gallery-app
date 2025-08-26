

const gallery = document.getElementById("gallery");
const searchInput = document.getElementById("searchInput");
const loader = document.getElementById("loader");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const closeBtn = document.getElementById("closeBtn");

const ACCESS_KEY = "M5e7bzf9h9jF4kgI8cgU60xoM2W8AJ-nF7GXkjwyLN4";

let query = "nature";
let page = 1;
let photos = [];
let currentIndex = 0;

async function fetchImages() {
    loader.style.display = "block";
    let url = `https://api.unsplash.com/search/photos?page=${page}&query=${query}&client_id=${ACCESS_KEY}&per_page=12`;
    try {
const res = await fetch(url);
const data = await res.json();
loader.style.display = "none";
photos = photos.concat(data.results);
displayImages(data.results);
    } catch (err) {
loader.style.display = "none";
console.error(err);
    }
}

function displayImages(images) {
    images.forEach((img) => {
const wrapper = document.createElement("div");
wrapper.classList.add("img-card");

const imgElement = document.createElement("img");
imgElement.src = img.urls.small;
imgElement.alt = img.alt_description || "Unsplash Image";
imgElement.addEventListener("click", () => openLightbox(imgElement.src, photos.indexOf(img)));

const caption = document.createElement("p");
caption.innerHTML = `Photo by <a href="${img.user.links.html}" target="_blank">${img.user.name}</a>`;

const downloadBtn = document.createElement("a");
downloadBtn.href = img.links.download + "?force=true";
downloadBtn.download = "unsplash-image.jpg";
downloadBtn.innerText = "Download";
downloadBtn.classList.add("download-btn");

wrapper.appendChild(imgElement);
wrapper.appendChild(caption);
wrapper.appendChild(downloadBtn);
gallery.appendChild(wrapper);
    });
}

function openLightbox(src, index) {
    lightbox.style.display = "flex";
    lightboxImg.src = src;
    currentIndex = index;
}

function updateLightbox() {
    if (currentIndex >= 0 && currentIndex < photos.length) {
lightboxImg.src = photos[currentIndex].urls.small;
    }
}

prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
currentIndex--;
updateLightbox();
    }
});

nextBtn.addEventListener("click", () => {
    if (currentIndex < photos.length - 1) {
currentIndex++;
updateLightbox();
    }
});

closeBtn.addEventListener("click", () => {
    lightbox.style.display = "none";
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
    if (lightbox.style.display === "flex") {
if (e.key === "ArrowLeft") prevBtn.click();
if (e.key === "ArrowRight") nextBtn.click();
if (e.key === "Escape") closeBtn.click();
    }
});

// Infinite Scroll
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
page++;
fetchImages();
    }
});

// Search
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
query = searchInput.value;
page = 1;
photos = [];
gallery.innerHTML = "";
fetchImages();
    }
});

// Dark/Light mode toggle
document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// Initial fetch
fetchImages();