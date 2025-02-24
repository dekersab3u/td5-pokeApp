<script>
import { ref, computed, onMounted } from "vue";
import { getBasket, clearBasket, increaseQuantity, decreaseQuantity } from "@/services/basket";

export default {
  name: "Panier",
  setup() {
    const basket = ref([]);

    // Charger les données du panier
    const loadBasket = () => {
      basket.value = getBasket(); // On récupère la version actualisée du panier
    };

    onMounted(loadBasket);

    const totalPrice = computed(() =>
        basket.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
    );

    return { basket, totalPrice, increaseQuantity, decreaseQuantity, clearBasket, loadBasket };
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
          <button @click="decreaseQuantity(pokemon); loadBasket()">➖</button>
          {{ pokemon.quantity }}
          <button @click="increaseQuantity(pokemon); loadBasket()">➕</button>
        </td>
        <td>{{ pokemon.price * pokemon.quantity }}</td>
      </tr>
      </tbody>
    </table>

    <p><strong>Total du panier : {{ totalPrice }} XP</strong></p>

    <button v-if="basket.length > 0" @click="clearBasket(); loadBasket()">Vider le panier</button>
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
  margin: 0 0.5rem;
  padding: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  border-radius: 0.5rem;
}

button:hover {
  opacity: 0.8;
}

button:nth-child(1) {
  background-color: #ff4d4d;
  color: white;
}

button:nth-child(3) {
  background-color: #4caf50;
  color: white;
}

button:last-of-type {
  margin-top: 1rem;
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  background-color: red;
  color: white;
}

button:last-of-type:hover {
  background-color: darkred;
}
</style>
