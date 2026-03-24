document.getElementById("vendorForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let area = document.getElementById("area").value;
  let pincode = document.getElementById("pincode").value;

  let vendor = {
    name,
    phone,
    area,
    pincode
  };

  // Get existing vendors
  let vendors = JSON.parse(localStorage.getItem("vendors")) || [];

  vendors.push(vendor);

  localStorage.setItem("vendors", JSON.stringify(vendors));

  alert("Vendor Registered Successfully ✅");

  document.getElementById("vendorForm").reset();
});