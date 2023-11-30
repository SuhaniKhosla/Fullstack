document.addEventListener("DOMContentLoaded", () => {
    const listItems = document.getElementById("list-items");
    const newItemInput = document.getElementById("new-item");
    const userInput = document.getElementById("user");

    loadStoredItems();

    function loadStoredItems() {
        const storedItems = JSON.parse(localStorage.getItem("groceryItems")) || [];

        storedItems.forEach(item => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <div class="container-2" data-testid="container-2">
                    <div><b>${item.name}</b></div>
                    <div class="container-3" data-testid="container-3">
                        <div>${item.user}</div>
                        <button onclick="markItem(this)">Mark</button>
                    </div>
                </div>
                <div id="add-price">
                    <input type="text" id="price" placeholder="Enter price">
                    <button onclick="addPrice(this)">Add Price</button>
                </div>
            `;
            if (item.price!=0) {
                addPrice(this);
            }
            listItems.appendChild(listItem);
        });
    }

    function saveToLocalStorage() {
        const items = [];

        listItems.childNodes.forEach(item => {
            const itemName = item.childNodes[0].textContent;
            const userName = item.childNodes[1].textContent;
            const price = item.childNodes[2].textContent.replace(/\D/g, ""); // Extract numeric price

            items.push({ name: itemName, user: userName, price: price });
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
                    <div class="container-3" data-testid="container-3">
                        <div>${userName}</div>
                        <button onclick="markItem(this)">Mark</button>
                    </div>
                </div>
                <div id="add-price">
                    <input type="text" id="price" placeholder="Enter price">
                    <button onclick="addPrice(this)">Add Price</button>
                </div>
            `;
            listItems.appendChild(listItem);

            saveToLocalStorage();

            // Clear input fields
            newItemInput.value = "";
            userInput.value = "";
        }
    }

    function addPrice(button) {
        const newPrice = document.getElementById("price").value.trim();

        if (newPrice && newPrice/1 == newPrice) {
            const listItem = button.parentNode;
            listItem.innerHTML = `<div>$ ${newPrice}</div>`;

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
            listItem.innerHTML = `<div>${markedUser}</div>` + listItem.innerHTML;
        }
    }

    window.addItem = addItem;
    window.addPrice = addPrice;
    window.markItem = markItem;
    window.clearLocalStorage = clearLocalStorage;
});
