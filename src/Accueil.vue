<script>
import { onMounted, ref } from "vue";
import { getPokeDetails, getPokemonList, searchPokemon } from "@/services/RequestClient";
import { addToBasket } from "@/services/basket";

export default {
  name: "Accueil",
  methods: { addToBasket },
  setup() {
    const pokemons = ref([]);
    const initialPokemons = ref([]); // Stocker la liste de départ
    const searchTerm = ref("");
    const searchResult = ref(null); // Stocke le résultat de la recherche
    const errorMessage = ref(""); // Message d'erreur si aucun Pokémon trouvé
    const loading = ref(true);
    const error = ref(null);

    // Charger les 25 premiers Pokémon
    const fetchPokemons = async () => {
      try {
        const data = await getPokemonList();
        const pokemonData = await Promise.all(
            data.results.map(async (poke) => {
              const details = await getPokeDetails(poke.url.replace(/^.*\/v2(?=\/)/, ""));
              return {
                name: poke.name,
                image: details.sprites.front_default,
                price: details.base_experience,
              };
            })
        );
        pokemons.value = pokemonData;
        initialPokemons.value = [...pokemonData]; // Sauvegarde des 25 premiers
      } catch (err) {
        error.value = "Impossible de charger les Pokémon.";
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    // Recherche d'un Pokémon
    const handleSearch = async () => {
      if (!searchTerm.value.trim()) {
        errorMessage.value = "";
        searchResult.value = null;
        return;
      }

      try {
        const result = await searchPokemon(searchTerm.value.toLowerCase());
        if (result) {
          searchResult.value = [
            {
              name: result.name,
              image: result.sprites.front_default,
              price: result.base_experience,
            },
          ];
          errorMessage.value = "";
        } else {
          searchResult.value = null;
          errorMessage.value = "Aucun Pokémon trouvé.";
        }
      } catch {
        searchResult.value = null;
        errorMessage.value = "Aucun Pokémon trouvé.";
      }
    };

    onMounted(fetchPokemons);

    return {pokemons, initialPokemons, searchTerm, searchResult, errorMessage, handleSearch, loading, error};
  },
};
</script>

<template>
  <div class="container">
    <h1>Liste des Pokémon</h1>

    <div class="search-bar">
      <input v-model="searchTerm"
             type="text"
             placeholder="Rechercher un Pokémon..."/>
      <button @click="handleSearch">Rechercher</button>
    </div>

    <div v-if="loading">Chargement...</div>
    <div v-else-if="error"
         class="error">{{ error }}
    </div>

    <!-- Affichage du message d'erreur si aucun Pokémon n'est trouvé -->
    <div v-if="errorMessage"
         class="error-message">{{ errorMessage }}
    </div>

    <div class="pokemon-list">
      <!-- Si une recherche a été effectuée et a réussi, afficher le Pokémon trouvé -->
      <div v-if="searchResult"
           v-for="pokemon in searchResult"
           :key="pokemon.name"
           class="pokemon-card">
        <img :src="pokemon.image"
             :alt="pokemon.name"/>
        <h2><router-link :to="'/pokemon/' + pokemon.name">{{ pokemon.name }}</router-link></h2>
        <p>Prix : {{ pokemon.price }} XP</p>
        <button @click="addToBasket(pokemon)">Ajouter au panier</button>
      </div>

      <!-- Si aucune recherche n'a été effectuée OU si la recherche a échoué, afficher les 25 Pokémon de départ -->
      <div v-if="!searchResult"
           v-for="pokemon in initialPokemons"
           :key="pokemon.name"
           class="pokemon-card">
        <img :src="pokemon.image"
             :alt="pokemon.name"/>
        <h2><router-link :to="'/pokemon/' + pokemon.name">{{ pokemon.name }}</router-link></h2>
        <p>Prix : {{ pokemon.price }} XP</p>
        <button @click="addToBasket(pokemon)">Ajouter au panier</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
  padding: 2rem;
}

.search-bar {
  margin-bottom: 1rem;
}

.search-bar input {
  padding: 0.5rem;
  font-size: 1rem;
  width: 250px;
  margin-right: 0.5rem;
}

.search-bar button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.search-bar button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.pokemon-list {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}

.pokemon-card {
  border: 0.1em solid #ddd;
  padding: 1rem;
  border-radius: 1rem;
  background: #f9f9f9;
  width: 30vw;
  max-width: 15rem;
  text-align: center;
}

.pokemon-card img {
  width: 50%;
  max-width: 5rem;
  height: auto;
}

.error {
  color: red;
  font-size: 1.2rem;
}
</style>
