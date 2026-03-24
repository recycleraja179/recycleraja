// 🚀 IMPORT FIREBASE
import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==============================
// ➕ ADD VENDOR (LOCAL STORAGE)
// ==============================
document.getElementById("adminForm")?.addEventListener("submit", function(e) {
  e.preventDefault();

  let vendor = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    area: document.getElementById("area").value,
    pincode: document.getElementById("pincode").value,
    id: document.getElementById("vid").value,
    password: document.getElementById("passField").value
  };

  let vendors = JSON.parse(localStorage.getItem("vendors")) || [];

  let exists = vendors.find(v => v.id === vendor.id);

  if (exists) {
    alert("Vendor ID already exists ❌");
    return;
  }

  vendors.push(vendor);
  localStorage.setItem("vendors", JSON.stringify(vendors));

  alert("Vendor Added ✅");
  document.getElementById("adminForm").reset();

  loadVendors();
});


// ==============================
// 📋 LOAD VENDORS
// ==============================
function loadVendors() {
  let vendors = JSON.parse(localStorage.getItem("vendors")) || [];

  let list = document.getElementById("vendorList");
  let total = document.getElementById("totalVendors");

  if (total) total.innerText = vendors.length;

  if (!list) return;

  if (vendors.length === 0) {
    list.innerHTML = "<p>No vendors added yet</p>";
    return;
  }

  list.innerHTML = vendors.map((v, index) => `
    <div class="order-card">
      <p><strong>${v.name}</strong></p>
      <p>📞 ${v.phone}</p>
      <p>📍 ${v.area} (${v.pincode})</p>
      <p>🆔 ID: ${v.id}</p>
      <button onclick="deleteVendor(${index})">Delete ❌</button>
    </div>
  `).join("");
}


// ==============================
// ❌ DELETE VENDOR
// ==============================
window.deleteVendor = function(index) {
  let vendors = JSON.parse(localStorage.getItem("vendors")) || [];

  vendors.splice(index, 1);
  localStorage.setItem("vendors", JSON.stringify(vendors));

  loadVendors();
};


// ==============================
// 📦 LOAD ORDERS FROM FIREBASE
// ==============================
async function loadOrders() {
  const querySnapshot = await getDocs(collection(db, "orders"));

  let container = document.getElementById("ordersContainer");

  if (!container) return;

  let output = "";

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    output += `
      <div class="order-card">
        <h3>👤 ${data.name}</h3>
        <p>📞 ${data.phone}</p>
        <p>📍 ${data.address}</p>
        <p>📮 ${data.pincode || "Not selected"}</p>
        <p>♻️ ${data.scrapType}</p>
        <p>⚖️ ${data.weight} kg</p>
        <p>💰 ₹${data.total}</p>
        <p>Status: ${data.status}</p>
      </div>
    `;
  });

  container.innerHTML = output || "<p>No orders yet</p>";
}


// ==============================
// 🔥 LOAD EVERYTHING
// ==============================
window.addEventListener("DOMContentLoaded", () => {
  loadVendors();
  loadOrders();
});
