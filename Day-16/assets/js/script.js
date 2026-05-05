const products = [
    {
        id: 1,
        name: "Shoes",
        price: 999,
        img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
    },
    {
        id: 2,
        name: "Watch",
        price: 1499,
        img: "https://images.unsplash.com/photo-1519741497674-611481863552"
    },
    {
        id: 3,
        name: "Bag",
        price: 799,
        img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3"
    },
    {
        id: 4,
        name: "Headphones",
        price: 1999,
        img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQAoRFqnVqxr65Y5v_-GaU2WocxLS45K3esU-3VAUBIaXJJpLw_sA_7z3So-Yv6JktxJ0FZB-8G0103B9rzU7WnmyG4JDO1T9TAcj4FNDwXlHhzWAPmzwGFrw"
    }
];

let cart = [];

function renderProducts() {
    const container = document.getElementById("productList");

    products.forEach(p => {
        container.innerHTML += `
            <div class="card">
                <img src="${p.img}">
                <h3>${p.name}</h3>
                <p class="price">₹${p.price}</p>
                <button onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        `;
    });
}

function addToCart(id) {
    const item = cart.find(p => p.id === id);

    if (item) {
        item.qty++;
    } else {
        const product = products.find(p => p.id === id);
        cart.push({ ...product, qty: 1 });
    }

    updateCart();
}

function updateCart() {
    const cartDiv = document.getElementById("cartItems");
    const totalDiv = document.getElementById("total");
    const count = document.getElementById("count");

    cartDiv.innerHTML = "";
    let total = 0;
    let totalItems = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
        totalItems += item.qty;

        cartDiv.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}">

            <div class="cart-info">
                <h4>${item.name}</h4>
                <p>₹${item.price}</p>

            <div class="qty-box">
                <button class="qty-btn" onclick="changeQty(${item.id}, -1)" ${item.qty === 1 ? "disabled" : ""}>-</button>
                ${item.qty}
                <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>

        <span class="remove" onclick="removeItem(${item.id})">❌</span>
    </div>
    `;
    });

    totalDiv.innerText = "Total: ₹" + total;
    count.innerText = totalItems;
}

function changeQty(id, change) {
    const item = cart.find(p => p.id === id);

    if (item.qty === 1 && change === -1) return;

    item.qty += change;
    updateCart();
}

function removeItem(id) {
    cart = cart.filter(p => p.id !== id);
    updateCart();
}

function openCart() {
    document.getElementById("cartSidebar").classList.add("active");
    document.getElementById("overlay").classList.add("active");
}

function closeCart() {
    document.getElementById("cartSidebar").classList.remove("active");
    document.getElementById("overlay").classList.remove("active");
}

renderProducts();