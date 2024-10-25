document.addEventListener("DOMContentLoaded", () => {
    const apiURL = 'https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889'; // Replace with actual API endpoint URL
    
    // Selectors for updating DOM
    const cartItemsContainer = document.querySelector(".cart-products tbody");
    const subtotalElement = document.querySelector(".cart-totals ul li:first-child span:nth-child(2)");
    const totalElement = document.querySelector(".cart-totals ul li:last-child .total-price");
    const checkoutButton = document.querySelector(".checkout-btn");

    let cartData = {};  // to store fetched cart data

    // Function to fetch cart data
    async function fetchCartData() {
        try {
        const response = await fetch(apiURL);
        if (response.ok) {
            cartData = await response.json();
            displayCartItems(cartData.items);
            updateCartTotals(cartData.original_total_price);
        } else {
            console.error("Failed to fetch cart data");
        }
        } catch (error) {
        console.error("Error fetching cart data:", error);
        }
    }

    // Function to display cart items
    function displayCartItems(items) {
      cartItemsContainer.innerHTML = "";  // Clear current items

        items.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><div class="product-image"><img src="${item.featured_image.url}" alt="${item.title}"></div></td>
            <td><span style="color:grey;">${item.title}</span></td>
            <td style="color:grey;">₹${(item.presentment_price).toLocaleString("en-IN")}</td>
            <td><input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="quantity-input"></td>
            <td>₹<span class="item-subtotal">${(item.line_price / 100).toLocaleString("en-IN")}</span></td>
            <td><span class="delete-icon" data-id="${item.id}"><i class="fas fa-trash-alt"></i></span></td>
        `;
        cartItemsContainer.appendChild(row);
        });

      // Add event listeners to quantity inputs and delete icons
        document.querySelectorAll(".quantity-input").forEach(input => {
        input.addEventListener("input", handleQuantityChange);
        });
        document.querySelectorAll(".delete-icon").forEach(icon => {
        icon.addEventListener("click", handleDeleteItem);
        });
    }

    // Function to handle quantity change
    function handleQuantityChange(event) {
        const itemId = event.target.getAttribute("data-id");
        const newQuantity = parseInt(event.target.value);

        const item = cartData.items.find(item => item.id == itemId);
        if (item) {
        item.quantity = newQuantity;
        item.line_price = item.presentment_price * newQuantity;
        displayCartItems(cartData.items);
        updateCartTotals(cartData.items.reduce((total, item) => total + item.line_price, 0) / 100);
        }
    }

    // Function to handle delete item
    function handleDeleteItem(event) {
        const itemId = event.target.closest(".delete-icon").getAttribute("data-id");

        cartData.items = cartData.items.filter(item => item.id != itemId);
        displayCartItems(cartData.items);
        updateCartTotals(cartData.items.reduce((total, item) => total + item.line_price, 0) / 100);
    }

    // Function to update cart totals
    function updateCartTotals(total) {
        subtotalElement.innerText = `₹${total.toLocaleString("en-IN")}`;
        totalElement.innerText = `₹${total.toLocaleString("en-IN")}`;
    }

    // Handle checkout button
    checkoutButton.addEventListener("click", () => {
        alert("Proceeding to checkout!");
      // Further checkout functionality can be implemented here
    });

    // Fetch and display cart data on load
    fetchCartData();
    });
