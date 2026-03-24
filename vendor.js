// 🚀 IMPORT FIREBASE
import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==============================
// 🔐 VENDOR LOGIN
// ==============================
document.getElementById("loginForm")?.addEventListener("submit", async function(e) {
  e.preventDefault();

  console.log("🔐 Login attempt");

  let id = document.getElementById("vendorId").value;
  let password = document.getElementById("password").value;

  try {
    const snapshot = await getDocs(collection(db, "vendors"));

    let foundVendor = null;

    snapshot.forEach((doc) => {
      const v = doc.data();

      if (v.id === id && v.password === password) {
        foundVendor = v;
      }
    });

    if (foundVendor) {
      console.log("✅ Login success");

      alert("Login Successful ✅");

      // 💾 Save session
      localStorage.setItem("loggedVendor", JSON.stringify(foundVendor));

      // 🔁 Redirect
      window.location.href = "vendor-dashboard.html";

    } else {
      console.log("❌ Invalid credentials");
      alert("Invalid ID or Password ❌");
    }

  } catch (err) {
    console.error("Firebase error:", err);
    alert("Something went wrong ❌");
  }
});


// ==============================
// 🔐 AUTO LOGIN CHECK (FOR DASHBOARD)
// ==============================
function checkLogin() {
  let vendor = JSON.parse(localStorage.getItem("loggedVendor"));

  if (!vendor) {
    alert("Please login first ❌");
    window.location.href = "vendor-login.html";
  }
}


// ==============================
// 🔓 LOGOUT FUNCTION
// ==============================
function logout() {
  localStorage.removeItem("loggedVendor");
  window.location.href = "vendor-login.html";
}


// ==============================
// 🌟 OPTIONAL: SHOW VENDOR NAME
// ==============================
function showVendorInfo() {
  let vendor = JSON.parse(localStorage.getItem("loggedVendor"));

  let nameBox = document.getElementById("vendorName");

  if (vendor && nameBox) {
    nameBox.innerText = vendor.name;
  }
}


// ==============================
// 🚀 LOAD FUNCTIONS (FOR DASHBOARD)
// ==============================
window.addEventListener("DOMContentLoaded", () => {
  checkLogin();
  showVendorInfo();
});


// 🌐 MAKE FUNCTIONS GLOBAL
window.logout = logout;
