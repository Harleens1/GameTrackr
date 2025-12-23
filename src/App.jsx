import React, { useState, useEffect } from 'react';
import { Search, Gamepad2, Star, List, Loader2, AlertCircle, Ghost, ArrowLeft } from 'lucide-react';

const App = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [gameDetails, setGameDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoint = searchTerm 
          ? `https://api.rawg.io/api/games?key=${API_KEY}&search=${searchTerm}&page_size=12`
          : `https://api.rawg.io/api/games?key=${API_KEY}&ordering=-relevance&page_size=12`;

        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Database offline.");
        const data = await response.json();
        setGames(data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      if (API_KEY) fetchGames();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, API_KEY]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!selectedGameId) return;
      setDetailsLoading(true);
      try {
        const response = await fetch(`https://api.rawg.io/api/games/${selectedGameId}?key=${API_KEY}`);
        if (!response.ok) throw new Error("Details not found.");
        const data = await response.json();
        setGameDetails(data);
        setShowFullDescription(false);
        window.scrollTo(0, 0);
      } catch (err) {
        console.error(err);
      } finally {
        setDetailsLoading(false);
      }
    };
    fetchDetails();
  }, [selectedGameId, API_KEY]);

  const stripHtml = (html) => html?.replace(/<[^>]*>?/gm, '') || "";

  const handleLogoClick = () => {
    setSelectedGameId(null);
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-red-600 selection:text-white">
      
      {/* NAVBAR */}
      <nav className="border-b border-white/5 bg-black/95 backdrop-blur-md sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
          <div 
            onClick={handleLogoClick} 
            className="flex items-center gap-2 font-black uppercase tracking-tighter text-2xl cursor-pointer hover:text-red-500 transition-colors group"
          >
            <Gamepad2 className="h-8 w-8 text-red-600 group-hover:rotate-12 transition-transform" /> 
            <span>Game<span className="text-red-600">Trackr</span></span>
          </div>
          <button className="px-6 py-2 text-xs font-black text-white bg-red-600 uppercase tracking-widest hover:bg-red-700 transition-colors">
            Sign In
          </button>
        </div>
      </nav>

      <main>
        {detailsLoading ? (
          <div className="h-[80vh] flex items-center justify-center">
            <Loader2 className="animate-spin h-10 w-10 text-red-600" />
          </div>
        ) : selectedGameId && gameDetails ? (
          /* --- GAME DETAILS VIEW --- */
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 relative">
            
            {/* KEPT THE ROUND ARROW */}
            <button 
              onClick={() => setSelectedGameId(null)}
              className="fixed top-24 left-6 z-[110] p-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>

             <div className="relative h-[45vh] w-full overflow-hidden">
              <img src={gameDetails.background_image_additional || gameDetails.background_image} className="w-full h-full object-cover opacity-30 blur-sm" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-40 relative z-10 pb-32">
              <div className="flex flex-col lg:flex-row gap-16">
                <div className="w-full lg:w-[450px] flex-shrink-0">
                  <img src={gameDetails.background_image} className="w-full rounded-none border border-white/10 shadow-2xl" alt="" />
                  <div className="mt-8">
                    {/* BACK BUTTON REMOVED FROM HERE */}
                    <button className="w-full py-5 bg-red-600 text-white font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-colors">
                      Add to Collection
                    </button>
                  </div>
                </div>

                <div className="flex-1 lg:pt-24">
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] mb-10">{gameDetails.name}</h1>
                    <div className="flex flex-wrap gap-y-4 gap-x-10 mb-12 text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em]">
                        <span className="flex items-center gap-2 text-red-500 font-black">
                          <Star className="h-3 w-3 fill-red-600 text-red-600"/> {gameDetails.rating}
                        </span>
                        <span>Released: {gameDetails.released}</span>
                        <span className="text-zinc-300">Platforms: {gameDetails.platforms?.map(p => p.platform.name).join(' / ')}</span>
                    </div>
                    <div className="max-w-2xl border-t border-white/5 pt-10">
                        <p className={`text-zinc-400 text-lg leading-relaxed ${!showFullDescription ? 'line-clamp-6' : ''}`}>
                            {stripHtml(gameDetails.description)}
                        </p>
                        <button onClick={() => setShowFullDescription(!showFullDescription)} className="mt-6 text-[10px] font-black uppercase border-b border-red-600 pb-1 text-red-500">
                            {showFullDescription ? "View Less" : "View Full Summary"}
                        </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* --- LANDING PAGE VIEW --- */
          <div className="animate-in fade-in duration-700">
            {/* ... Rest of the component remains the same ... */}
            <div className="max-w-7xl mx-auto px-4 pt-32 pb-24 text-center">
              <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter mb-12 leading-[0.75]">
                TRACK <br /> <span className="text-red-700 drop-shadow-[0_0_35px_rgba(185,28,28,0.4)]">EVERYTHING</span>
              </h1>
              <div className="max-w-2xl mx-auto relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-zinc-700 group-focus-within:text-white transition-colors" />
                <input 
                  type="text" 
                  placeholder="SEARCH DATABASE..." 
                  className="w-full bg-zinc-950 border border-white/5 py-7 pl-16 pr-6 rounded-none text-xl font-bold focus:border-white/20 outline-none transition-all placeholder:text-zinc-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <section className="max-w-7xl mx-auto px-4 py-12 min-h-[400px]">
              <div className="flex items-center gap-4 mb-12">
                <div className="h-[2px] w-8 bg-red-600" />
                <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-white">
                    {searchTerm ? `Search Results for "${searchTerm}"` : "Trending Titles"}
                </h2>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-zinc-950 animate-pulse border border-white/5" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {games.map((game) => (
                    <div key={game.id} onClick={() => setSelectedGameId(game.id)} className="group cursor-pointer">
                      <div className="aspect-[3/4] overflow-hidden bg-zinc-900 mb-4 border border-white/5 group-hover:border-white/20 transition-colors">
                        <img 
                          src={game.background_image} 
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
                          alt={game.name} 
                        />
                      </div>
                      <h3 className="font-black uppercase tracking-tight text-sm group-hover:text-red-500 transition-colors leading-tight">{game.name}</h3>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
