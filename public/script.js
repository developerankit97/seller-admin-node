let inputOrderId = document.querySelector('#product-id');
let price = document.querySelector('#price');
let itemName = document.querySelector('#itemName');
let category = document.querySelector('#category');
let addBtn = document.querySelector('button[type="submit"]');
let productList = document.querySelectorAll('.product-list');
let electronics = document.querySelector('.electronics');
let food = document.querySelector('.food');
let skincare = document.querySelector('.skincare');
let electronicsAmount = document.querySelector('.electronics-amount');
let foodAmount = document.querySelector('.food-amount');
let skincareAmount = document.querySelector('.skincare-amount');

// Event Handlers
window.addEventListener('DOMContentLoaded', getOrders);
addBtn.addEventListener('click', addOrder);
for (let i = 0; i < productList.length; i++) {
    productList[i].addEventListener('click', updateOrder);
    productList[i].addEventListener('click', deleteOrder);
}

let isUpdating = false;

let generateHtml = (id, price, itemName, category) => {
    output = `<li class="list-group-item d-flex justify-content-between align-items-center" id="${id}">
                <div>${price} Rs - ${itemName}</div>
                <div>
                    <button type="button" id="${id}" class="btn btn-outline-success btn-sm edit">Edit</button>
                    <button type="button" id="${id}" class="btn btn-outline-danger btn-sm delete">Delete</button>
                </div>
            </li>`
    if (category == 'Electronics') {
        electronics.innerHTML += output;
        electronicsAmount.textContent = parseInt(electronicsAmount.textContent.trim()) + price;
    } else if (category == 'Food') {
        food.innerHTML += output;
        foodAmount.textContent = parseInt(foodAmount.textContent.trim()) + price;
    } else {
        skincare.innerHTML += output;
        skincareAmount.textContent = parseInt(skincareAmount.textContent.trim()) + price;
    }
}

function setInputValues(i = '', p = '', d = '', t = '') {
    inputOrderId.value = i;
    price.value = p;
    itemName.value = d;
    category.value = t;
}

async function getOrders() {
    try {
        let response = await axios.get('http://localhost:3000/products');
        response.data.forEach(order => {
            generateHtml(order.id, order.price, order.itemName, order.category);
        })
    } catch (err) {
        console.log(err);
    }
}

async function addOrder(e) {
    e.preventDefault();
    if (price && itemName && category) {
        let productObj = {
            "price": price.value,
            "itemName": itemName.value,
            "category": category.value
        }
        if (isUpdating) {
            try {
                let response = await axios.put(`http://localhost:3000/products/${inputOrderId.value}`, productObj);
                setInputValues();
                window.location.reload();
            } catch (e) {
                console.log(e);
            }
        } else {
            try {
                let response = await axios.post('http://localhost:3000/products', productObj);
                generateHtml(response.data.id, response.data.price, response.data.itemName, response.data.category);
                setInputValues();
            } catch (err) {
                console.log(err);
            }
        }
    }
}

async function updateOrder(e) {
    if (e.target.classList.contains('edit')) {
        const id = e.target.getAttribute('id');
        try {
            let response = await axios.get(`http://localhost:3000/products/${id}`);
            setInputValues(response.data.id, response.data.price, response.data.itemName, response.data.category);
            isUpdating = true;
        } catch (err) {
            console.log(err);
        }
    }
}

async function deleteOrder(e) {
    if (e.target.classList.contains('delete')) {
        const id = e.target.getAttribute('id');
        try {
            let response = await axios.delete(`http://localhost:3000/products/${id}`);
            e.target.parentElement.parentElement.remove();
        } catch (err) {
            console.log(err);
        }
    }
}