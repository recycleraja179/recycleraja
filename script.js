// 🚀 IMPORT FIREBASE
import { db } from "./firebase.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==============================
// 📍 ON LOAD
// ==============================
window.addEventListener("DOMContentLoaded", () => {
  loadVendors();
  loadCartSummary();
  autoFillScrapType();
});


// ==============================
// 🔥 LOAD VENDORS INTO DROPDOWN
// ==============================
async function loadVendors() {
  try {
    const querySnapshot = await getDocs(collection(db, "vendors"));

    let select = document.getElementById("pincodeSelect");
    if (!select) return;

    select.innerHTML = `<option value="">Select Your Area</option>`;

    querySnapshot.forEach((doc) => {
      let v = doc.data();

      if (v.pincode && v.area) {
        let option = document.createElement("option");
        option.value = v.pincode;
        option.textContent = `${v.area} (${v.pincode})`;
        select.appendChild(option);
      }
    });

    console.log("✅ Vendors loaded");

  } catch (err) {
    console.error("❌ Vendor Load Error:", err);
  }
}


// ==============================
// 🧾 LOAD CART SUMMARY
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
function autoFillScrapType() {
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
}


// ==============================
// 📦 FORM SUBMIT (MAIN LOGIC)
// ==============================
document.getElementById("sellForm")?.addEventListener("submit", async function(e) {
  e.preventDefault();

  console.log("🔥 Form submitted");

  // 📥 GET FORM VALUES
  let name = document.getElementById("name").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let address = document.getElementById("address").value.trim();
  let pincode = document.getElementById("pincodeSelect").value;
  let scrapType = document.getElementById("scrapType").value;
  let weight = document.getElementById("weight").value;
  let pickupDate = document.getElementById("pickupDate").value;
  let pickupTime = document.getElementById("pickupTime").value;
  let notes = document.getElementById("notes").value;

  let fullTime = `${pickupDate} at ${pickupTime}`;

  // 🔍 VALIDATION
  if (!name || !phone || !address || !pincode) {
    alert("⚠️ Please fill all required fields");
    return;
  }

  // 🔥 FETCH VENDORS
  let matchedVendor = null;

  try {
    const querySnapshot = await getDocs(collection(db, "vendors"));

    querySnapshot.forEach((doc) => {
      let v = doc.data();

      if (v.pincode === pincode && !matchedVendor) {
        matchedVendor = v;
      }
    });

  } catch (err) {
    console.error("❌ Vendor Fetch Error:", err);
  }

  console.log("🎯 Matched Vendor:", matchedVendor);

  // 🛒 CART DATA
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = localStorage.getItem("total") || 0;

  let cartText = cart.map(item =>
    `${item.name} - ${item.qty}kg = ₹${item.total}`
  ).join("\n");

  // ==============================
  // 🔥 SAVE ORDER TO FIREBASE
  // ==============================
  try {
    await addDoc(collection(db, "orders"), {
      name,
      phone,
      address,
      pincode,
      scrapType,
      weight,
      pickupDate,
      pickupTime,
      notes,
      cart,
      total,
      vendor: matchedVendor?.name || "Not Assigned",
      vendorPhone: matchedVendor?.phone || "",
      status: "Pending",
      createdAt: new Date()
    });

    console.log("✅ Order saved");

  } catch (err) {
    console.error("❌ Firebase Error:", err);
  }

  // ==============================
  // 📩 WHATSAPP AUTO SEND
  // ==============================
  let message = `📦 Scrap Pickup Request from RecycleRaja

👤 Name: ${name}
📞 Phone: ${phone}
📍 Address: ${address}
📮 Pincode: ${pincode}

♻️ Scrap Type: ${scrapType}
⚖️ Weight: ${weight} kg
⏰ Pickup: ${fullTime}

🧾 Items:
${cartText}

💰 Estimated Total: ₹${total}

📝 Notes: ${notes}
`;

  if (matchedVendor && matchedVendor.phone) {
    let whatsappURL = `https://wa.me/${matchedVendor.phone}?text=${encodeURIComponent(message)}`;

    console.log("📲 Sending to:", matchedVendor.phone);

    window.open(whatsappURL, "_blank");

  } else {
    alert("❌ No vendor available in this pincode");
    console.log("❌ No vendor found for:", pincode);
  }

  // ==============================
  // ✅ SUCCESS
  // ==============================
  alert("✅ Request Submitted Successfully!");

});
