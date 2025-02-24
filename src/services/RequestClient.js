const BASE_URL = 'https://pokeapi.co/api/v2';

async function request(endpoint, method='GET', body=null, isAuthRequest=false)  {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(isAuthRequest && token && { Authorization: `Bearer ${token}`
        }),
    };

    // Configurer la requête
    const config = {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) }),
    };

    try {
        // Envoyer la requête
        const response = await fetch(`${BASE_URL}${endpoint}`, config);

        if (response.status === 403 || response.status === 401) {
            // Token expired or invalid, remove token and redirect to login
            removeToken();
            window.location.href = '/login';
            return;
        }


        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.message || 'Something went wrong');
        }


        const contentType = response.headers.get('content-type');
        return contentType && contentType.includes('application/json')
            ? await response.json()
            : null;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

async function getPokemonList() {
    return request('/pokemon/?limit=25');
}

async function searchPokemon(name) {
    return request('/pokemon/${name}');
}

async function getPokeDetails(pokeName) {
    return request(pokeName);
}

const login = (username, password) => {
    return request('/login', 'POST', { username, password }, true);
};

const register = (username, password) => {
    return request('/register', 'POST', { username, password }, true);
};

export { request, login, register, getPokemonList, searchPokemon, getPokeDetails };