// 🔥 LOAD VENDOR DATA
window.addEventListener("DOMContentLoaded", function () {
  let vendor = JSON.parse(localStorage.getItem("currentVendor"));

  if (!vendor) {
    window.location.href = "vendor-login.html";
    return;
  }

  document.getElementById("vName").innerText = vendor.name;
  document.getElementById("vArea").innerText = vendor.area;
  document.getElementById("vPin").innerText = vendor.pincode;
  document.getElementById("vPhone").innerText = vendor.phone;

  loadOrders(vendor);
});

// 📦 LOAD ORDERS
function loadOrders(vendor) {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let container = document.getElementById("ordersList");

  // 🔍 FILTER ONLY THIS VENDOR'S ORDERS
  let vendorOrders = orders.filter(o => o.vendor === vendor.name);

  if (vendorOrders.length === 0) {
    container.innerHTML = "<p>No orders yet</p>";
    return;
  }

  container.innerHTML = vendorOrders.map((order, index) => `
    <div class="order-card">
      <p><strong>👤 ${order.name}</strong></p>
      <p>📞 ${order.phone}</p>
      <p>📍 ${order.address}</p>
      <p>♻️ ${order.scrapType} (${order.weight}kg)</p>
      <p>📅 ${order.date}</p>
      <p>Status: <strong>${order.status}</strong></p>

      ${
        order.status === "Pending"
        ? `<button onclick="completeOrder(${index})">Mark Completed ✅</button>`
        : ""
      }
    </div>
  `).join("");
}

// ✅ COMPLETE ORDER
function completeOrder(index) {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  orders[index].status = "Completed";

  localStorage.setItem("orders", JSON.stringify(orders));

  location.reload();
}

// 🔐 LOGOUT
function logout() {
  localStorage.removeItem("currentVendor");
  window.location.href = "vendor-login.html";
}