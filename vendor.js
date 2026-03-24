import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.getElementById("vendorForm")?.addEventListener("submit", async function(e) {
  e.preventDefault();

  let vendor = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    area: document.getElementById("area").value,
    pincode: document.getElementById("pincode").value,
    id: document.getElementById("vendorId").value,
    password: document.getElementById("password").value,
    createdAt: new Date()
  };

  try {
    await addDoc(collection(db, "vendors"), vendor);
    alert("Vendor Registered ✅");
    document.getElementById("vendorForm").reset();
  } catch (err) {
    console.error(err);
    alert("Error ❌");
  }
});
