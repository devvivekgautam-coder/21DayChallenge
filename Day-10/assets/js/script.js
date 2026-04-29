const products = [
    {
        name: "Gaming Laptop",
        category: "electronics",
        price: 74999,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwm6NpmymvC53VCjIetr6SeWXJsWaay1WKlg&s"
    },
    {
        name: "Noise Cancelling Headphones",
        category: "electronics",
        price: 3499,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx7jFn5taequwsIz1sjmbCOMYiwIiVliQR3w&s"
    },
    {
        name: "Classic Cotton T-Shirt",
        category: "clothing",
        price: 899,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYF1bk7GtsW-MEDsU9-fM9ZuiC9J1WuJBfgn5LxMy4Zw&s"
    },
    {
        name: "Slim Fit Jeans",
        category: "clothing",
        price: 2499,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrpAh0aYta5PJ0RnnWG-VfmlZGnf17NNV4Dg&s"
    },
    {
        name: "Smartwatch Pro",
        category: "electronics",
        price: 12999,
        image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQcn5b4eylWZb5bnVCuGOuLyRKlrgTy5isqG9p_yMpEj_bB3wJVXOObwJCmRZumtJCXzSnU9zkaMpK61xnK8Z22P8xVjPlJxK3y3FiZJrq-piTa0sryzsvTUNV8_rIg9xB3RqZHdJI&usqp=CAc"
    },
    {
        name: "Denim Jacket",
        category: "clothing",
        price: 3999,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUu1k3orMCA_xWW7-B02NofBUoE0325yD3hQ&s"
    },
    {
        name: "4K Action Camera",
        category: "electronics",
        price: 18999,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSClH1msxEP1X98AgUhz5CVy1KRosvrdEibRw&s"
    },
    {
        name: "Running Sneakers",
        category: "clothing",
        price: 3299,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwM9P2E9iv04LgiluJcXrR-7nwH-gIJg4ljQ&s"
    }
];

const productContainer = document.getElementById("productList");
const searchInput = document.getElementById("searchInput");
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");
const sortSelect = document.getElementById("sortPrice");
const categoryBtns = document.querySelectorAll(".cat-btn");

let activeCategory = "all";

function displayProducts(items) {
    productContainer.innerHTML = "";
    if (!items.length) {
        const emptyDiv = document.createElement("div");
        emptyDiv.className = "empty-state";
        emptyDiv.innerHTML = "No products match your filters.<br> Try adjusting price or search keyword!";
        productContainer.appendChild(emptyDiv);
        return;
    }

    items.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("card");

        let categoryIcon = product.category === "electronics" ? "📱" : "👕";
        let displayCategory = product.category === "electronics" ? "Electronics" : "Clothing";

        card.innerHTML = `
                <img class="card-img" src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://picsum.photos/id/13/300/200'">
                <div class="card-content">
                    <h3>${product.name} <span class="price">₹${product.price.toLocaleString('en-IN')}</span></h3>
                    <div class="category-badge">${categoryIcon} ${displayCategory}</div>
                </div>
            `;
        productContainer.appendChild(card);
    });
}

function getFilteredAndSortedProducts() {
    let filtered = [...products];

    if (activeCategory !== "all") {
        filtered = filtered.filter(p => p.category === activeCategory);
    }

    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm !== "") {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
    }

    const minPriceRaw = minPriceInput.value;
    const maxPriceRaw = maxPriceInput.value;

    const minPriceNum = minPriceRaw !== "" ? parseFloat(minPriceRaw) : null;
    const maxPriceNum = maxPriceRaw !== "" ? parseFloat(maxPriceRaw) : null;

    if (minPriceNum !== null && !isNaN(minPriceNum)) {
        filtered = filtered.filter(p => p.price >= minPriceNum);
    }
    if (maxPriceNum !== null && !isNaN(maxPriceNum)) {
        filtered = filtered.filter(p => p.price <= maxPriceNum);
    }

    const sortValue = sortSelect.value;
    if (sortValue === "low") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortValue === "high") {
        filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
}

function refreshProductDisplay() {
    const finalProducts = getFilteredAndSortedProducts();
    displayProducts(finalProducts);
}

function setActiveCategory(category) {
    activeCategory = category;

    categoryBtns.forEach(btn => {
        const btnCat = btn.getAttribute("data-category");
        if (btnCat === category) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
    refreshProductDisplay();
}

function bindEvents() {

    searchInput.addEventListener("input", () => refreshProductDisplay());

    minPriceInput.addEventListener("input", () => refreshProductDisplay());

    maxPriceInput.addEventListener("input", () => refreshProductDisplay());

    sortSelect.addEventListener("change", () => refreshProductDisplay());

    categoryBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const chosenCategory = btn.getAttribute("data-category");
            setActiveCategory(chosenCategory);
        });
    });
}

function init() {
    bindEvents();

    setActiveCategory("all");

    refreshProductDisplay();
}

window.filterProducts = function (category) {
    if (category === "all") setActiveCategory("all");
    else if (category === "electronics") setActiveCategory("electronics");
    else if (category === "clothing") setActiveCategory("clothing");
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}