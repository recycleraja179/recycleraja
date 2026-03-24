// 🚀 IMPORT FIREBASE
import { db } from "./firebase.js";
import { collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==============================
// ➕ ADD VENDOR (FIREBASE)
// ==============================
document.getElementById("adminForm")?.addEventListener("submit", async function(e) {
  e.preventDefault();

  let vendor = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    area: document.getElementById("area").value,
    pincode: document.getElementById("pincode").value,
    id: document.getElementById("vid").value,
    password: document.getElementById("passField").value,
    createdAt: new Date()
  };

  try {
    await addDoc(collection(db, "vendors"), vendor);

    alert("Vendor Added ✅");
    document.getElementById("adminForm").reset();

    loadVendors(); // refresh list
  } catch (err) {
    console.error(err);
    alert("Error adding vendor ❌");
  }
});


// ==============================
// 📋 LOAD VENDORS FROM FIREBASE
// ==============================
async function loadVendors() {
  const querySnapshot = await getDocs(collection(db, "vendors"));

  let list = document.getElementById("vendorList");
  let total = document.getElementById("totalVendors");

  if (!list) return;

  let vendors = [];

  querySnapshot.forEach((docSnap) => {
    vendors.push({ id: docSnap.id, ...docSnap.data() });
  });

  if (total) total.innerText = vendors.length;

  if (vendors.length === 0) {
    list.innerHTML = "<p>No vendors added yet</p>";
    return;
  }

  list.innerHTML = vendors.map((v) => `
    <div class="order-card">
      <p><strong>${v.name}</strong></p>
      <p>📞 ${v.phone}</p>
      <p>📍 ${v.area} (${v.pincode})</p>
      <p>🆔 ID: ${v.id}</p>
      <button onclick="deleteVendor('${v.id}')">Delete ❌</button>
    </div>
  `).join("");
}


// ==============================
// ❌ DELETE VENDOR FROM FIREBASE
// ==============================
window.deleteVendor = async function(id) {
  try {
    await deleteDoc(doc(db, "vendors", id));
    loadVendors();
  } catch (err) {
    console.error(err);
    alert("Error deleting vendor ❌");
  }
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
