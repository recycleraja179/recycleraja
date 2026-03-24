// 🚀 ADMIN PANEL LOGIC

// ➕ ADD VENDOR
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

  // 🔥 CHECK DUPLICATE ID
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

// 📋 LOAD VENDORS
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

      <!-- ❌ DELETE BUTTON -->
      <button onclick="deleteVendor(${index})">Delete ❌</button>
    </div>
  `).join("");
}

// ❌ DELETE VENDOR
function deleteVendor(index) {
  let vendors = JSON.parse(localStorage.getItem("vendors")) || [];

  vendors.splice(index, 1);

  localStorage.setItem("vendors", JSON.stringify(vendors));

  loadVendors();
}

// 🔥 LOAD ON PAGE START
window.addEventListener("DOMContentLoaded", loadVendors);