function login() {
  let id = document.getElementById("vid").value;
  let pass = document.getElementById("pass").value;

  let vendors = JSON.parse(localStorage.getItem("vendors")) || [];

  let found = vendors.find(v => v.id === id && v.password === pass);

  if (found) {
    // ✅ Save current vendor
    localStorage.setItem("currentVendor", JSON.stringify(found));

    // 🔥 Redirect to dashboard (we create next)
    window.location.href = "vendor-dashboard.html";

  } else {
    document.getElementById("errorMsg").innerText = "Invalid ID or Password ❌";
  }
}