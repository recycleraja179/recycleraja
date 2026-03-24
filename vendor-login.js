import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.getElementById("loginForm")?.addEventListener("submit", async function(e) {
  e.preventDefault();

  let id = document.getElementById("vendorId").value.trim().toLowerCase();
  let password = document.getElementById("password").value.trim();

  console.log("Entered:", id, password);

  const snapshot = await getDocs(collection(db, "vendors"));

  let foundVendor = null;

  snapshot.forEach((doc) => {
    let v = doc.data();

    let dbId = (v.id || "").trim().toLowerCase();
    let dbPass = (v.password || "").trim();

    console.log("Checking:", dbId, dbPass);

    if (dbId == id && dbPass == password) {
      foundVendor = v;
    }
  });

  console.log("Found vendor:", foundVendor);

  if (foundVendor) {
    alert("Login Successful ✅");

    localStorage.setItem("loggedVendor", JSON.stringify(foundVendor));

    window.location.href = "vendor-dashboard.html";
  } else {
    alert("Invalid ID or Password ❌");
  }
});
