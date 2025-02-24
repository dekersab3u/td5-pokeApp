<script>
import {onMounted, ref} from "vue";
import {getPokeDetails, getPokemonList, searchPokemon} from "@/services/RequestClient";
import {addToBasket} from "@/services/basket";

export default {
  name: "Accueil",
  methods: {addToBasket},
  setup() {
    const pokemons = ref([]); // Liste des Pokémon affichés
    const allPokemons = ref([]); // Liste des 25 Pokémon initiaux
    const searchQuery = ref(""); // Input de la barre de recherche
    const loading = ref(true);
    const error = ref(null);

    // Récupérer la liste des 25 premiers Pokémon au chargement
    const fetchPokemons = async () => {
      try {
        const data = await getPokemonList();
        const details = await Promise.all(
            data.results.map(async (poke) => {
              const info = await getPokeDetails(poke.url.replace(/^.*\/v2(?=\/)/, ""));
              return {
                name: poke.name,
                image: info.sprites.front_default,
                price: info.base_experience,
              };
            })
        );
        pokemons.value = details;
        allPokemons.value = details;
      } catch (err) {
        error.value = "Impossible de charger les Pokémon.";
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    // Recherche un Pokémon spécifique dans l'API
    const handleSearch = async () => {
      const query = searchQuery.value.trim().toLowerCase();
      if (query === "") {
        pokemons.value = allPokemons.value; // Si recherche vide, on remet la liste initiale
        return;
      }

      try {
        loading.value = true;
        const result = await searchPokemon(query);
        pokemons.value = [
          {
            name: result.name,
            image: result.sprites.front_default,
            price: result.base_experience,
          },
        ];
        error.value = null;
      } catch (err) {
        error.value = "Aucun Pokémon trouvé.";
        pokemons.value = [];
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchPokemons);

    return {pokemons, loading, error, searchQuery, handleSearch};
  },
};
</script>

<template>
  <div class="container">
    <h1>Liste des Pokémon</h1>

    <!-- Barre de recherche -->
    <input
        v-model="searchQuery"
        @input="handleSearch"
        placeholder="Rechercher un Pokémon..."
        class="search-bar"
    />

    <div v-if="loading">Chargement...</div>
    <div v-else-if="error"
         class="error">{{ error }}
    </div>
    <div v-else
         class="pokemon-list">
      <div v-for="pokemon in pokemons"
           :key="pokemon.name"
           class="pokemon-card">
        <img :src="pokemon.image"
             :alt="pokemon.name"/>
        <h2>{{ pokemon.name }}</h2>
        <p>Prix : {{ pokemon.price }} XP</p>
        <button class="add-basket"
                @click="addToBasket(pokemon)">Ajouter au panier
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
  padding: 2rem;
}

/* Barre de recherche */
.search-bar {
  width: 50%;
  padding: 0.5rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
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
