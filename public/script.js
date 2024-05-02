const categoryData = {};

let childDivs = document.querySelectorAll(".category");

// On page load make API call
// Function to fetch data from the API
function fetchData() {
  fetch(
    "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json"
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Work with the JSON data
      console.log(data);
      for (let i = 0; i < data.categories.length; i++) {
        categoryData[data.categories[i].category_name] =
          data.categories[i].category_products;
      }
      console.log(categoryData);
      //Bydefult activet men category
      childDivs.forEach(function (div) {
        if (div.dataset.department == "Men") {
          div.classList.add("active");
        }
      });
      //Render products of men
      renderCards(categoryData["Men"]);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

// Call fetchData function when the page loads
window.addEventListener("load", fetchData);

// On API success transform the date for ease access
const categoryContainer = document.getElementById("categoryCantainer");

categoryContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("category")) {
    const department = event.target.dataset.department;

    childDivs.forEach(function (div) {
      div.classList.remove("active");
    });
    // Add active class to the clicked child div
    event.target.classList.add("active");

    //check if the property excist in object
    const products = categoryData[department];

    if (products && products.length > 0) {
      renderCards(products);
    }
    console.log(department);
  }
});

function calculateDiscountPercentage(originalPrice, discountedPrice) {
  // Ensure discounted price is less than original price
  if (discountedPrice >= originalPrice) {
    return 0;
  }

  // Calculate discount percentage
  const discountAmount = originalPrice - discountedPrice;
  const discountPercentage = (discountAmount / originalPrice) * 100;

  return discountPercentage.toFixed(2);
}

// Function to render cards
function renderCards(products) {
  const cardContainer = document.getElementById("productCard");

  console.log(products);

  //Clear existing content
  cardContainer.innerHTML = "";

  // Loop through each product and create a card for it
  products.forEach((product) => {
    const card = document.createElement("div");
    const discount = calculateDiscountPercentage(
      parseInt(product.compare_at_price),
      parseInt(product.price)
    );
    card.classList.add("card");
    //render product name and image
    card.innerHTML = `
    <div class="card-image-container" >
        <img src="${product.image}" alt="${product.name}" class="card-image">
        ${
          product.badge_text
            ? `<div class="badge-text">${product.badge_text}</div>`
            : ""
        }  
    </div>
    <div class="card-content">
        <span class="card-title" title="${product.title}" >${
      product.title
    }</span>
        ・
        <span class="card-vendor">${product.vendor}</span >
    </div>
    <div class="price-content" >
        <span class="card-price">Rs ${product.price}</span >
        <span class="card-compare-at-price"><s>${
          product.compare_at_price
        }</s></span >
        <span class="card-discount">${discount}%</span >
    </div>
    <div class="add-to-card" >Add to Cart</div>
    `;

    // Append the card to the card container
    cardContainer.appendChild(card);
  });
}
