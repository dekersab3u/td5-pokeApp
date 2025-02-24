<script setup>
//import HelloWorld from './components/HelloWorld.vue'
//import TheWelcome from './components/TheWelcome.vue'
import Accueil from "@/Accueil.vue";
</script>

<template>
  <!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Boutique Pokémon</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

</head>
<body>
  <header>
    <h1>Boutique Pokémon</h1>
    <nav>
      <ul>
        <li><router-link to="/">Accueil</router-link></li>
        <li><router-link to="/panier">Panier</router-link></li>
      </ul>
    </nav>
  </header>

  <main>
    <router-view></router-view>
  </main>

  <footer>
    <p>&copy; Boutique Pokémon</p>
  </footer>
</body>
</html>
</template>

<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  color:black;
}
</style>
