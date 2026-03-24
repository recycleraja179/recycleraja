import { db } from "./firebase.js";
import { collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==============================
// 🚀 LOAD DASHBOARD
// ==============================
window.addEventListener("DOMContentLoaded", async function () {
  let vendor = JSON.parse(localStorage.getItem("loggedVendor"));

  if (!vendor) {
    window.location.href = "vendor-login.html";
    return;
  }

  document.getElementById("vName").innerText = vendor.name;
  document.getElementById("vArea").innerText = vendor.area;
  document.getElementById("vPin").innerText = vendor.pincode;
  document.getElementById("vPhone").innerText = vendor.phone;

  await loadOrders(vendor);
});


// ==============================
// 📦 LOAD ORDERS + CALCULATE STATS
// ==============================
async function loadOrders(vendor) {
  const snapshot = await getDocs(collection(db, "orders"));
  let container = document.getElementById("ordersList");

  let output = "";
  let vendorOrders = [];

  snapshot.forEach((docSnap) => {
    let data = docSnap.data();

    if (data.vendor === vendor.name) {
      vendorOrders.push({ id: docSnap.id, ...data });

      output += `
        <div class="order-card">
          <p><strong>${data.name}</strong></p>
          <p>${data.phone}</p>
          <p>${data.address}</p>
          <p>${data.scrapType}</p>
          <p>Status: ${data.status}</p>

          ${
            data.status === "Pending"
            ? `<button onclick="completeOrder('${docSnap.id}')">Complete</button>`
            : ""
          }
        </div>
      `;
    }
  });

  container.innerHTML = output || "No orders yet";

  // 🔥 CALCULATE STATS
  calculateStats(vendorOrders);
}


// ==============================
// 📊 CALCULATE REPORTS
// ==============================
function calculateStats(orders) {
  let today = new Date();

  let todayCount = 0;
  let weekCount = 0;
  let monthRevenue = 0;
  let yearRevenue = 0;

  orders.forEach(order => {
    let orderDate = order.createdAt?.toDate
      ? order.createdAt.toDate()
      : new Date(order.createdAt);

    let diffDays = (today - orderDate) / (1000 * 60 * 60 * 24);

    // 📅 Today Orders
    if (diffDays < 1) {
      todayCount++;
    }

    // 📆 Weekly Orders
    if (diffDays < 7) {
      weekCount++;
    }

    // 💰 Monthly Revenue
    if (
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    ) {
      monthRevenue += order.total || 0;
    }

    // 📈 Yearly Revenue
    if (orderDate.getFullYear() === today.getFullYear()) {
      yearRevenue += order.total || 0;
    }
  });

  // 🔥 UPDATE UI
  document.getElementById("todayOrders").innerText = todayCount;
  document.getElementById("weekOrders").innerText = weekCount;
  document.getElementById("monthRevenue").innerText = monthRevenue;
  document.getElementById("yearRevenue").innerText = yearRevenue;
}


// ==============================
// ✅ COMPLETE ORDER
// ==============================
window.completeOrder = async function(id) {
  await updateDoc(doc(db, "orders", id), {
    status: "Completed"
  });

  alert("Order completed ✅");
  location.reload();
};


// ==============================
// 🔐 LOGOUT
// ==============================
window.logout = function() {
  localStorage.removeItem("loggedVendor");
  window.location.href = "vendor-login.html";
};
