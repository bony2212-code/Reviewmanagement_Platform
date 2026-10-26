// Agency Dashboard Controller
const STORAGE_KEY = 'review_growth_hub_clients_v3';
const AUTH_CREDS_KEY = 'rgh_admin_creds_v1';
const AUTH_SESSION_KEY = 'rgh_admin_session_v1';

// Default initial sample clients with real products
const DEFAULT_CLIENTS = [
  {
    id: 'client_1',
    name: 'SmartXCRM Surgical & Hospital Equipment',
    person_name: 'Mr. Darpan Patel (Director)',
    category: 'surgical_medical',
    city: 'Ahmedabad',
    google_url: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
    phone: '919876543210',
    keywords: 'Wheelchair, Hospital Bed, Mobility Solutions, Oxygen Concentrator, Walker',
    default_lang: 'gu',
    createdAt: new Date().toISOString()
  },
  {
    id: 'client_2',
    name: 'Lifeline Multi-Speciality Hospital & Trauma Care',
    person_name: 'Dr. Keyur Patel (MS Orthopedic)',
    category: 'healthcare',
    city: 'Surat',
    google_url: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
    phone: '919876543211',
    keywords: 'Emergency Care, Orthopedic Surgery, ICU Facility, Cashless Mediclaim',
    default_lang: 'gu',
    createdAt: new Date().toISOString()
  },
  {
    id: 'client_3',
    name: 'Smile Craft Dental & Implant Clinic',
    person_name: 'Dr. Sneha Sharma (BDS, Implantologist)',
    category: 'healthcare',
    city: 'Vadodara',
    google_url: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
    phone: '919876543212',
    keywords: 'Painless Root Canal, Teeth Cleaning, Dental Implants, Invisible Aligners',
    default_lang: 'hi',
    createdAt: new Date().toISOString()
  },
  {
    id: 'client_4',
    name: 'Royal Rajwadi Thali & Family Dining',
    person_name: 'Chef Harshvardhan Singh',
    category: 'restaurant',
    city: 'Rajkot',
    google_url: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
    phone: '919876543213',
    keywords: 'Authentic Gujarati Thali, Family Dining, Fast Service, Delicious Desserts',
    default_lang: 'gu',
    createdAt: new Date().toISOString()
  }
];

// State
let clients = [];
let currentEditingId = null;
let modalSelectedKeywords = new Set();

// Auth Functions
function getAdminCredentials() {
  const stored = localStorage.getItem(AUTH_CREDS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) { }
  }
  return { username: 'admin', password: 'admin@123' };
}

function saveAdminCredentials(username, password) {
  localStorage.setItem(AUTH_CREDS_KEY, JSON.stringify({ username, password }));
}

function isAuthenticated() {
  return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true' || localStorage.getItem(AUTH_SESSION_KEY) === 'true';
}

function checkAuthUI() {
  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');

  if (isAuthenticated()) {
    if (loginView) loginView.classList.add('hidden');
    if (dashboardView) dashboardView.classList.remove('hidden');
    loadClients();
    renderClientGrid();
    updateStats();
    populateIndustryDropdown();
    loadLeads();
    renderLeadsList();
  } else {
    if (loginView) loginView.classList.remove('hidden');
    if (dashboardView) dashboardView.classList.add('hidden');
  }
}

function handleLogin(e) {
  e.preventDefault();
  const usernameInput = document.getElementById('login-username').value.trim();
  const passwordInput = document.getElementById('login-password').value;
  const remember = document.getElementById('login-remember').checked;
  const errorBox = document.getElementById('login-error-msg');
  const errorText = document.getElementById('login-error-text');

  const creds = getAdminCredentials();

  if (usernameInput === creds.username && passwordInput === creds.password) {
    if (errorBox) errorBox.classList.add('hidden');
    sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
    if (remember) {
      localStorage.setItem(AUTH_SESSION_KEY, 'true');
    }
    checkAuthUI();
    showToast("Welcome back, Admin!");
  } else {
    if (errorBox) errorBox.classList.remove('hidden');
    if (errorText) errorText.textContent = "Invalid Login ID or Password. Please try again.";
  }
}

function handleLogout() {
  if (confirm("Are you sure you want to log out of the Admin Dashboard?")) {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    localStorage.removeItem(AUTH_SESSION_KEY);
    checkAuthUI();
    showToast("Logged out successfully.");
  }
}

function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
}

function openPasswordModal() {
  const modal = document.getElementById('password-modal');
  const form = document.getElementById('change-password-form');
  const err = document.getElementById('pw-error-msg');
  if (form) form.reset();
  if (err) err.classList.add('hidden');

  const creds = getAdminCredentials();
  const newUserInput = document.getElementById('input-new-user');
  if (newUserInput) newUserInput.value = creds.username;

  if (modal) modal.classList.remove('hidden');
}

function closePasswordModal() {
  const modal = document.getElementById('password-modal');
  if (modal) modal.classList.add('hidden');
}

function handleChangePassword(e) {
  e.preventDefault();
  const currPw = document.getElementById('input-curr-pw').value;
  const newUser = document.getElementById('input-new-user').value.trim();
  const newPw = document.getElementById('input-new-pw').value;
  const err = document.getElementById('pw-error-msg');

  const creds = getAdminCredentials();

  if (currPw !== creds.password) {
    if (err) {
      err.textContent = "Current password does not match!";
      err.classList.remove('hidden');
    }
    return;
  }

  if (!newUser || !newPw) {
    if (err) {
      err.textContent = "Username and password cannot be empty!";
      err.classList.remove('hidden');
    }
    return;
  }

  saveAdminCredentials(newUser, newPw);
  closePasswordModal();
  showToast("Admin credentials updated successfully!");
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkAuthUI();
  initEventListeners();
});

function loadClients() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      clients = JSON.parse(stored);
    } catch (e) {
      clients = [...DEFAULT_CLIENTS];
    }
  } else {
    clients = [...DEFAULT_CLIENTS];
    saveClients();
  }
}

function saveClients() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  updateStats();
}

function updateStats() {
  const elTotal = document.getElementById('stat-total-clients');
  if (elTotal) elTotal.textContent = clients.length;
}

function getFunnelUrl(client) {
  const base = window.location.origin + window.location.pathname.replace('index.html', '').replace(/\/$/, '') + '/review.html';
  const encoded = encodeClientData(client);
  return `${base}?d=${encoded}`;
}

function getStandeeUrl(client) {
  const base = window.location.origin + window.location.pathname.replace('index.html', '').replace(/\/$/, '') + '/standee.html';
  const encoded = encodeClientData(client);
  return `${base}?d=${encoded}`;
}

// Populate Industry Dropdown in Add Client Modal
function populateIndustryDropdown() {
  const select = document.getElementById('input-category');
  if (!select) return;

  select.innerHTML = '';
  Object.values(INDUSTRY_CATALOG).forEach(ind => {
    const opt = document.createElement('option');
    opt.value = ind.id;
    opt.textContent = `${ind.icon} ${ind.name}`;
    select.appendChild(opt);
  });

  select.addEventListener('change', () => {
    onIndustryChanged(select.value);
  });
}

// Render dynamic product/keyword tags for selected industry
function onIndustryChanged(industryId, retainExisting = false) {
  const cat = INDUSTRY_CATALOG[industryId] || INDUSTRY_CATALOG.general;
  const container = document.getElementById('keyword-tags-container');
  if (!container) return;

  if (!retainExisting) {
    modalSelectedKeywords.clear();
    // Default: select first 5-6 products of this industry
    (cat.defaultProducts || []).slice(0, 5).forEach(p => modalSelectedKeywords.add(p));
  }

  renderKeywordChips(cat);
  syncKeywordsInput();
}

function renderKeywordChips(cat) {
  const container = document.getElementById('keyword-tags-container');
  if (!container) return;
  container.innerHTML = '';

  // Render industry presets
  (cat.defaultProducts || []).forEach(prod => {
    const isSelected = modalSelectedKeywords.has(prod);
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = `px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${isSelected
      ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-500'
      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
      }`;
    chip.innerHTML = `${isSelected ? '✓ ' : '+ '}${escapeHtml(prod)}`;
    chip.addEventListener('click', () => {
      if (modalSelectedKeywords.has(prod)) {
        modalSelectedKeywords.delete(prod);
      } else {
        modalSelectedKeywords.add(prod);
      }
      renderKeywordChips(cat);
      syncKeywordsInput();
    });
    container.appendChild(chip);
  });

  // Render any custom added keywords that weren't in default list
  modalSelectedKeywords.forEach(customProd => {
    if (!(cat.defaultProducts || []).includes(customProd)) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 text-white shadow-sm transition-all flex items-center gap-1';
      chip.innerHTML = `✓ ${escapeHtml(customProd)} <span class="ml-1 opacity-70 hover:opacity-100 font-bold">×</span>`;
      chip.addEventListener('click', () => {
        modalSelectedKeywords.delete(customProd);
        renderKeywordChips(cat);
        syncKeywordsInput();
      });
      container.appendChild(chip);
    }
  });
}

function syncKeywordsInput() {
  const input = document.getElementById('input-keywords');
  if (input) {
    input.value = Array.from(modalSelectedKeywords).join(', ');
  }
}

// Render Client Cards in Agency Dashboard
function renderClientGrid() {
  const grid = document.getElementById('client-grid');
  if (!grid) return;

  grid.innerHTML = '';

  if (clients.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-gray-300 p-8">
        <div class="w-16 h-16 mx-auto mb-4 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        </div>
        <h3 class="text-lg font-bold text-gray-800 mb-1">No Clients Added Yet</h3>
        <p class="text-sm text-gray-500 mb-4">Start by adding your first business client to generate high-converting review funnels.</p>
        <button onclick="openClientModal()" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow">
          + Add First Client
        </button>
      </div>
    `;
    return;
  }

  clients.forEach(client => {
    const funnelUrl = getFunnelUrl(client);
    const standeeUrl = getStandeeUrl(client);

    const cat = INDUSTRY_CATALOG[client.category] || INDUSTRY_CATALOG.general;
    const catLabel = `${cat.icon} ${cat.name}`;

    const card = document.createElement('div');
    card.className = "bg-white rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between";
    card.innerHTML = `
      <div>
        <!-- Top row: Category & Lang Badge -->
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 truncate max-w-[210px]">
            ${catLabel}
          </span>
          <span class="text-xs font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 flex items-center gap-1 flex-shrink-0">
            ${client.default_lang === 'gu' ? '🇮🇳 ગુજરાતી' : client.default_lang === 'hi' ? '🇮🇳 हिन्दी' : '🇬🇧 English'}
          </span>
        </div>

        <!-- Business Name & City -->
        <div class="flex items-start gap-3 mb-3">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white font-bold text-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            ${(client.name || 'B').charAt(0).toUpperCase()}
          </div>
          <div class="overflow-hidden">
            <h3 class="font-bold text-gray-900 text-base leading-snug truncate" title="${escapeHtml(client.name)}">
              ${escapeHtml(client.name)}
            </h3>
            ${client.person_name ? `
              <p class="text-xs text-indigo-700 font-semibold flex items-center gap-1 mt-0.5 truncate">
                <span>${client.category === 'healthcare' || /dr\b|doctor/i.test(client.person_name) ? '👨‍⚕️' : '👤'}</span>
                <span>${escapeHtml(client.person_name)}</span>
              </p>
            ` : ''}
            <p class="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <span>📍 ${escapeHtml(client.city || 'City')}</span>
              ${client.phone ? `<span class="text-gray-300">•</span> <span>📞 ${escapeHtml(client.phone)}</span>` : ''}
            </p>
          </div>
        </div>

        <!-- Products / Keywords Tags -->
        <div class="mb-4">
          <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Products / Services:</p>
          <div class="flex flex-wrap gap-1">
            ${(client.keywords || 'Quality Service').split(',').map(k => `
              <span class="text-[11px] px-2 py-0.5 bg-indigo-50/70 text-indigo-700 rounded-md font-medium border border-indigo-100/60">
                ${escapeHtml(k.trim())}
              </span>
            `).slice(0, 4).join('')}
            ${(client.keywords || '').split(',').length > 4 ? `<span class="text-[10px] text-gray-400 self-center">+${(client.keywords.split(',').length - 4)} more</span>` : ''}
          </div>
        </div>
      </div>

      <!-- Actions Area -->
      <div class="pt-4 border-t border-gray-100 space-y-2.5">
        <!-- Funnel URL Copy Input -->
        <div class="flex items-center gap-1.5">
          <input type="text" readonly value="${funnelUrl}" class="text-xs bg-slate-50 border border-slate-200 text-slate-600 rounded-xl px-2.5 py-1.5 w-full font-mono select-all truncate">
          <button onclick="copyToClipboard('${funnelUrl}')" title="Copy Link" class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
          </button>
        </div>

        <!-- Action Button Toolbar -->
        <div class="grid grid-cols-4 gap-1.5 text-xs font-semibold">
          <!-- Test Funnel -->
          <a href="${funnelUrl}" target="_blank" class="py-2 px-1 text-center rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition flex flex-col items-center justify-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            <span class="text-[10px]">Test Funnel</span>
          </a>

          <!-- QR Code Generator -->
          <button onclick="openQrModal('${client.id}')" class="py-2 px-1 text-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex flex-col items-center justify-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
            <span class="text-[10px]">QR Code</span>
          </button>

          <!-- WhatsApp Share -->
          <button onclick="shareOnWhatsApp('${client.id}')" class="py-2 px-1 text-center rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition flex flex-col items-center justify-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.586 1.761.88 2.791.88 3.181 0 5.767-2.586 5.767-5.766.001-3.18-2.585-5.766-5.767-5.766zm3.374 8.213c-.14.394-.711.728-1.02.775-.282.043-.655.078-2.128-.532-1.879-.778-3.084-2.697-3.178-2.823-.094-.125-.765-1.017-.765-1.939 0-.923.484-1.376.656-1.564.172-.188.375-.235.5-.235.125 0 .25.002.359.007.115.006.269-.044.421.323.156.375.532 1.297.579 1.391.047.094.078.204.016.329-.063.125-.094.204-.188.313-.094.109-.198.243-.282.327-.094.094-.192.196-.083.383.109.188.485.801 1.042 1.297.719.641 1.325.84 1.512.934.188.094.297.078.406-.047.109-.125.469-.547.594-.734.125-.188.25-.156.422-.094.172.063 1.094.516 1.282.609.188.094.313.141.359.219.046.078.046.453-.094.847z"/></svg>
            <span class="text-[10px]">WhatsApp</span>
          </button>

          <!-- Standee Print -->
          <a href="${standeeUrl}" target="_blank" class="py-2 px-1 text-center rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition flex flex-col items-center justify-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            <span class="text-[10px]">Standee</span>
          </a>
        </div>

        <!-- Edit / Delete -->
        <div class="flex items-center justify-between text-xs pt-1">
          <button onclick="editClient('${client.id}')" class="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1">
            ✏️ Edit Client
          </button>
          <button onclick="deleteClient('${client.id}')" class="text-rose-500 hover:text-rose-700 font-medium">
            Delete
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// WhatsApp Share Handler
function shareOnWhatsApp(clientId) {
  const client = clients.find(c => c.id === clientId);
  if (!client) return;

  const funnelUrl = getFunnelUrl(client);
  const text = `Hi! Please share your valuable experience with *${client.name}* on Google.\n\n👉 Tap here to rate us: ${funnelUrl}\n\n(It takes just 10 seconds and lets you choose English, Hindi, or Gujarati review drafts for your exact product/service!) ⭐⭐⭐⭐⭐`;

  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(waUrl, '_blank');
}

// Copy helper
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast("Link copied to clipboard!");
  }).catch(() => {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast("Link copied!");
  });
}

// Toast notification
function showToast(message) {
  const toast = document.getElementById('global-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove('opacity-0', 'translate-y-4');
  toast.classList.add('opacity-100', 'translate-y-0');
  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-4');
  }, 2500);
}

// Modal management
function openClientModal(client = null) {
  const modal = document.getElementById('client-modal');
  const title = document.getElementById('modal-title');
  const form = document.getElementById('client-form');

  form.reset();
  modalSelectedKeywords.clear();

  if (client) {
    currentEditingId = client.id;
    title.textContent = "Edit Business Client";
    document.getElementById('input-name').value = client.name || '';
    document.getElementById('input-person-name').value = client.person_name || '';
    document.getElementById('input-category').value = client.category || 'general';
    document.getElementById('input-city').value = client.city || '';
    document.getElementById('input-google-url').value = client.google_url || '';
    document.getElementById('input-phone').value = client.phone || '';
    document.getElementById('input-keywords').value = client.keywords || '';
    document.getElementById('input-lang').value = client.default_lang || 'en';

    if (client.keywords) {
      client.keywords.split(',').map(k => k.trim()).filter(Boolean).forEach(k => modalSelectedKeywords.add(k));
    }
    onIndustryChanged(client.category || 'general', true);
  } else {
    currentEditingId = null;
    title.textContent = "Add New Business Client";
    document.getElementById('input-name').value = '';
    document.getElementById('input-person-name').value = '';
    document.getElementById('input-category').value = 'surgical_medical';
    document.getElementById('input-lang').value = 'gu';
    onIndustryChanged('surgical_medical', false);
  }

  modal.classList.remove('hidden');
}

function closeClientModal() {
  document.getElementById('client-modal').classList.add('hidden');
  currentEditingId = null;
}

function editClient(id) {
  const client = clients.find(c => c.id === id);
  if (client) openClientModal(client);
}

function deleteClient(id) {
  if (confirm("Are you sure you want to delete this client?")) {
    clients = clients.filter(c => c.id !== id);
    saveClients();
    renderClientGrid();
    showToast("Client removed.");
  }
}

// QR Code Modal
function openQrModal(clientId) {
  const client = clients.find(c => c.id === clientId);
  if (!client) return;

  const funnelUrl = getFunnelUrl(client);
  const qrContainer = document.getElementById('qrcode-canvas-container');
  qrContainer.innerHTML = '';

  document.getElementById('qr-modal-biz-name').textContent = client.name;
  document.getElementById('qr-modal-city').textContent = client.city ? `📍 ${client.city}` : '';

  // Generate QR Code using QRCode.js
  if (typeof QRCode !== 'undefined') {
    new QRCode(qrContainer, {
      text: funnelUrl,
      width: 220,
      height: 220,
      colorDark: "#1e1b4b",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  // Set download button
  const downloadBtn = document.getElementById('btn-download-qr');
  downloadBtn.onclick = () => {
    const img = qrContainer.querySelector('img');
    const canvas = qrContainer.querySelector('canvas');
    let dataUrl = '';
    if (img && img.src) {
      dataUrl = img.src;
    } else if (canvas) {
      dataUrl = canvas.toDataURL('image/png');
    }

    if (dataUrl) {
      const link = document.createElement('a');
      link.download = `${client.name.replace(/\s+/g, '_')}_Google_Review_QR.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  document.getElementById('qr-modal').classList.remove('hidden');
}

function closeQrModal() {
  document.getElementById('qr-modal').classList.add('hidden');
}

// Add Custom Keyword button handler
function addCustomKeyword() {
  const input = document.getElementById('input-custom-keyword');
  if (!input) return;
  const val = input.value.trim();
  if (val) {
    // Can be comma separated
    val.split(',').map(s => s.trim()).filter(Boolean).forEach(k => modalSelectedKeywords.add(k));
    input.value = '';
    const catId = document.getElementById('input-category').value;
    const cat = INDUSTRY_CATALOG[catId] || INDUSTRY_CATALOG.general;
    renderKeywordChips(cat);
    syncKeywordsInput();
  }
}

function selectAllIndustryKeywords() {
  const catId = document.getElementById('input-category').value;
  const cat = INDUSTRY_CATALOG[catId] || INDUSTRY_CATALOG.general;
  (cat.defaultProducts || []).forEach(p => modalSelectedKeywords.add(p));
  renderKeywordChips(cat);
  syncKeywordsInput();
}

function clearAllIndustryKeywords() {
  modalSelectedKeywords.clear();
  const catId = document.getElementById('input-category').value;
  const cat = INDUSTRY_CATALOG[catId] || INDUSTRY_CATALOG.general;
  renderKeywordChips(cat);
  syncKeywordsInput();
}

// Form Submission & Event Listeners
function initEventListeners() {
  const form = document.getElementById('client-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const newClient = {
        id: currentEditingId || `client_${Date.now()}`,
        name: document.getElementById('input-name').value.trim(),
        person_name: document.getElementById('input-person-name').value.trim(),
        category: document.getElementById('input-category').value,
        city: document.getElementById('input-city').value.trim(),
        google_url: document.getElementById('input-google-url').value.trim(),
        phone: document.getElementById('input-phone').value.trim(),
        keywords: document.getElementById('input-keywords').value.trim(),
        default_lang: document.getElementById('input-lang').value,
        createdAt: new Date().toISOString()
      };

      if (currentEditingId) {
        const index = clients.findIndex(c => c.id === currentEditingId);
        if (index !== -1) clients[index] = newClient;
        showToast("Client details updated!");
      } else {
        clients.unshift(newClient);
        showToast("New client created successfully!");
      }

      saveClients();
      renderClientGrid();
      closeClientModal();
    });
  }

  // Admin Login form
  const loginForm = document.getElementById('admin-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Change Password form
  const changePwForm = document.getElementById('change-password-form');
  if (changePwForm) {
    changePwForm.addEventListener('submit', handleChangePassword);
  }

  // Apply Lead form on index.html
  const applyForm = document.getElementById('apply-lead-form');
  if (applyForm) {
    applyForm.addEventListener('submit', handleApplyLeadSubmit);
  }

  // Custom keyword input Enter key handler
  const customKwInput = document.getElementById('input-custom-keyword');
  if (customKwInput) {
    customKwInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addCustomKeyword();
      }
    });
  }

  // Quick preset sample client generator
  const btnAddSample = document.getElementById('btn-add-sample');
  if (btnAddSample) {
    btnAddSample.addEventListener('click', () => {
      const cities = ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const sample = {
        id: `client_${Date.now()}`,
        name: `HealthPlus Surgical & Hospital Bed Store`,
        category: 'surgical_medical',
        city: randomCity,
        google_url: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
        phone: '919898001122',
        keywords: 'Wheelchair, Hospital Bed, Oxygen Concentrator, Mobility Solutions, Commode Chair',
        default_lang: 'gu',
        createdAt: new Date().toISOString()
      };
      clients.unshift(sample);
      saveClients();
      renderClientGrid();
      showToast("Sample Surgical client added!");
    });
  }
}

// Escape HTML helper
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ==================== INCOMING CLIENT LEADS MANAGEMENT ====================
const LEADS_STORAGE_KEY = 'rgh_client_leads_v1';
let clientLeads = [];

const DEFAULT_SAMPLE_LEADS = [
  {
    id: 'lead_sample_1',
    name: 'Dr. Mihir Vyas',
    business: 'Vyas Dental Care & Implant Clinic',
    city: 'Surat',
    industry: 'Dental & Healthcare',
    phone: '9825012345',
    date: new Date().toLocaleString()
  },
  {
    id: 'lead_sample_2',
    name: 'Karan Patel',
    business: 'Patel Automobile Spa & Detailing',
    city: 'Ahmedabad',
    industry: 'Automobile & Garage',
    phone: '9879054321',
    date: new Date().toLocaleString()
  }
];

function loadLeads() {
  const stored = localStorage.getItem(LEADS_STORAGE_KEY);
  if (stored) {
    try {
      clientLeads = JSON.parse(stored);
    } catch (e) {
      clientLeads = [...DEFAULT_SAMPLE_LEADS];
    }
  } else {
    clientLeads = [...DEFAULT_SAMPLE_LEADS];
    saveLeads();
  }
}

function saveLeads() {
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(clientLeads));
  updateLeadsBadge();
}

function updateLeadsBadge() {
  const badge = document.getElementById('badge-leads-count');
  if (badge) {
    badge.textContent = `${clientLeads.length} Leads`;
  }
}

function renderLeadsList() {
  const container = document.getElementById('leads-container');
  if (!container) return;
  updateLeadsBadge();

  container.innerHTML = '';

  if (clientLeads.length === 0) {
    container.innerHTML = `
      <div class="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
        <p class="text-xs font-semibold text-slate-700">No incoming leads yet</p>
        <p class="text-[11px] text-slate-500 mt-0.5">Leads submitted through the "Apply Now" button on customer review pages or login screen will appear here.</p>
      </div>
    `;
    return;
  }

  clientLeads.forEach(lead => {
    const card = document.createElement('div');
    card.className = "p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition flex flex-col md:flex-row md:items-center justify-between gap-3";

    // WhatsApp URL for agency owner to chat with this lead
    const rawPhone = lead.phone ? lead.phone.replace(/[^0-9]/g, '') : '';
    const leadWhatsAppPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
    const helloMsg = `Hi ${lead.name}! Thank you for applying for Review Growth Hub for *${lead.business}*. I would love to share your custom live 5-star review demo link!`;
    const waChatUrl = `https://wa.me/${leadWhatsAppPhone}?text=${encodeURIComponent(helloMsg)}`;

    card.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-sm">
          ${(lead.business || 'B').charAt(0).toUpperCase()}
        </div>
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h4 class="font-bold text-slate-900 text-sm">${escapeHtml(lead.business)}</h4>
            <span class="text-[11px] font-semibold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md">
              ${escapeHtml(lead.industry || 'General')}
            </span>
          </div>
          <p class="text-xs text-slate-600 mt-0.5">
            <span>👤 ${escapeHtml(lead.name)}</span>
            <span class="text-slate-300 mx-1">•</span>
            <span>📍 ${escapeHtml(lead.city)}</span>
            <span class="text-slate-300 mx-1">•</span>
            <span>📞 ${escapeHtml(lead.phone)}</span>
          </p>
          <p class="text-[10px] text-slate-400 mt-0.5">Received: ${escapeHtml(lead.date || 'Recent')}</p>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <a href="${waChatUrl}" target="_blank" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1">
          <span>💬</span> <span>WhatsApp</span>
        </a>
        <button onclick="convertLeadToClient('${lead.id}')" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1">
          <span>⚡</span> <span>Convert to Client</span>
        </button>
        <button onclick="deleteLead('${lead.id}')" title="Remove Lead" class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

function deleteLead(id) {
  if (confirm("Remove this inquiry from leads?")) {
    clientLeads = clientLeads.filter(l => l.id !== id);
    saveLeads();
    renderLeadsList();
    showToast("Lead removed.");
  }
}

// Convert a lead directly into a client (pre-populates Add Client Modal)
function convertLeadToClient(leadId) {
  const lead = clientLeads.find(l => l.id === leadId);
  if (!lead) return;

  openClientModal();
  document.getElementById('input-name').value = lead.business || '';
  document.getElementById('input-person-name').value = lead.name || '';
  document.getElementById('input-city').value = lead.city || '';
  document.getElementById('input-phone').value = lead.phone || '';

  // Match category
  const indMap = {
    'Surgical & Medical': 'surgical_medical',
    'Dental & Healthcare': 'healthcare',
    'Restaurant & Food': 'restaurant',
    'Salon & Beauty': 'salon',
    'Automobile & Garage': 'automobile',
    'Real Estate': 'realestate'
  };
  const matchedCat = indMap[lead.industry] || 'general';
  document.getElementById('input-category').value = matchedCat;
  onIndustryChanged(matchedCat, false);

  showToast("Lead details filled in Add Client form!");
}

// Apply Now Modal Controls (on index.html)
function openApplyModal() {
  const modal = document.getElementById('apply-lead-modal');
  const form = document.getElementById('apply-lead-form');
  const success = document.getElementById('lead-success-msg');
  if (form) form.classList.remove('hidden');
  if (success) success.classList.add('hidden');
  if (modal) modal.classList.remove('hidden');
}

function closeApplyModal() {
  const modal = document.getElementById('apply-lead-modal');
  if (modal) modal.classList.add('hidden');
}

function handleApplyLeadSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('lead-name').value.trim();
  const business = document.getElementById('lead-biz').value.trim();
  const city = document.getElementById('lead-city').value.trim();
  const industry = document.getElementById('lead-industry').value;
  const phone = document.getElementById('lead-phone').value.trim();

  const newLead = {
    id: 'lead_' + Date.now(),
    name,
    business,
    city,
    industry,
    phone,
    date: new Date().toLocaleString()
  };

  clientLeads.unshift(newLead);
  saveLeads();
  renderLeadsList();

  // Send inquiry to Agency WhatsApp
  const agencyPhone = '919876543210';
  const msg = `🚀 *NEW CLIENT INQUIRY - REVIEW GROWTH HUB*\n\n👤 *Client Name:* ${name}\n🏥 *Business Name:* ${business}\n🏢 *Industry:* ${industry}\n📍 *City:* ${city}\n📞 *WhatsApp:* ${phone}\n\n_I want to get the 5-Star Review Funnel system for my business. Please send me setup details & demo._`;
  window.open(`https://wa.me/${agencyPhone}?text=${encodeURIComponent(msg)}`, '_blank');

  document.getElementById('apply-lead-form').classList.add('hidden');
  document.getElementById('lead-success-msg').classList.remove('hidden');
  showToast("Inquiry submitted successfully!");
}
