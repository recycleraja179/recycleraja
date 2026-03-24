// 🧾 CART SYSTEM (RecycleRaja)

let cart = [];
let total = 0;

// 🔥 LIVE PRICE CALCULATION
function calculateItem(inputId, price, outputId) {
  let qty = Number(document.getElementById(inputId).value) || 0;
  let itemTotal = qty * price;

  document.getElementById(outputId).innerText = `Estimated: ₹${itemTotal}`;
}


// ➕ ADD OR UPDATE ITEM
function addItem(name, price, inputId) {
  let qty = Number(document.getElementById(inputId).value);

  if (!qty || qty <= 0) {
    alert("Enter valid quantity");
    return;
  }

  let itemTotal = qty * price;

  // 🔍 CHECK IF ITEM EXISTS
  let existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.qty = qty;
    existingItem.total = itemTotal;
  } else {
    cart.push({
      name: name,
      qty: qty,
      total: itemTotal
    });
  }

  updateCart();
}


// 🧾 UPDATE CART UI + SAVE DATA
function updateCart() {
  let cartBox = document.querySelector(".cart-box");

  // 🔥 CALCULATE TOTAL
  total = cart.reduce((sum, item) => sum + item.total, 0);

  // 🧾 ITEM LIST
  let itemsHTML = cart.map(item =>
    `<p>${item.name} - ${item.qty}kg = ₹${item.total}</p>`
  ).join("");

  // 📦 UPDATE UI
  cartBox.innerHTML = `
    <h2>Your Scrap List 🧾</h2>
    ${itemsHTML || "<p>No items added yet</p>"}
    <h3>Total: ₹${total}</h3>
    <a href="sell.html" class="cta-btn">Proceed</a>
  `;

  // 💾 SAVE TO LOCAL STORAGE
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("total", total);

  // 🔥 AUTO SET SCRAP TYPE
  let types = [...new Set(cart.map(item => item.name))];
  localStorage.setItem("scrapType", types.join(", "));
}