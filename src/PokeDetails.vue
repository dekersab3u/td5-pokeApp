<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getPokeDetails } from "@/services/RequestClient";

export default {
  name: "PokeDetails",
  setup() {
    const route = useRoute();
    const pokemon = ref(null);
    const error = ref(null);
    const loading = ref(true);

    const fetchDetails = async () => {
      try {
        const details = await getPokeDetails(`/pokemon/${route.params.name}`);
        pokemon.value = {
          name: details.name,
          image: details.sprites.other["official-artwork"].front_default,
          stats: details.stats.map((stat) => ({
            name: stat.stat.name,
            value: stat.base_stat,
          })),
          types: details.types.map((t) => t.type.name),
          height: details.height,
          weight: details.weight,
          abilities: details.abilities.map((a) => a.ability.name),
          base_experience: details.base_experience,
        };
      } catch (err) {
        error.value = "Impossible de charger les détails du Pokémon.";
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchDetails);
    return { pokemon, loading, error };
  },
};
</script>

<template>
  <div class="container" v-if="loading">Chargement...</div>
  <div class="container" v-else-if="error">{{ error }}</div>
  <div v-else class="pokemon-details">
    <h1>{{ pokemon.name }}</h1>
    <img :src="pokemon.image" :alt="pokemon.name" class="pokemon-image" />
    <p><strong>Types :</strong> {{ pokemon.types.join(", ") }}</p>
    <p><strong>Taille :</strong> {{ pokemon.height / 10 }} m</p>
    <p><strong>Poids :</strong> {{ pokemon.weight / 10 }} kg</p>
    <p><strong>Expérience de base :</strong> {{ pokemon.base_experience }}</p>
    <p><strong>Capacités :</strong> {{ pokemon.abilities.join(", ") }}</p>
    <h2>Statistiques</h2>
    <ul>
      <li v-for="stat in pokemon.stats" :key="stat.name">
        {{ stat.name }} : {{ stat.value }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
  padding: 2rem;
}
.pokemon-details {
  text-align: center;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #f9f9f9;
  max-width: 600px;
  margin: auto;
}
.pokemon-image {
  width: 200px;
  height: auto;
}
</style>
