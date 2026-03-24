// 🚀 IMPORT FIREBASE
import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==============================
// 🧑‍🔧 VENDOR REGISTRATION
// ==============================
document.getElementById("vendorForm")?.addEventListener("submit", async function(e) {
  e.preventDefault();

  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let area = document.getElementById("area").value;
  let pincode = document.getElementById("pincode").value;

  try {
    await addDoc(collection(db, "vendor_requests"), {
      name,
      phone,
      area,
      pincode,
      status: "pending",
      createdAt: new Date()
    });

    alert("Request submitted successfully ✅");

    document.getElementById("vendorForm").reset();

  } catch (err) {
    console.error(err);
    alert("Error submitting request ❌");
  }
});
