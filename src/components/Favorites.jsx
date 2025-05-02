import React, { useState } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  const { favorites, removeFavorite } = useFavorites();
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState("all");
  const [sortDirection, setSortDirection] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Get type color
  const getTypeColor = (type) => {
    switch (type) {
      case "grass":
        return "bg-green-500";
      case "fire":
        return "bg-red-500";
      case "water":
        return "bg-blue-500";
      case "electric":
        return "bg-yellow-400 text-black";
      case "poison":
        return "bg-purple-600";
      case "flying":
        return "bg-indigo-400";
      case "bug":
        return "bg-lime-500";
      case "normal":
        return "bg-gray-400";
      case "ground":
        return "bg-yellow-700";
      case "fairy":
        return "bg-pink-400";
      case "fighting":
        return "bg-orange-600";
      case "psychic":
        return "bg-pink-600";
      case "rock":
        return "bg-stone-600";
      case "ghost":
        return "bg-violet-700";
      case "ice":
        return "bg-cyan-300 text-black";
      case "dragon":
        return "bg-purple-800";
      case "dark":
        return "bg-gray-700";
      case "steel":
        return "bg-slate-400 text-black";
      default:
        return "bg-gray-500";
    }
  };

  // Handle remove favorite
  const handleRemoveFavorite = (pokemonName) => {
    removeFavorite(pokemonName);
  };

  // Handle back to home
  const handleBackToHome = () => {
    navigate("/");
  };

  // Filter favorites by type
  const filteredFavorites = favorites.filter((pokemon) => {
    if (selectedType === "all") return true;
    return pokemon.types.includes(selectedType);
  });

  // Sort favorites by name
  const sortedFavorites =
    sortDirection === "asc"
      ? [...filteredFavorites].sort((a, b) => a.name.localeCompare(b.name))
      : sortDirection === "desc"
      ? [...filteredFavorites].sort((a, b) => b.name.localeCompare(a.name))
      : filteredFavorites;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedFavorites.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex">
      {/* Left Sidebar Filters */}
      <div className="w-1/4 p-6 border-r-2">
        <h1 className="text-3xl font-extrabold text-blue-600 text-center mb-8 cursor-pointer">
          Pokedex
        </h1>

        <button
          onClick={handleBackToHome}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg mb-8 w-full cursor-pointer transition duration-300"
        >
          Back to Home
        </button>

        {/* Filters */}
        <div className="mb-6">
          {/* Filter by Type */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-xl text-gray-700">
              Filter by Type
            </h3>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-400 rounded-lg w-full cursor-pointer hover:bg-gray-100 transition duration-300"
            >
              <option value="all">All Types</option>
              {Array.from(
                new Set(favorites.flatMap((pokemon) => pokemon.types))
              )
                .sort()
                .map((type, idx) => (
                  <option key={idx} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
            </select>
          </div>

          {/* Sort by Name */}
          <div className="mb-6">
            <h3 className="font-semibold text-xl text-gray-700 mb-3">
              Sort by Name
            </h3>
            <div className="flex flex-col gap-4">
              <label className="flex items-center cursor-pointer checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={sortDirection === "asc"}
                  onChange={() =>
                    setSortDirection(sortDirection === "asc" ? null : "asc")
                  }
                />
                <svg viewBox="0 0 25 25" className="mr-2">
                  <circle
                    className="background"
                    cx="12.5"
                    cy="12.5"
                    r="12.5"
                  ></circle>
                  <circle className="stroke" cx="12.5" cy="12.5" r="9"></circle>
                  <polyline
                    className="check"
                    points="8.8 12.8 11.5 15.5 16.7 10"
                  ></polyline>
                </svg>
                <span>A to Z</span>
              </label>

              <label className="flex items-center cursor-pointer checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={sortDirection === "desc"}
                  onChange={() =>
                    setSortDirection(sortDirection === "desc" ? null : "desc")
                  }
                />
                <svg viewBox="0 0 25 25" className="mr-2">
                  <circle
                    className="background"
                    cx="12.5"
                    cy="12.5"
                    r="12.5"
                  ></circle>
                  <circle className="stroke" cx="12.5" cy="12.5" r="9"></circle>
                  <polyline
                    className="check"
                    points="8.8 12.8 11.5 15.5 16.7 10"
                  ></polyline>
                </svg>
                <span className="text-gray-700">Z to A</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Pokémon Cards */}
      <div className="w-3/4 p-6">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-8 text-center cursor-pointer">
          My Favorite Pokémon
        </h1>
        <div className="grid grid-cols-3 gap-6">
          {currentItems.length > 0 ? (
            currentItems.map((pokemon, index) => (
              <div
                key={index}
                className="card p-4 border-2 border-blue-600 rounded-3xl flex flex-col items-center relative"
              >
                <i
                  className="bx bxs-heart text-red-500 text-2xl cursor-pointer absolute top-2 right-2"
                  onClick={() => handleRemoveFavorite(pokemon.name)}
                ></i>

                {pokemon.image && (
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    className="w-32 h-32 mb-4"
                  />
                )}
                <h2 className="text-2xl font-bold capitalize mb-2  cursor-pointer">
                  {pokemon.name}
                </h2>
                <p>
                  <b>Height: </b>
                  {pokemon.height}
                </p>
                <p>
                  <b>Weight: </b>
                  {pokemon.weight}
                </p>
                <div className="flex gap-2 flex-wrap mt-3 justify-center">
                  {pokemon.types.map((type, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-full text-sm font-semibold text-white capitalize cursor-pointer ${getTypeColor(
                        type
                      )} hover:scale-105 hover:opacity-80 transition-all duration-300`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-xl text-gray-500">
              No Pokémon in your favorites.
            </div>
          )}
        </div>

        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 cursor-pointer"
          >
            <div className="flex items-center justify-center h-5 w-5">
              <i className="bx bx-chevron-left text-xl"></i>
            </div>
          </button>

          <span className="font-semibold text-lg">{currentPage}</span>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage * itemsPerPage >= sortedFavorites.length}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 cursor-pointer"
          >
            <div className="flex items-center justify-center h-5 w-5">
              <i className="bx bx-chevron-right text-xl"></i>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
