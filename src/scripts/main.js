// src/scripts/main.js

import { setupDragAndDrop } from './drag-drop.js';

function showImages(files) {
  const gallery = document.getElementById('gallery');
  gallery.hidden = false;
  gallery.innerHTML = ''; // Clear previous images

  files.forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = url;
    img.alt = file.name;
    img.className = 'card__image';
    card.appendChild(img);
    gallery.appendChild(card);

    // Add EXIF data section
    const meta = document.createElement('div');
    meta.className = 'card__meta';
    meta.innerHTML = `
  <p><strong>Filename:</strong> ${file.name}</p>
  <p><strong>Size:</strong> ${(file.size / 1024).toFixed(1)} KB</p>
  <p><strong>Type:</strong> ${file.type}</p>
  
`;
card.appendChild(meta);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupDragAndDrop('dropzone', showImages);
});