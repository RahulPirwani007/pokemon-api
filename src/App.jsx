import React, { useState } from "react";
import Header from "./Header";
import Hero from "./Hero";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div>
      <Header onSearch={handleSearch} />
      <Hero searchQuery={searchQuery} />
    </div>
  );
};

export default App;
