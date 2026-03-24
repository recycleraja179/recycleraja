import { db } from "./firebase.js";
import { collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

async function loadOrders(vendor) {
  const snapshot = await getDocs(collection(db, "orders"));
  let container = document.getElementById("ordersList");

  let output = "";

  snapshot.forEach((docSnap) => {
    let data = docSnap.data();

    if (data.vendor === vendor.name) {
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
}

window.completeOrder = async function(id) {
  await updateDoc(doc(db, "orders", id), {
    status: "Completed"
  });

  location.reload();
};

window.logout = function() {
  localStorage.removeItem("loggedVendor");
  window.location.href = "vendor-login.html";
};
