const categoryContainer = document.getElementById("category-container");
const plantContainer = document.getElementById("plant-card-container");
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
                  <h2 class="card-title inter font-semibold text-[14px] text-[#1F2937]">${plantInfo.name}</h2>
                  <p class="inter font-light text-[12px] text-[#1F2937] h-[110px]">${plantInfo.description}</p>
                  <div class="flex justify-between">
                    <div
                      class="badge badge-outline geist font-medium text-[14px] text-[#15803D] bg-[#DCFCE7]"
                    >
                      ${plantInfo.category}
                    </div>
                    <div class="inter font-semibold text-[14px]">
                      ৳ <span>${plantInfo.price}</span>
                    </div>
                  </div>
                  <div
                    class="btn w-full mt-2 inter font-medium text-[16px] bg-[#15803D] hover:bg-[#126b32] rounded-4xl text-white py-6"
                  >
                    Add to Cart
                  </div>
                </div>
              </div>
    `;
        plantContainer.append(newCard);
      });
  }
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
  const allCatP = document.createElement("p");
  allCatP.innerHTML = `<p id="0" class="inter font-light text-[14px] lg:text-[14px] text-[#1F2937] cursor-pointer">All Trees</p>`;
  categoryContainer.append(allCatP);
  for (let cat of data.categories) {
    const categoryName = cat.category_name;
    const catP = document.createElement("p");
    catP.innerHTML = `<p id="${cat.id}" class="inter font-light text-[14px] lg:text-[14px] text-[#1F2937] cursor-pointer">${categoryName}</p>`;
    categoryContainer.append(catP);
  }
}

categoryContainer.addEventListener("click", (e) => {
  fetchPlants(e.target.id);
});
fetchCategory();
fetchPlants(0);
