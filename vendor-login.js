import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.getElementById("loginForm")?.addEventListener("submit", async function(e) {
  e.preventDefault();

  let id = document.getElementById("vendorId").value.trim().toLowerCase();
  let password = document.getElementById("password").value.trim();

  try {
    const snapshot = await getDocs(collection(db, "vendors"));

    let foundVendor = null;

    snapshot.forEach((doc) => {
      let v = doc.data();

      let dbId = (v.id || "").trim().toLowerCase();
      let dbPass = (v.password || "").trim();

      if (dbId == id && dbPass == password) {
        foundVendor = v;
      }
    });

    if (foundVendor) {
      localStorage.setItem("loggedVendor", JSON.stringify(foundVendor));
      window.location.href = "vendor-dashboard.html";
    } else {
      alert("Invalid ID or Password ❌");
    }

  } catch (err) {
    console.error(err);
    alert("Error ❌");
  }
});
