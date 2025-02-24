// src/services/basket.js
export function getBasket() {
    return JSON.parse(localStorage.getItem("basket")) || [];
}

export function addToBasket(pokemon) {
    let basket = getBasket();
    basket.push(pokemon);
    localStorage.setItem("basket", JSON.stringify(basket));
}

export function clearBasket() {
    localStorage.removeItem("basket");
}

export function increaseQuantity(pokemon) {
    const item = basket.value.find((p) => p.name === pokemon.name);
    if (item) {
        item.quantity++;
        updateBasket();
    }
}

export function decreaseQuantity(pokemon) {
    const item = basket.value.find((p) => p.name === pokemon.name);
    if (item && item.quantity > 1) {
        item.quantity--;
        updateBasket();
    } else if (item && item.quantity === 1) {
        basket.value = basket.value.filter((p) => p.name !== pokemon.name);
        updateBasket();
    }
}

export function updateBasket() {
    localStorage.setItem("panier", JSON.stringify(basket.value));
}
