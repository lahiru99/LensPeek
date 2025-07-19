// src/scripts/drag-drop.js

export function setupDragAndDrop(dropzoneId, onFiles) {
  const dropzone = document.getElementById(dropzoneId);

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dropzone--active');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dropzone--active');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dropzone--active');
    const files = Array.from(e.dataTransfer.files);
    onFiles(files);
  });

  // Optional: handle click to open file dialog
  dropzone.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = () => onFiles(Array.from(input.files));
    input.click();
  });
} 