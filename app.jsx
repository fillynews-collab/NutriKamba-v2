import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Home, ChefHat, HeartPulse, Leaf, 
  Settings, User, Bookmark, Crown, Phone, Mail, 
  RefreshCw, Trash2, CheckCircle, AlertTriangle, 
  Copy, ChevronRight, Camera, Star, Shield, 
  CreditCard, Bot, Info, Heart, ExternalLink, 
  FileText, LogIn, Users 
} from 'lucide-react';

// --- IMPORTAÇÕES DO MOTOR CLOUD (FIREBASE) ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, onSnapshot, deleteDoc } from 'firebase/firestore';

// ==========================================
// 🔴 CONFIGURAÇÃO FIREBASE DO CEO FILIPE
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyBSSVvYlo_0cCSzg_G_BcIEcAMr3vLHJcU",
  authDomain: "nutrikamba-ai.firebaseapp.com",
  projectId: "nutrikamba-ai",
  storageBucket: "nutrikamba-ai.firebasestorage.app",
  messagingSenderId: "826992901492",
  appId: "1:826992901492:web:5cf1cfdb127eb2e59a8021"
};

const appId = typeof __app_id !== 'undefined' ? __app_id : 'nutrikamba-ai-prod';
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// ==========================================
// ÍCONES E BANDEIRAS
// ==========================================
const getCountryFlag = (phone) => {
  if (!phone) return '🌍';
  if (phone.startsWith('244') || (phone.length === 9 && phone.startsWith('9'))) return '🇦🇴';
  if (phone.startsWith('55')) return '🇧🇷';
  if (phone.startsWith('351')) return '🇵🇹';
  if (phone.startsWith('258')) return '🇲🇿';
  if (phone.startsWith('238')) return '🇨🇻';
  if (phone.startsWith('245')) return '🇬🇼';
  if (phone.startsWith('239')) return '🇸🇹';
  if (phone.startsWith('1')) return '🇺🇸';
  return '🌍';
};

const AppIcons = {
  Express: () => <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md"><rect width="100" height="100" rx="24" fill="#F97316"/><path d="M30 35 L50 55 L70 35" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round"/><path d="M30 65 L50 45 L70 65" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round"/><text x="50" y="85" fontSize="20" fill="white" fontWeight="black" textAnchor="middle">MCX</text></svg>,
  BAI: () => <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md"><rect width="100" height="100" rx="24" fill="#1D4ED8"/><circle cx="50" cy="40" r="15" fill="white"/><text x="50" y="75" fontSize="28" fill="white" fontWeight="black" textAnchor="middle" letterSpacing="2">BAI</text></svg>,
  BIC: () => <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md"><rect width="100" height="100" rx="24" fill="#DC2626"/><text x="50" y="62" fontSize="38" fill="white" fontWeight="black" textAnchor="middle" fontStyle="italic">BIC</text></svg>,
  BCI: () => <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md"><rect width="100" height="100" rx="24" fill="#0369A1"/><rect x="25" y="25" width="50" height="20" fill="white" rx="5"/><text x="50" y="75" fontSize="32" fill="white" fontWeight="black" textAnchor="middle">BCI</text></svg>,
  ATL: () => <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md"><rect width="100" height="100" rx="24" fill="#0891B2"/><path d="M20 70 Q50 20 80 70" stroke="white" strokeWidth="10" fill="none" strokeLinecap="round"/><text x="50" y="85" fontSize="24" fill="white" fontWeight="black" textAnchor="middle">ATL</text></svg>,
  BantuBet: () => <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md"><rect width="100" height="100" rx="24" fill="#047857"/><circle cx="50" cy="45" r="22" fill="none" stroke="#FBBF24" strokeWidth="8" strokeDasharray="10 5"/><text x="50" y="85" fontSize="22" fill="#FBBF24" fontWeight="black" textAnchor="middle">BANTU</text></svg>,
  RedotPay: () => <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md"><rect width="100" height="100" rx="24" fill="#0F172A"/><circle cx="75" cy="25" r="14" fill="#EF4444"/><text x="45" y="65" fontSize="26" fill="white" fontWeight="black" textAnchor="middle">Redot</text></svg>,
  WhatsApp: () => <svg viewBox="0 0 24 24" width="24" height="24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  Telegram: () => <svg viewBox="0 0 24 24" width="24" height="24" fill="#0088cc"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/></svg>,
  Gmail: () => <svg viewBox="0 0 24 24" width="24" height="24"><path fill="#ea4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/><path fill="#34a853" d="M24 5.457v6.273l-6.545-4.91v-2.18l6.545 4.91v-4.093z"/><path fill="#4285f4" d="M0 5.457v6.273l6.545-4.91v-2.18L0 9.548v-4.093z"/><path fill="#fbbc04" d="M12 16.64L24 7.636v-2.18L12 11.73l-12-6.273v2.18l12 9.003z"/></svg>
};

// --- PLANOS ATUALIZADOS PELO CEO ---
const PLANOS = [
  { id: 'basico', name: 'Básico', days: 14, price: '4.999 Kz', icon: Shield, color: 'text-orange-500', bg: 'bg-orange-50', features: ['105 Receitas/Dicas por dia', '25 Análises de Imagem/dia', 'Com Anúncios Patrocinados'] },
  { id: 'vivo', name: 'VIVO Premium', days: 30, price: '9.999 Kz', icon: Crown, color: 'text-emerald-500', bg: 'bg-emerald-50', popular: true, features: ['Acesso Ilimitado a tudo', 'Sem Anúncios Adsterra', 'Prioridade Máxima na IA'] }
];

const BANCOS = [
  { id: 'express', name: 'Express', icon: AppIcons.Express, iban: '926 894 051', type: 'Número de Telefone' },
  { id: 'bai', name: 'BAI', icon: AppIcons.BAI, iban: '0040 0000 86145330101 50', type: 'IBAN' },
  { id: 'bic', name: 'BIC', icon: AppIcons.BIC, iban: '0051 0000 32882554101 70', type: 'IBAN' },
  { id: 'bci', name: 'BCI', icon: AppIcons.BCI, iban: '0005 0000 83812269101 97', type: 'IBAN' },
  { id: 'atl', name: 'Atlântico', icon: AppIcons.ATL, iban: '0055 0000 74348579101 69', type: 'IBAN' }
];

const ADSTERRA_LINK = "https://www.effectivegatecpm.com/f3a9v4c7?key=b6e692564eded8f8923bda7900388224";

// ==========================================
// APLICAÇÃO PRINCIPAL: NUTRIKAMBA AI
// ==========================================
function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);
  const [legalModal, setLegalModal] = useState(null);
  const [fbUser, setFbUser] = useState(null);

  // --- MEMÓRIA LOCAL E LIMITES (v25 para limpeza forçada de caches) ---
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem('nk_profile_v25')) || { name: '', phone: '', pin: '', preferences: '', plan: 'gratis', expiry: null });
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('nk_favs_v25')) || []);
  
  const [usage, setUsage] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = JSON.parse(localStorage.getItem('nk_usage_v25'));
    if (saved && saved.date === today) return saved;
    return { date: today, text: 0, vision: 0, generation: 0 };
  });

  const [apiKey, setApiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [appUsers, setAppUsers] = useState([]);
  const [apiKeySaved, setApiKeySaved] = useState(false);

  // --- CONEXÃO CLOUD ---
  useEffect(() => {
    const initCloud = async () => { try { await signInAnonymously(auth); } catch (e) {} };
    initCloud();
    const unsubAuth = onAuthStateChanged(auth, setFbUser);
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!fbUser) return;
    const unsubUsers = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'appUsers'), (snap) => {
      const list = []; snap.forEach(d => list.push({ id: d.id, ...d.data() })); setAppUsers(list);
    });
    const unsubKeys = onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'config', 'apiKeys'), (snap) => {
      if (snap.exists()) { 
        setApiKey(snap.data().groq || ''); 
        setGeminiKey(snap.data().gemini || ''); 
      }
    });
    return () => { unsubUsers(); unsubKeys(); };
  }, [fbUser]);

  useEffect(() => { localStorage.setItem('nk_profile_v25', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('nk_favs_v25', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('nk_usage_v25', JSON.stringify(usage)); }, [usage]);

  useEffect(() => {
    if (profile.phone) {
       const me = appUsers.find(u => u.phone === profile.phone);
       if (me && (me.plan !== profile.plan || me.expiry !== profile.expiry)) {
         setProfile(prev => ({ ...prev, plan: me.plan, expiry: me.expiry }));
       }
    }
  }, [appUsers, profile.phone, profile.plan, profile.expiry]);

  useEffect(() => { setTimeout(() => setIsAppReady(true), 100); }, []);

  // --- ESTADOS DA IA ---
  const [promptInput, setPromptInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageBase64, setImageBase64] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedIban, setCopiedIban] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);

  // ==========================================
  // LOGIN / REGISTO COM PIN
  // ==========================================
  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target.regName.value.trim();
    const phoneInput = e.target.regPhone.value.trim();
    const pinInput = e.target.regPin.value.trim();
    
    if (!name || !phoneInput || !pinInput) return alert("Preencha todos os dados!");
    if (pinInput.length !== 4) return alert("O PIN deve ter exatamente 4 números.");

    let cleanPhone = phoneInput.replace(/\D/g, ''); 
    if (cleanPhone.startsWith('244')) cleanPhone = cleanPhone.substring(3);
    else if (cleanPhone.startsWith('00244')) cleanPhone = cleanPhone.substring(5);

    if (cleanPhone === '926894051' && name !== 'Filipe Figueiredo Catumbela Sakaputu') {
      return alert("⚠️ Acesso Negado: Número do Administrador.");
    }

    if (fbUser) {
      const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'appUsers', cleanPhone);
      try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
           const data = docSnap.data();
           if (data.pin && data.pin !== pinInput) {
               return alert("PIN Incorreto!");
           }
           setProfile({ name: data.name, phone: cleanPhone, pin: data.pin, plan: data.plan || 'gratis', expiry: data.expiry || null, preferences: data.preferences || '' });
        } else {
           await setDoc(userRef, { name: name, phone: cleanPhone, pin: pinInput, plan: 'gratis', expiry: null, createdAt: new Date().toISOString() });
           setProfile({ name, phone: cleanPhone, pin: pinInput, plan: 'gratis', expiry: null, preferences: '' });
        }
      } catch(err) { console.error(err); alert("Erro ao ligar ao servidor."); }
    } else {
        setProfile({ name, phone: cleanPhone, pin: pinInput, plan: 'gratis', expiry: null });
    }
  };

  const calculateDaysLeft = (expiry) => {
    if (!expiry) return 'Ilimitado';
    const diff = new Date(expiry) - new Date();
    const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    return `${days} dias restantes`;
  };

  const adminChangePlan = async (userId, planId) => {
    const p = PLANOS.find(pl => pl.id === planId);
    let expiry = null;
    if (p) expiry = new Date(Date.now() + p.days * 24 * 60 * 60 * 1000).toISOString();
    if (fbUser) await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'appUsers', userId), { plan: planId, expiry: expiry }, { merge: true });
  };

  const adminDeleteUser = async (userId) => {
    if(window.confirm("Apagar o cliente permanentemente do sistema?")) {
      if (fbUser) await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'appUsers', userId));
    }
  };

  const handleSaveApiKey = async () => {
    if (fbUser) {
       await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'config', 'apiKeys'), { groq: apiKey, gemini: geminiKey }, { merge: true });
       setApiKeySaved(true); setTimeout(() => setApiKeySaved(false), 3000);
    }
  };

  // ==========================================
  // MOTOR DE INTELIGÊNCIA ARTIFICIAL E LIMITES ATUALIZADOS
  // ==========================================
  const getLimits = () => {
     if (profile.plan === 'vivo') return { text: 9999, vision: 9999, generation: 0 };
     if (profile.plan === 'basico') return { text: 105, vision: 25, generation: 0 };
     return { text: 55, vision: 3, generation: 0 };
  };

  const checkLimit = (type) => usage[type] < getLimits()[type];

  const callGroqTextAI = async (prompt, sysPrompt) => {
    if (!apiKey.trim()) return "⚠️ Configuração em atualização pela equipa NutriKamba.";
    const models = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];
    for (const model of models) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: model, messages: [{ role: 'system', content: sysPrompt }, { role: 'user', content: prompt }] })
        });
        const data = await response.json();
        if (response.ok) return data.choices[0].message.content;
      } catch (e) {}
    }
    return "❌ Falha na conexão de texto. Verifique a internet.";
  };

  const callGeminiVisionAI = async (prompt, sysPrompt) => {
    if (!geminiKey.trim()) return "⚠️ Scanner visual em manutenção.";
    try {
      const mimeType = imageBase64.split(';')[0].split(':')[1];
      const rawData = imageBase64.split(',')[1];
      const payload = {
          systemInstruction: { parts: [{ text: sysPrompt }] },
          contents: [{ role: "user", parts: [{ text: prompt }, { inlineData: { mimeType: mimeType, data: rawData } }] }],
          safetySettings: [{ category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" }]
      };
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.promptFeedback?.blockReason === 'SAFETY' || data.candidates?.[0]?.finishReason === 'SAFETY') return "⚠️ CONTEÚDO IMPRÓPRIO. REPETIR.";
      if (response.ok && data.candidates) return data.candidates[0].content.parts[0].text;
      return "❌ Não foi possível analisar a imagem.";
    } catch (e) { return "❌ Falha visual. Foto pesada ou sem internet."; }
  };

  const handleGenerateAction = async (type) => {
    const usageKey = type === 'vision' ? 'vision' : 'text';
    
    if (!checkLimit(usageKey)) {
        alert("Atingiu o limite diário! Faça Upgrade para o VIVO ou Básico.");
        setActiveTab('planos'); return;
    }

    if (!promptInput.trim() && !imageBase64) return;
    if (profile.plan !== 'vivo') window.open(ADSTERRA_LINK, "_blank");

    setIsGenerating(true); setAiResponse('');
    
    const prefs = profile.preferences ? ` Preferências: ${profile.preferences}.` : "";
    let sysPrompt = "És um assistente da NutriKamba AI. Responde em Português.";
    let result = "";

    if (type === 'recipe') {
       sysPrompt = "És um Master Chef africano. Escreve receitas com emojis." + prefs;
       result = await callGroqTextAI(promptInput, sysPrompt);
    } else if (type === 'health') {
       sysPrompt = "És Nutricionista. Dicas baseadas em ciência. Avisa para ir ao médico." + prefs;
       result = await callGroqTextAI(promptInput, sysPrompt);
    } else if (type === 'medicina') {
       sysPrompt = "És especialista em medicina natural africana. Foca-te em curas com plantas." + prefs;
       result = await callGroqTextAI(promptInput, sysPrompt);
    } else if (type === 'vision') {
       sysPrompt = "Assistente visual avançado. Se for comida: ingredientes e calorias. Se for teste: resolve passo a passo. Outra coisa: descreve. Em Português.";
       result = await callGeminiVisionAI(promptInput || "Analise detalhadamente esta imagem.", sysPrompt);
    }
    
    setAiResponse(result);
    if (!result.includes('❌') && !result.includes('⚠️')) {
       setUsage(prev => ({ ...prev, [usageKey]: prev[usageKey] + 1 }));
    }
    setIsGenerating(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(URL.createObjectURL(file));
      const reader = new FileReader(); reader.onloadend = () => setImageBase64(reader.result); reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (text, type='text') => {
    const el = document.createElement('textarea'); el.value = text; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el);
    if(type==='iban') { setCopiedIban(true); setTimeout(()=>setCopiedIban(false), 2000); }
    else { setCopiedText(true); setTimeout(()=>setCopiedText(false), 2000); }
  };

  const addFavorite = (text) => {
    if (!text) return;
    setFavorites([{ id: Date.now(), text, date: new Date().toLocaleDateString() }, ...favorites]);
    alert("Adicionado aos Favoritos com sucesso! ❤️");
  };

  const removeFavorite = (id) => { setFavorites(favorites.filter(f => f.id !== id)); };

  const switchTab = (tab) => { setActiveTab(tab); setIsMenuOpen(false); setAiResponse(''); setPromptInput(''); setImageFile(null); setImageBase64(''); };

  // ==========================================
  // COMPONENTES DE UI ESTÁTICOS
  // ==========================================
  const renderLimitCounter = (type, label) => {
    if (profile.plan === 'vivo') return null;
    const limits = getLimits();
    const remaining = Math.max(0, limits[type] - usage[type]);
    return (
      <div className="flex items-center justify-between bg-orange-50/50 border border-orange-100 p-4 rounded-[2rem] mb-6 shadow-sm">
         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label} Diárias</span>
         <span className={`text-xs font-black px-4 py-1.5 rounded-xl shadow-sm ${remaining > 0 ? 'bg-orange-500 text-white' : 'bg-red-500 text-white'}`}>{remaining} Restantes</span>
      </div>
    );
  };

  const renderAdsterraBanner = () => {
    if (profile.plan === 'vivo') return null;
    return (
      <a href={ADSTERRA_LINK} target="_blank" rel="noreferrer" className="block w-full bg-slate-100 p-4 rounded-3xl border-2 border-dashed border-slate-300 text-center mb-8 active:scale-95 transition-all shadow-sm hover:bg-slate-200">
         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Oferta Patrocinada</span>
         <div className="flex items-center justify-center gap-2 text-blue-600 font-black text-sm bg-white py-4 rounded-xl shadow-sm"><ExternalLink size={18}/> CLIQUE PARA ATIVAR O BÓNUS DO DIA</div>
      </a>
    );
  };

  const renderContactSection = () => (
    <div className="mt-10 bg-slate-50 border border-slate-200 p-8 rounded-[3rem] shadow-inner text-center">
      <h3 className="text-sm font-black text-slate-600 uppercase tracking-widest mb-6">Contactos Oficiais</h3>
      <div className="flex justify-center gap-4 flex-wrap">
         <a href="https://wa.me/244926894051" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 border border-slate-100 group"><AppIcons.WhatsApp /> <span className="text-xs font-black text-slate-700 group-hover:text-green-500">+244 926 894 051</span></a>
         <a href="https://t.me/fillynews220" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 border border-slate-100 group"><AppIcons.Telegram /> <span className="text-xs font-black text-slate-700 group-hover:text-blue-500">Telegram</span></a>
         <a href="mailto:filipefigueiredo220@gmail.com" className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 border border-slate-100 group"><AppIcons.Gmail /> <span className="text-xs font-black text-slate-700 group-hover:text-red-500">E-mail</span></a>
      </div>
    </div>
  );

  const renderLegalModals = () => {
    if(!legalModal) return null;
    const contents = {
       termos: "Ao utilizar a NutriKamba AI, reconhece que a IA não substitui um médico ou profissional.",
       privacidade: "Os seus dados são mantidos de forma privada. O PIN garante a sua segurança multi-dispositivo.",
       sobre: "Fundada por Filipe F. C. Sakaputu. A nossa missão é democratizar o acesso ao conhecimento e à criatividade em Angola e no mundo através da Inteligência Artificial."
    };
    return (
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[200] flex items-center justify-center p-6 animate-in fade-in">
         <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl max-w-lg w-full relative border">
            <button onClick={()=>setLegalModal(null)} className="absolute top-6 right-6 p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-rose-100"><X size={20}/></button>
            <h2 className="text-2xl font-black mb-4 capitalize flex items-center gap-3"><Shield className="text-orange-500"/> {legalModal.replace('_', ' ')}</h2>
            <p className="text-sm text-slate-600 font-medium leading-relaxed mb-8">{contents[legalModal]}</p>
            <button onClick={()=>setLegalModal(null)} className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl active:scale-95 text-xs uppercase tracking-widest">Compreendi</button>
         </div>
      </div>
    );
  };

  // ==========================================
  // ECRÃ DE REGISTO OBRIGATÓRIO
  // ==========================================
  if (isAppReady && !profile.name) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
         <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl max-w-md w-full text-center border border-slate-100 animate-in zoom-in relative z-10">
            <div className="w-24 h-24 bg-orange-50 text-orange-500 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-inner"><Shield size={40}/></div>
            <h1 className="text-3xl font-black tracking-tighter mb-2">NutriKamba AI</h1>
            <p className="text-xs text-slate-500 font-bold mb-8 uppercase tracking-widest">Identifique-se para entrar na App</p>
            <form onSubmit={handleRegister} className="space-y-4 text-left">
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block">Nome Completo</label>
                 <input required name="regName" type="text" placeholder="Ex: Filipe Sakaputu" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent outline-none focus:border-orange-400 font-black text-slate-800 transition-colors" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="col-span-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block">Telemóvel</label>
                   <input required name="regPhone" type="tel" placeholder="926 894 051" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent outline-none focus:border-orange-400 font-black text-slate-800 transition-colors" />
                 </div>
                 <div className="col-span-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block text-orange-500 flex items-center gap-1"><Shield size={12}/> PIN (4 Digitos)</label>
                   <input required name="regPin" type="password" maxLength="4" pattern="\d{4}" placeholder="****" className="w-full p-5 bg-orange-50 rounded-2xl border-2 border-transparent outline-none focus:border-orange-400 font-black text-orange-600 transition-colors text-center tracking-widest" />
                 </div>
               </div>
               <p className="text-[9px] text-slate-400 font-bold text-center mt-2 px-2">Já tem conta? Digite o mesmo número e o PIN antigo para recuperar os dados.</p>
               <button type="submit" className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 text-xs uppercase tracking-widest mt-4 hover:bg-slate-800 transition-all flex justify-center items-center gap-2"><LogIn size={18}/> ENTRAR NA APP</button>
            </form>
            <a href="https://wa.me/244926894051?text=Olá%20Suporte%20NutriKamba,%20esqueci%20o%20meu%20PIN." target="_blank" rel="noreferrer" className="block mt-6 text-[10px] font-black text-orange-500 uppercase tracking-widest hover:underline">Esqueci o meu PIN</a>
         </div>
      </div>
    );
  }

  // ==========================================
  // RENDERIZAÇÃO DA APP PRINCIPAL
  // ==========================================
  const renderTab = () => {
    if (!isAppReady) return <div className="flex h-full items-center justify-center"><RefreshCw size={40} className="animate-spin text-orange-500"/></div>;

    switch (activeTab) {
      case 'dashboard': return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-24">
          <div className="flex justify-between items-center bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm mb-8 hover:shadow-md transition-all">
             <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${profile.plan === 'vivo' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}><Crown size={24}/></div>
                <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plano Atual</p><h4 className="font-black text-lg text-slate-800 capitalize tracking-tight">{profile.plan}</h4></div>
             </div>
             {profile.plan !== 'vivo' && <button onClick={() => switchTab('planos')} className="bg-orange-500 text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 shadow-lg shadow-orange-500/30">Fazer Upgrade</button>}
          </div>

          {renderAdsterraBanner()}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
            <button onClick={() => switchTab('receitas')} className="bg-white p-6 rounded-[2rem] border shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1 text-center active:scale-95 group">
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 group-hover:text-white transition-all"><ChefHat size={32}/></div>
              <h3 className="text-sm font-black text-slate-800">Culinária</h3>
            </button>
            <button onClick={() => switchTab('gerador')} className="bg-white p-6 rounded-[2rem] border shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1 text-center active:scale-95 group relative overflow-hidden">
              <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500 group-hover:text-white transition-all"><Star size={32}/></div>
              <h3 className="text-sm font-black text-slate-800">Criar Arte</h3>
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-purple-500 rounded-full blur-2xl opacity-20"></div>
            </button>
            <button onClick={() => switchTab('visao')} className="bg-white p-6 rounded-[2rem] border shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1 text-center active:scale-95 group">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500 group-hover:text-white transition-all"><Camera size={32}/></div>
              <h3 className="text-sm font-black text-slate-800">Ver Mundo</h3>
            </button>
            <button onClick={() => switchTab('saude')} className="bg-white p-6 rounded-[2rem] border shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1 text-center active:scale-95 group">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:bg-rose-500 group-hover:text-white transition-all"><HeartPulse size={32}/></div>
              <h3 className="text-sm font-black text-slate-800">Fitness</h3>
            </button>
            <button onClick={() => switchTab('medicina')} className="bg-white p-6 rounded-[2rem] border shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1 text-center active:scale-95 group">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-all"><Leaf size={32}/></div>
              <h3 className="text-sm font-black text-slate-800">Natural</h3>
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group mb-8">
            <div className="relative z-10">
               <h2 className="text-3xl font-black mb-3 tracking-tighter">Olá, {profile.name.split(' ')[0]} {getCountryFlag(profile.phone)}! 🍳</h2>
               <p className="text-orange-100 font-medium mb-6 text-sm max-w-sm">A Inteligência Artificial avançada a serviço da sua saúde, paladar e criatividade.</p>
               <button onClick={() => switchTab('perfil')} className="bg-white text-orange-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 hover:bg-orange-50 transition-all flex items-center gap-2 w-max"><User size={16}/> O Meu Perfil</button>
            </div>
            <Bot size={200} className="absolute -right-10 -bottom-10 text-white opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          </div>

          <div className="flex flex-col gap-4 mb-8">
            {profile.plan !== 'vivo' && (
              <div className="bg-slate-100 border border-slate-200 p-4 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm group">
                <div className="flex items-center gap-4 w-full md:w-auto">
                   <div className="w-12 h-12 flex-shrink-0"><AppIcons.BantuBet /></div>
                   <div>
                      <span className="bg-slate-200 text-slate-500 text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest">Anúncio</span>
                      <p className="text-sm font-black text-slate-700 mt-1">Aposte na BantuBet e ganhe bónus infinito!</p>
                   </div>
                </div>
                <a href="https://criarcontabantu.com/criar-conta?btag=1658445" target="_blank" rel="noreferrer" className="bg-orange-500 text-white text-xs font-black px-6 py-3 rounded-xl uppercase tracking-widest hover:bg-orange-600 transition-all text-center w-full md:w-auto flex-shrink-0">Apostar Agora</a>
              </div>
            )}
            <a href="https://url.hk/i/pt/4xa6c" target="_blank" rel="noreferrer" className="flex items-center justify-between bg-[#0A1128] p-4 rounded-[2rem] text-white hover:scale-[1.02] active:scale-95 transition-all shadow-lg border border-slate-700 group cursor-pointer">
              <div className="flex items-center gap-4"><div className="w-12 h-12 flex-shrink-0 p-1"><AppIcons.RedotPay /></div><div><h4 className="font-black text-sm text-white flex items-center gap-2">Cartão RedotPay</h4><p className="text-[10px] text-slate-400 font-medium">Cartão VISA Virtual Internacional</p></div></div>
              <ChevronRight size={20} className="text-slate-500 group-hover:text-white mr-2"/>
            </a>
          </div>
          {renderContactSection()}
        </div>
      );

      // --- ÁREA DE MANUTENÇÃO: GERADOR DE ARTE ---
      case 'gerador': return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500 pb-24">
          {renderAdsterraBanner()}
          <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner"><Star size={40}/></div>
            <h3 className="text-2xl md:text-3xl font-black tracking-tighter mb-4 text-slate-800">GERAÇÃO DE IMAGEM INDISPONÍVEL</h3>
            <p className="text-orange-500 font-black text-sm uppercase tracking-widest mb-8">Aguarde a atualização, brevemente.</p>
            <div className="p-6 w-full max-w-md bg-slate-50 rounded-3xl border border-slate-200">
               <p className="text-sm text-slate-500 font-medium leading-relaxed">A nossa fábrica de arte está em manutenção. Aproveite as nossas outras funcionalidades (Culinária, Saúde, Visão, Medicina Natural) que continuam a operar a 100%.</p>
            </div>
          </div>
        </div>
      );

      case 'receitas':
      case 'saude':
      case 'medicina':
      case 'visao': 
        const config = {
          receitas: { icon: ChefHat, color: 'orange', title: 'Mestre Cuca IA', desc: 'Receitas de África e do Mundo', fn: 'recipe', btn: 'CRIAR RECEITA MÁGICA', plh: 'O que deseja cozinhar? Ex: Funge com Calulu...' },
          saude: { icon: HeartPulse, color: 'rose', title: 'Saúde & Fitness', desc: 'Dietas e planos de treino', fn: 'health', btn: 'OBTER PLANO SAUDÁVEL', plh: 'Qual é o seu objetivo? Ex: Dieta para diabetes...' },
          medicina: { icon: Leaf, color: 'emerald', title: 'Medicina da Terra', desc: 'Curas naturais e ervas', fn: 'medicina', btn: 'GERAR CURA NATURAL', plh: 'Qual é o problema de saúde? Ex: Chá para tosse...' },
          visao: { icon: Camera, color: 'blue', title: 'Scanner Universal', desc: 'Análise de Pratos, Provas e Imagens', fn: 'vision', btn: 'ANALISAR IMAGEM', plh: 'O que quer saber sobre a foto?' }
        }[activeTab];
        const Icon = config.icon;

        return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500 pb-24">
          {activeTab === 'visao' && renderLimitCounter('vision', 'Análises')}
          
          {renderAdsterraBanner()}

          <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-xl border border-slate-100">
            <div className="flex items-center gap-5 mb-6"><div className={`bg-${config.color}-100 p-4 rounded-[2rem] shadow-sm`}><Icon className={`text-${config.color}-600`} size={32}/></div><div><h3 className="text-2xl font-black tracking-tighter">{config.title}</h3><p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">{config.desc}</p></div></div>
            
            {activeTab === 'visao' && (
              <div className={`border-4 border-dashed border-slate-200 rounded-[3rem] p-10 text-center mb-8 relative hover:border-${config.color}-400 transition-all bg-slate-50 cursor-pointer`}>
                 <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                 {imageFile ? (<img src={imageFile} alt="Preview" className="max-h-56 mx-auto rounded-3xl shadow-lg border-4 border-white" />) : (
                   <div className="flex flex-col items-center"><div className={`w-20 h-20 bg-${config.color}-100 text-${config.color}-500 rounded-full flex items-center justify-center mb-4 shadow-inner`}><Camera size={36}/></div><p className="text-sm font-black text-slate-700">Toque para Tirar Foto ou Escolher da Galeria</p></div>
                 )}
              </div>
            )}

            <textarea value={promptInput} onChange={e => setPromptInput(e.target.value)} placeholder={config.plh} className={`w-full p-6 bg-slate-50 rounded-3xl border-2 border-transparent outline-none focus:border-${config.color}-400 font-medium text-sm ${activeTab==='visao' ? 'h-24' : 'h-32'} mb-6 transition-all shadow-inner`} />
            <button onClick={() => handleGenerateAction(config.fn)} disabled={isGenerating || (!promptInput.trim() && !imageBase64)} className={`w-full bg-${config.color}-500 text-white font-black py-5 rounded-3xl shadow-xl shadow-${config.color}-500/30 active:scale-95 transition-all duration-300 text-sm uppercase tracking-widest flex justify-center items-center gap-3 hover:bg-${config.color}-600`}>{isGenerating ? <><RefreshCw size={20} className="animate-spin"/> A PROCESSAR NA IA...</> : <><Icon size={20}/> {config.btn}</>}</button>
            
            {aiResponse && (
              <div className="bg-[#1C2520] text-white p-8 rounded-[3rem] relative mt-10 animate-in slide-in-from-bottom-4 shadow-2xl">
                <div className="absolute top-6 right-6 flex gap-2">
                   <button onClick={() => addFavorite(aiResponse)} className="p-4 bg-white/10 rounded-2xl active:scale-90 hover:bg-white/20 text-rose-400" title="Guardar Favorito"><Heart size={20}/></button>
                   <button onClick={() => copyToClipboard(aiResponse)} className="p-4 bg-white/10 rounded-2xl active:scale-90 hover:bg-white/20" title="Copiar/Guardar">{copiedText ? <CheckCircle className={`text-${config.color}-400`} size={20}/> : <Copy size={20}/>}</button>
                </div>
                <h4 className={`text-[10px] font-black text-${config.color}-400 uppercase tracking-widest mb-6 flex items-center gap-2`}><Icon size={14}/> Resultado da IA:</h4>
                <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium pr-10">{aiResponse}</p>
                {(activeTab === 'saude' || activeTab === 'medicina') && <div className="mt-8 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl"><p className="text-[10px] text-orange-300 uppercase font-black text-center">*Aviso: Não substitui conselho médico profissional.</p></div>}
              </div>
            )}
          </div>
        </div>
      );

      case 'perfil': return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300 pb-24">
          <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100">
            <h2 className="text-3xl font-black tracking-tighter mb-8 flex items-center gap-4"><User className="text-blue-500" size={32}/> O Meu Perfil {getCountryFlag(profile.phone)}</h2>
            <div className="space-y-6">
               <div><label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-2">Nome Completo</label><input type="text" value={profile.name} onChange={e=>setProfile({...profile, name: e.target.value})} className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent outline-none focus:border-blue-400 font-bold transition-colors" /></div>
               <div className="grid grid-cols-2 gap-4">
                 <div><label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-2">Telemóvel</label><input type="tel" value={profile.phone} disabled className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent font-bold text-slate-400 cursor-not-allowed" /></div>
                 <div><label className="text-[10px] font-black text-orange-500 uppercase mb-2 block ml-2 flex items-center gap-1"><Shield size={12}/> Seu PIN Secreto</label><input type="password" value={profile.pin} disabled className="w-full p-5 bg-orange-50 rounded-2xl border-2 border-transparent font-black text-orange-600 cursor-not-allowed text-center tracking-widest" /></div>
               </div>
               <div><label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-2">Preferências de Saúde (A IA lê isto)</label><textarea value={profile.preferences} onChange={e=>setProfile({...profile, preferences: e.target.value})} placeholder="Ex: Sou diabético, não gosto de cebola, prefiro comida rápida..." className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent outline-none focus:border-blue-400 font-medium h-32 transition-colors" /></div>
               
               <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                  <div className="flex-1 bg-slate-50 p-4 rounded-2xl border text-center">
                     <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Seu Plano Atual</span>
                     <span className="font-black text-orange-600 capitalize">{profile.plan}</span>
                     {profile.plan !== 'gratis' && <p className="text-[9px] font-bold text-slate-400 mt-1">{calculateDaysLeft(profile.expiry)}</p>}
                  </div>
                  <button onClick={() => alert("Perfil e preferências salvas com sucesso! ✅")} className="flex-[2] bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 uppercase text-xs tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2"><CheckCircle size={18}/> SALVAR PERFIL</button>
               </div>
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100">
             <h2 className="text-3xl font-black tracking-tighter mb-8 flex items-center gap-4"><Bookmark className="text-rose-500" size={32}/> Meus Favoritos</h2>
             {favorites.length === 0 ? <p className="text-slate-400 font-bold text-center py-10 bg-slate-50 rounded-3xl border border-dashed">Ainda não guardou nada.</p> : (
               <div className="space-y-4">
                 {favorites.map(fav => (
                   <div key={fav.id} className="bg-slate-50 p-6 md:p-8 rounded-[2rem] relative border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                     <button onClick={() => removeFavorite(fav.id)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors p-2 bg-white rounded-xl shadow-sm"><Trash2 size={16}/></button>
                     <p className="text-[10px] font-black text-slate-400 mb-4 bg-white inline-block px-3 py-1 rounded-lg border shadow-sm">{fav.date}</p>
                     <p className="text-sm font-medium text-slate-700 whitespace-pre-wrap pr-8">{fav.text}</p>
                     <button onClick={() => copyToClipboard(fav.text, 'text')} className="mt-6 text-xs font-black text-blue-600 uppercase flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl active:scale-95 transition-transform"><Copy size={14}/> Copiar Tudo</button>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      );

      case 'planos': return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in pb-24">
          <div className="text-center"><h2 className="text-4xl md:text-5xl font-black mb-3 tracking-tighter">Premium VIP</h2><p className="text-slate-500 text-base font-medium">Livre-se de limites e ganhe prioridade máxima.</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {PLANOS.map(p => (
              <div key={p.id} onClick={() => {setSelectedPlan(p); setSelectedBank(null);}} className={`bg-white p-8 md:p-12 rounded-[3.5rem] border-4 cursor-pointer transition-all duration-300 hover:-translate-y-2 ${selectedPlan?.id === p.id ? 'border-orange-500 shadow-2xl scale-[1.02]' : 'border-transparent shadow-lg hover:border-slate-100'}`}>
                <div className={`w-20 h-20 ${p.bg} rounded-[2rem] flex items-center justify-center mb-8 shadow-inner`}><p.icon size={36} className={p.color}/></div>
                <h3 className="text-3xl font-black mb-2 tracking-tighter">{p.name}</h3><div className="text-slate-400 text-[10px] font-black uppercase mb-8 tracking-widest bg-slate-50 inline-block px-3 py-1 rounded-lg border">Acesso por {p.days} dias</div>
                <div className="text-4xl md:text-5xl font-black mb-8 border-b-2 border-slate-50 pb-8 text-slate-800">{p.price}</div>
                <ul className="space-y-5 mb-10 text-sm font-bold text-slate-600">{p.features.map((f, i) => (<li key={i} className="flex gap-4 items-center"><CheckCircle size={20} className={p.color}/>{f}</li>))}</ul>
                <button className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 active:scale-95 ${selectedPlan?.id === p.id ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/30' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>SELECIONAR PLANO</button>
              </div>
            ))}
          </div>
          
          {selectedPlan && (
            <div className="bg-white p-8 md:p-16 rounded-[4rem] shadow-2xl border border-slate-100 animate-in slide-in-from-bottom-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-black text-center mb-10 flex items-center justify-center gap-4 tracking-tighter"><CreditCard className="text-orange-600" size={32}/> Pagamento Oficial</h3>
              
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 mb-12">
                {BANCOS.map(b => (
                  <button key={b.id} onClick={() => setSelectedBank(b)} className={`p-4 md:p-6 rounded-[2rem] border-4 flex flex-col items-center gap-4 shadow-sm bg-white transition-all active:scale-95 ${selectedBank?.id === b.id ? 'border-orange-500 scale-105 shadow-xl' : 'border-slate-50 hover:border-slate-200'}`}>
                    <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center relative"><b.icon /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{b.name}</span>
                  </button>
                ))}
              </div>

              {selectedBank && (
                <div className="bg-slate-50 p-8 md:p-12 rounded-[3rem] border-2 border-slate-100 shadow-inner animate-in zoom-in">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center md:text-left">Transferência {selectedBank.name} (Filipe F. C. Sakaputu)</p>
                   <div className="bg-white px-8 py-6 rounded-3xl border shadow-sm mb-8 text-center md:text-left"><h4 className="text-xl md:text-3xl font-black font-mono tracking-widest text-slate-800">{selectedBank.iban}</h4></div>
                   <div className="flex flex-col md:flex-row gap-4">
                      <button onClick={() => copyToClipboard(selectedBank.iban, 'iban')} className="flex-1 bg-white border-2 border-slate-200 text-slate-900 font-black py-5 rounded-2xl shadow-sm active:scale-95 flex items-center justify-center gap-3 text-xs uppercase hover:bg-slate-50 transition-colors">{copiedIban ? <><CheckCircle size={18} className="text-orange-500"/> COPIADO!</> : <><Copy size={18}/> COPIAR DADOS</>}</button>
                      <a href={`https://wa.me/244926894051?text=Olá!%20Fiz%20o%20pagamento%20do%20plano%20*${selectedPlan.name}*%20no%20*${selectedBank.name}*.%20Segue%20o%20comprovativo:`} target="_blank" rel="noreferrer" className="flex-1 bg-orange-600 text-white font-black py-5 rounded-2xl shadow-xl hover:shadow-orange-600/50 hover:bg-orange-700 active:scale-95 flex items-center justify-center gap-2 text-xs uppercase transition-colors">Enviar Comprovativo <ChevronRight size={18}/></a>
                   </div>
                </div>
              )}
            </div>
          )}
          {renderContactSection()}
        </div>
      );

      case 'settings': return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300 pb-20">
          
          <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl border border-slate-100 mb-8">
             <div className="flex items-center gap-4 mb-8 border-b-2 border-slate-50 pb-6"><div className="bg-blue-100 p-4 rounded-2xl"><Users className="text-blue-600" size={28}/></div><h2 className="text-3xl font-black tracking-tighter">Painel de Controlo de Utilizadores</h2></div>
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse min-w-[900px]">
                 <thead>
                   <tr className="border-b-2 border-slate-100">
                     <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Utilizador / País</th>
                     <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contacto</th>
                     <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-orange-500">PIN (Secreta)</th>
                     <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plano / Alterar</th>
                     <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                   </tr>
                 </thead>
                 <tbody>
                   {appUsers.map((u) => {
                     return (
                     <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                       <td className="p-4 font-black text-sm text-slate-800">{getCountryFlag(u.phone)} {u.name}</td>
                       <td className="p-4 text-xs font-bold text-slate-500"><Phone size={12} className="inline mr-1"/>{u.phone}</td>
                       <td className="p-4 text-xs font-black text-orange-600 font-mono"><Shield size={12} className="inline mr-1"/>{u.pin || 'N/A'}</td>
                       <td className="p-4">
                          <select value={u.plan} onChange={(e) => adminChangePlan(u.id, e.target.value)} className="text-[10px] font-black uppercase px-3 py-2 rounded-xl border border-slate-200 outline-none cursor-pointer bg-white shadow-sm focus:border-blue-400">
                            <option value="gratis">Grátis</option><option value="basico">Básico</option><option value="vivo">VIVO</option>
                          </select>
                       </td>
                       <td className="p-4 flex gap-2 justify-end">
                          <button onClick={() => adminDeleteUser(u.id)} className="p-2.5 bg-slate-100 text-slate-400 rounded-xl hover:text-red-600 hover:bg-red-50 transition-all shadow-sm active:scale-95" title="Apagar Utilizador"><Trash2 size={16}/></button>
                       </td>
                     </tr>
                   )})}
                 </tbody>
               </table>
             </div>
          </div>

          <div className="bg-slate-50 p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-inner">
            <h4 className="font-black text-2xl mb-8 flex items-center gap-3 tracking-tighter"><Settings size={28} className="text-slate-400"/> Chaves de Inteligência Artificial</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
               <div className="bg-white p-6 rounded-[2rem] border shadow-sm">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2 ml-2"><Bot size={16} className="text-orange-500"/> 1. Chave Groq (Textos)</label>
                  <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="gsk_..." className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent outline-none focus:border-orange-400 font-mono text-xs transition-all" />
               </div>
               <div className="bg-white p-6 rounded-[2rem] border shadow-sm">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2 ml-2"><Camera size={16} className="text-blue-500"/> 2. Gemini (Scanner/Olho)</label>
                  <input type="password" value={geminiKey} onChange={e => setGeminiKey(e.target.value)} placeholder="AIzaSy..." className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent outline-none focus:border-blue-400 font-mono text-xs transition-all" />
               </div>
            </div>

            <button onClick={handleSaveApiKey} className="w-full bg-slate-900 text-white font-black py-6 rounded-[2rem] shadow-xl active:scale-95 transition-all duration-300 text-xs uppercase tracking-widest flex justify-center items-center gap-3 hover:bg-slate-800">
               {apiKeySaved ? <><CheckCircle size={20} className="text-emerald-400"/> CHAVES GUARDADAS NA NUVEM!</> : 'SALVAR AS CHAVES NO SERVIDOR'}
            </button>
            <p className="text-[10px] text-slate-400 font-bold mt-4 text-center">As definições foram reconfiguradas para melhor performance da App.</p>
          </div>
        </div>
      );

      default: return null;
    }
  };

  // NAVEGAÇÃO PRINCIPAL (OS 5 BOTÕES NO MENU DE BAIXO)
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Início' },
    { id: 'receitas', icon: ChefHat, label: 'Receitas' },
    { id: 'gerador', icon: Star, label: 'Criar Arte' },
    { id: 'visao', icon: Camera, label: 'Ver Mundo' },
    { id: 'planos', icon: Crown, label: 'Premium' },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-orange-200">
      
      {renderLegalModals()}

      {/* MENU LATERAL */}
      <div className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}></div>
      <div className={`fixed top-0 left-0 h-full w-72 md:w-80 bg-[#1C2520] text-white z-50 transform transition-transform duration-300 shadow-2xl flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <div className="p-8 border-b border-white/10 relative bg-gradient-to-b from-white/5 to-transparent">
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><X size={20}/></button>
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-2xl font-black mb-4 shadow-lg shadow-orange-500/40 border-2 border-orange-400">{profile.name ? profile.name.charAt(0).toUpperCase() : <User size={28}/>}</div>
            <h3 className="font-black text-xl tracking-tighter truncate pr-4">{profile.name || 'Convidado'} {getCountryFlag(profile.phone)}</h3>
            <p className="text-[10px] text-orange-300 font-black uppercase tracking-widest mt-2 flex items-center gap-2"><Crown size={12}/> Plano {profile.plan}</p>
         </div>
         <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            <button onClick={() => switchTab('dashboard')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all active:scale-95 ${activeTab === 'dashboard' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><Home size={20}/> Ecrã Inicial</button>
            <button onClick={() => switchTab('perfil')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all active:scale-95 ${activeTab === 'perfil' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><User size={20}/> Meu Perfil</button>
            <button onClick={() => switchTab('planos')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all active:scale-95 ${activeTab === 'planos' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><Crown size={20}/> Planos Premium</button>
            
            {profile?.phone === "926894051" && (
              <button onClick={() => switchTab('settings')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all active:scale-95 ${activeTab === 'settings' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><Settings size={20}/> Painel Admin</button>
            )}
            
            <div className="pt-6 mt-6 border-t border-white/10 px-4 space-y-2">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Informações Legais</p>
              <button onClick={() => setLegalModal('termos')} className="w-full flex items-center gap-3 text-xs font-bold text-slate-300 hover:text-white transition-colors text-left"><FileText size={16}/> Termos de Uso</button>
              <button onClick={() => setLegalModal('privacidade')} className="w-full flex items-center gap-3 text-xs font-bold text-slate-300 hover:text-white transition-colors text-left"><Shield size={16}/> Privacidade</button>
              <button onClick={() => setLegalModal('sobre')} className="w-full flex items-center gap-3 text-xs font-bold text-slate-300 hover:text-white transition-colors text-left"><Info size={16}/> Sobre Nós</button>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 px-4">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Suporte ao Cliente</p>
              <div className="space-y-4">
                 <a href="https://wa.me/244926894051" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs font-bold text-slate-300 hover:text-white transition-colors group"><AppIcons.WhatsApp /> +244 926 894 051</a>
                 <a href="https://t.me/fillynews220" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs font-bold text-slate-300 hover:text-white transition-colors group"><AppIcons.Telegram /> Telegram Oficial</a>
                 <a href="mailto:filipefigueiredo220@gmail.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs font-bold text-slate-300 hover:text-white transition-colors group"><AppIcons.Gmail /> Enviar E-mail</a>
              </div>
            </div>
         </nav>
      </div>

      {/* MENU DESKTOP */}
      <div className="w-72 bg-[#1C2520] text-slate-400 flex flex-col justify-between hidden lg:flex z-20 shadow-2xl rounded-r-[4rem] overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-8"><div className="bg-orange-500 p-4 rounded-2xl text-white shadow-lg shadow-orange-500/30"><Leaf size={28}/></div><h1 className="text-white font-black text-2xl tracking-tighter">NUTRIKAMBA</h1></div>
          <nav className="space-y-3">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => switchTab(item.id)} className={`w-full flex items-center gap-5 p-4 rounded-3xl transition-all duration-300 font-black text-xs uppercase tracking-widest active:scale-95 group ${activeTab === item.id ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20 translate-x-3' : 'text-slate-500 hover:bg-white/5 hover:text-orange-400'}`}>
                <item.icon size={24} className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'opacity-70 group-hover:scale-110'}`}/>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-hidden relative w-full">
        <header className="h-24 bg-white/60 backdrop-blur-2xl border-b border-slate-100 flex items-center px-6 md:px-10 shadow-sm z-10 sticky top-0 gap-4 md:justify-between">
          <button onClick={() => setIsMenuOpen(true)} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 active:scale-95 transition-all text-slate-700 shadow-sm lg:hidden"><Menu size={24}/></button>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter capitalize hidden sm:block">{activeTab === 'settings' ? 'Painel Admin' : navItems.find(n => n.id === activeTab)?.label || 'NutriKamba AI'}</h2>
          <div className="ml-auto sm:ml-0 bg-white border shadow-sm px-4 py-2.5 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => switchTab('perfil')}>
             <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-black">{profile.name ? profile.name.charAt(0).toUpperCase() : <User size={16}/>}</div>
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 hidden md:inline">{profile.name.split(' ')[0] || 'Perfil'} {getCountryFlag(profile.phone)}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-32 md:pb-10 w-full relative">
          <div className="max-w-7xl mx-auto">{renderTab()}</div>
        </main>

        {/* BOTTOM NAV MOBILE (OS 5 BOTÕES PERFEITOS) */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[96%] md:w-max bg-white/95 backdrop-blur-xl border border-slate-200 p-2 flex justify-between items-center z-30 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] gap-0.5 lg:hidden">
           {navItems.map((item) => (
             <button key={item.id} onClick={() => switchTab(item.id)} className={`flex-1 md:w-24 min-w-[50px] flex flex-col items-center justify-center p-2 rounded-[2rem] transition-all duration-300 active:scale-90 ${activeTab === item.id ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 -translate-y-2' : 'text-slate-400 hover:text-orange-500'}`}>
               <item.icon size={22} className={`transition-all duration-300 mb-1 ${activeTab === item.id ? 'scale-110 drop-shadow-md' : ''}`} />
               <span className={`text-[6px] font-black uppercase tracking-widest w-full text-center truncate ${activeTab === item.id ? 'opacity-100' : 'opacity-0 h-0'}`}>{item.label}</span>
             </button>
           ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ESCUDO ANTI-FALHAS
// ==========================================
class AppErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, errorMessage: '' }; }
  static getDerivedStateFromError(error) { return { hasError: true, errorMessage: error.toString() }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-rose-50 p-6 font-sans">
          <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl max-w-lg w-full text-center border-4 border-rose-500">
            <h1 className="text-3xl font-black text-rose-600 mb-4 flex items-center justify-center gap-3 tracking-tighter"><AlertTriangle size={36}/> Ops!</h1>
            <div className="bg-slate-100 p-6 rounded-3xl text-left overflow-x-auto text-xs font-mono text-rose-800 break-words mb-8 border border-rose-200 shadow-inner">{this.state.errorMessage}</div>
            <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="bg-rose-600 hover:bg-rose-700 text-white font-black py-5 px-8 rounded-2xl shadow-xl shadow-rose-500/30 w-full uppercase tracking-widest text-xs active:scale-95 transition-all">Limpar Memória e Reiniciar</button>
          </div>
        </div>
      );
    }
    return <MainApp />;
  }
}

export default AppErrorBoundary;
