// Header Component
import React, { useState } from "react";

const Header = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="h-[6rem] w-full flex justify-between items-center py-2">
      <img
        src="https://www.gameskinny.com/wp-content/uploads/gameskinnyc/a/6/0/a6078c-2fd9033b2be04c9b947d1aac6cdaef60-a2551.gif"
        alt=""
        className="h-[3rem] sm:h-[4rem] ml-4 cursor-pointer"
      />
      <div className="flex justify-center items-center relative w-full sm:w-auto">
        <input
          type="search"
          placeholder="pokemon search"
          className="outline-0 w-full sm:w-[30rem] border-2 border-blue-600 rounded-2xl pl-4 pr-20 py-2 pb-2.5"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
        />
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#feca03] px-4 py-0.5 rounded-full text-blue-700 cursor-pointer"
          onClick={handleSearchClick}
        >
          Search
        </button>
      </div>
      <nav className="mr-3.5">
        <ul className="flex justify-between items-center gap-3">
          <li className="cursor-pointer">Home</li>
          <li className="cursor-pointer">About</li>
          <li className="cursor-pointer">Contact</li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
