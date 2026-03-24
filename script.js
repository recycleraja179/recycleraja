// 🚀 IMPORT FIREBASE
import { db } from "./firebase.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==============================
// 📍 LOAD VENDORS FROM FIREBASE + CART
// ==============================
window.addEventListener("DOMContentLoaded", function () {
  loadVendors(); // 🔥 NEW
  loadCartSummary();
});


// ==============================
// 🔥 LOAD VENDORS FROM FIREBASE
// ==============================
async function loadVendors() {
  const querySnapshot = await getDocs(collection(db, "vendors"));

  let select = document.getElementById("pincodeSelect");

  if (!select) return;

  select.innerHTML = `<option value="">Select Your Area</option>`;

  querySnapshot.forEach((doc) => {
    let v = doc.data();

    let option = document.createElement("option");
    option.value = v.pincode;
    option.textContent = `${v.area} (${v.pincode})`;

    select.appendChild(option);
  });
}


// ==============================
// 🧾 LOAD CART
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
// 🔥 AUTO-FILL SCRAP TYPE
// ==============================
let savedType = localStorage.getItem("scrapType");

if (savedType) {
  let scrapInput = document.getElementById("scrapType");

  if (scrapInput) {
    let options = scrapInput.options;

    for (let i = 0; i < options.length; i++) {
      if (savedType.toLowerCase().includes(options[i].value.toLowerCase())) {
        scrapInput.selectedIndex = i;
        break;
      }
    }
  }
}


// ==============================
// 📦 FORM SUBMIT (MAIN LOGIC)
// ==============================
document.getElementById("sellForm")?.addEventListener("submit", async function(e) {
  e.preventDefault();

  console.log("🔥 Form submitted");

  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let address = document.getElementById("address").value;
  let pincode = document.getElementById("pincodeSelect").value;
  let scrapType = document.getElementById("scrapType").value;
  let weight = document.getElementById("weight").value;
  let pickupDate = document.getElementById("pickupDate").value;
let pickupTime = document.getElementById("pickupTime").value;
  let notes = document.getElementById("notes").value;

  // 🔥 GET VENDORS FROM FIREBASE (MATCHING)
  const querySnapshot = await getDocs(collection(db, "vendors"));

  let matchedVendor = null;

  querySnapshot.forEach((doc) => {
    let v = doc.data();
    if (v.pincode === pincode) {
      matchedVendor = v;
    }
  });

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = localStorage.getItem("total") || 0;

  let cartText = cart.map(item =>
    `${item.name} - ${item.qty}kg = ₹${item.total}`
  ).join("\n");


  // ==============================
  // 🔥 SAVE TO FIREBASE (ORDERS)
  // ==============================
  try {
    console.log("📤 Sending data to Firebase...");

    await addDoc(collection(db, "orders"), {
      name,
      phone,
      address,
      pincode,
      scrapType,
      weight,
      time,
      notes,
      cart,
      total,
      vendor: matchedVendor?.name || "Not Assigned",
      status: "Pending",
      createdAt: new Date()
    });

    console.log("✅ Data saved to Firebase");

  } catch (err) {
    console.error("❌ Firebase Error:", err);
  }


  // ==============================
  // 📩 WHATSAPP SEND
  // ==============================
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

  alert("✅ Request Submitted Successfully!");
});
