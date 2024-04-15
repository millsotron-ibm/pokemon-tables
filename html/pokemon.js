let currentPage = 0;
const itemsPerPage = 5;

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

  listing.onclick = () => {
    fetchPokemonDetails(pokemonData.id);
  };

  const imageElement = document.createElement("img");
  imageElement.src = pokemonData.sprites.front_default;
  imageElement.alt = pokemonData.name;

  const nameElement = document.createElement("pokemon-name");
  nameElement.textContent = pokemonData.name;

  const idElement = document.createElement("pokemon-id");
  idElement.textContent = `ID: ${pokemonData.id}`;

  const featuresList = document.createElement("pokemon-types");
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

function fetchPokemonTypes() {
  fetch("https://pokeapi.co/api/v2/type")
    .then((response) => response.json())
    .then((data) => {
      const typeSelector = document.getElementById("pokemon-type-selector");

      data.results.forEach((type) => {
        const option = document.createElement("option");
        option.value = type.url;
        option.textContent = type.name;
        typeSelector.appendChild(option);
      });
    });
}

// Fetch the initial Pokemon list and types
fetchPokemonList(currentPage * itemsPerPage);
fetchPokemonTypes();

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

function fetchPokemonDetails(id) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then((response) => response.json())
    .then((pokemonData) => {
      displayPokemonDetails(pokemonData);
    });
}


function displayPokemonDetails(pokemonData) {
  // Create a modal element
  const modal = document.createElement('div');
  modal.className = 'pokemon-modal';
  modal.innerHTML = `
    <div class="pokemon-modal-content">
      <span class="pokemon-modal-close">&times;</span>
      <h2>${pokemonData.name}</h2>
      <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}" />
      <p>ID: ${pokemonData.id}</p>
      <p>Height: ${pokemonData.height}</p>
      <p>Weight: ${pokemonData.weight}</p>
      <p>Base experience: ${pokemonData.base_experience}</p>
    </div>
  `;

  document.body.appendChild(modal);

  // Handle the close button click event
  const closeButton = document.querySelector('.pokemon-modal-close');
  closeButton.onclick = () => {
    modal.remove();
  };

  // Handle clicking outside the modal content to close the modal
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.remove();
    }
  };
}
