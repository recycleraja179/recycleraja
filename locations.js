// 📍 LOAD LOCATIONS (VENDORS + DEFAULT FALLBACK)
window.addEventListener("DOMContentLoaded", function () {

  const container = document.getElementById("locationList");
  if (!container) return;

  // 🔹 GET VENDORS FROM LOCAL STORAGE
  let vendors = JSON.parse(localStorage.getItem("vendors")) || [];

  // 🔹 DEFAULT LOCATIONS (fallback)
  const defaultLocations = [
    { area: "Himayat Nagar", pincode: "500029" },
    { area: "Narayanguda", pincode: "500029" },
    { area: "Ashok Nagar", pincode: "500020" },
    { area: "Chikkadpally", pincode: "500020" },
    { area: "Nallakunta", pincode: "500044" },
    { area: "Kompally", pincode: "500014" },
    { area: "Jeedimetla", pincode: "500055" }
  ];

  let locationsToShow = [];

  // 🔥 IF VENDORS EXIST → SHOW THEM
  if (vendors.length > 0) {

    let uniqueLocations = {};

    vendors.forEach(v => {
      if (v.pincode && v.area) {
        uniqueLocations[v.pincode] = v.area;
      }
    });

    locationsToShow = Object.entries(uniqueLocations).map(
      ([pincode, area]) => ({ area, pincode })
    );

  } else {
    // 🔹 ELSE SHOW DEFAULT
    locationsToShow = defaultLocations;
  }

  // 🎯 RENDER UI
  container.innerHTML = locationsToShow.map(loc => `
    <div class="location-card">
      
      <div class="location-icon">📍</div>
      
      <h3>${loc.area}</h3>
      
      <p>Pincode: ${loc.pincode}</p>
      
      <button onclick="goToSell('${loc.pincode}')">
        Sell Scrap ♻️
      </button>

    </div>
  `).join("");

});


// 🚀 REDIRECT FUNCTION (IMPORTANT: outside)
function goToSell(pincode) {
  window.location.href = `sell.html?pincode=${pincode}`;
}
