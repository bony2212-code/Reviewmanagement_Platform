// Multilingual AI Review Templates & Comprehensive Industry Catalog
// Languages supported: English (en), Hindi (hi), Gujarati (gu)

const INDUSTRY_CATALOG = {
  surgical_medical: {
    id: "surgical_medical",
    name: "Surgical & Medical Equipment Store",
    icon: "🏥",
    categoryPhrase: {
      en: "medical & surgical equipment",
      hi: "सर्जिकल और मेडिकल इक्विपमेंट",
      gu: "સર્જિકલ અને મેડિકલ સાધનો"
    },
    defaultProducts: [
      "Wheelchair",
      "Hospital Bed",
      "Mobility Solutions",
      "Oxygen Concentrator",
      "Walker / Walking Stick",
      "BP Monitor",
      "Nebulizer Machine",
      "Commode Chair",
      "Orthopedic Supports & Belts",
      "Pulse Oximeter",
      "Air Mattress",
      "Surgical Gloves & Disposables"
    ]
  },
  healthcare: {
    id: "healthcare",
    name: "Dental, Clinic & Doctor",
    icon: "🦷",
    categoryPhrase: {
      en: "dental & healthcare services",
      hi: "डेंटल और चिकित्सा सेवा",
      gu: "દાંત અને આરોગ્ય સારવાર"
    },
    defaultProducts: [
      "Painless Root Canal",
      "Teeth Cleaning & Scaling",
      "Dental Implants",
      "Braces & Invisible Aligners",
      "Teeth Whitening",
      "Child Dental Care",
      "General Consultation",
      "Physiotherapy"
    ]
  },
  restaurant: {
    id: "restaurant",
    name: "Restaurant, Cafe & Food",
    icon: "🍽️",
    categoryPhrase: {
      en: "dining experience & food",
      hi: "स्वादिष्ट भोजन और डाइनिंग",
      gu: "સ્વાદિષ્ટ ભોજન અને ડાઇનિંગ"
    },
    defaultProducts: [
      "Authentic Gujarati Thali",
      "Sizzlers & Starters",
      "Paneer Tikka & Curries",
      "Fast Food & Pizza",
      "Family Dining",
      "Live Mocktails",
      "Delicious Desserts",
      "Breakfast & Snacks"
    ]
  },
  salon: {
    id: "salon",
    name: "Salon, Spa & Beauty Lounge",
    icon: "✂️",
    categoryPhrase: {
      en: "beauty & grooming services",
      hi: "सैलून और ग्रूमिंग सर्विस",
      gu: "સલૂન અને બ્યુટી સર્વિસ"
    },
    defaultProducts: [
      "Keratin Treatment",
      "Hydra Facial",
      "Bridal & Groom Makeup",
      "Hair Spa & Treatment",
      "Trendy Haircut & Styling",
      "Beard Styling",
      "Pedicure & Manicure",
      "Skin Rejuvenation"
    ]
  },
  automobile: {
    id: "automobile",
    name: "Automobile Service & Detailing",
    icon: "🚗",
    categoryPhrase: {
      en: "car servicing & care",
      hi: "गाड़ी की सर्विस और देखभाल",
      gu: "વાહનની સર્વિસ અને કેર"
    },
    defaultProducts: [
      "Ceramic Coating",
      "Complete Car Servicing",
      "Denting & Painting",
      "Genuine Spare Parts",
      "Wheel Alignment & Balancing",
      "Car AC Repair",
      "Foam Wash & Interior Cleaning",
      "Teflon Coating"
    ]
  },
  electronics: {
    id: "electronics",
    name: "Electronics & Mobile Store",
    icon: "📱",
    categoryPhrase: {
      en: "electronics & gadgets",
      hi: "इलेक्ट्रॉनिक्स और मोबाइल",
      gu: "ઈલેક્ટ્રોનિક્સ અને મોબાઈલ"
    },
    defaultProducts: [
      "Latest Smartphones",
      "Smart LED TV",
      "Laptop & Computer Repair",
      "Original Accessories",
      "Best Exchange Offers",
      "Bluetooth Speakers & Earbuds",
      "Home Appliances",
      "CCTV Installation"
    ]
  },
  realestate: {
    id: "realestate",
    name: "Real Estate & Builders",
    icon: "🏢",
    categoryPhrase: {
      en: "property & consultancy",
      hi: "प्रॉपर्टी और रियल एस्टेट",
      gu: "પ્રોપર્ટી અને રિયલ એસ્ટેટ"
    },
    defaultProducts: [
      "Luxury 3BHK Flats",
      "Residential Plots",
      "Commercial Showrooms",
      "Transparent Paperwork",
      "Prime Location Property",
      "Home Loan Assistance",
      "Budget Friendly Apartments"
    ]
  },
  fashion: {
    id: "fashion",
    name: "Clothing, Boutique & Fashion",
    icon: "👗",
    categoryPhrase: {
      en: "outfits & fashion collection",
      hi: "कपड़े और फैशन कलेक्शन",
      gu: "કપડાં અને ફેશન કલેક્શન"
    },
    defaultProducts: [
      "Bridal Lehenga",
      "Designer Sarees",
      "Custom Tailoring & Fitting",
      "Men's Kurta & Sherwani",
      "Partywear Suits",
      "Western & Casual Wear",
      "Premium Fabrics"
    ]
  },
  fitness: {
    id: "fitness",
    name: "Gym, Fitness & Yoga",
    icon: "🏋️",
    categoryPhrase: {
      en: "fitness & training",
      hi: "जिम और फिटनेस ट्रेनिंग",
      gu: "જીમ અને ફિટનેસ ટ્રેનિંગ"
    },
    defaultProducts: [
      "Personal Training",
      "Weight Loss Program",
      "Modern Gym Equipment",
      "Zumba & Cardio Classes",
      "Certified Fitness Coaches",
      "Diet & Nutrition Guidance",
      "Clean Workout Environment"
    ]
  },
  education: {
    id: "education",
    name: "Coaching Classes & Education",
    icon: "📚",
    categoryPhrase: {
      en: "coaching & education",
      hi: "कोचिंग और पढ़ाई",
      gu: "કોચિંગ અને શિક્ષણ"
    },
    defaultProducts: [
      "Concept Clarity",
      "Board Exam Preparation",
      "Small Batch Sizes",
      "Experienced Teachers",
      "Personal Attention",
      "Quality Study Material",
      "Regular Test Series"
    ]
  },
  furniture: {
    id: "furniture",
    name: "Furniture & Interior Design",
    icon: "🛋️",
    categoryPhrase: {
      en: "furniture & home decor",
      hi: "फर्नीचर और होम डेकोर",
      gu: "ફર્નિચર અને હોમ ડેકોર"
    },
    defaultProducts: [
      "Modular Kitchen",
      "Wooden Sofa Set",
      "Luxury Double Bed",
      "Office Tables & Chairs",
      "Custom Wardrobe Design",
      "Durable Wooden Polish",
      "Dining Table Set"
    ]
  },
  legal_finance: {
    id: "legal_finance",
    name: "CA, Tax & Legal Services",
    icon: "⚖️",
    categoryPhrase: {
      en: "financial & legal consultancy",
      hi: "टैक्स और कानूनी सेवाएं",
      gu: "ટેક્સ અને કાનૂની સેવાઓ"
    },
    defaultProducts: [
      "GST Registration & Returns",
      "Income Tax Filing (ITR)",
      "Company Registration",
      "Audit & Bookkeeping",
      "Business Loan Consultancy",
      "Trademark Registration",
      "Financial Advisory"
    ]
  },
  general: {
    id: "general",
    name: "General Retail & Services",
    icon: "💼",
    categoryPhrase: {
      en: "products & services",
      hi: "उत्पाद और सेवाएं",
      gu: "પ્રોડક્ટ્સ અને સેવાઓ"
    },
    defaultProducts: [
      "Quality Products",
      "Prompt Customer Support",
      "Affordable Pricing",
      "Fast Delivery & Turnaround",
      "Honest Guidance & Advice",
      "Reliable After-Sales Service"
    ]
  }
};

// UI Translations for the Funnel
const UI_STRINGS = {
  en: {
    langName: "English",
    howWasExp: "How was your experience with",
    tapToRate: "Tap a star to rate us",
    starsSelected: "5-Star Experience!",
    selectLanguagePrompt: "Select Review Language:",
    selectProductPrompt: "What did you purchase or visit for? (Tap to customize review)",
    allProductsLabel: "All / General",
    chooseReview: "Choose your favorite review or edit:",
    copyBtn: "📋 Copy & Open Google (5★)",
    copiedToast: "✅ Copied! Opening Google Reviews... Just Paste & Submit!",
    regenerateBtn: "✨ Shuffle / Fresh Variations",
    customEditPlaceholder: "You can also type your custom review here...",
    step1Title: "Step 1",
    step1Desc: "Select 5 Stars ⭐⭐⭐⭐⭐",
    step2Title: "Step 2",
    step2Desc: "Paste your review 📋",
    step3Title: "Step 3",
    step3Desc: "Hit Post! 🚀",
    negHeading: "We are deeply sorry for your experience",
    negSubheading: "Your satisfaction is our #1 priority. Please share your direct feedback with the owner so we can resolve this immediately.",
    negNamePlaceholder: "Your Name",
    negPhonePlaceholder: "Your Phone / WhatsApp Number",
    negMsgPlaceholder: "What went wrong? How can we make it right?",
    negSubmitBtn: "📩 Send Direct Feedback to Owner",
    negSubmittedMsg: "Thank you! Your feedback has been sent directly to the owner. We will contact you shortly."
  },
  hi: {
    langName: "हिन्दी",
    howWasExp: "आपका अनुभव कैसा रहा?",
    tapToRate: "रेटिंग देने के लिए स्टार पर टैप करें",
    starsSelected: "शानदार 5-स्टार अनुभव!",
    selectLanguagePrompt: "रिव्यू की भाषा चुनें:",
    selectProductPrompt: "आपने क्या सामान या सर्विस ली? (रिव्यू कस्टमाइज़ करने के लिए टैप करें):",
    allProductsLabel: "सभी / जनरल",
    chooseReview: "अपना पसंदीदा रिव्यू चुनें या एडिट करें:",
    copyBtn: "📋 रिव्यू कॉपी करें और Google पर 5★ दें",
    copiedToast: "✅ रिव्यू कॉपी हो गया! अब बस गूगल पर पेस्ट (Paste) करके पोस्ट करें!",
    regenerateBtn: "✨ नया रिव्यू बनाएं (Shuffle)",
    customEditPlaceholder: "आप चाहें तो यहां अपना खुद का रिव्यू भी लिख सकते हैं...",
    step1Title: "स्टेप 1",
    step1Desc: "5 स्टार ⭐⭐⭐⭐⭐ चुनें",
    step2Title: "स्टेप 2",
    step2Desc: "रिव्यू पेस्ट (Paste) करें 📋",
    step3Title: "स्टेप 3",
    step3Desc: "Post बटन दबाएं! 🚀",
    negHeading: "हमें खेद है कि आपका अनुभव अच्छा नहीं रहा",
    negSubheading: "आपकी संतुष्टि हमारे लिए सबसे महत्वपूर्ण है। कृपया सीधे मालिक को बताएं ताकि हम इसे तुरंत ठीक कर सकें।",
    negNamePlaceholder: "आपका नाम",
    negPhonePlaceholder: "आपका फोन / व्हाट्सऐप नंबर",
    negMsgPlaceholder: "क्या कमी रह गई? हम इसे कैसे बेहतर कर सकते हैं?",
    negSubmitBtn: "📩 मालिक को सीधे फीडबैक भेजें",
    negSubmittedMsg: "धन्यवाद! आपका संदेश सीधे मालिक तक पहुंचा दिया गया है। हम जल्द आपसे संपर्क करेंगे।"
  },
  gu: {
    langName: "ગુજરાતી",
    howWasExp: "તમારો અનુભવ કેવો રહ્યો?",
    tapToRate: "રેટિંગ આપવા માટે સ્ટાર પર ટેપ કરો",
    starsSelected: "ઉત્કૃષ્ટ 5-સ્ટાર અનુભવ!",
    selectLanguagePrompt: "રિવ્યૂની ભાષા પસંદ કરો:",
    selectProductPrompt: "તમે કઈ પ્રોડક્ટ કે સર્વિસ લીધી? (રિવ્યૂ બદલવા માટે ટેપ કરો):",
    allProductsLabel: "બધું / જનરલ",
    chooseReview: "તમારો મનપસંદ રિવ્યૂ પસંદ કરો અથવા એડિટ કરો:",
    copyBtn: "📋 રિવ્યૂ કોપી કરો અને Google પર 5★ આપો",
    copiedToast: "✅ રિવ્યૂ કોપી થઈ ગયો! હવે ગૂગલ પર ફક્ત પેસ્ટ (Paste) કરીને પોસ્ટ કરો!",
    regenerateBtn: "✨ નવો રિવ્યૂ બનાવો (Shuffle)",
    customEditPlaceholder: "તમે અહીં તમારી રીતે પણ રિવ્યૂ લખી શકો છો...",
    step1Title: "પગલું 1",
    step1Desc: "5 સ્ટાર ⭐⭐⭐⭐⭐ પસંદ કરો",
    step2Title: "પગલું 2",
    step2Desc: "રિવ્યૂ પેસ્ટ (Paste) કરો 📋",
    step3Title: "પગલું 3",
    step3Desc: "Post બટન દબાવો! 🚀",
    negHeading: "અમને દિલગીરી છે કે તમારો અનુભવ સારો ન રહ્યો",
    negSubheading: "તમારો સંતોષ અમારા માટે સર્વોપરી છે. કૃપા કરીને સીધો માલિકને પ્રતિસાદ આપો જેથી અમે તેનું તાત્કાલિક નિરાકરણ લાવી શકીએ.",
    negNamePlaceholder: "તમારું નામ",
    negPhonePlaceholder: "તમારો ફોન / વ્હોટ્સએપ નંબર",
    negMsgPlaceholder: "શું ખામી રહી ગઈ? અમે તેને કેવી રીતે સુધારી શકીએ?",
    negSubmitBtn: "📩 માલિકને સીધો ફીડબેક મોકલો",
    negSubmittedMsg: "ખૂબ ખૂબ આભાર! તમારો સંદેશ સીધો માલિક સુધી પહોંચાડી દેવાયો છે. અમે ટૂંક સમયમાં તમારો સંપર્ક કરીશું."
  }
};

// Human-touch sentence structure variations per language
const REVIEW_STRUCTURES = {
  en: [
    // Variation 1: Direct Purchase & High Quality
    "I recently visited {name} in {city} for {product}. The quality was exceptional and the pricing was completely genuine. The staff is extremely knowledgeable, patient, and polite. Very satisfied with the experience, full 5 stars!",
    // Variation 2: Recommendation & Trust
    "If you are looking for reliable {product} in {city}, {name} is hands down the best place! Transparent dealings, quick service, and top-notch standards. Highly recommended to everyone!",
    // Variation 3: Super Helpful Staff & Smooth Process
    "Had an amazing experience at {name} in {city}! The team explained everything thoroughly and helped me pick the best {product}. Very cooperative people and seamless process. Must visit!",
    // Variation 4: Value for Money & Authentic
    "Outstanding service and great value for money at {name}! Purchased {product} from here and the quality exceeded my expectations. {city} needs more honest businesses like this. 5/5 stars!",
    // Variation 5: Short & Crisp
    "Best place in {city} for {product}! Super fast service, friendly behavior, and 100% genuine quality. Thank you {name} team for such a wonderful experience!"
  ],
  hi: [
    // Variation 1: Direct Purchase & High Quality
    "मैंने हाल ही में {city} में {name} से {product} लिया। प्रोडक्ट की क्वालिटी एकदम शानदार है और दाम भी बिल्कुल सही है। यहां का स्टाफ बहुत ही विनम्र, पेशेवर और मददगार है। 10 में से 10 अनुभव, 5 स्टार रेटिंग दिल से बनती है!",
    // Variation 2: Recommendation & Trust
    "अगर आप {city} में भरोसेमंद {product} तलाश रहे हैं, तो {name} सबसे बेस्ट जगह है! यहां काम बहुत ही ईमानदारी और समय की पाबंदी के साथ होता है। मैं सभी को यहां आने की सलाह दूंगा।",
    // Variation 3: Super Helpful Staff & Guidance
    "{name} की सर्विस सच में तारीफ के काबिल है। {product} को लेकर इन्होंने मुझे पूरी जानकारी दी और सबसे सही विकल्प चुनने में मदद की। {city} में इनसे बेहतर सर्विस और कहीं नहीं मिल सकती!",
    // Variation 4: Value for Money & Satisfaction
    "लाजवाब सर्विस और एकदम वाजिब रेट! {name} से {product} लेने का अनुभव बहुत ही सुखद रहा। पूरी टीम का व्यवहार बहुत अच्छा है। 100% संतुष्ट ग्राहक, बहुत-बहुत धन्यवाद!",
    // Variation 5: Short & Crisp
    "{city} में {product} के लिए {name} नंबर 1 है! बेहतरीन क्वालिटी, फास्ट सर्विस और बहुत ही फ्रेंडली स्टाफ। 5 स्टार से कम कुछ नहीं!"
  ],
  gu: [
    // Variation 1: Direct Purchase & High Quality
    "મેં તાજેતરમાં {city} માં {name} ખાતેથી {product} લીધું. ક્વોલિટી ખરેખર ખૂબ જ શ્રેષ્ઠ છે અને ભાવ પણ એકદમ વ્યાજબી. સ્ટાફનું માર્ગદર્શન અને સ્વભાવ ખૂબ જ નમ્ર અને પ્રેમાળ રહ્યો. સંપૂર્ણ સંતોષ, 5 સ્ટાર રેટીંગ!",
    // Variation 2: Recommendation & Trust
    "જો તમે {city} માં વિશ્વસનીય અને સારી ગુણવત્તાવાળા {product} ની શોધમાં હોવ, તો {name} સૌથી ઉત્તમ સ્થળ છે! પ્રમાણિક વ્યવહાર અને ઝડપી સર્વિસ માટે હું દરેકને જરૂર ભલામણ કરું છું.",
    // Variation 3: Super Helpful Staff & Guidance
    "{name} ની સર્વિસ ખરેખર પ્રશંસનીય છે! {product} બાબતે એમણે મને ખૂબ જ સાચું અને ઉપયોગી માર્ગદર્શન આપ્યું. {city} માં આટલી સરસ અને સહાયક ટીમ મળવી મુશ્કેલ છે. ખૂબ ખૂબ આભાર!",
    // Variation 4: Value for Money & Satisfaction
    "એકદમ સંતોષકારક સર્વિસ અને વાજબી કિંમત! {name} પાસેથી {product} મેળવવાનો મારો અનુભવ ઉત્તમ રહ્યો. અહીંનો સ્ટાફ ગ્રાહકની જરૂરિયાત ખૂબ પ્રેમથી સમજે છે. 100% રેકોમેન્ડેડ!",
    // Variation 5: Short & Crisp
    "{city} માં {product} માટે {name} સર્વશ્રેષ્ઠ છે! ઉત્તમ ગુણવત્તા, ઝડપી રિસ્પોન્સ અને અદ્ભુત સર્વિસ. દિલથી 5 સ્ટાર રેટીંગ આપું છું!"
  ]
};

// Generates reviews dynamically based on business info, category, language, and selected product
function generateReviews(client, lang = 'en', selectedProduct = null) {
  const catKey = client.category && INDUSTRY_CATALOG[client.category] ? client.category : 'general';
  const categoryInfo = INDUSTRY_CATALOG[catKey] || INDUSTRY_CATALOG.general;
  
  const name = client.name || "Business";
  const city = client.city || "City";
  const person = client.person_name ? client.person_name.trim() : "";
  
  // Determine product wording
  let productWording = selectedProduct;
  if (!productWording) {
    // If client provided custom keywords/products, pick one
    const rawKeywords = client.keywords ? client.keywords.split(',').map(k => k.trim()).filter(Boolean) : [];
    if (rawKeywords.length > 0) {
      productWording = rawKeywords[Math.floor(Math.random() * rawKeywords.length)];
    } else {
      productWording = categoryInfo.categoryPhrase[lang] || categoryInfo.categoryPhrase.en;
    }
  }

  const templates = REVIEW_STRUCTURES[lang] || REVIEW_STRUCTURES.en;
  
  // Shuffle variations so user gets fresh human reviews every time
  const shuffled = [...templates].sort(() => 0.5 - Math.random());
  
  return shuffled.slice(0, 3).map(template => {
    let text = template
      .replace(/{name}/g, name)
      .replace(/{city}/g, city)
      .replace(/{product}/g, productWording)
      .replace(/\s+/g, ' ')
      .trim();

    // If person/doctor name is provided, naturally weave it into doctor/hospital or professional reviews
    if (person) {
      if (lang === 'en' && !text.includes(person)) {
        text = text.replace(/The staff is|The team is|Staff guided me/g, `${person} and the staff were`);
      } else if (lang === 'hi' && !text.includes(person)) {
        text = text.replace(/यहां का स्टाफ|पूरी टीम/g, `${person} और पूरा स्टाफ`);
      } else if (lang === 'gu' && !text.includes(person)) {
        text = text.replace(/સ્ટાફનું|અહીંનો સ્ટાફ/g, `${person} અને સ્ટાફનું`);
      }
    }

    return text;
  });
}

// Convert Place ID or URL to Direct 5-Star Write Review URL
function formatGoogleReviewUrl(inputUrlOrPlaceId) {
  if (!inputUrlOrPlaceId) return "https://search.google.com";
  
  const cleanInput = inputUrlOrPlaceId.trim();
  
  // If user entered a Google Place ID directly
  if (/^ChIJ[A-Za-z0-9_-]+$/.test(cleanInput)) {
    return `https://search.google.com/local/writereview?placeid=${cleanInput}`;
  }
  
  // If user provided a link with placeid query parameter
  if (cleanInput.includes("placeid=")) {
    return cleanInput;
  }
  
  // If it's already a direct review link
  if (cleanInput.includes("/review") || cleanInput.includes("writereview")) {
    return cleanInput;
  }

  // If it's a short g.page URL without /review
  if (cleanInput.includes("g.page/") && !cleanInput.endsWith("/review")) {
    return cleanInput.endsWith("/") ? `${cleanInput}review` : `${cleanInput}/review`;
  }

  return cleanInput;
}

// Client serialization for URL sharing without backend database
function encodeClientData(client) {
  try {
    const jsonStr = JSON.stringify(client);
    return encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
  } catch (e) {
    console.error("Encoding failed", e);
    return "";
  }
}

function decodeClientData(hashOrParam) {
  try {
    const jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(hashOrParam))));
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Decoding failed", e);
    return null;
  }
}
