import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Hero from "./components/Hero";
import Favorites from "./components/Favorites";
import { FavoritesProvider } from "./context/FavoritesContext";
import Header from "./Header";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <FavoritesProvider>
      <Router>
        <Header onSearch={handleSearch} />
        <Routes>
          <Route path="/" element={<Hero searchQuery={searchQuery} />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </Router>
    </FavoritesProvider>
  );
};

export default App;
