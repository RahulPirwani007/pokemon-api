import React, { useState, useEffect } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { useNavigate } from "react-router-dom";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const Hero = ({ searchQuery }) => {
  const [pokemonData, setPokemonData] = useState([]);
  const [pokemonImages, setPokemonImages] = useState({});
  const [pokemonTypes, setPokemonTypes] = useState({});
  const [pokemonHeight, setPokemonHeight] = useState({});
  const [pokemonWeight, setPokemonWeight] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState("all");
  const [sortDirection, setSortDirection] = useState(null);
  const itemsPerPage = 15;

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const navigate = useNavigate();

  // Favorites from context
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const loadPokemonData = async () => {
    const cachedData = localStorage.getItem("pokemonData");
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setPokemonData(parsedData.results);
      setPokemonImages(parsedData.images);
      setPokemonTypes(parsedData.types);
      setPokemonHeight(parsedData.height);
      setPokemonWeight(parsedData.weight);
    } else {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=150"
      );
      const data = await response.json();
      const images = {};
      const types = {};
      const heights = {};
      const weights = {};
      const allPromises = data.results.map(async (pokemon) => {
        const pokemonResponse = await fetch(pokemon.url);
        const pokemonData = await pokemonResponse.json();
        images[pokemon.name] =
          pokemonData.sprites.other["official-artwork"].front_default;
        types[pokemon.name] = pokemonData.types.map((t) => t.type.name);
        heights[pokemon.name] = pokemonData.height;
        weights[pokemon.name] = pokemonData.weight;
      });
      await Promise.all(allPromises);
      const cached = {
        results: data.results,
        images,
        types,
        height: heights,
        weight: weights,
      };
      localStorage.setItem("pokemonData", JSON.stringify(cached));
      setPokemonData(data.results);
      setPokemonImages(images);
      setPokemonTypes(types);
      setPokemonHeight(heights);
      setPokemonWeight(weights);
    }
  };

  useEffect(() => {
    loadPokemonData();
  }, []);

  const filteredPokemonData = pokemonData
    .filter((pokemon) => {
      if (debouncedSearchQuery && typeof debouncedSearchQuery === "string") {
        return pokemon.name
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase());
      }
      return true;
    })
    .filter((pokemon) =>
      selectedType === "all"
        ? true
        : pokemonTypes[pokemon.name]?.includes(selectedType)
    );

  const sortedPokemonData =
    sortDirection === "asc"
      ? [...filteredPokemonData].sort((a, b) => a.name.localeCompare(b.name))
      : sortDirection === "desc"
      ? [...filteredPokemonData].sort((a, b) => b.name.localeCompare(a.name))
      : filteredPokemonData;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedPokemonData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalPages = Math.ceil(filteredPokemonData.length / itemsPerPage);

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

  const toggleFavorite = (pokemonName) => {
    const isAlreadyFav = favorites.some((poke) => poke.name === pokemonName);
    const image = pokemonImages[pokemonName];
    const height = pokemonHeight[pokemonName];
    const weight = pokemonWeight[pokemonName];
    const types = pokemonTypes[pokemonName];

    if (isAlreadyFav) {
      removeFavorite(pokemonName);
    } else {
      addFavorite({
        name: pokemonName,
        image,
        height,
        weight,
        types,
      });
    }
  };

  const handleFavoritesClick = () => {
    navigate("/favorites");
  };

  return (
    <div className="flex">
      <div className="w-1/4 bg-gray-100 p-4 h-screen">
        <h2 className="text-2xl font-bold mb-4 text-center">Filters</h2>

        <div className="mb-6">
          <h3 className="font-semibold">Filter by Type</h3>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-100 cursor-pointer transition duration-300"
          >
            <option value="all">All Types</option>
            {Array.from(new Set(Object.values(pokemonTypes).flat()))
              .sort()
              .map((type, idx) => (
                <option key={idx} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-3">Sort by Name</h3>
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

        <button
          onClick={handleFavoritesClick}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg mb-8 w-full cursor-pointer transition duration-300"
        >
          My Favorites
        </button>
      </div>

      <div className="w-3/4 min-h-[42rem] overflow-y-scroll p-4">
        <h1 className="text-blue-800 font-extrabold text-6xl flex justify-center items-center mb-8 cursor-pointer">
          POKEDEX
        </h1>

        <div className="grid grid-cols-3 gap-6">
          {paginatedData.length > 0 ? (
            paginatedData.map((pokemon, index) => (
              <div
                className="card p-4 border-2 border-blue-600 rounded-3xl flex flex-col items-center relative"
                key={index}
              >
                <i
                  className={`bx ${
                    favorites.some((f) => f.name === pokemon.name)
                      ? "bxs-heart text-red-500"
                      : "bx-heart text-black"
                  } text-2xl cursor-pointer absolute top-2 right-2`}
                  onClick={() => toggleFavorite(pokemon.name)}
                ></i>

                {pokemonImages[pokemon.name] && (
                  <img
                    src={pokemonImages[pokemon.name]}
                    alt={pokemon.name}
                    className="w-32 h-32 mb-4 cursor-pointer"
                  />
                )}
                <h2 className="text-2xl font-bold capitalize mb-2 cursor-pointer">
                  {pokemon.name}
                </h2>
                <p>
                  <b>Height: </b>
                  {pokemonHeight[pokemon.name]}
                </p>
                <p>
                  <b>Weight: </b>
                  {pokemonWeight[pokemon.name]}
                </p>
                <div className="flex gap-2 flex-wrap mt-3 justify-center">
                  {pokemonTypes[pokemon.name]?.map((type, idx) => (
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
            <div className="flex justify-center items-center text-xl text-gray-500 col-span-3">
              No Results Found
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2 flex-wrap">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 cursor-pointer ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-blue-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
