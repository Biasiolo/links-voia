import React, { useState, useEffect } from 'react';
import data from '../links.json';
import { Search, Menu, X, ChevronUp, ChevronDown, ExternalLink, Star, Clock } from 'lucide-react';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteLinks, setFavoriteLinks] = useState([]);
  const [recentLinks, setRecentLinks] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { categories } = data;

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteLinks');
    if (storedFavorites) {
      setFavoriteLinks(JSON.parse(storedFavorites));
    }

    const storedRecent = localStorage.getItem('recentLinks');
    if (storedRecent) {
      setRecentLinks(JSON.parse(storedRecent));
    } else {
      const exampleRecent = [
        { name: 'Google Analytics', url: 'https://analytics.google.com', timestamp: new Date().toISOString() },
        { name: 'Slack', url: 'https://slack.com', timestamp: new Date(Date.now() - 3600000).toISOString() }
      ];
      setRecentLinks(exampleRecent);
      localStorage.setItem('recentLinks', JSON.stringify(exampleRecent));
    }

    const expanded = {};
    categories.forEach((_, index) => {
      expanded[index] = true;
    });
    setExpandedCategories(expanded);
  }, [categories]);

  const handleLinkClick = (link) => {
    const newRecentLinks = [
      { ...link, timestamp: new Date().toISOString() },
      ...recentLinks.filter(item => item.url !== link.url).slice(0, 4)
    ];
    setRecentLinks(newRecentLinks);
    localStorage.setItem('recentLinks', JSON.stringify(newRecentLinks));
  };

  const toggleFavorite = (link) => {
    const isFavorite = favoriteLinks.some(item => item.url === link.url);
    let newFavorites;

    if (isFavorite) {
      newFavorites = favoriteLinks.filter(item => item.url !== link.url);
    } else {
      newFavorites = [...favoriteLinks, link];
    }

    setFavoriteLinks(newFavorites);
    localStorage.setItem('favoriteLinks', JSON.stringify(newFavorites));
  };

  const isFavorite = (link) => {
    return favoriteLinks.some(item => item.url === link.url);
  };

  const toggleCategory = (index) => {
    setExpandedCategories({
      ...expandedCategories,
      [index]: !expandedCategories[index]
    });
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const linkTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - linkTime) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min atrás`;
    } else if (diffInMinutes < 24 * 60) {
      return `${Math.floor(diffInMinutes / 60)} h atrás`;
    } else {
      return `${Math.floor(diffInMinutes / (60 * 24))} d atrás`;
    }
  };

  const filteredCategories = categories.map(category => {
    const filteredLinks = category.links.filter(link =>
      link.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return { ...category, links: filteredLinks };
  }).filter(category => category.links.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <header className="sticky top-0 z-50 bg-gray-900 bg-opacity-95 backdrop-blur-sm border-b border-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">

            <h1 className="text-2xl font-bold text-white">VOIA Links</h1>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <button onClick={() => setActiveTab('all')} className={`px-3 py-2 rounded-lg transition ${activeTab === 'all' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:text-white'}`}>
              Todos os Links
            </button>
            <button onClick={() => setActiveTab('favorites')} className={`px-3 py-2 rounded-lg transition ${activeTab === 'favorites' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:text-white'}`}>
              Favoritos
            </button>
            <button onClick={() => setActiveTab('recent')} className={`px-3 py-2 rounded-lg transition ${activeTab === 'recent' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:text-white'}`}>
              Recentes
            </button>
          </nav>

          <button className="md:hidden text-white focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800 pb-4 px-4">
            <nav className="flex flex-col space-y-2">
              <button onClick={() => { setActiveTab('all'); setMobileMenuOpen(false); }} className={`px-3 py-2 rounded-lg transition ${activeTab === 'all' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:text-white'}`}>
                Todos os Links
              </button>
              <button onClick={() => { setActiveTab('favorites'); setMobileMenuOpen(false); }} className={`px-3 py-2 rounded-lg transition ${activeTab === 'favorites' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:text-white'}`}>
                Favoritos
              </button>
              <button onClick={() => { setActiveTab('recent'); setMobileMenuOpen(false); }} className={`px-3 py-2 rounded-lg transition ${activeTab === 'recent' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:text-white'}`}>
                Recentes
              </button>
            </nav>
          </div>
        )}
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="mx-auto max-w-md relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              placeholder="Pesquisar links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-600">
              Hub de Links Voia
            </h1>
            <p className="text-lg text-gray-400 mt-4 max-w-3xl mx-auto">
              Acesse rapidamente as ferramentas essenciais da agência.
            </p>
          </div>
        </div>

        {activeTab === 'all' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category, index) => (
              <div
                key={index}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-teal-500/30 hover:border-teal-500/40 "
              >
                <div 
                  className="flex justify-between items-center p-4 cursor-pointer text-center"
                  onClick={() => toggleCategory(index)}
                >
                  <div className="flex items-center space-x-3 cursor-pointer text-center">
                    <span className="text-2xl">{category.icon}</span>
                    <h2 className="text-xl font-bold  text-teal-500">{category.name}</h2>
                  </div>
                  <div>
                    {expandedCategories[index] ? 
                      <ChevronUp className="text-gray-400" size={20} /> : 
                      <ChevronDown className="text-gray-400" size={20} />
                    }
                  </div>
                </div>
                
                {expandedCategories[index] && (
                  <div className="px-4 pb-4">
                    <div className="space-y-2">
                      {category.links.map((link, linkIndex) => (
                        <div 
                          key={linkIndex}
                          className={`flex items-center justify-between rounded-lg ${link.featured ? 'bg-gradient-to-r from-orange-600/20 to-pink-600/20 border border-orange-500/30' : 'bg-gray-700/40 hover:bg-teal-700/80 border border-gray-600'} transition-all duration-100 transform hover:-translate-y-0.5 hover:shadow-md`}

                        >
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-grow p-3 flex items-center text-white"
                            onClick={() => handleLinkClick(link)}
                          >
                            <span className="flex-grow font-medium">{link.name}</span>
                            <ExternalLink size={16} className="text-gray-400" />
                          </a>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFavorite(link);
                            }}
                            className="p-3 text-gray-400 hover:text-yellow-400 transition-colors"
                          >
                            <Star 
                              size={16} 
                              fill={isFavorite(link) ? "currentColor" : "none"} 
                              className={isFavorite(link) ? "text-yellow-400" : ""}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Favoritos */}
        {activeTab === 'favorites' && (
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
              <Star className="mr-2 text-yellow-400" size={24} fill="currentColor" />
              Links Favoritos
            </h2>
            
            {favoriteLinks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteLinks.map((link, index) => (
                  <div 
                    key={index}
                    className="bg-gray-700/40 rounded-lg hover:bg-gray-700/80 border border-gray-600 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md flex items-center justify-between"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-grow p-3 flex items-center text-white"
                      onClick={() => handleLinkClick(link)}
                    >
                      <span className="flex-grow font-medium">{link.name}</span>
                      <ExternalLink size={16} className="text-gray-400" />
                    </a>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(link);
                      }}
                      className="p-3 text-yellow-400 hover:text-gray-400 transition-colors"
                    >
                      <Star size={16} fill="currentColor" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400">
                <Star className="mx-auto mb-3" size={32} />
                <p>Você ainda não tem links favoritos. Marque alguns como favoritos para vê-los aqui!</p>
              </div>
            )}
          </div>
        )}

        {/* Recentes */}
        {activeTab === 'recent' && (
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
              <Clock className="mr-2 text-blue-400" size={24} />
              Links Recentes
            </h2>
            
            {recentLinks.length > 0 ? (
              <div className="space-y-4">
                {recentLinks.map((link, index) => (
                  <div 
                    key={index}
                    className="bg-gray-700/40 rounded-lg hover:bg-gray-700/80 border border-gray-600 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md flex items-center justify-between"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-grow p-3 flex items-center text-white"
                      onClick={() => handleLinkClick(link)}
                    >
                      <div className="flex-grow">
                        <span className="font-medium block">{link.name}</span>
                        <span className="text-sm text-gray-400">{formatTimeAgo(link.timestamp)}</span>
                      </div>
                      <ExternalLink size={16} className="text-gray-400" />
                    </a>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(link);
                      }}
                      className="p-3 text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      <Star 
                        size={16} 
                        fill={isFavorite(link) ? "currentColor" : "none"} 
                        className={isFavorite(link) ? "text-yellow-400" : ""}
                      />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400">
                <Clock className="mx-auto mb-3" size={32} />
                <p>Nenhum link acessado recentemente.</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 py-6 border-t border-gray-800 text-center">
          <div className="flex justify-center items-center space-x-4 mb-3">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Sobre
            </a>
            <span className="text-gray-700">•</span>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Suporte
            </a>
            <span className="text-gray-700">•</span>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Contato
            </a>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Agência Voia. Todos os direitos reservados.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
      