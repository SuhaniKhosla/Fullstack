document.addEventListener("DOMContentLoaded", () => {
    const listItems = document.getElementById("list-items");
    const newItemInput = document.getElementById("new-item");
    const userInput = document.getElementById("user");
    const i = [];
    const users = {};
    const prices = {};

    loadStoredItems();

    function loadStoredItems() {
        const storedItems = JSON.parse(localStorage.getItem("groceryItems")) || [];

        storedItems.forEach(item => {
            i.push(item.name);
            users[item.name] = item.user.split(' ');
            prices[item.name] = item.price;
            const listItem = document.createElement("li");
            const u = users[item.name];
            if (item.price!=0) {
                listItem.innerHTML = `
                <div class="container-2" data-testid="container-2">
                    <div><b>${item.name}</b></div>
                    <div class="container-3" data-testid="${item.name}">
                        <div>${u.map(user => `<div>${user}</div>`).join('')}</div>
                        <button onclick="markItem(this)">Mark</button>
                    </div>
                </div>
                <div id="add-price">
                    <div>$ ${item.price}</div>
                </div>
            `;
            } else {
                listItem.innerHTML = `
                <div class="container-2" data-testid="container-2">
                    <div><b>${item.name}</b></div>
                    <div class="container-3" data-testid="${item.name}">
                        <div>${u.map(user => `<div>${user}</div>`).join('')}</div>
                        <button onclick="markItem(this)">Mark</button>
                    </div>
                </div>
                <div id="add-price"  data-item-id="${item.name}">
                    <input type="text" id="price" placeholder="Enter price">
                    <button onclick="addPrice(this)">Add Price</button>
                </div>
            `;
            }
            listItems.appendChild(listItem);
        });
    }

    function saveToLocalStorage() {
        const items = [];

        i.forEach(n => {
            const u = users[n].join(' ');
            const p = prices[n]
            items.push({ name: n, user: u, price: p });
        });

        localStorage.setItem("groceryItems", JSON.stringify(items));
    }

    function clearLocalStorage() {
        localStorage.clear();
        location.reload();
    }

    function addItem() {
        const newItemText = newItemInput.value.trim();
        const userName = userInput.value.trim();

        if (newItemText && userName) {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <div class="container-2" data-testid="container-2">
                    <div><b>${newItemText}</b></div>
                    <div class="container-3" data-testid="${newItemText}">
                        <div>${userName}</div>
                        <button onclick="markItem(this)">Mark</button>
                    </div>
                </div>
                <div id="add-price"  data-item-id="${newItemText}">
                    <input type="text" id="price" placeholder="Enter price">
                    <button onclick="addPrice(this)">Add Price</button>
                </div>
            `;
            listItems.appendChild(listItem);

            i.push(newItemText);
            users[newItemText] = [userName];
            prices[newItemText] = 0;

            // Clear input fields
            newItemInput.value = "";
            userInput.value = "";

            saveToLocalStorage();
        }
    }

    function addPrice(button) {
        const newPrice = parseFloat(document.getElementById("price").value.trim());

        if (!isNaN(newPrice) && newPrice > 0) {
            const listItem = button.parentNode;

            var itemContainer = button.closest('[data-item-id]');
            var itemId = itemContainer.getAttribute('data-item-id');
            
            listItem.innerHTML = `<div>$ ${newPrice}</div>`;

            prices[itemId] = newPrice;

            saveToLocalStorage();

            // Clear input fields
            newPrice.value = "";
        } else {
            alert("Price needs to be a number.");
        }
    }

    function markItem(button) {
        const listItem = button.parentNode;
        const markedUser = prompt("Enter your name to mark:");

        if (markedUser) {
            var itemContainer = button.closest('[data-testid]');
            var itemId = itemContainer.getAttribute('data-testid');

            users[itemId].push(markedUser);

            const u = users[itemId];

            listItem.innerHTML = `
                <div>${u.map(user => `<div>${user}</div>`).join('')}</div>
                <button onclick="markItem(this)">Mark</button>
            `;

            saveToLocalStorage();
        }
    }

    function calculate(button) {
        const listItem = button.parentNode;
        const buyer = prompt("Enter the name of the Buyer:");
        if (buyer) {
            listItem.innerHTML += `<div>Payment to ${buyer}: </div>`;

            const payment = {};

            i.forEach(n => {
                const p = prices[n]/users[n].length;
                users[n].forEach(u => {
                    if (!payment[u]) {
                        payment[u] = 0;
                    }
                    payment[u] += p;
                })
            });

            Object.entries(payment).forEach(([key, value]) => {
                listItem.innerHTML += `<div>Name: ${key}, Value: ${value}</div>`;
            });

        } 
    }

    window.addItem = addItem;
    window.addPrice = addPrice;
    window.markItem = markItem;
    window.calculate = calculate;
    window.clearLocalStorage = clearLocalStorage;
});
