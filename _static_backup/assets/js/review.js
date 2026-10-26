// Review Funnel Interactive Controller
document.addEventListener('DOMContentLoaded', () => {
  // 1. Parse Client Data from URL Query Params or Base64 Param 'd'
  const params = new URLSearchParams(window.location.search);
  let clientData = null;

  if (params.get('d')) {
    clientData = decodeClientData(params.get('d'));
  }

  // Fallback to explicit query params
  if (!clientData) {
    clientData = {
      name: params.get('name') || "Apex Surgical & Mobility Store",
      city: params.get('city') || "Ahmedabad",
      category: params.get('category') || "surgical_medical",
      google_url: params.get('google_url') || "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4",
      phone: params.get('phone') || "919876543210",
      keywords: params.get('keywords') || "Wheelchair, Hospital Bed, Mobility Solutions, Oxygen Concentrator",
      default_lang: params.get('lang') || "en"
    };
  }

  // State
  let currentRating = 5;
  let currentLang = clientData.default_lang || 'en';
  let activeReviews = [];
  let selectedReviewIndex = 0;
  let selectedProduct = null;

  // DOM Elements
  const elBizName = document.getElementById('biz-name');
  const elBizPerson = document.getElementById('biz-person');
  const elBizCity = document.getElementById('biz-city');
  const elBizAvatar = document.getElementById('biz-avatar');
  const elStarRating = document.getElementById('star-rating');
  const elStars = elStarRating.querySelectorAll('.star-btn');
  const elRatingFeedback = document.getElementById('rating-feedback-text');
  
  const elPositiveSection = document.getElementById('positive-section');
  const elNegativeSection = document.getElementById('negative-section');
  
  const elLangBtns = document.querySelectorAll('.lang-btn');
  const elProductPrompt = document.getElementById('ui-select-product-prompt');
  const elProductContainer = document.getElementById('product-chips-container');
  const elReviewsList = document.getElementById('reviews-list');
  const elCustomReview = document.getElementById('custom-review-input');
  const elRegenBtn = document.getElementById('btn-regenerate');
  const elCopyGoogleBtn = document.getElementById('btn-copy-google');
  
  const elCopyModal = document.getElementById('copy-success-modal');
  const elCloseModalBtn = document.getElementById('btn-close-modal');
  const elDirectGoogleLink = document.getElementById('btn-direct-google-link');
  
  // Negative section elements
  const elNegForm = document.getElementById('neg-feedback-form');
  const elNegSuccess = document.getElementById('neg-success-msg');

  // Initialize UI with client info
  elBizName.textContent = clientData.name;
  if (clientData.person_name && elBizPerson) {
    const isDoctor = clientData.category === 'healthcare' || /dr\b|doctor/i.test(clientData.person_name);
    elBizPerson.textContent = `${isDoctor ? '👨‍⚕️' : '👤'} ${clientData.person_name}`;
    elBizPerson.classList.remove('hidden');
  }
  elBizCity.textContent = clientData.city ? `📍 ${clientData.city}` : '';
  elBizAvatar.textContent = (clientData.name || 'B').charAt(0).toUpperCase();

  // Extract products list for this client
  function getClientProducts() {
    let list = [];
    if (clientData.keywords) {
      list = clientData.keywords.split(',').map(k => k.trim()).filter(Boolean);
    }
    
    // If fewer than 2 keywords, supplement from Industry catalog
    const cat = clientData.category && INDUSTRY_CATALOG[clientData.category] ? INDUSTRY_CATALOG[clientData.category] : INDUSTRY_CATALOG.general;
    if (list.length === 0 && cat && cat.defaultProducts) {
      list = [...cat.defaultProducts];
    }
    return list;
  }

  const clientProducts = getClientProducts();

  // Render Product Chips
  function renderProductChips() {
    if (!elProductContainer) return;
    elProductContainer.innerHTML = '';

    const strings = UI_STRINGS[currentLang] || UI_STRINGS.en;

    // "All / General" chip
    const allChip = document.createElement('button');
    allChip.type = 'button';
    const isAllActive = selectedProduct === null;
    allChip.className = isAllActive
      ? 'px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-600 text-white shadow-sm border border-indigo-600 transition-all flex items-center gap-1'
      : 'px-3 py-1.5 rounded-full text-xs font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all';
    allChip.innerHTML = isAllActive ? `<span>✓</span> <span>${strings.allProductsLabel}</span>` : strings.allProductsLabel;
    allChip.addEventListener('click', () => {
      selectedProduct = null;
      renderProductChips();
      renderReviews();
    });
    elProductContainer.appendChild(allChip);

    // Dynamic Product Chips
    clientProducts.forEach(prod => {
      const chip = document.createElement('button');
      chip.type = 'button';
      const isActive = selectedProduct === prod;
      chip.className = isActive
        ? 'px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-600 text-white shadow-sm border border-indigo-600 transition-all flex items-center gap-1'
        : 'px-3 py-1.5 rounded-full text-xs font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all';
      chip.innerHTML = isActive ? `<span>✓</span> <span>${escapeHtml(prod)}</span>` : escapeHtml(prod);
      
      chip.addEventListener('click', () => {
        selectedProduct = prod;
        renderProductChips();
        renderReviews();
      });

      elProductContainer.appendChild(chip);
    });
  }

  // Set initial language tab
  function updateLanguage(newLang) {
    currentLang = newLang;
    
    // Update button states
    elLangBtns.forEach(btn => {
      const isSelected = btn.dataset.lang === newLang;
      btn.className = isSelected 
        ? "lang-btn px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm bg-indigo-600 text-white border-indigo-600"
        : "lang-btn px-4 py-2 rounded-xl text-sm font-medium transition-all bg-white text-gray-700 hover:bg-gray-100 border border-gray-200";
    });

    // Update localized UI strings
    const strings = UI_STRINGS[currentLang] || UI_STRINGS.en;
    document.getElementById('ui-how-was-exp').textContent = `${strings.howWasExp} ${clientData.name}`;
    document.getElementById('ui-select-lang-prompt').textContent = strings.selectLanguagePrompt;
    if (elProductPrompt) elProductPrompt.textContent = strings.selectProductPrompt;
    document.getElementById('ui-choose-review').textContent = strings.chooseReview;
    document.getElementById('btn-copy-google-text').textContent = strings.copyBtn;
    document.getElementById('btn-regen-text').textContent = strings.regenerateBtn;
    elCustomReview.placeholder = strings.customEditPlaceholder;

    // Steps translation
    document.getElementById('step-1-title').textContent = strings.step1Title;
    document.getElementById('step-1-desc').textContent = strings.step1Desc;
    document.getElementById('step-2-title').textContent = strings.step2Title;
    document.getElementById('step-2-desc').textContent = strings.step2Desc;
    document.getElementById('step-3-title').textContent = strings.step3Title;
    document.getElementById('step-3-desc').textContent = strings.step3Desc;

    // Negative texts
    document.getElementById('neg-heading').textContent = strings.negHeading;
    document.getElementById('neg-subheading').textContent = strings.negSubheading;
    document.getElementById('neg-name').placeholder = strings.negNamePlaceholder;
    document.getElementById('neg-phone').placeholder = strings.negPhonePlaceholder;
    document.getElementById('neg-message').placeholder = strings.negMsgPlaceholder;
    document.getElementById('neg-submit-btn-text').textContent = strings.negSubmitBtn;

    // Re-render product chips & reviews
    renderProductChips();
    renderReviews();
  }

  // Render Reviews based on active language & selected product
  function renderReviews() {
    activeReviews = generateReviews(clientData, currentLang, selectedProduct);
    selectedReviewIndex = 0;
    
    elReviewsList.innerHTML = '';
    activeReviews.forEach((reviewText, idx) => {
      const card = document.createElement('div');
      card.className = `p-3.5 rounded-xl border text-sm transition-all cursor-pointer select-none text-left relative ${
        idx === 0 
          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 text-gray-900 shadow-sm' 
          : 'border-gray-200 bg-white hover:border-indigo-300 text-gray-700'
      }`;
      
      card.innerHTML = `
        <div class="flex items-start justify-between gap-2">
          <p class="leading-relaxed review-card-text">${escapeHtml(reviewText)}</p>
          <span class="check-icon flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${idx === 0 ? 'bg-indigo-600 text-white' : 'border border-gray-300 text-transparent'}">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
          </span>
        </div>
      `;

      card.addEventListener('click', () => {
        selectedReviewIndex = idx;
        elCustomReview.value = reviewText;
        updateReviewCardsSelection();
      });

      elReviewsList.appendChild(card);
    });

    // Populate editable textarea with first review
    elCustomReview.value = activeReviews[0] || '';
  }

  function updateReviewCardsSelection() {
    const cards = elReviewsList.children;
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const checkIcon = card.querySelector('.check-icon');
      if (i === selectedReviewIndex) {
        card.className = 'p-3.5 rounded-xl border text-sm transition-all cursor-pointer select-none text-left relative border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 text-gray-900 shadow-sm';
        checkIcon.className = 'check-icon flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center bg-indigo-600 text-white';
      } else {
        card.className = 'p-3.5 rounded-xl border text-sm transition-all cursor-pointer select-none text-left relative border-gray-200 bg-white hover:border-indigo-300 text-gray-700';
        checkIcon.className = 'check-icon flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center border border-gray-300 text-transparent';
      }
    }
  }

  // Star Rating Handler
  function setRating(rating) {
    currentRating = rating;
    
    // Update star visual styling
    elStars.forEach((star, idx) => {
      const starNum = idx + 1;
      const svg = star.querySelector('svg');
      if (starNum <= rating) {
        svg.classList.remove('text-gray-300');
        svg.classList.add('text-amber-400');
        star.classList.add('scale-105');
      } else {
        svg.classList.remove('text-amber-400');
        svg.classList.add('text-gray-300');
        star.classList.remove('scale-105');
      }
    });

    const strings = UI_STRINGS[currentLang] || UI_STRINGS.en;

    // Review Gating logic: 4 or 5 stars = Positive Review Funnel, 1 to 3 stars = Negative Review Protection
    if (rating >= 4) {
      elPositiveSection.classList.remove('hidden');
      elNegativeSection.classList.add('hidden');
      elRatingFeedback.textContent = rating === 5 ? "⭐⭐⭐⭐⭐ " + strings.starsSelected : "⭐⭐⭐⭐ " + strings.starsSelected;
      elRatingFeedback.className = "text-emerald-700 font-semibold text-sm transition-all";
    } else {
      elPositiveSection.classList.add('hidden');
      elNegativeSection.classList.remove('hidden');
      elRatingFeedback.textContent = "We want to make this right for you.";
      elRatingFeedback.className = "text-amber-700 font-semibold text-sm transition-all";
    }
  }

  // Star Click Listeners
  elStars.forEach(star => {
    star.addEventListener('click', () => {
      const rating = parseInt(star.dataset.star, 10);
      setRating(rating);
    });
  });

  // Language Button Listeners
  elLangBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      updateLanguage(btn.dataset.lang);
    });
  });

  // Shuffle / Regenerate Button
  elRegenBtn.addEventListener('click', () => {
    // Re-shuffle reviews with random human-touch variation
    renderReviews();
    elRegenBtn.classList.add('scale-95');
    setTimeout(() => elRegenBtn.classList.remove('scale-95'), 150);
  });

  // Copy to Clipboard & Redirect to Google
  elCopyGoogleBtn.addEventListener('click', async () => {
    const textToCopy = elCustomReview.value.trim() || activeReviews[selectedReviewIndex] || "Great service!";
    const targetGoogleUrl = formatGoogleReviewUrl(clientData.google_url);

    // Copy to clipboard
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        elCustomReview.select();
        document.execCommand('copy');
      }
    } catch (err) {
      elCustomReview.select();
      document.execCommand('copy');
    }

    // Fire celebratory confetti!
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    }

    // Open Step Guidance Modal and Redirect
    elDirectGoogleLink.href = targetGoogleUrl;
    elCopyModal.classList.remove('hidden');

    // Automatically trigger Google review opening after a brief moment
    setTimeout(() => {
      window.open(targetGoogleUrl, '_blank');
    }, 700);
  });

  elCloseModalBtn.addEventListener('click', () => {
    elCopyModal.classList.add('hidden');
  });

  // Negative Feedback Form Submission (WhatsApp / Direct message to owner/doctor)
  elNegForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('neg-name').value.trim();
    const phone = document.getElementById('neg-phone').value.trim();
    const message = document.getElementById('neg-message').value.trim();

    // Construct WhatsApp message to client owner or doctor
    const rawPhone = clientData.phone ? clientData.phone.replace(/[^0-9]/g, '') : '';
    const ownerPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
    
    const starIcons = '⭐'.repeat(currentRating);
    const doctorLabel = clientData.person_name ? `👨‍⚕️ *Doctor/Owner:* ${clientData.person_name}\n` : '';

    const complaintText = `⚠️ *PRIVATE CUSTOMER ALERT (BELOW 4★ FEEDBACK)*\n\n🏥 *Business:* ${clientData.name}\n${doctorLabel}📍 *City:* ${clientData.city || 'N/A'}\n⭐ *Rating Given:* ${currentRating}/5 Stars (${starIcons})\n\n👤 *Customer Name:* ${name}\n📞 *Customer Phone:* ${phone}\n\n📝 *Customer Complaint / Feedback:*\n"${message}"\n\n_Note: This feedback was NOT posted on Google. Please contact the customer immediately to resolve their issue._`;
    
    if (ownerPhone) {
      const waUrl = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(complaintText)}`;
      window.open(waUrl, '_blank');
    }

    // Update Thank You card text with personalized doctor/owner mention
    const strings = UI_STRINGS[currentLang] || UI_STRINGS.en;
    const thankTarget = clientData.person_name ? clientData.person_name : (clientData.name || 'our management');
    
    let thankDetailMsg = `Your feedback has been sent directly to ${thankTarget} on WhatsApp. We will reach out to you personally to make things right.`;
    if (currentLang === 'hi') {
      thankDetailMsg = `आपका संदेश सीधे ${thankTarget} को WhatsApp पर भेज दिया गया है। हम जल्द ही आपसे संपर्क करके समस्या का समाधान करेंगे।`;
    } else if (currentLang === 'gu') {
      thankDetailMsg = `તમારો સંદેશ સીધો ${thankTarget} ને WhatsApp પર મોકલી દેવાયો છે. અમે ટૂંક સમયમાં તમારો સંપર્ક કરી યોગ્ય નિરાકરણ લાવીશું.`;
    }

    const detailP = elNegSuccess.querySelector('p:last-child');
    if (detailP) detailP.textContent = thankDetailMsg;

    elNegForm.classList.add('hidden');
    elNegSuccess.classList.remove('hidden');
  });

  // Helper escape
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Initialize with 5 stars and default language
  setRating(5);
  updateLanguage(currentLang);
});
