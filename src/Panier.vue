<script>
import { ref, computed, onMounted } from "vue";
import { getBasket, clearBasket, decreaseQuantity, increaseQuantity, updateBasket } from "@/services/basket";

export default {
  name: "Panier",
  methods: {increaseQuantity, decreaseQuantity},
  setup() {
    const basket = ref([]);

    // Charger les données du panier au montage
    onMounted(() => {
      const storedBasket = getBasket();
      const groupedBasket = storedBasket.reduce((acc, pokemon) => {
        const existingPokemon = acc.find((item) => item.name === pokemon.name);
        if (existingPokemon) {
          existingPokemon.quantity += 1;
        } else {
          acc.push({ ...pokemon, quantity: 1 });
        }
        return acc;
      }, []);
      basket.value = groupedBasket;
    });

    const totalPrice = computed(() =>
        basket.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
    );

    // Vider le panier
    const emptyBasket = () => {
      clearBasket();
      basket.value = [];
    };

    return { basket, totalPrice, emptyBasket };
  },
};
</script>

<template>
  <div class="container">
    <h1>Mon Panier</h1>
    <div v-if="basket.length === 0">Le panier est vide.</div>
    <table v-else>
      <thead>
      <tr>
        <th>Image</th>
        <th>Nom</th>
        <th>Prix (XP)</th>
        <th>Quantité</th>
        <th>Total (XP)</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(pokemon, index) in basket" :key="index">
        <td><img :src="pokemon.image" :alt="pokemon.name" width="50" /></td>
        <td>{{ pokemon.name }}</td>
        <td>{{ pokemon.price }}</td>
        <td>
          <button @click="decreaseQuantity(pokemon)">-</button>
          {{ pokemon.quantity }}
          <button @click="increaseQuantity(pokemon)">+</button>
        </td>
        <td>{{ pokemon.price * pokemon.quantity }}</td>
      </tr>
      </tbody>
    </table>

    <p><strong>Total du panier : {{ totalPrice }} XP</strong></p>

    <button v-if="basket.length > 0" @click="emptyBasket">Vider le panier</button>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
  padding: 2rem;
}

table {
  width: 100%;
  max-width: 600px;
  margin: auto;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 0.8rem;
  text-align: center;
}

th {
  background-color: #f5f5f5;
}

button {
  margin-top: 1rem;
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  background-color: red;
  color: white;
  border: none;
  border-radius: 0.5rem;
}

button:hover {
  background-color: darkred;
}
</style>
