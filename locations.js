// 📍 LOAD VENDORS → SHOW LOCATIONS
window.addEventListener("DOMContentLoaded", function () {
  let vendors = JSON.parse(localStorage.getItem("vendors")) || [];

  let container = document.getElementById("locationList");

  if (!container) return;

  if (vendors.length === 0) {
    container.innerHTML = "<p>No locations available yet</p>";
    return;
  }

  // 🔥 REMOVE DUPLICATES (same pincode)
  let uniqueLocations = {};

  vendors.forEach(v => {
    uniqueLocations[v.pincode] = v.area;
  });

  // 🎯 DISPLAY
  container.innerHTML = Object.entries(uniqueLocations).map(
    ([pincode, area]) =>
      `<div class="location-card">
        <h3>📍 ${area}</h3>
        <p>Pincode: ${pincode}</p>
      </div>`
  ).join("");
});