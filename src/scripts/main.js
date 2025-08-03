// src/scripts/main.js

import { setupDragAndDrop } from './drag-drop.js';
import { parseExifData } from './exif-parser.js';

function showImages(files) {
  const gallery = document.getElementById('gallery');
  gallery.hidden = false;
  gallery.innerHTML = '';

  files.forEach((file) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);

    // Create card
    const card = document.createElement('div');
    card.className = 'card';

    // Create image
    const img = document.createElement('img');
    img.src = url;
    img.alt = file.name;
    img.className = 'card__image';

    // Create metadata container
    const meta = document.createElement('div');
    meta.className = 'card__meta';

    // Add image to card
    card.appendChild(img);

    // Add metadata to card
    parseExifData(file).then((exifData) => {
      console.log('EXIF Data for', file.name, ':', exifData); // Add this line
      meta.innerHTML = `
        <p><strong>Filename:</strong> ${file.name}</p>
        <p><strong>Size:</strong> ${(file.size / 1024).toFixed(1)} KB</p>
        <p><strong>Type:</strong> ${file.type}</p>
        <p><strong>Camera:</strong> ${exifData.camera}</p>
        <p><strong>Lens:</strong> ${exifData.lens}</p>
        <p><strong>Focal Length:</strong> ${exifData.focalLength}</p>
        <p><strong>Aperture:</strong> ${exifData.aperture}</p>
        <p><strong>ISO:</strong> ${exifData.iso}</p>
      `;
    });

    card.appendChild(meta);
    gallery.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupDragAndDrop('dropzone', showImages);
});
