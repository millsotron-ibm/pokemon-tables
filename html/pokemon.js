let currentPage = 0;
const itemsPerPage = 10;

function fetchPokemonList(offset) {
  // Fetch a list of Pokemon from the Pokemon API with pagination
  fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${itemsPerPage}`
  )
    .then((response) => response.json())
    .then((data) => {
      // Get the Pokemon list container element
      const pokemonList = document.getElementById("pokemon-list");
      pokemonList.innerHTML = ""; // Clear the container

      // Iterate over the Pokemon results and create pokemon listing elements
      data.results.forEach((pokemon) => {
        fetch(pokemon.url)
          .then((response) => response.json())
          .then((pokemonData) => {
            const listing = createPokemonListing(pokemonData);
            pokemonList.appendChild(listing);
          });
      });
    });
}

function createPokemonListing(pokemonData) {
  // Create a new pokemon listing element with the Pokemon's information
  const listing = document.createElement("article");
  listing.className = "pokemon-listing";

  const imageElement = document.createElement("img");
  imageElement.src = pokemonData.sprites.front_default;
  imageElement.alt = pokemonData.name;

  const nameElement = document.createElement("h2");
  nameElement.textContent = pokemonData.name;

  const idElement = document.createElement("p");
  idElement.textContent = `ID: ${pokemonData.id}`;

  const featuresList = document.createElement("ul");
  pokemonData.types.forEach((type) => {
    const listItem = document.createElement("li");
    listItem.textContent = type.type.name;
    featuresList.appendChild(listItem);
  });

  listing.appendChild(imageElement);
  listing.appendChild(nameElement);
  listing.appendChild(idElement);
  listing.appendChild(featuresList);

  return listing;
}

// Fetch the initial Pokemon list
fetchPokemonList(currentPage * itemsPerPage);

// Add click event listeners for the Next and Previous buttons
document.getElementById("previous-btn").addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    fetchPokemonList(currentPage * itemsPerPage);
  }
});

document.getElementById("next-btn").addEventListener("click", () => {
  currentPage++;
  fetchPokemonList(currentPage * itemsPerPage);
});
