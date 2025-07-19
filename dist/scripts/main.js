"use strict";
(() => {
  // src/scripts/drag-drop.js
  function setupDragAndDrop(dropzoneId, onFiles) {
    const dropzone = document.getElementById(dropzoneId);
    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("dropzone--active");
    });
    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("dropzone--active");
    });
    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("dropzone--active");
      const files = Array.from(e.dataTransfer.files);
      onFiles(files);
    });
    dropzone.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.multiple = true;
      input.onchange = () => onFiles(Array.from(input.files));
      input.click();
    });
  }

  // src/scripts/main.js
  function showImages(files) {
    const gallery = document.getElementById("gallery");
    gallery.hidden = false;
    gallery.innerHTML = "";
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      const img = document.createElement("img");
      img.src = url;
      img.alt = file.name;
      img.style.maxWidth = "100%";
      img.style.margin = "1rem 0";
      gallery.appendChild(img);
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
    setupDragAndDrop("dropzone", showImages);
  });
})();
