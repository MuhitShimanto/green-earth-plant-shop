// Plant Card Section==========================================================================================

const categoryContainer = document.getElementById("category-container");
const plantContainer = document.getElementById("plant-card-container");
const cartItemContainer = document.getElementById("cart-item-container");
let allCatId = [];

// Plant Cards Fetch & Load by Category
function fetchPlants(categoryId) {
  if (categoryId != 0) {
    fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`)
      .then((res) => res.json())
      .then((singleCatData) => {
        loadPlants(singleCatData);
      });
  } else {
    getAllCategoryId().then((ids) => {
      for (let id of allCatId) {
        fetchPlants(id);
      }
    });
  }
}

function loadPlants(categoryData) {
  plantContainer.innerHTML = "";
  for (plant of categoryData.plants) {
    fetch(`https://openapi.programming-hero.com/api/plant/${plant.id}`)
      .then((res) => res.json())
      .then((data) => {
        const plantInfo = data.plants;
        const newCard = document.createElement("div");
        newCard.innerHTML = `
        <div class="card bg-base-100 shadow-md p-3 space-y-5 w-full">
                <figure class="rounded-lg h-[187px]">
                  <img class="object-cover"
                    src="${plantInfo.image}"
                    alt="${plantInfo.name}"
                  />
                </figure>
                <div class="body space-y-2">
                  <button class="card-title inter font-semibold text-[14px] text-[#1F2937]" onclick="loadDetails(${plantInfo.id})">${plantInfo.name}</button>
                  <p class="inter font-light text-[12px] text-[#1F2937] h-[110px]">${plantInfo.description}</p>
                  <div class="price-div flex justify-between">
                    <div class="badge badge-outline geist font-medium text-[14px] text-[#15803D] bg-[#DCFCE7]">${plantInfo.category}</div>
                    <div class="inter font-semibold text-[14px]">৳ <span class="price">${plantInfo.price}</span></div>
                  </div>
                  <div class="add-cart btn w-full mt-2 inter font-medium text-[16px] bg-[#15803D] hover:bg-[#126b32] rounded-4xl text-white py-6">Add to Cart</div>
                </div>
        </div>
    `;
        plantContainer.append(newCard);
      });
  }
}
// Load Details
function loadDetails(plantId) {
  fetch(`https://openapi.programming-hero.com/api/plant/${plantId}`).then(res=>res.json()).then(data=>{
    showDetails(data.plants);
  })
}
function showDetails(plantObj) {
  console.log(plantObj)
  const detailsContainer = document.getElementById('details-container');
  detailsContainer.innerHTML = `
  <h2 class="inter font-bold text-[20px]">${plantObj.name}</h2>
  <img class="rounded-xl h-[350px] w-full object-cover" src="${plantObj.image}"></img>
  <p><span class="inter font-bold">Category:</span> ${plantObj.category}</p>
  <p><span class="inter font-bold">Price:</span> ৳ ${plantObj.price}</p>
  <p><span class="inter font-bold">Description:</span> ${plantObj.description}</p>
  `
  document.getElementById('detailsModal').showModal();


}
// All Category
function getAllCategoryId() {
  return fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((allCategorydata) => {
      for (elem of allCategorydata.categories) {
        allCatId.push(elem.id);
      }
      return allCatId;
    });
}
// Category Fetch & Load
function fetchCategory() {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((allCategorydata) => {
      loadCategory(allCategorydata);
    });
}
function loadCategory(data) {
  categoryContainer.innerHTML = "";
  const allCatP = document.createElement("p");
  allCatP.innerHTML = `<p id="0" class="p-[10px] inter font-light text-[14px] lg:text-[14px] text-[#1F2937] cursor-pointer hover:bg-[#15803D]/10 transition ease-in-out duration-150">All Trees</p>`;
  categoryContainer.append(allCatP);
  for (let cat of data.categories) {
    const categoryName = cat.category_name;
    const catP = document.createElement("p");
    catP.innerHTML = `<p id="${cat.id}" class="p-[10px] inter font-light text-[14px] lg:text-[14px] text-[#1F2937] cursor-pointer hover:bg-[#15803D]/10 transition ease-in-out duration-150">${categoryName}</p>`;
    categoryContainer.append(catP);
  }
}

categoryContainer.addEventListener("click", (e) => {
  console.log(e.target.parentElement.parentElement);
  let container = e.target.parentElement.parentElement;
  container.querySelectorAll(".active").forEach((el) => {
    el.classList.remove("active");
  });
  e.target.classList.add("active");
  fetchPlants(e.target.id);
});
fetchCategory();
fetchPlants(0);

// Cart Section==========================================================================================
let totalCost = 0;
document.getElementById("total-amount").innerText = 0;
plantContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-cart")) {
    const name = e.target.parentElement.querySelector(".card-title").innerText;
    const price = parseInt(
      e.target.parentElement.querySelector(".price").innerText
    );

    alreadyAdded = false;

    for (let cart of cartItemContainer.querySelectorAll(".cart-title")) {
      if (cart.innerText == name) {
        alreadyAdded = true;
        let quantity = parseInt(
          cart.parentElement.querySelector(".quantity").innerText
        );
        cart.parentElement.querySelector(".quantity").innerText = quantity + 1;
        updateTotalCost(price);
      }
    }

    if (!alreadyAdded) {
      const cartDiv = document.createElement("div");
      cartDiv.innerHTML = `
    <div
              class="cart-item w-full p-[8px] mt-[8px] bg-[#F0FDF4] flex justify-between items-center rounded-md"
            >
              <div>
                <p class="cart-title inter font-semibold text-[14px]">${name}</p>
                <p class="inter font-normal text-[16px] text-[#1F2937]/60">
                  ৳<span class="price">${price}</span> x <span class="quantity">1</span>
                </p>
              </div>
              <i id="remove-cart-item" class="fa-solid fa-xmark cursor-pointer hover:text-red-500 transition ease-in-out duration-150"></i>
            </div>
    `;
      cartItemContainer.append(cartDiv);
      updateTotalCost(price);
      alreadyAdded = false;
    }
  }
});
function updateTotalCost(price) {
  totalCost += price;
  document.getElementById("total-amount").innerText = totalCost;
}
document
  .getElementById("cart-item-container")
  .addEventListener("click", (e) => {
    if (e.target.id == "remove-cart-item") {
      e.target.parentElement.remove();
      const quantity = parseInt(
        e.target.parentElement.querySelector(".quantity").innerText
      );
      const price = parseInt(
        e.target.parentElement.querySelector(".price").innerText
      );
      updateTotalCost(-price * quantity);
    }
  });
