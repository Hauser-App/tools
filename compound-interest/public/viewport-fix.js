// This script ensures the viewport meta tag is properly set
// It runs immediately when included in the HTML
(function () {
  // Check if viewport meta exists
  let viewport = document.querySelector('meta[name="viewport"]');

  // If it doesn't exist, create it
  if (!viewport) {
    viewport = document.createElement("meta");
    viewport.name = "viewport";
    document.head.appendChild(viewport);
  }

  // Set the proper content value for responsive design
  viewport.content =
    "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
})();
