// 📍 LOCATIONS PAGE SCRIPT (SHOW MODE + FUTURE READY)

window.addEventListener("DOMContentLoaded", function () {

  const container = document.getElementById("locationList");
  if (!container) return;

  // 🔥 STATIC LOCATIONS (SHOW PURPOSE NOW)
  const defaultLocations = [
    { area: "Himayat Nagar", pincode: "500029" },
    { area: "Narayanguda", pincode: "500029" },
    { area: "Ashok Nagar", pincode: "500020" },
    { area: "Chikkadpally", pincode: "500020" },
    { area: "Nallakunta", pincode: "500044" },

    { area: "Kompally", pincode: "500014" },
    { area: "Suchitra", pincode: "500067" },
    { area: "Jeedimetla", pincode: "500055" },
    { area: "Suraram", pincode: "500055" },
    { area: "Gandimaisamma", pincode: "500043" },

    { area: "Balanagar", pincode: "500037" },
    { area: "Kukatpally", pincode: "500072" },
    { area: "Bachupally", pincode: "500090" },
    { area: "Nizampet", pincode: "500090" }
  ];

  // 🔹 FUTURE: LOAD VENDORS (WHEN YOU ADD THEM)
  let vendors = JSON.parse(localStorage.getItem("vendors")) || [];

  let locationsToShow = [];

  // 🔥 IF VENDORS EXIST → USE THEM
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
    // 🔹 CURRENT: SHOW DEFAULT LOCATIONS
    locationsToShow = defaultLocations;
  }

  // 🎯 RENDER LOCATIONS
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


// 🚀 REDIRECT TO SELL PAGE WITH PINCODE
function goToSell(pincode) {
  window.location.href = `sell.html?pincode=${pincode}`;
}
