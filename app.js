// ===== PRODUCTS DATA =====
const products = [
  { id: 1, name: 'Sweet Mango', emoji: '🥭', category: 'tropical', price: 180, unit: 'per kg', origin: 'Rajshahi, Bangladesh', badge: 'Best Seller', desc: 'Sun-ripened Rajshahi mangoes — the sweetest in the world. Rich, golden flesh with zero fibers. Perfect for eating fresh or making juice.' },
  { id: 2, name: 'Fresh Strawberries', emoji: '🍓', category: 'berries', price: 320, unit: 'per 500g', origin: 'Local Farm', badge: 'Organic', desc: 'Plump, juicy strawberries hand-picked at peak ripeness. Naturally sweet with a hint of tartness. Great for desserts or eating fresh.' },
  { id: 3, name: 'Grape Clusters', emoji: '🍇', category: 'berries', price: 250, unit: 'per kg', origin: 'Imported', badge: null, desc: 'Seedless green and red grapes with a perfect balance of sweetness. Crisp, refreshing, and packed with antioxidants.' },
  { id: 4, name: 'Fresh Lemons', emoji: '🍋', category: 'citrus', price: 80, unit: 'per kg', origin: 'Local Farm', badge: null, desc: 'Bright, zesty lemons with high juice content. Perfect for lemonade, cooking, or boosting your immune system with vitamin C.' },
  { id: 5, name: 'Ripe Peaches', emoji: '🍑', category: 'stone', price: 290, unit: 'per kg', origin: 'Imported', badge: 'Seasonal', desc: 'Velvety soft peaches with a fragrant aroma and juicy flesh. Sweet with a subtle tang — perfect for summer snacking.' },
  { id: 6, name: 'Blueberries', emoji: '🫐', category: 'berries', price: 480, unit: 'per 250g', origin: 'Imported', badge: 'Super Food', desc: 'Premium blueberries bursting with antioxidants and flavor. Sweet, plump, and perfect for breakfast bowls, smoothies, or snacking.' },
  { id: 7, name: 'Sweet Pineapple', emoji: '🍍', category: 'tropical', price: 120, unit: 'each', origin: 'Sylhet, Bangladesh', badge: null, desc: 'Ripe, golden pineapples from the hills of Sylhet. Naturally sweet with a perfect balance of tropical flavor. No sour aftertaste.' },
  { id: 8, name: 'Dragon Fruit', emoji: '🎆', category: 'tropical', price: 350, unit: 'each', origin: 'Local Farm', badge: 'Exotic', desc: 'Stunning pink dragon fruit with white speckled flesh. Mildly sweet with a kiwi-like texture. High in fiber and vitamin C.' },
  { id: 9, name: 'Kiwi Fruits', emoji: '🥝', category: 'tropical', price: 220, unit: 'per 6 pcs', origin: 'Imported', badge: null, desc: 'Tangy-sweet kiwis packed with vitamin C and potassium. Great eaten fresh, in fruit salads, or as a topping for desserts.' },
  { id: 10, name: 'Watermelon', emoji: '🍉', category: 'tropical', price: 90, unit: 'per kg', origin: 'Local Farm', badge: 'Summer Pick', desc: 'Cool, refreshing watermelon with vibrant red flesh. Seedless variety, incredibly sweet and hydrating. Perfect for hot days.' },
  { id: 11, name: 'Sweet Cherries', emoji: '🍒', category: 'stone', price: 560, unit: 'per 250g', origin: 'Imported', badge: 'Premium', desc: 'Plump, dark cherries with a rich, sweet flavor. Deep red color indicates maximum ripeness. Perfect for desserts or eating fresh.' },
  { id: 12, name: 'Mandarin Orange', emoji: '🍊', category: 'citrus', price: 160, unit: 'per kg', origin: 'Imported', badge: null, desc: 'Easy-peel mandarin oranges with a sweet, juicy flavor. Packed with vitamin C and perfect as a healthy on-the-go snack.' },
];

// ===== STATE =====
let cart = JSON.parse(localStorage.getItem('fruithaven-cart') || '[]');
let filteredProducts = [...products];
let modalQty = 1;
let currentProduct = null;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderProducts(products);
  updateCartUI();
  setupNavScroll();
});

// ===== NAV =====
function setupNavScroll() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });
}

function toggleMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}

// ===== FILTER =====
function filterProducts(category) {
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  const btns = document.querySelectorAll('.filter-btn');
  btns.forEach(btn => {
    if (btn.textContent.trim().toLowerCase() === category || (category === 'all' && btn.textContent.trim() === 'All')) {
      btn.classList.add('active');
    }
  });

  filteredProducts = category === 'all' ? [...products] : products.filter(p => p.category === category);
  renderProducts(filteredProducts, true);

  // Scroll to shop
  document.getElementById('shop').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== RENDER PRODUCTS =====
function renderProducts(list, animate = false) {
  const grid = document.getElementById('products-grid');
  grid.innerHTML = '';

  list.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${i * 0.05}s`;
    if (animate) card.style.animation = 'fadeIn 0.4s ease forwards';

    card.innerHTML = `
      <div class="product-img" onclick="openModal(${p.id})">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        ${p.emoji}
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-origin">📍 ${p.origin}</div>
        <div class="product-bottom">
          <div class="product-price">৳${p.price}<small style="font-size:0.65rem;color:#6b7280;font-weight:400"> ${p.unit}</small></div>
          <button class="add-btn" onclick="event.stopPropagation(); quickAdd(${p.id})" title="Add to cart">+</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ===== MODAL =====
function openModal(id) {
  currentProduct = products.find(p => p.id === id);
  if (!currentProduct) return;
  modalQty = 1;

  document.getElementById('modal-content').innerHTML = `
    <span class="modal-fruit-emoji">${currentProduct.emoji}</span>
    <h2 class="modal-title">${currentProduct.name}</h2>
    <p style="color:#6b7280;font-size:0.85rem;margin-bottom:0.5rem">📍 ${currentProduct.origin}</p>
    <p class="modal-desc">${currentProduct.desc}</p>
    <div class="modal-price">৳${currentProduct.price} <small style="font-size:0.9rem;color:#6b7280;font-weight:400">${currentProduct.unit}</small></div>
    <div class="modal-qty">
      <button class="qty-btn" onclick="changeQty(-1)">−</button>
      <span class="qty-display" id="modal-qty-display">1</span>
      <button class="qty-btn" onclick="changeQty(1)">+</button>
      <span style="color:#6b7280;font-size:0.85rem">= ৳<span id="modal-subtotal">${currentProduct.price}</span></span>
    </div>
    <button class="btn-primary" style="width:100%" onclick="addToCartFromModal()">Add to Cart 🛒</button>
  `;

  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function changeQty(delta) {
  modalQty = Math.max(1, modalQty + delta);
  document.getElementById('modal-qty-display').textContent = modalQty;
  document.getElementById('modal-subtotal').textContent = (currentProduct.price * modalQty).toLocaleString();
}

function addToCartFromModal() {
  for (let i = 0; i < modalQty; i++) addToCart(currentProduct.id);
  closeModal();
}

// ===== CART =====
function quickAdd(id) {
  addToCart(id);
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateCartUI();
  showToast(`${product.emoji} ${product.name} added to cart!`);
}

function removeFromCart(id) {
  const idx = cart.findIndex(i => i.id === id);
  if (idx === -1) return;
  if (cart[idx].qty > 1) cart[idx].qty--;
  else cart.splice(idx, 1);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('fruithaven-cart', JSON.stringify(cart));
}

function updateCartUI() {
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  document.getElementById('cart-count').textContent = count;

  const itemsEl = document.getElementById('cart-items');
  const footerEl = document.getElementById('cart-footer');

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Your cart is empty 🛒</p>';
    footerEl.style.display = 'none';
    return;
  }

  footerEl.style.display = 'block';
  let total = 0;

  itemsEl.innerHTML = cart.map(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    return `
      <div class="cart-item">
        <div class="cart-item-emoji">${item.emoji}</div>
        <div class="cart-item-info">
          <strong>${item.name}</strong>
          <span>৳${item.price} ${item.unit}</span>
        </div>
        <div class="cart-item-controls">
          <button onclick="removeFromCart(${item.id})">−</button>
          <span>${item.qty}</span>
          <button onclick="addToCart(${item.id})">+</button>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('cart-total').textContent = `৳${total.toLocaleString()}`;
}

function toggleCart() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  const isOpen = drawer.classList.contains('open');

  if (isOpen) {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  } else {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function checkout() {
  if (cart.length === 0) return;
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const items = cart.map(i => `${i.qty}x ${i.name}`).join(', ');

  document.getElementById('modal-content').innerHTML = `
    <div style="text-align:center">
      <div style="font-size:4rem;margin-bottom:1rem">🎉</div>
      <h2 class="modal-title" style="margin-bottom:0.5rem">Order Placed!</h2>
      <p style="color:#6b7280;margin-bottom:1.5rem">Thank you for your order. We'll deliver within 24 hours.</p>
      <div style="background:#f0fdf4;border-radius:12px;padding:1.5rem;margin-bottom:1.5rem;text-align:left">
        <p style="font-weight:600;margin-bottom:0.5rem">Order Summary</p>
        <p style="color:#6b7280;font-size:0.9rem;margin-bottom:0.8rem">${items}</p>
        <p style="font-weight:700;color:#1a6b2f;font-size:1.2rem">Total: ৳${total.toLocaleString()}</p>
      </div>
      <button class="btn-primary" style="width:100%" onclick="closeModal();clearCart()">Done ✓</button>
    </div>
  `;

  document.getElementById('modal-overlay').classList.add('open');
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
  document.body.style.overflow = 'hidden';
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
}

// ===== CONTACT =====
function submitContact(e) {
  e.preventDefault();
  showToast('✉️ Message sent! We\'ll reply within 24 hours.');
  e.target.reset();
}

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== FADE ANIMATION =====
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`;
document.head.appendChild(style);
