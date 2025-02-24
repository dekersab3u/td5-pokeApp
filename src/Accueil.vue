<script>
import {onMounted, ref} from "vue";
import {getPokeDetails, getPokemonList} from "@/services/RequestClient";
import { addToBasket } from "@/services/basket";


export default {
  name: "Accueil",
  methods: {addToBasket},
  setup() {
    const pokemons = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const fetchPokemons = async () => {
      try {
        const data = await getPokemonList();
        pokemons.value = await Promise.all(
            data.results.map(async (poke) => {
              const details = await getPokeDetails(poke.url.replace(/^.*\/v2(?=\/)/, ''));
              return {
                name: poke.name,
                image: details.sprites.front_default,
                price: details.base_experience,
              };
            })
        );
      } catch (err) {
        error.value = "Impossible de charger les Pokémon.";
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchPokemons);

    return { pokemons, loading, error };
  },
};
</script>

<template>
  <div class="container">
    <h1>Liste des Pokémon</h1>
    <div v-if="loading">Chargement...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="pokemon-list">
      <div v-for="pokemon in pokemons" :key="pokemon.name" class="pokemon-card">
        <img :src="pokemon.image" :alt="pokemon.name" />
        <h2>{{ pokemon.name }}</h2>
        <p>Prix : {{ pokemon.price }} XP</p>
        <button class="add-basket" id="{{ pokemon.name }}" @click="addToBasket(pokemon)">Ajouter au panier</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
  padding: 2rem;
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
