const API_URL = "https://fakestoreapi.com";
let products = [];
let cart = [];
let user = null;

async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        products = await response.json();
        displayProducts();
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
    }
}

function displayProducts() {
const productsDiv = document.getElementById("products");
productsDiv.innerHTML = products
    .map(
    (product) => `
                <div class="product">
                    <img src="${product.image}" alt="${
        product.title
    }" style="max-width: 100px;">
                    <h3>${product.title}</h3>
                    <p>R$ ${product.price.toFixed(2)}</p>
                    <button onclick="addToCart(${
                    product.id
                    })">Adicionar ao Carrinho</button>
                </div>
            `
    )
    .join("");
}

// Funções do carrinho
function addToCart(productId) {
const product = products.find((p) => p.id === productId);
const existingItem = cart.find((item) => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
}

function removeFromCart(productId) {
cart = cart.filter((item) => item.id !== productId);
updateCart();
}

function updateCart() {
const cartItemsDiv = document.getElementById("cartItems");
const cartTotalDiv = document.getElementById("cartTotal");

cartItemsDiv.innerHTML = cart
    .map(
    (item) => `
                <div class="cart-item">
                    <span>${item.title} (x${item.quantity})</span>
                    <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
                    <button onclick="removeFromCart(${
                    item.id
                    })">Remover</button>
                </div>
            `
    )
    .join("");

const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
cartTotalDiv.innerHTML = `<strong>Total: R$ ${total.toFixed(2)}</strong>`;
}

async function login() {
const username = document.getElementById("username").value;
const password = document.getElementById("password").value;
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        user = { username, token: data.token };
        updateUserInfo();
    } catch (error) {
        console.error("Erro no login:", error);
        alert("Falha no login. Tente novamente.");
    }
}

function logout() {
    user = null;
    updateUserInfo();
}

function updateUserInfo() {
const userInfoDiv = document.getElementById("userInfo");
const loginFormDiv = document.getElementById("loginForm");
    if (user) {
        userInfoDiv.innerHTML = `
                        <p>Bem-vindo, ${user.username}!</p>
                        <button onclick="logout()">Logout</button>
                    `;
        loginFormDiv.style.display = "none";
    } else {
        userInfoDiv.innerHTML = "";
        loginFormDiv.style.display = "block";
    }
}

function checkout() {
    if (!user) {
        alert("Por favor, faça login para finalizar a compra.");
        return;
    }
    if (cart.length === 0) {
        alert("Seu carrinho está vazio.");
        return;
    }
    alert("Compra finalizada! Um e-mail de confirmação será enviado.");
    cart = [];
    updateCart();
}

fetchProducts();
updateUserInfo();
