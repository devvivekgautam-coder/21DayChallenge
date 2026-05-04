const products = [
    {
        name: "Shoes",
        price: 999,
        img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR22JDuZ4Ns1qeh9yU2p2E7S1uoYEebQRBzz70qNvv61RGeRS9bu87U0tTSeJrsc4-beLWMvkN4u3DOdTDfKqJJu-lIL8Pfiyjb2TRtVMue4f7O8szMpApJHjkK"
    },

    {
        name: "Watch",
        price: 1499,
        img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRCgg107Pw-yMrMOv7cPeLCnD0NAkEKa7w4iD6hnvxFW6yQ5dMwNo4bxykZbVoaUreD5xmOjF_E0E3GLwefaiMhn8ohcEicCzwldFbfwIlW"
    },

    {
        name: "Headphones",
        price: 1999,
        img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQgQRnX8rsMsAeRfelOFB0kooMvWUI3FsF8l_J8TCXZ8wO3in0z3ElWU_bWrFJAzIn75E9jBp5-C6nXyI4-jO7lPDMyhxNCgwtVMYl-fpVCS0UJzvfraww"
    },

    {
        name: "Bag",
        price: 799,
        img: "https://m.media-amazon.com/images/I/614x1vo4w8L.jpg"
    },

    {
        name: "Water Bottle",
        price: "199",
        img: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRRfaYv-2OBvUs_wW83MeLQcEOUBJKJhJAyb9CURcOYA6Jk7UAJY_yWBfMPuOH-5-9Xv9c5ZyRZRvscP_Fpxn7jTns1OVwC"
    },

    {
        name: "Laptop",
        price: "67,499",
        img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTB2zKhjedVN3SE_C2aeJzLbLUPh1Y5biOp0K9zesBBPHNMIxstuWtWn7izl9Qqg51fgo7xg03DIr5m93TXv-DaYUSW2TUoEdHc9v7l0j_800rhMs1flRbY"
    }
];

let cart = [];

function renderProducts() {
    const container = document.getElementById("productList");

    products.forEach((p, index) => {
        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <img src="${p.img}">
            <h3>${p.name}</h3>
            <p class="price">₹${p.price}</p>
            <button onclick="addToCart(${index})">Add to Cart</button>
        `;

        container.appendChild(div);
    });
}

function addToCart(index) {
    cart.push(products[index]);
    document.getElementById("cartCount").innerText = cart.length;
}

renderProducts();