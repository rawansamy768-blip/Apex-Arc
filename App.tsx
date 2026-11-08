  import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { 
  Building2, Search, MapPin, Bed, Bath, Square, 
  Sparkles, Bot, Send, User, X, 
  CheckCircle2, PhoneCall, ArrowUpRight, ChevronLeft, ChevronRight, Mail, Clock, Bookmark
} from 'lucide-react';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const EGYPT_LOCATIONS = [
  "Fifth Settlement, New Cairo", "El Sheikh Zayed, Giza", "Zamalek, Cairo", 
  "Hacienda Bay, North Coast", "New Administrative Capital", "El Gouna, Red Sea",
  "Madinaty, New Cairo", "Palm Hills, October City", "Ain Sokhna Beach"
];

const PROPERTY_TYPES = ["Villa", "Penthouse", "Townhouse", "Duplex", "Chalet", "Mansion"];

const GUARANTEED_ARCH_IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
];

const GENERATED_PROPERTIES = Array.from({ length: 16 }, (_, index) => {
  const id = String(index + 1);
  const type = PROPERTY_TYPES[index % PROPERTY_TYPES.length];
  const location = EGYPT_LOCATIONS[index % EGYPT_LOCATIONS.length];
  const priceVal = 5.8 + (index * 1.45);
  const areaVal = 175 + (index * 14);
  const beds = (index % 4) + 2;
  const baths = beds;
  
  const mainImg = GUARANTEED_ARCH_IMAGES[index];
  
  return {
    id,
    title: `Apex Premier ${type} #${index + 1}`,
    location,
    price: `EGP ${priceVal.toFixed(1)}M`,
    beds,
    baths,
    area: `${areaVal} m²`,
    type,
    image: mainImg,
    gallery: [
      GUARANTEED_ARCH_IMAGES[(index + 1) % GUARANTEED_ARCH_IMAGES.length],
      GUARANTEED_ARCH_IMAGES[(index + 2) % GUARANTEED_ARCH_IMAGES.length],
      GUARANTEED_ARCH_IMAGES[(index + 3) % GUARANTEED_ARCH_IMAGES.length]
    ],
    tag: index % 3 === 0 ? 'Architectural Pick' : index % 5 === 0 ? 'Hot Deal' : 'Exclusive',
    description: `An architectural marvel situated in prime ${location}. Designed with double-height glass facades, smart home automation, private infinity pool, and imported European marble interiors.`,
    features: ['Double-Height Ceilings', 'Private Infinity Pool', 'Smart Home System', 'Underground Parking', '24/7 Gated Security', 'Solar Powered System']
  };
});

export function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Hello! I'm your Apex AI Concierge connected to backend Port 5000. Ask me about any of our 16 properties across Egypt!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt: userMsg }),
      });
      const data = await res.json();

      if (data.success) {
        setMessages((prev) => [...prev, { sender: 'ai', text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { sender: 'ai', text: 'Backend returned an unexpected response.' }]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Backend server offline. Please ensure Express server is running on http://localhost:5000.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans relative flex flex-col justify-between selection:bg-zinc-900 selection:text-white">
      
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200 px-8 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tight text-zinc-900 group-hover:opacity-80 transition-opacity">Apex Arc</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
            <Link to="/" className="hover:text-zinc-900 transition-colors duration-200">About Us</Link>
            <Link to="/properties" className="hover:text-zinc-900 transition-colors duration-200">Portfolio (16)</Link>
            <Link to="/contact" className="hover:text-zinc-900 transition-colors duration-200">Contacts</Link>
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold bg-zinc-100 px-3 py-1.5 rounded-full border border-zinc-200 text-zinc-700 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-zinc-900 fill-zinc-900" /> Saved ({favorites.length})
            </span>
            <button 
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-300 transform hover:scale-105 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              AI Assistant
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 animate-in fade-in duration-500">
        <Routes>
          <Route path="/" element={<HomeView favorites={favorites} toggleFavorite={toggleFavorite} />} />
          <Route path="/properties" element={<PropertiesView favorites={favorites} toggleFavorite={toggleFavorite} />} />
          <Route path="/property/:id" element={<PropertyDetailView favorites={favorites} toggleFavorite={toggleFavorite} />} />
          <Route path="/contact" element={<ContactView />} />
        </Routes>
      </main>

      <footer className="border-t border-zinc-200 py-12 text-center text-xs text-zinc-500 bg-white">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-4 gap-8 text-left mb-8">
          <div>
            <div className="font-bold text-zinc-900 text-sm mb-3">Apex Arc</div>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Transforming architectural vision into timeless real estate across Egypt.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-zinc-900 mb-3 text-xs uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs text-zinc-600">
              <li><Link to="/" className="hover:text-zinc-900 transition-colors">Home</Link></li>
              <li><Link to="/properties" className="hover:text-zinc-900 transition-colors">All 16 Properties</Link></li>
              <li><Link to="/contact" className="hover:text-zinc-900 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-zinc-900 mb-3 text-xs uppercase tracking-wider">Prime Regions</h4>
            <p className="text-zinc-500 text-xs">New Cairo • Zamalek • Sheikh Zayed • North Coast</p>
          </div>
          <div>
            <h4 className="font-bold text-zinc-900 mb-3 text-xs uppercase tracking-wider">AI Status</h4>
            <p className="text-emerald-600 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Port 5000 Connected
            </p>
          </div>
        </div>
        <div className="border-t border-zinc-100 pt-6">
          Apex Arc © 2026 — Premier Architectural Real Estate
        </div>
      </footer>

      <div className="fixed bottom-6 right-6 z-50">
        {!isChatOpen ? (
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer border border-zinc-700"
          >
            <Bot className="w-5 h-5 text-emerald-400 animate-bounce" />
            <span className="text-xs font-semibold tracking-wide">AI Assistant</span>
          </button>
        ) : (
          <div className="w-[360px] md:w-[420px] h-[540px] bg-white border border-zinc-300 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 bg-zinc-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Apex AI Concierge</h4>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Express Backend (Port 5000)
                  </span>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-zinc-50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-2.5 transition-all duration-300 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  )}
                  <div className={`p-3 rounded-2xl max-w-[80%] whitespace-pre-line leading-relaxed shadow-sm ${
                    msg.sender === 'user' ? 'bg-zinc-900 text-white rounded-tr-none' : 'bg-white text-zinc-800 border border-zinc-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-700 shrink-0">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="text-zinc-500 text-[11px] flex items-center gap-2">
                  <Bot className="w-3.5 h-3.5 animate-bounce text-emerald-600" /> Scanning database...
                </div>
              )}
            </div>

            <div className="p-3 bg-white border-t border-zinc-200 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about properties or budget..."
                className="flex-1 bg-zinc-100 border border-zinc-300 rounded-full px-4 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 transition-all"
              />
              <button onClick={sendMessage} disabled={loading} className="bg-zinc-900 hover:bg-zinc-800 text-white p-2.5 rounded-full transition-all duration-200 hover:scale-105 disabled:opacity-50 cursor-pointer">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

function HomeView({ favorites, toggleFavorite }: { favorites: string[], toggleFavorite: (id: string) => void }) {
  const navigate = useNavigate();
  const [serviceIdx, setServiceIdx] = useState(0);

  const services = [
    { num: '01', title: 'Arch Design', desc: 'From initial concept development and schematic design', img: GUARANTEED_ARCH_IMAGES[0] },
    { num: '02', title: 'Interior Design', desc: 'Creating cohesive interior spaces that reflect your style', img: GUARANTEED_ARCH_IMAGES[1] },
    { num: '03', title: 'Urban Planning', desc: 'Designing the spaces between buildings & outdoors', img: GUARANTEED_ARCH_IMAGES[2] }
  ];

  const nextService = () => {
    setServiceIdx((prev) => (prev + 1) % services.length);
  };

  const prevService = () => {
    setServiceIdx((prev) => (prev === 0 ? services.length - 1 : prev - 1));
  };

  const visibleServices = [
    services[serviceIdx],
    services[(serviceIdx + 1) % services.length],
    services[(serviceIdx + 2) % services.length]
  ];

  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-20">
      
      {/* قسم الهيرو مع تأثير Hover فخم على الخلفية بالكامل (Group Hover) */}
      <section className="relative rounded-[32px] overflow-hidden text-white min-h-[500px] flex flex-col justify-end p-10 md:p-16 shadow-2xl group cursor-pointer">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${GUARANTEED_ARCH_IMAGES[0]})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-95" />
        
        <div className="relative z-10 max-w-xl space-y-4 mb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-lg">
            Designing Spaces That Inspire & Endure
          </h1>
          <p className="text-zinc-200 text-xs md:text-sm leading-relaxed drop-shadow">
            We transform visions into timeless architecture, blending innovative design with functional excellence.
          </p>
        </div>
        <div className="relative z-10">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate('/properties');
            }}
            className="bg-white hover:bg-zinc-100 text-zinc-900 px-7 py-3 rounded-full text-xs font-bold tracking-wide transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-xl"
          >
            Schedule a Free Consultation
          </button>
        </div>
      </section>

      {/* About Company & Stats Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900">About Company</h2>
          <p className="text-zinc-500 text-xs leading-relaxed max-w-md">
            At Apex Architects, we believe that architecture is more than just buildings; it's about creating environments that enhance human experience.
          </p>
          <div className="pt-6 flex items-center gap-8 text-zinc-400 font-semibold text-xs uppercase tracking-widest border-t border-zinc-200">
            <span>CNBC</span>
            <span>officernd</span>
            <span>ARCOMIC</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="border-l-2 border-zinc-900 pl-4 transition-all duration-300 hover:translate-x-1">
            <h3 className="text-4xl font-extrabold text-zinc-900 mb-1">25+</h3>
            <p className="text-zinc-500 text-xs">Years of Excellence in Architecture & Design</p>
          </div>
          <div className="border-l-2 border-zinc-900 pl-4 transition-all duration-300 hover:translate-x-1">
            <h3 className="text-4xl font-extrabold text-zinc-900 mb-1">500+</h3>
            <p className="text-zinc-500 text-xs">Projects Successfully Completed</p>
          </div>
          <div className="border-l-2 border-zinc-900 pl-4 transition-all duration-300 hover:translate-x-1">
            <h3 className="text-4xl font-extrabold text-zinc-900 mb-1">98%</h3>
            <p className="text-zinc-500 text-xs">Our Client Retention Rate</p>
          </div>
          <div className="border-l-2 border-zinc-900 pl-4 transition-all duration-300 hover:translate-x-1">
            <h3 className="text-4xl font-extrabold text-zinc-900 mb-1">15+</h3>
            <p className="text-zinc-500 text-xs">Countries with Our Projects</p>
          </div>
        </div>
      </section>

      {/* Services We Provide (3 عناصر في الهوم + تفاعل Hover ناعم) */}
      <section className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-zinc-900">Services we provide</h2>
          <div className="flex gap-2">
            <button 
              onClick={prevService}
              className="w-10 h-10 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-700 bg-white hover:bg-zinc-900 hover:text-white transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextService}
              className="w-10 h-10 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-700 bg-white hover:bg-zinc-900 hover:text-white transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleServices.map((srv, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-sm space-y-4 hover:shadow-2xl hover:border-zinc-900 transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer">
              <div className="relative h-56 rounded-2xl overflow-hidden bg-zinc-100">
                <img src={srv.img} alt={srv.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 bg-zinc-900/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {srv.num}
                </span>
              </div>
              <h3 className="font-bold text-zinc-900 text-base group-hover:text-emerald-600 transition-colors">{srv.title}</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">{srv.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Our Portfolio of Pioneering Design</h2>
          <p className="text-zinc-500 text-xs max-w-lg">
            Explore our selected works that demonstrate our commitment to design excellence, innovation, and client satisfaction.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-6 md:col-span-2">
            <div className="relative h-72 rounded-3xl overflow-hidden group bg-zinc-100 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <img src={GUARANTEED_ARCH_IMAGES[3]} alt="Modern Architecture" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute bottom-4 left-4 bg-zinc-900/80 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full font-medium shadow">
                Modern Architecture
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="relative h-56 rounded-3xl overflow-hidden group bg-zinc-100 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <img src={GUARANTEED_ARCH_IMAGES[4]} alt="Corporate Office" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute bottom-4 left-4 bg-zinc-900/80 backdrop-blur-md text-white text-xs px-4 py-1.5 rounded-full font-medium shadow">
                  Corporate Office
                </div>
              </div>
              <div className="relative h-56 rounded-3xl overflow-hidden group bg-zinc-100 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <img src={GUARANTEED_ARCH_IMAGES[5]} alt="Luxury Residence" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute bottom-4 left-4 bg-zinc-900/80 backdrop-blur-md text-white text-xs px-4 py-1.5 rounded-full font-medium shadow">
                  Luxury Residence
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between space-y-6">
            <div className="relative h-[440px] rounded-3xl overflow-hidden group bg-zinc-100 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <img src={GUARANTEED_ARCH_IMAGES[6]} alt="Private Villa" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute bottom-4 left-4 bg-zinc-900/80 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full font-medium shadow">
                Private Villa
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/properties')}
              className="w-full py-3.5 bg-white border border-zinc-300 hover:bg-zinc-900 hover:text-white rounded-full text-xs font-semibold text-zinc-900 transition-all duration-300 cursor-pointer shadow-sm transform hover:scale-[1.02]"
            >
              See More Projects ({GENERATED_PROPERTIES.length})
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

function PropertiesView({ favorites, toggleFavorite }: { favorites: string[], toggleFavorite: (id: string) => void }) {
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProperties = GENERATED_PROPERTIES.filter(p => {
    const matchesType = filterType === 'All' || p.type === filterType;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 animate-in fade-in duration-300">
      <div className="mb-10 text-center space-y-4">
        <h1 className="text-3xl font-bold text-zinc-900">All Architectural Properties ({GENERATED_PROPERTIES.length} Listings)</h1>
        <p className="text-zinc-500 text-xs">Browse our complete luxury portfolio across prime locations in Egypt.</p>

        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search by title, location (e.g., Zamalek, Villa)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-100 border border-zinc-300 rounded-full pl-11 pr-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 transition-all shadow-inner"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {['All', 'Villa', 'Penthouse', 'Townhouse', 'Duplex', 'Chalet', 'Mansion'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                filterType === type ? 'bg-zinc-900 text-white shadow scale-105' : 'bg-white text-zinc-600 border border-zinc-300 hover:text-zinc-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((item) => (
            <PropertyCard key={item.id} item={item} isFavorite={favorites.includes(item.id)} toggleFavorite={toggleFavorite} />
          ))
        ) : (
          <div className="col-span-3 text-center py-16 text-zinc-400 text-xs">
            No properties found matching your search. Try another keyword!
          </div>
        )}
      </div>
    </div>
  );
}

function PropertyCard({ item, isFavorite, toggleFavorite }: { item: any, isFavorite: boolean, toggleFavorite: (id: string) => void }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-zinc-900 transition-all duration-300 group flex flex-col justify-between transform hover:-translate-y-2 cursor-pointer">
      <div>
        <div className="relative h-60 overflow-hidden bg-zinc-100">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <span className="absolute top-4 left-4 bg-zinc-900/80 backdrop-blur-md text-white text-[11px] px-3.5 py-1 rounded-full font-medium">
            {item.tag}
          </span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(item.id);
            }}
            className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer shadow-sm ${
              isFavorite ? 'bg-zinc-900 text-white' : 'bg-white/90 text-zinc-700 hover:bg-white hover:text-zinc-900'
            }`}
            title={isFavorite ? "Remove from saved" : "Save property"}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>
        <div className="p-6 space-y-3">
          <h3 className="text-base font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">{item.title}</h3>
          <p className="text-zinc-500 text-xs flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-zinc-900" /> {item.location}
          </p>
          <div className="flex items-center justify-between text-zinc-500 text-xs border-t border-b border-zinc-100 py-3">
            <span className="flex items-center gap-1"><Bed className="w-4 h-4 text-zinc-700" /> {item.beds} Beds</span>
            <span className="flex items-center gap-1"><Bath className="w-4 h-4 text-zinc-700" /> {item.baths} Baths</span>
            <span className="flex items-center gap-1"><Square className="w-4 h-4 text-zinc-700" /> {item.area}</span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Price</span>
          <span className="text-zinc-900 font-extrabold text-base">{item.price}</span>
        </div>
        <button 
          onClick={() => navigate(`/property/${item.id}`)}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 cursor-pointer flex items-center gap-1 shadow-sm"
        >
          Details <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function ContactView() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-16 animate-in fade-in duration-300">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3">Get in Touch with Apex Arc</h1>
        <p className="text-zinc-500 text-xs">Have questions about our architectural designs or properties? Send us a message.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 bg-white border border-zinc-200 rounded-3xl p-8 md:p-12 shadow-xl">
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 mb-2">Contact Information</h3>
            <p className="text-zinc-500 text-xs leading-relaxed">Reach out directly through our channels below.</p>
          </div>

          <div className="space-y-4 text-xs text-zinc-700">
            <div className="flex items-center gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200 transition-all hover:border-zinc-400">
              <MapPin className="w-5 h-5 text-zinc-900 shrink-0" />
              <span>Fifth Settlement, New Cairo, Egypt</span>
            </div>
            <div className="flex items-center gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200 transition-all hover:border-zinc-400">
              <PhoneCall className="w-5 h-5 text-zinc-900 shrink-0" />
              <span>+20 100 555 8899</span>
            </div>
            <div className="flex items-center gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200 transition-all hover:border-zinc-400">
              <Mail className="w-5 h-5 text-zinc-900 shrink-0" />
              <span>contact@apexarc.com</span>
            </div>
            <div className="flex items-center gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200 transition-all hover:border-zinc-400">
              <Clock className="w-5 h-5 text-zinc-900 shrink-0" />
              <span>Sun - Thu: 9:00 AM - 6:00 PM</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-50 p-8 rounded-2xl border border-zinc-200 flex flex-col justify-center">
          {submitted ? (
            <div className="text-center space-y-4 py-8 animate-in zoom-in-95 duration-300">
              <div className="w-12 h-12 bg-zinc-200 text-zinc-900 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-zinc-900 text-base">Message Sent Successfully!</h4>
              <p className="text-zinc-500 text-xs">Our team will contact you within 24 hours.</p>
              <button onClick={() => setSubmitted(false)} className="mt-4 text-xs font-semibold text-zinc-900 hover:underline cursor-pointer">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h4 className="font-bold text-zinc-900 text-sm mb-2">Send Us a Message</h4>
              <div>
                <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  required 
                  type="text" 
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 transition-all" 
                />
              </div>
              <div>
                <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Email Address</label>
                <input 
                  required 
                  type="email" 
                  placeholder="john@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 transition-all" 
                />
              </div>
              <div>
                <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Message</label>
                <textarea 
                  required 
                  rows={4} 
                  placeholder="Describe your inquiry..." 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 transition-all"
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-3 rounded-xl text-xs font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-md cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Submit Inquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function PropertyDetailView({ favorites, toggleFavorite }: { favorites: string[], toggleFavorite: (id: string) => void }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = GENERATED_PROPERTIES.find((p) => p.id === id) || GENERATED_PROPERTIES[0];
  const [activeImage, setActiveImage] = useState(property.image);
  const isFav = favorites.includes(property.id);

  return (
    <div className="max-w-5xl mx-auto px-8 py-12 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate(-1)} className="text-zinc-600 text-xs font-semibold hover:underline cursor-pointer flex items-center gap-1">
          ← Back to Portfolio
        </button>
        <button 
          onClick={() => toggleFavorite(property.id)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            isFav ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700 border border-zinc-300 hover:bg-zinc-200'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
          {isFav ? 'Saved in Bookmarks' : 'Bookmark Property'}
        </button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-xl">
        <div className="h-96 w-full relative bg-zinc-900 overflow-hidden">
          <img src={activeImage} alt={property.title} className="w-full h-full object-cover transition-all duration-500 hover:scale-105" />
          <span className="absolute top-4 left-4 bg-zinc-900 text-white text-xs px-4 py-1.5 rounded-full font-bold">{property.tag}</span>
        </div>

        {property.gallery && property.gallery.length > 0 && (
          <div className="p-4 bg-zinc-100 flex gap-3 overflow-x-auto border-b border-zinc-200">
            <div className="relative shrink-0">
              <img 
                src={property.image} 
                alt="Exterior" 
                onClick={() => setActiveImage(property.image)}
                className={`w-28 h-20 object-cover rounded-2xl cursor-pointer border-2 transition-all duration-200 ${activeImage === property.image ? 'border-zinc-900 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
              />
              <span className="absolute bottom-1 left-1 bg-zinc-900/80 text-[9px] text-white px-1.5 rounded">Exterior</span>
            </div>
            {property.gallery.map((imgUrl, i) => (
              <div key={i} className="relative shrink-0">
                <img 
                  src={imgUrl} 
                  alt={`Interior ${i + 1}`} 
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-28 h-20 object-cover rounded-2xl cursor-pointer border-2 transition-all duration-200 ${activeImage === imgUrl ? 'border-zinc-900 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                />
                <span className="absolute bottom-1 left-1 bg-zinc-900/80 text-[9px] text-white px-1.5 rounded">Interior {i + 1}</span>
              </div>
            ))}
          </div>
        )}

        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 mb-2">{property.title}</h1>
              <p className="text-zinc-500 text-xs flex items-center gap-2">
                <MapPin className="w-4 h-4 text-zinc-900" /> {property.location}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-400 block">Property Price</span>
              <span className="text-2xl font-extrabold text-zinc-900">{property.price}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-b border-zinc-200 py-6 mb-6 text-center">
            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 transition-all hover:bg-zinc-100">
              <span className="text-xs text-zinc-400 block mb-1">Bedrooms</span>
              <span className="text-lg font-bold text-zinc-900">{property.beds} Beds</span>
            </div>
            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 transition-all hover:bg-zinc-100">
              <span className="text-xs text-zinc-400 block mb-1">Bathrooms</span>
              <span className="text-lg font-bold text-zinc-900">{property.baths} Baths</span>
            </div>
            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 transition-all hover:bg-zinc-100">
              <span className="text-xs text-zinc-400 block mb-1">Surface Area</span>
              <span className="text-lg font-bold text-zinc-900">{property.area}</span>
            </div>
          </div>

          <h3 className="text-base font-bold text-zinc-900 mb-3">Architectural Overview</h3>
          <p className="text-zinc-600 text-xs leading-relaxed mb-8">{property.description}</p>

          <h3 className="text-base font-bold text-zinc-900 mb-4">Specifications & Features</h3>
          <div className="grid md:grid-cols-2 gap-3 mb-8">
            {property.features.map((feat: string, index: number) => (
              <div key={index} className="flex items-center gap-2.5 text-xs text-zinc-700 bg-zinc-50 p-3 rounded-xl border border-zinc-200 transition-all hover:bg-zinc-100">
                <CheckCircle2 className="w-4 h-4 text-zinc-900" /> {feat}
              </div>
            ))}
          </div>

          <button 
            onClick={() => alert('Consultation request submitted! Data validated successfully.')}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-4 rounded-full text-xs font-semibold transition-all duration-300 transform hover:scale-[1.01] shadow-lg cursor-pointer flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-4 h-4" /> Schedule Consultation with Architect
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;