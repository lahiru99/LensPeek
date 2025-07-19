// src/scripts/main.js

import { setupDragAndDrop } from './drag-drop.js';

function showImages(files) {
  const gallery = document.getElementById('gallery');
  gallery.hidden = false;
  gallery.innerHTML = ''; // Clear previous images

  files.forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    const img = document.createElement('img');
    img.src = url;
    img.alt = file.name;
    img.style.maxWidth = '100%';
    img.style.margin = '1rem 0';
    gallery.appendChild(img);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupDragAndDrop('dropzone', showImages);
}); 