/* =============================================
   PARICHAY PATRA — app.js v7
   Backend: GitHub + JSON (data.json in repo)
   Admin saves → GitHub API → live for everyone
   ============================================= */

// ============================================
// ⚙️  GITHUB CONFIG — Fill these in Admin Panel
//     (stored in localStorage on admin's device)
// ============================================
const GITHUB_CONFIG_KEY = 'parichay_github_config';

function getGithubConfig() {
  try { return JSON.parse(localStorage.getItem(GITHUB_CONFIG_KEY)) || {}; }
  catch(e) { return {}; }
}
function saveGithubConfig(cfg) {
  localStorage.setItem(GITHUB_CONFIG_KEY, JSON.stringify(cfg));
}

// ---- PASSWORDS ----
const PUBLIC_PWD = 'parichay2024';
const ADMIN_PWD  = 'ganesh@admin';

// ---- LOCAL CACHE KEY (for offline fallback) ----
const CACHE_KEY = 'parichay_data_cache';

const DEFAULT_DATA = {
  name:    { mr: 'श्री. राहुल विनायक देशपांडे', en: 'Mr. Rahul Vinayak Deshpande' },
  personal: {
    dob:        { mr: '15 जून 1996',           en: '15 June 1996' },
    height:     { mr: '5 फूट 8 इंच (172 cm)',  en: '5 ft 8 in (172 cm)' },
    colour:     { mr: 'गोरा (Fair)',            en: 'Fair' },
    jatDharma:  { mr: 'मराठा / Hindu',          en: 'Maratha / Hindu' },
    kuldaivat:  { mr: 'श्री. भवानी माता',       en: 'Shri Bhavani Mata' },
    devak:      { mr: 'नारळ',                   en: 'Coconut' },
    bloodGroup: { mr: 'B+',                     en: 'B+' }
  },
  horoscope: {
    gan:            { mr: 'देव गण',      en: 'Dev Gan' },
    nadi:           { mr: 'अंत्य नाडी',  en: 'Antya Nadi' },
    janmanakshatra: { mr: 'रोहिणी',      en: 'Rohini' },
    jamvel:         { mr: 'रात्री 11:30', en: 'Night 11:30' }
  },
  education: {
    qualification: { mr: 'B.E. (Computer Engineering)', en: 'B.E. (Computer Engineering)' },
    college:       { mr: 'Pune University',              en: 'Pune University' },
    passingYear:   { mr: '2018',                         en: '2018' }
  },
  career: {
    company:     { mr: 'TCS India Pvt. Ltd.',   en: 'TCS India Pvt. Ltd.' },
    designation: { mr: 'Software Engineer',     en: 'Software Engineer' },
    salary:      { mr: '₹ 8,50,000 / वार्षिक', en: '₹ 8,50,000 / Annually' }
  },
  family: {
    father: {
      name:       { mr: 'श्री. विनायक रामचंद्र देशपांडे', en: 'Shri. Vinayak Ramchandra Deshpande' },
      occupation: { mr: 'शेती व्यवसाय', en: 'Farming' }
    },
    mother: {
      name:       { mr: 'सौ. सुनीता विनायक देशपांडे', en: 'Sau. Sunita Vinayak Deshpande' },
      occupation: { mr: 'गृहिणी', en: 'Homemaker' }
    },
    sisters:  [{ name:{mr:'कु. प्रिया देशपांडे',en:'Ku. Priya Deshpande'}, occupation:{mr:'शिक्षिका',en:'Teacher'}, married:{mr:'अविवाहित',en:'Unmarried'} }],
    brothers: [],
    mamas:    [{ name:{mr:'श्री. सुभाष जोशी',en:'Shri. Subhash Joshi'}, relation:{mr:'मामा',en:'Maternal Uncle'}, location:{mr:'पुणे',en:'Pune'} }],
    mushis:   [],
    chultas:  []
  },
  gallery:  [],
  contacts: [
    { name:{mr:'श्री. विनायक देशपांडे',en:'Shri. Vinayak Deshpande'}, relation:{mr:'वडील',en:'Father'}, phone:'+91 98765 43210' },
    { name:{mr:'श्री. राहुल देशपांडे', en:'Shri. Rahul Deshpande'},  relation:{mr:'स्वतः',en:'Self'},   phone:'+91 91234 56789' }
  ],
  whatsapp: '919123456789',
  mapLink:  'https://maps.google.com/?q=Pune,Maharashtra',
  address:  { mr: 'मु. पो. शिरूर, ता. शिरूर, जि. पुणे - 412210', en: 'Shirur, Taluka Shirur, Dist. Pune - 412210' }
};

// =============================================
// LANGUAGE
// =============================================
let currentLang = 'mr';

const LANG = {
  mr: {
    heading:'परिचयपत्र', headingSub:'Parichay Patra', biodataSub:'वधू / वर परिचयपत्र',
    langLabel:'मराठी', langNext:'EN',
    secPersonal:'वैयक्तिक माहिती', secHoro:'जन्मकुंडली माहिती', secEdu:'शैक्षणिक माहिती',
    secCareer:'नोकरी / व्यवसाय', secFamily:'कौटुंबिक माहिती', secGallery:'छायाचित्र दालन', secContact:'संपर्क',
    lDob:'जन्म दिनांक', lHeight:'उंची', lColour:'वर्ण', lJat:'जात / धर्म',
    lKuldaivat:'कुलदैवत', lDevak:'देवक', lBlood:'रक्तगट', lGan:'गण',
    lNadi:'नाडी', lNakshatra:'जन्मनक्षत्र', lJamvel:'जन्मवेळ',
    lQual:'शैक्षणिक पात्रता', lCollege:'महाविद्यालय', lYear:'उत्तीर्ण वर्ष',
    lCompany:'कंपनी', lDesig:'पद (Designation)', lSalary:'वार्षिक वेतन',
    flFather:'वडील (Father)', flMother:'आई (Mother)', flSisters:'बहिणी (Sisters)', flBrothers:'भाऊ (Brothers)',
    flMamas:'मामा (Maternal Uncle)', flMushis:'मावशी (Maternal Aunt)', flChultas:'चुलते (Paternal Uncles)',
    btnWa:'WhatsApp', btnMap:'नकाशा / Map', btnPrint:'प्रिंट', btnShare:'शेअर', noPhotos:'फोटो नाही'
  },
  en: {
    heading:'Biodata', headingSub:'परिचयपत्र', biodataSub:'Bride / Groom Biodata',
    langLabel:'English', langNext:'मरा',
    secPersonal:'Personal Information', secHoro:'Horoscope Information', secEdu:'Educational Information',
    secCareer:'Career / Occupation', secFamily:'Family Information', secGallery:'Photo Gallery', secContact:'Contact',
    lDob:'Date of Birth', lHeight:'Height', lColour:'Complexion', lJat:'Caste / Religion',
    lKuldaivat:'Kuldaivat', lDevak:'Devak', lBlood:'Blood Group', lGan:'Gan',
    lNadi:'Nadi', lNakshatra:'Birth Nakshatra', lJamvel:'Birth Time',
    lQual:'Highest Qualification', lCollege:'College / University', lYear:'Passing Year',
    lCompany:'Company', lDesig:'Designation', lSalary:'Annual Salary',
    flFather:'Father (वडील)', flMother:'Mother (आई)', flSisters:'Sisters (बहिणी)', flBrothers:'Brothers (भाऊ)',
    flMamas:'Maternal Uncle (मामा)', flMushis:'Maternal Aunt (मावशी)', flChultas:'Paternal Uncles (चुलते)',
    btnWa:'WhatsApp', btnMap:'Map', btnPrint:'Print', btnShare:'Share', noPhotos:'No photos yet'
  }
};

function val(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[currentLang] || obj.mr || obj.en || '';
}

// =============================================
// DATA — Load from GitHub, fallback to cache
// =============================================
let appData = JSON.parse(JSON.stringify(DEFAULT_DATA));

async function fetchDataFromGitHub() {
  const cfg = getGithubConfig();
  if (!cfg.owner || !cfg.repo) return null;
  try {
    const url = `https://raw.githubusercontent.com/${cfg.owner}/${cfg.repo}/${cfg.branch||'main'}/data.json?t=${Date.now()}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    return data;
  } catch(e) { return null; }
}

function loadCachedData() {
  try {
    const s = localStorage.getItem(CACHE_KEY);
    return s ? JSON.parse(s) : null;
  } catch(e) { return null; }
}

// =============================================
// SAVE DATA TO GITHUB
// =============================================
async function saveDataToGitHub(data) {
  const cfg = getGithubConfig();
  if (!cfg.owner || !cfg.repo || !cfg.token) {
    toast('❌ GitHub config missing! Set it in ⚙️ GitHub Settings tab.');
    return false;
  }

  const branch = cfg.branch || 'main';
  const path   = 'data.json';
  const apiBase = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${path}`;
  const headers = {
    'Authorization': `token ${cfg.token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github.v3+json'
  };

  // Get current file SHA (needed to update)
  let sha = '';
  try {
    const r = await fetch(apiBase, { headers });
    if (r.ok) { const j = await r.json(); sha = j.sha; }
  } catch(e) {}

  const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));

  const body = {
    message: 'Update biodata via Admin Panel',
    content,
    branch,
    ...(sha ? { sha } : {})
  };

  try {
    const r = await fetch(apiBase, { method:'PUT', headers, body: JSON.stringify(body) });
    if (r.ok) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      return true;
    } else {
      const err = await r.json();
      toast('❌ GitHub Error: ' + (err.message || 'Unknown error'));
      return false;
    }
  } catch(e) {
    toast('❌ Network error. Check your token & repo name.');
    return false;
  }
}

// =============================================
// PASSWORD GATES
// =============================================
function initPublicGate() {
  if (!sessionStorage.getItem('public_unlocked')) {
    document.getElementById('public-gate').classList.add('show');
  } else {
    loadAndRender();
  }
}

async function loadAndRender() {
  const fromGH = await fetchDataFromGitHub();
  if (fromGH) { appData = fromGH; }
  else {
    const cached = loadCachedData();
    if (cached) appData = cached;
  }
  renderPublicPage();
}

window.checkPublicPassword = function() {
  const v = document.getElementById('gatePwdInput').value;
  if (v === PUBLIC_PWD) {
    sessionStorage.setItem('public_unlocked','1');
    document.getElementById('public-gate').classList.remove('show');
    loadAndRender();
  } else {
    document.getElementById('gateError').classList.add('show');
    document.getElementById('gatePwdInput').value='';
    document.getElementById('gatePwdInput').focus();
  }
};

window.openAdminModal = function() {
  document.getElementById('pwd-modal').classList.add('open');
  document.getElementById('adminPwdInput').value='';
  document.querySelector('#pwd-modal .pwd-error').classList.remove('show');
  setTimeout(()=>document.getElementById('adminPwdInput').focus(),80);
};
window.checkAdminPassword = function() {
  const v = document.getElementById('adminPwdInput').value;
  if (v === ADMIN_PWD) {
    document.getElementById('pwd-modal').classList.remove('open');
    showAdminPage();
  } else {
    document.querySelector('#pwd-modal .pwd-error').classList.add('show');
    document.getElementById('adminPwdInput').value='';
  }
};

// =============================================
// PAGE SWITCH
// =============================================
function showAdminPage() {
  document.getElementById('public-page').style.display='none';
  document.getElementById('admin-page').style.display='block';
  renderAdminPage();
}
window.showPublicPage = function() {
  document.getElementById('admin-page').style.display='none';
  document.getElementById('public-page').style.display='block';
  renderPublicPage();
};

// =============================================
// RENDER PUBLIC
// =============================================
function renderPublicPage() {
  const L=LANG[currentLang], d=appData;
  t('candidateName',    val(d.name));
  t('mainHeading',      L.heading);
  t('mainHeadingSub',   L.headingSub);
  t('candidateNameSub', L.biodataSub);
  t('langCurrent',      L.langLabel);
  t('langNext',         L.langNext);
  t('sec-personal',L.secPersonal); t('sec-horo',L.secHoro); t('sec-edu',L.secEdu);
  t('sec-career',L.secCareer); t('sec-family',L.secFamily);
  t('sec-gallery',L.secGallery); t('sec-contact',L.secContact);

  field('item-dob',       L.lDob,       val(d.personal.dob));
  field('item-height',    L.lHeight,    val(d.personal.height));
  field('item-colour',    L.lColour,    val(d.personal.colour));
  field('item-jat',       L.lJat,       val(d.personal.jatDharma));
  field('item-kuldaivat', L.lKuldaivat, val(d.personal.kuldaivat));
  field('item-devak',     L.lDevak,     val(d.personal.devak));
  field('item-blood',     L.lBlood,     val(d.personal.bloodGroup));
  field('item-gan',       L.lGan,       val(d.horoscope.gan));
  field('item-nadi',      L.lNadi,      val(d.horoscope.nadi));
  field('item-nakshatra', L.lNakshatra, val(d.horoscope.janmanakshatra));
  field('item-jamvel',    L.lJamvel,    val(d.horoscope.jamvel));
  field('item-qual',      L.lQual,      val(d.education.qualification));
  field('item-college',   L.lCollege,   val(d.education.college));
  field('item-year',      L.lYear,      val(d.education.passingYear));
  field('item-company',   L.lCompany,   val(d.career.company));
  field('item-desig',     L.lDesig,     val(d.career.designation));
  field('item-salary',    L.lSalary,    val(d.career.salary));

  t('fl-father',   L.flFather);
  t('fl-mother',   L.flMother);
  t('fl-sisters',  L.flSisters);
  t('fl-brothers', L.flBrothers);
  t('fl-mamas',    L.flMamas);
  t('fl-mushis',   L.flMushis);
  t('fl-chultas',  L.flChultas);
  renderFamilyPublic(d); renderGalleryPublic(d); renderContactsPublic(d);

  const wa=document.getElementById('action-wa'), map=document.getElementById('action-map');
  if(wa)  wa.href ='https://wa.me/'+(d.whatsapp||'').replace(/\D/g,'');
  if(map) map.href=d.mapLink||'#';
  document.documentElement.lang=currentLang;
}

function t(id,text){const e=document.getElementById(id);if(e)e.textContent=text||'';}
function field(id,label,value){
  const e=document.getElementById(id);if(!e)return;
  const lEl=e.querySelector('.info-item-label'),vEl=e.querySelector('.info-item-value');
  if(lEl)lEl.textContent=label; if(vEl)vEl.textContent=value||'—';
}
function renderFamilyPublic(d){
  renderParentCard('family-father',d.family.father);
  renderParentCard('family-mother',d.family.mother);
  renderMemberCards('family-sisters',  d.family.sisters  ||[]);
  renderMemberCards('family-brothers', d.family.brothers ||[]);
  renderMemberCards('family-mamas',    d.family.mamas    ||[]);
  renderMemberCards('family-mushis',   d.family.mushis   ||[]);
  renderMemberCards('family-chultas',  d.family.chultas  ||[]);
}
function renderParentCard(id,m){
  const e=document.getElementById(id);if(!e||!m)return;
  e.innerHTML=`<div class="family-card"><div class="fc-name">${val(m.name)||'—'}</div><div class="fc-detail">${IC.briefcase}<span>${val(m.occupation)||'—'}</span></div></div>`;
}
function renderMemberCards(id,members){
  const e=document.getElementById(id);if(!e)return;
  if(!members||!members.length){e.innerHTML=`<span style="color:var(--text-light);font-size:0.85rem;padding:4px">—</span>`;return;}
  e.innerHTML=members.map(m=>`<div class="family-card">
    <div class="fc-name">${val(m.name)||'—'}</div>
    ${m.occupation?`<div class="fc-detail">${IC.briefcase}<span>${val(m.occupation)}</span></div>`:''}
    ${m.relation  ?`<div class="fc-detail">${IC.users}<span>${val(m.relation)}</span></div>`:''}
    ${m.married   ?`<div class="fc-detail">${IC.heart}<span>${val(m.married)}</span></div>`:''}
    ${m.location  ?`<div class="fc-detail">${IC.mapPin}<span>${val(m.location)}</span></div>`:''}
  </div>`).join('');
}
function renderGalleryPublic(d){
  const e=document.getElementById('gallery-grid');if(!e)return;
  if(!d.gallery||!d.gallery.length){e.innerHTML=`<div class="gallery-item"><div class="gallery-placeholder">${IC.image}<span>${LANG[currentLang].noPhotos}</span></div></div>`;return;}
  e.innerHTML=d.gallery.map((src,i)=>`<div class="gallery-item" onclick="openLightbox(${i})"><img src="${src}" alt="Photo ${i+1}" loading="lazy"/><div class="gallery-overlay">${IC.search}</div></div>`).join('');
}
function renderContactsPublic(d){
  const e=document.getElementById('contact-cards');if(!e)return;
  e.innerHTML=(d.contacts||[]).map(c=>`<div class="contact-card"><div class="cc-rel">${val(c.relation)||''}</div><div class="cc-name">${val(c.name)||''}</div><a class="cc-phone" href="tel:${c.phone}">${IC.phone}<span>${c.phone}</span></a></div>`).join('');
}

window.toggleLang=function(){currentLang=currentLang==='mr'?'en':'mr';renderPublicPage();};
window.openLightbox=function(i){document.querySelector('#lightbox img').src=appData.gallery[i];document.getElementById('lightbox').classList.add('open');};
window.printPage=()=>window.print();
window.sharePage=function(){
  if(navigator.share)navigator.share({title:val(appData.name)+' — परिचयपत्र',url:location.href});
  else navigator.clipboard.writeText(location.href).then(()=>toast('लिंक कॉपी झाली!'));
};

// =============================================
// ADMIN — RENDER
// =============================================
function sv(id,v){const e=document.getElementById(id);if(e)e.value=v||'';}
function svBi(id,obj){sv(id+'-mr',obj&&obj.mr);sv(id+'-en',obj&&obj.en);}
function gv(id){const e=document.getElementById(id);return e?e.value.trim():'';}
function gvBi(id){return{mr:gv(id+'-mr'),en:gv(id+'-en')};}

function renderAdminPage(){
  const d=appData;
  sv('adm-name-mr',d.name&&d.name.mr); sv('adm-name-en',d.name&&d.name.en);
  svBi('adm-dob',d.personal.dob); svBi('adm-height',d.personal.height);
  svBi('adm-colour',d.personal.colour); svBi('adm-jat',d.personal.jatDharma);
  svBi('adm-kuldaivat',d.personal.kuldaivat); svBi('adm-devak',d.personal.devak);
  svBi('adm-blood',d.personal.bloodGroup);
  svBi('adm-gan',d.horoscope.gan); svBi('adm-nadi',d.horoscope.nadi);
  svBi('adm-nakshatra',d.horoscope.janmanakshatra); svBi('adm-jamvel',d.horoscope.jamvel);
  svBi('adm-qual',d.education.qualification); svBi('adm-college',d.education.college);
  svBi('adm-year',d.education.passingYear);
  svBi('adm-company',d.career.company); svBi('adm-desig',d.career.designation);
  svBi('adm-salary',d.career.salary);
  svBi('adm-father-name',d.family.father&&d.family.father.name);
  svBi('adm-father-occ', d.family.father&&d.family.father.occupation);
  svBi('adm-mother-name',d.family.mother&&d.family.mother.name);
  svBi('adm-mother-occ', d.family.mother&&d.family.mother.occupation);
  sv('adm-wa',d.whatsapp); sv('adm-map',d.mapLink);
  svBi('adm-address',d.address);

  // GitHub config
  const cfg=getGithubConfig();
  sv('gh-owner',cfg.owner); sv('gh-repo',cfg.repo);
  sv('gh-branch',cfg.branch||'main'); sv('gh-token',cfg.token);

  renderAdminContacts();
  renderDynList('adm-sisters', d.family.sisters ||[]);
  renderDynList('adm-brothers',d.family.brothers||[]);
  renderDynList('adm-mamas',   d.family.mamas   ||[]);
  renderDynList('adm-mushis',  d.family.mushis  ||[]);
  renderDynList('adm-chultas', d.family.chultas ||[]);
  renderAdminGallery();
}

function collectData() {
  const d = appData;
  d.name={mr:gv('adm-name-mr'),en:gv('adm-name-en')};
  d.personal.dob=gvBi('adm-dob'); d.personal.height=gvBi('adm-height');
  d.personal.colour=gvBi('adm-colour'); d.personal.jatDharma=gvBi('adm-jat');
  d.personal.kuldaivat=gvBi('adm-kuldaivat'); d.personal.devak=gvBi('adm-devak');
  d.personal.bloodGroup=gvBi('adm-blood');
  d.horoscope.gan=gvBi('adm-gan'); d.horoscope.nadi=gvBi('adm-nadi');
  d.horoscope.janmanakshatra=gvBi('adm-nakshatra'); d.horoscope.jamvel=gvBi('adm-jamvel');
  d.education.qualification=gvBi('adm-qual'); d.education.college=gvBi('adm-college');
  d.education.passingYear=gvBi('adm-year');
  d.career.company=gvBi('adm-company'); d.career.designation=gvBi('adm-desig');
  d.career.salary=gvBi('adm-salary');
  d.family.father={name:gvBi('adm-father-name'),occupation:gvBi('adm-father-occ')};
  d.family.mother={name:gvBi('adm-mother-name'),occupation:gvBi('adm-mother-occ')};
  d.whatsapp=gv('adm-wa'); d.mapLink=gv('adm-map'); d.address=gvBi('adm-address');
  return d;
}

window.adminSaveAll = async function() {
  const btn = document.getElementById('btn-save-main');
  if(btn){btn.disabled=true;btn.textContent='⏳ Saving...';}
  const data = collectData();
  const ok = await saveDataToGitHub(data);
  if(ok) toast('✅ Live! Data saved to GitHub.');
  if(btn){btn.disabled=false;btn.innerHTML=`${IC.save} जतन करा / Save`;}
};

window.adminSaveFamilyParents=function(){window.adminSaveAll();};
window.switchAdminPanel=function(panelId,btn){
  document.querySelectorAll('.admin-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.admin-nav button').forEach(b=>b.classList.remove('active'));
  document.getElementById(panelId)?.classList.add('active');
  btn?.classList.add('active');
};

// GitHub config save
window.saveGithubSettings = function() {
  saveGithubConfig({
    owner:  gv('gh-owner'),
    repo:   gv('gh-repo'),
    branch: gv('gh-branch')||'main',
    token:  gv('gh-token')
  });
  toast('✅ GitHub settings saved!');
};

window.testGithubConnection = async function() {
  const cfg=getGithubConfig();
  if(!cfg.owner||!cfg.repo||!cfg.token){toast('Fill in all GitHub fields first');return;}
  toast('⏳ Testing connection...');
  const url=`https://api.github.com/repos/${cfg.owner}/${cfg.repo}`;
  const r=await fetch(url,{headers:{'Authorization':`token ${cfg.token}`}});
  if(r.ok) toast('✅ Connected! Repo found.');
  else toast('❌ Failed. Check owner, repo name & token.');
};

// =============================================
// ADMIN — CONTACTS
// =============================================
function renderAdminContacts(){
  const e=document.getElementById('adm-contacts');if(!e)return;
  e.innerHTML=(appData.contacts||[]).map((c,i)=>`
    <div class="dynamic-entry">
      <div><div class="de-name">${val(c.name)}</div><div class="de-sub">${val(c.relation)} · ${c.phone}</div></div>
      <button class="btn-remove" onclick="removeContact(${i})">${IC.x}</button>
    </div>`).join('');
}
window.removeContact=function(i){appData.contacts.splice(i,1);renderAdminContacts();};
window.addContact=function(){
  const nameMr=gv('new-cname-mr'),nameEn=gv('new-cname-en');
  const relMr=gv('new-crel-mr'),relEn=gv('new-crel-en');
  const phone=gv('new-cphone');
  if(!nameMr||!phone){toast('नाव आणि नंबर आवश्यक');return;}
  appData.contacts.push({name:{mr:nameMr,en:nameEn||nameMr},relation:{mr:relMr,en:relEn||relMr},phone});
  ['new-cname-mr','new-cname-en','new-crel-mr','new-crel-en','new-cphone'].forEach(id=>sv(id,''));
  renderAdminContacts();toast('संपर्क जोडला!');
};

// =============================================
// ADMIN — DYNAMIC FAMILY
// =============================================
const FMAP={'adm-sisters':'sisters','adm-brothers':'brothers','adm-mamas':'mamas','adm-mushis':'mushis','adm-chultas':'chultas'};

function renderDynList(listId,items){
  const e=document.getElementById(listId+'-entries');if(!e)return;
  e.innerHTML=items.map((item,i)=>`
    <div class="dynamic-entry">
      <div>
        <div class="de-name">${val(item.name)||'—'}</div>
        <div class="de-sub">${[item.occupation,item.relation,item.married,item.location].filter(Boolean).map(v=>val(v)).join(' · ')}</div>
      </div>
      <button class="btn-remove" onclick="removeFamilyMember('${listId}',${i})">${IC.x}</button>
    </div>`).join('');
}
window.removeFamilyMember=function(listId,i){
  const key=FMAP[listId];if(!key)return;
  appData.family[key].splice(i,1);renderDynList(listId,appData.family[key]);
};
window.addFamilyMember=function(listId,fields){
  const key=FMAP[listId];if(!key)return;
  const obj={};
  fields.forEach(f=>{const mr=gv(listId+'-new-'+f+'-mr'),en=gv(listId+'-new-'+f+'-en');obj[f]={mr,en:en||mr};});
  if(!obj.name?.mr){toast('मराठी नाव टाका');return;}
  if(!appData.family[key])appData.family[key]=[];
  appData.family[key].push(obj);
  fields.forEach(f=>{sv(listId+'-new-'+f+'-mr','');sv(listId+'-new-'+f+'-en','');});
  renderDynList(listId,appData.family[key]);toast('जोडले!');
};

// =============================================
// ADMIN — GALLERY
// =============================================
function renderAdminGallery(){
  const e=document.getElementById('admin-gallery-grid');if(!e)return;
  e.innerHTML=(appData.gallery||[]).map((src,i)=>`<div class="admin-gallery-item"><img src="${src}" alt=""/><button class="ag-remove" onclick="removeGalleryPhoto(${i})">${IC.x}</button></div>`).join('');
}
window.removeGalleryPhoto=function(i){appData.gallery.splice(i,1);renderAdminGallery();};
window.handleGalleryUpload=function(input){
  Array.from(input.files).forEach(file=>{
    const r=new FileReader();
    r.onload=ev=>{if(!appData.gallery)appData.gallery=[];appData.gallery.push(ev.target.result);renderAdminGallery();toast('फोटो जोडला! (Save to publish)');};
    r.readAsDataURL(file);
  });
  input.value='';
};

// =============================================
// TOAST
// =============================================
function toast(msg,duration=3000){
  const el=document.getElementById('toast');
  el.textContent=msg;el.classList.add('show');
  clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),duration);
}

// =============================================
// SVG ICONS
// =============================================
const IC={
  briefcase:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  users:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  heart:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  mapPin:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  image:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
  phone:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.88-1.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  search:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  x:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  save:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>`,
  github:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`,
};

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded',()=>{
  initPublicGate();
  document.getElementById('gatePwdInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')window.checkPublicPassword();});
  document.getElementById('adminPwdInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')window.checkAdminPassword();});
  document.getElementById('lightbox')?.addEventListener('click',e=>{if(e.target.id==='lightbox')document.getElementById('lightbox').classList.remove('open');});
  document.querySelector('.lb-close')?.addEventListener('click',()=>document.getElementById('lightbox').classList.remove('open'));
});
