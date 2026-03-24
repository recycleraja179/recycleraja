// 🚀 MAIN SCRIPT (RecycleRaja)

// ==============================
// 📍 LOAD VENDORS INTO DROPDOWN
// ==============================
window.addEventListener("DOMContentLoaded", function () {
  let vendors = JSON.parse(localStorage.getItem("vendors")) || [];

  let select = document.getElementById("pincodeSelect");

  if (select) {
    // Clear default except first
    select.innerHTML = `<option value="">Select Your Area</option>`;

    vendors.forEach(v => {
      let option = document.createElement("option");
      option.value = v.pincode;
      option.textContent = `${v.area} (${v.pincode})`;
      select.appendChild(option);
    });
  }

  // 🧾 LOAD CART DATA (if exists)
  loadCartSummary();
});


// ==============================
// 🧾 LOAD CART DATA INTO SELL PAGE
// ==============================
function loadCartSummary() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = localStorage.getItem("total") || 0;

  let cartBox = document.getElementById("cartSummary");

  if (cartBox && cart.length > 0) {
    let itemsHTML = cart.map(item =>
      `<p>${item.name} - ${item.qty}kg = ₹${item.total}</p>`
    ).join("");

    cartBox.innerHTML = `
      <h3>Your Selected Scrap</h3>
      ${itemsHTML}
      <h4>Total: ₹${total}</h4>
    `;
  }
}


// ==============================
// 📦 FORM SUBMIT → MATCH VENDOR
// ==============================
document.getElementById("sellForm")?.addEventListener("submit", function(e) {
  e.preventDefault();

  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let address = document.getElementById("address").value;
  let pincode = document.getElementById("pincodeSelect").value;
  let scrapType = document.getElementById("scrapType").value;
  let weight = document.getElementById("weight").value;
  let time = document.getElementById("time").value;
  let notes = document.getElementById("notes").value;

  let vendors = JSON.parse(localStorage.getItem("vendors")) || [];

  // 🔍 FIND MATCHED VENDOR
  let matchedVendor = vendors.find(v => v.pincode === pincode);

  // 🧾 CART DATA
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = localStorage.getItem("total") || 0;

  let cartText = cart.map(item =>
    `${item.name} - ${item.qty}kg = ₹${item.total}`
  ).join("\n");

  // 📩 MESSAGE
  let message = `
📦 Scrap Pickup Request

👤 Name: ${name}
📞 Phone: ${phone}
📍 Address: ${address}
📮 Pincode: ${pincode}

♻️ Scrap Type: ${scrapType}
⚖️ Weight: ${weight} kg
⏰ Time: ${time}

🧾 Items:
${cartText}

💰 Estimated Total: ₹${total}

📝 Notes: ${notes}
`;

  if (matchedVendor) {
    let url = `https://wa.me/${matchedVendor.phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  } else {
    alert("❌ No vendor available in this area");
  }
});
// 🔥 AUTO-FILL SCRAP TYPE
let savedType = localStorage.getItem("scrapType");

if (savedType) {
  let scrapInput = document.getElementById("scrapType");

  if (scrapInput) {
    // If it's dropdown → set first option
    let options = scrapInput.options;

    for (let i = 0; i < options.length; i++) {
      if (savedType.toLowerCase().includes(options[i].value.toLowerCase())) {
        scrapInput.selectedIndex = i;
        break;
      }
    }
  }
}
let order = {
  name,
  phone,
  address,
  pincode,
  scrapType,
  weight,
  vendor: matchedVendor?.name || "Not Assigned",
  status: "Pending",
  date: new Date().toLocaleString()
};

let orders = JSON.parse(localStorage.getItem("orders")) || [];
orders.push(order);
localStorage.setItem("orders", JSON.stringify(orders));
// 💾 SAVE ORDER
let order = {
  name,
  phone,
  address,
  pincode,
  scrapType,
  weight,
  vendor: matchedVendor?.name || "Not Assigned",
  status: "Pending",
  date: new Date().toLocaleString()
};

let orders = JSON.parse(localStorage.getItem("orders")) || [];
orders.push(order);
localStorage.setItem("orders", JSON.stringify(orders));