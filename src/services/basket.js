// src/services/basket.js
export function getBasket() {
    return JSON.parse(localStorage.getItem("basket")) || [];
}

export function addToBasket(pokemon) {
    let basket = getBasket();
    const existingPokemon = basket.find((item) => item.name === pokemon.name);

    if (existingPokemon) {
        existingPokemon.quantity++;
    } else {
        basket.push({ ...pokemon, quantity: 1 });
    }

    localStorage.setItem("basket", JSON.stringify(basket));
}

export function clearBasket() {
    localStorage.removeItem("basket");
}

export function increaseQuantity(pokemon) {
    let basket = getBasket();
    const item = basket.find((p) => p.name === pokemon.name);

    if (item) {
        item.quantity++;
        localStorage.setItem("basket", JSON.stringify(basket));  // Mise à jour du localStorage
    }
}

export function decreaseQuantity(pokemon) {
    let basket = getBasket();
    const item = basket.find((p) => p.name === pokemon.name);

    if (item) {
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            basket = basket.filter((p) => p.name !== pokemon.name);
        }
        localStorage.setItem("basket", JSON.stringify(basket));  // Mise à jour du localStorage
    }
}
