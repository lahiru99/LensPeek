// src/scripts/main.js

import { setupDragAndDrop } from './drag-drop.js';
import { parseExifData } from './exif-parser.js';

function appendMetaRow(parent, label, value) {
  const row = document.createElement('p');
  const labelEl = document.createElement('strong');
  labelEl.textContent = `${label}: `;
  row.append(labelEl, document.createTextNode(String(value)));
  parent.appendChild(row);
}

/** EXIF DateTime is "YYYY:MM:DD HH:MM:SS" — format for display, e.g. "12 May 2023". */
function formatPhotoDate(exifData) {
  if (exifData.camera === 'No EXIF data') return 'No EXIF data';
  if (!exifData.date) return 'Unknown';

  const normalized = exifData.date.replace(
    /^(\d{4}):(\d{2}):(\d{2})/,
    '$1-$2-$3'
  );
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return 'Unknown';

  return parsed.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function fillCardMeta(meta, file, exifData) {
  meta.replaceChildren();
  appendMetaRow(meta, 'Filename', file.name);
  appendMetaRow(meta, 'Size', `${(file.size / 1024).toFixed(1)} KB`);
  appendMetaRow(meta, 'Type', file.type);
  appendMetaRow(meta, 'Camera', exifData.camera);
  appendMetaRow(meta, 'Lens', exifData.lens);
  appendMetaRow(meta, 'Focal Length', exifData.focalLength);
  appendMetaRow(meta, 'Aperture', exifData.aperture);
  appendMetaRow(meta, 'ISO', exifData.iso);
  appendMetaRow(meta, 'Shutter', exifData.shutterSpeed);
  appendMetaRow(meta, 'Date', formatPhotoDate(exifData));
}

function showImages(files) {
  const gallery = document.getElementById('gallery');
  gallery.hidden = false;
  gallery.replaceChildren();

  files.forEach((file) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);

    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = url;
    img.alt = file.name;
    img.className = 'card__image';

    const meta = document.createElement('\u0064iv');
    meta.className = 'card__meta';

    card.appendChild(img);

    parseExifData(file).then((exifData) => {
      fillCardMeta(meta, file, exifData);
    });

    card.appendChild(meta);
    gallery.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupDragAndDrop('dropzone', showImages);
});
