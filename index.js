import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import { app } from "../FirebaseConfig/firebase.js";

import {
  getFirestore,
  doc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,
  addDoc,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

const userColReference = collection(db, "Users");
const orderColRef = collection(db, "CART_LISTS");
const reviewColRef = collection(db, "Reviews");

const displayFood = document.querySelector(".displayFood");
const countText = document.querySelector(".countText");
const itemText = document.querySelector(".itemText");
// const modalontent = document.querySelector(".modal-content");
const togglenav = document.querySelector(".toggleNav");
const navbar = document.querySelector(".navMenu");
const selectMeal = document.getElementById("mealSelect");
const selectCouisine = document.getElementById("couisine");
const logOut = document.getElementById("logOut");
const itemSection = document.querySelector(".itemSection");
const cartImg = document.querySelector(".cartImg");
const vegCategorySelect = document.getElementById("vegCategorySelect");
const inputForm = document.getElementById("inputForm");
const inputField = document.querySelector(".inputField");
const inputLoad = document.querySelector(".inputLoad");
// const popularMealSection = document.querySelector(".popularMealSection");
const toogleBtn = document.querySelector(".toggle-button");
const popularMeals = document.querySelector(".popularMeals");

const logOutSession = document.getElementById("logOutSession");
const inputLoader = document.querySelector(".loaders");

const checkCard = document.getElementById("checkCard");

const checkPreviousOrder = document.getElementById("previousOrder");

let userCurrentId;
const loaadCkeckOut = document.querySelector(".loadingProceed");
const proceedText = document.querySelector("#proceedSubmitBtn");

const holderName = document.getElementById("holderName");
const cardNumber = document.getElementById("cardNumber");
const cvvText = document.getElementById("cvvText");
const checkOutForm = document.getElementById("checkOutForm");

const testimonialWrapper = document.querySelector(".testimonial-wrapper");

const closeNav = document.querySelector(".closeNav");

const reviewRating = document.getElementById("reviewRating");

const viewCart = document.getElementById("viewCart");
const navtexts = document.getElementById("openMyOrders");
const viewCartBtn = document.getElementById("viewCartBtn");

const cartClick = document.querySelector(".cartClick");

const reviewLoader = document.querySelector(".revloader");

const reviewMessage = document.getElementById("reviewMessage");
const reviewForm = document.getElementById("reviewForm");
const AppId = "2043da85";
const AppKey = `408028f9deb72737b293f2a22905ed11
`;
let myName;
let foodList = [];

let userCurrentName;

if (toogleBtn && navbar) {
  toogleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    togglenav.classList.add("toggleShow");
    // toogleBtn.style.display = "none"
  });
}

closeNav.addEventListener("click", (e) => {
  e.preventDefault();
  // toogleBtn.style.display = "flex"
  togglenav.classList.remove("toggleShow");
});

// const foodPrices = `${(Math.random() * 1000).toFixed(2)}`;
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log(user.uid);

    const docRef = doc(userColReference, user.uid);
    const userCredentials = await getDoc(docRef);
    userCurrentId = user.uid;
    console.log(userCredentials.exists());

    if (userCredentials.exists()) {
      const userInfo = userCredentials.data();
      console.log(userInfo.Username);
      myName = userInfo.Username;
      userCurrentName = userInfo.Username;
      
    }
    counter();
    displayRevieews();
    // arrangeMeal();
    // showOrders()
  } else {
    window.location.href = "../SignIn Page/signIn.html";
  }
});


const defualtMeal = async () => {

  displayFood.innerHTML = `<p>Fetching chicken recipes <span class="spinner-border spinner-border-sm  loaderss" role="status">
  <span class="visually-hidden"></span>
</span></p>`;
  const baseUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=chicken&app_id=${AppId}&app_key=${AppKey}`;
  try {
    const response = await fetch(baseUrl, {
      headers: {
        "Edamam-Account-User": userCurrentId,
      },
    });
    const data = await response.json();
    console.log(data);
    const foodList = data.hits;

    displayFood.innerHTML = "";
    foodList.forEach((food) => {
      const random = Math.round(food.recipe.calories);
      const recipeUri = food.recipe.uri;
      const recipeId = recipeUri.split("#recipe_")[1];
      const foodPrices = `${(Math.random() * 1000).toFixed(2)}`;
      displayFood.innerHTML += `<div class="food-item">
       <img src="${food.recipe.image}" alt="${
        food.recipe.label
      }" class="images">
      <div class="foodText">
      <h2 class="labelText">Label: ${food.recipe.label}</h2>
      <h2 class="overviewText">Calories: ${random}</h2>
      <p  class="overviewText">Diet Labels: ${
        food.recipe.dietLabels[0] || "N/A"
      }
       <span  class="overviewText">Diet Label: ${
         food.recipe.dietLabels[1] || ""
       }</span>
      </p> 
       <p  class="overviewText">Health Labels: ${
         food.recipe.healthLabels[0] || "N/A"
       };
      <span  class="overviewText"> ${food.recipe.healthLabels[1] || ""}</span>
      </p> 
      <p  class="overviewText">Ingredients:  ${
        food.recipe.ingredients[0].text || "N/A"
      }
      <span  class="overviewText"> ${
        food.recipe.ingredients[1].text || ""
      }</span>
      </p>  
      <p  class="overviewText">Source: ${food.recipe.source}</p>
      <p  class="overviewText">Price: $${foodPrices}</p>
      <p  class="overviewText">Cuisine Type: ${food.recipe.cuisineType}</p>
 <a href="../SingleFood/singleFood.html?foodId=${recipeId}&price=${foodPrices}" class="viewDetails">View Details</a>

 <button class="addFood" food_id = "${recipeId}" food_price="${foodPrices}"  > <span class="textCart">Add To Cart</span>
 <span class="spinner-border spinner-border-sm  loader d-none" role="status">
  <span class="visually-hidden"></span>
</span>
 </button>
 </div>
 </div>`;
      
    });

    const foodCart = document.querySelectorAll(".addFood");
    foodCart.forEach((btn) => {
      btn.addEventListener("click", () => {
        const foodId = btn.getAttribute("food_id");
        const priceId = btn.getAttribute("food_price");

        const searchFoodWithId = foodList.find(
          (food) => food.recipe.uri.split("#recipe_")[1] === foodId
        );
        if (searchFoodWithId) {
          // alert( food.recipe.uri)
          const foodItems = {
            id: foodId,
            label: searchFoodWithId.recipe.label,
            image: searchFoodWithId.recipe.image,
            calories: Math.round(searchFoodWithId.recipe.calories),
            dietLabels: searchFoodWithId.recipe.dietLabels,
            healthLabels: searchFoodWithId.recipe.healthLabels,
            ingredients: searchFoodWithId.recipe.ingredients,
            cuisineType: searchFoodWithId.recipe.cuisineType,
            source: searchFoodWithId.recipe.source,
            price: parseFloat(priceId),
          };
          addFoodToCart(foodItems, btn);
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
};
defualtMeal();

// Select Meal
selectMeal.addEventListener("change", async () => {
  displayFood.innerHTML = `<p>Fetching ${selectMeal.value} recipes <span class="spinner-border spinner-border-sm  loaderss" role="status">
     <span class="visually-hidden"></span>
   </span></p>`;

  try {
    const meal = selectMeal.value;
    const baseUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${meal}&app_id=${AppId}&app_key=${AppKey}`;
    const response = await fetch(baseUrl, {
      headers: {
        "Edamam-Account-User": userCurrentId,
      },
    });
    const data = await response.json();

    console.log(data);
    console.log(data.hits[1].recipe.uri);
    const foodList = data.hits;

    displayFood.innerHTML = "";
    foodList.forEach((food) => {
      const random = Math.round(food.recipe.calories);
      const recipeUri = food.recipe.uri;
      const recipeId = recipeUri.split("#recipe_")[1];
      const foodPrices = `${(Math.random() * 1000).toFixed(2)}`;
      // console.log(recipeId);

      displayFood.innerHTML += `<div class="food-item">
       <img src="${food.recipe.image}" alt="${
        food.recipe.label
      }" class="images">
      <div class="foodText">
      <h2 class="labelText">Label: ${food.recipe.label}</h2>
      <h2 class="overviewText">Calories: ${random}</h2>
      <p  class="overviewText">Diet Labels: ${
        food.recipe.dietLabels[0] || "N/A"
      }
       <span  class="overviewText">Diet Label: ${
         food.recipe.dietLabels[1] || ""
       }</span>
      </p> 
       <p  class="overviewText">Health Labels: ${
         food.recipe.healthLabels[0] || "N/A"
       };
      <span  class="overviewText"> ${food.recipe.healthLabels[1] || ""}</span>
      </p> 

      <p  class="overviewText">Ingredients:  ${
        food.recipe.ingredients[0].text || "N/A"
      }
      <span  class="overviewText"> ${
        food.recipe.ingredients[1].text || ""
      }</span>
      </p> 
     
      <p  class="overviewText">Source: ${food.recipe.source}</p>
      <p  class="overviewText">Price: $${foodPrices}</p>
      <p  class="overviewText">Cuisine Type: ${food.recipe.cuisineType}</p>
 <a href="../SingleFood/singleFood.html?foodId=${recipeId}&price=${foodPrices}" class="viewDetails">View Details</a>

 <button class="addFood" food_id = "${recipeId}" food_price="${foodPrices}"  > <span class="textCart">Add To Cart</span>
 <span class="spinner-border spinner-border-sm  loader d-none" role="status">
  <span class="visually-hidden"></span>
</span>
 </button>

 </div>
 </div>`;
      // console.log(recipeId);
    });

    const foodCart = document.querySelectorAll(".addFood");
    foodCart.forEach((btn) => {
      btn.addEventListener("click", () => {
        const foodId = btn.getAttribute("food_id");
        const priceId = btn.getAttribute("food_price");

        const searchFoodWithId = foodList.find(
          (food) => food.recipe.uri.split("#recipe_")[1] === foodId
        );
        if (searchFoodWithId) {
          const foodItems = {
            id: foodId,
            label: searchFoodWithId.recipe.label,
            image: searchFoodWithId.recipe.image,
            calories: Math.round(searchFoodWithId.recipe.calories),
            dietLabels: searchFoodWithId.recipe.dietLabels,
            healthLabels: searchFoodWithId.recipe.healthLabels,
            ingredients: searchFoodWithId.recipe.ingredients,
            cuisineType: searchFoodWithId.recipe.cuisineType,
            source: searchFoodWithId.recipe.source,
            price: parseFloat(priceId),
          };
          // alert( food.recipe.uri)
          addFoodToCart(foodItems, btn);
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
});

// Selct Cousine
selectCouisine.addEventListener("change", async () => {

  const couisineMeal = selectCouisine.value;
  const meals = selectMeal.value || `${couisineMeal} ` || "chicken";

  displayFood.innerHTML = `<p>Fetching ${meals} ${selectCouisine.value} recipes <span class="spinner-border spinner-border-sm  loaderss" role="status">
  <span class="visually-hidden"></span>
</span></p>`;
  console.log(couisineMeal);

  try {

    const couisineUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(
      meals
    )}&cuisineType=${encodeURIComponent(
      couisineMeal
    )}&app_id=${AppId}&app_key=${AppKey}`;
    const response = await fetch(couisineUrl, {
      headers: {
        "Edamam-Account-User": userCurrentId,
      },
    });
    const datas = await response.json();
    //  console.log(data.hits[0].recipe.label);
    console.log(datas);

    const couisineProducts = datas.hits;
    console.log(couisineProducts[0].recipe.label);

    displayFood.innerHTML = "";
    couisineProducts.forEach((foods) => {
      const randomCalories = Math.round(foods.recipe.calories);
      const recipeUri = foods.recipe.uri;
      const recipeId = recipeUri.split("#recipe_")[1];
      const foodPrices = `${(Math.random() * 1000).toFixed(2)}`;

      displayFood.innerHTML += `<div class="food-item">
       <img src="${foods.recipe.image}" alt="${
        foods.recipe.label
      }" class="images">
      <div class="foodText">
      <h2 class="labelText">Label: ${foods.recipe.label}</h2>
      <h2  class="overviewText">Calories: ${randomCalories}</h2>
      <p  class="overviewText">Diet Labels: ${
        foods.recipe.dietLabels[0] || "N/A"
      }
       <span  class="overviewText"> ${foods.recipe.dietLabels[1] || ""}</span>
      </p> 

       <p  class="overviewText">Health Labels: ${
         foods.recipe.healthLabels[0] || "N/A"
       };
      <span  class="overviewText"> ${foods.recipe.healthLabels[1] || ""}</span>
      </p> 
     <p  class="overviewText">Ingredients:  ${
       foods.recipe.ingredients[0].text || "N/A"
     }
      <span  class="overviewText"> ${
        foods.recipe.ingredients[1].text || ""
      }</span>
      </p> 
      <p  class="overviewText">Source: ${foods.recipe.source}</p>
      <p  class="overviewText">Price: $${foodPrices}</p>
 <a href="../SingleFood/singleFood.html?foodId=${recipeId}&price=${foodPrices}" class="viewDetails">View Details</a>
 <button class="addFood" food_id = "${recipeId}" priceId="${foodPrices}"   > <span class="textCart">Add To Cart</span>
 <span class="spinner-border spinner-border-sm  loader d-none" role="status">
  <span class="visually-hidden"></span>
</span>
 </button>
 </div>
 </div>`;

      //  console.log(foods.recipe.label);
    });
    const foodCart = document.querySelectorAll(".addFood");
    foodCart.forEach((btn) => {
      btn.addEventListener("click", () => {
        const foodId = btn.getAttribute("food_id");
        const priceId = btn.getAttribute("priceId");
        // btn.textContent = "red"

        const searchFoodWithId = couisineProducts.find(
          (food) => food.recipe.uri.split("#recipe_")[1] === foodId
        );
        if (searchFoodWithId) {
          // alert( food.recipe.uri)
          const foodItems = {
            id: foodId,
            label: searchFoodWithId.recipe.label,
            image: searchFoodWithId.recipe.image,
            calories: Math.round(searchFoodWithId.recipe.calories),
            dietLabels: searchFoodWithId.recipe.dietLabels,
            healthLabels: searchFoodWithId.recipe.healthLabels,
            ingredients: searchFoodWithId.recipe.ingredients,
            cuisineType: searchFoodWithId.recipe.cuisineType,
            source: searchFoodWithId.recipe.source,
            price: parseFloat(priceId),
          };
          addFoodToCart(foodItems, btn);
          counter();
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
});

///Veg CategorySelect
vegCategorySelect.addEventListener("change", async () => {
  displayFood.innerHTML = `<p>Fetching  ${selectMeal.value} ${selectCouisine.value} ${vegCategorySelect.value} recipes<span class="spinner-border spinner-border-sm  loaderss" role="status">
  <span class="visually-hidden"></span>
</span></p>`;
  const mealValue = selectMeal.value;
  let cuisineSelect = selectCouisine.value;

  const vegSelect = vegCategorySelect.value;
  // console.log(vegSelect);
  console.log(mealValue);
  console.log(cuisineSelect);
  console.log(vegSelect);

  if (!cuisineSelect || cuisineSelect === "Select Cuisine Type") {
    cuisineSelect = "american"; // or any default allowed value
  }

  try {
    const baserl = `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(
      mealValue
    )}&app_id=${AppId}&app_key=${AppKey}&cuisineType=${encodeURIComponent(
      cuisineSelect
    )}&health=${encodeURIComponent(vegSelect)}`;

    const response = await fetch(baserl, {
      headers: {
        "Edamam-Account-User": userCurrentId,
      },
    });
    const vegDatas = await response.json();
    // console.log(vegDatas);
    const vegData = vegDatas.hits;
    console.log(vegData);

    displayFood.innerHTML = "";
    vegData.forEach((vegs) => {
      const randomCalories = Math.round(vegs.recipe.calories);
      const recipeUri = vegs.recipe.uri;
      const recipeId = recipeUri.split("#recipe_")[1];
      const foodPrices = `${(Math.random() * 1000).toFixed(2)}`;
      displayFood.innerHTML += `
      <div class="food-item">
       <img src="${vegs.recipe.image}" alt="${
        vegs.recipe.label
      }" class="images">
      <div class="foodText">
      <h2 class="labelText">Label: ${vegs.recipe.label}</h2>
      <h2  class="overviewText">Calories: ${randomCalories}</h2>
      <p  class="overviewText">Diet Labels: ${
        vegs.recipe.dietLabels[0] || "N/A"
      }
       <span  class="overviewText"> ${vegs.recipe.dietLabels[1] || ""}</span>
      </p> 

       <p  class="overviewText">Health Labels: ${
         vegs.recipe.healthLabels[0] || "N/A"
       };
      <span  class="overviewText"> ${vegs.recipe.healthLabels[1] || ""}</span>
      </p> 
     <p  class="overviewText">Ingredients:  ${
       vegs.recipe.ingredients[0].text || "N/A"
     }
      <span  class="overviewText"> ${
        vegs.recipe.ingredients[1].text || ""
      }</span>
      </p> 
      <p  class="overviewText">Source: ${vegs.recipe.source}</p>
      <p  class="overviewText">Price: $${foodPrices}</p>
 <a href="../SingleFood/singleFood.html?foodId=${recipeId}&price=${foodPrices}" class="viewDetails">View Details</a>
 <button class="addFood" food_id = "${recipeId}" priceId="${foodPrices}"   > <span class="textCart">Add To Cart</span>
 <span class="spinner-border spinner-border-sm  loader d-none" role="status">
  <span class="visually-hidden"></span>
</span>
 </button>
 </div>
 </div>
      `;
    });

    const vegCart = document.querySelectorAll(".addFood");
    vegCart.forEach((btn) => {
      btn.addEventListener("click", () => {
        const foodId = btn.getAttribute("food_id");
        const priceId = btn.getAttribute("priceId");
        // btn.textContent = "red"

        const searchFoodWithId = vegData.find(
          (food) => food.recipe.uri.split("#recipe_")[1] === foodId
        );
        if (searchFoodWithId) {
          // alert( food.recipe.uri)
          const foodItems = {
            id: foodId,
            label: searchFoodWithId.recipe.label,
            image: searchFoodWithId.recipe.image,
            calories: Math.round(searchFoodWithId.recipe.calories),
            dietLabels: searchFoodWithId.recipe.dietLabels,
            healthLabels: searchFoodWithId.recipe.healthLabels,
            ingredients: searchFoodWithId.recipe.ingredients,
            cuisineType: searchFoodWithId.recipe.cuisineType,
            source: searchFoodWithId.recipe.source,
            price: parseFloat(priceId),
          };
          addFoodToCart(foodItems, btn);
          counter();
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
});

///Search Meal

const foodSearch = async () => {
  const inputMeal = inputField.value;
  // inputField.value = ""
  // inputField.value = "Searching.."
  // searchBtn.textContent = "Searching"
  // inputLoader.classList.remove("d-none");
  displayFood.innerHTML = `<p>Fetching ${inputMeal} recipes <span class="spinner-border spinner-border-sm  loaderss" role="status">
  <span class="visually-hidden"></span>
</span></p>`;

  if (!inputMeal) {
    displayFood.innerHTML = "<h3>Food Not Found ❌</h3>";
    inputLoader.classList.add("d-none");
    inputField.style.borderColor = "red";
    return;
  }

  try {
    const baseUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${inputMeal}&app_id=${AppId}&app_key=${AppKey}`;
    const response = await fetch(baseUrl, {
      headers: {
        "Edamam-Account-User": userCurrentId,
      },
    });
    const res = await response.json();
    console.log(res);

    const inputsFood = res.hits;
    displayFood.innerHTML = "";

    if (inputsFood.length == 0) {
      displayFood.innerHTML = "<h3>Food Not Found ❌</h3>";
      return;
    }

    inputsFood.forEach((food) => {
      const random = Math.round(food.recipe.calories);
      const recipeUri = food.recipe.uri;
      const recipeId = recipeUri.split("#recipe_")[1];
      const foodPrices = `${(Math.random() * 1000).toFixed(2)}`;
      // console.log(recipeId);

      displayFood.innerHTML += `<div class="food-item">
       <img src="${food.recipe.image}" alt="${
        food.recipe.label
      }" class="images">
      <div class="foodText">
      <h2 class="labelText">Label: ${food.recipe.label}</h2>
      <h2 class="overviewText">Calories: ${random}</h2>
      <p  class="overviewText">Diet Labels: ${
        food.recipe.dietLabels[0] || "N/A"
      }
       <span  class="overviewText">Diet Label: ${
         food.recipe.dietLabels[1] || ""
       }</span>
      </p> 
       <p  class="overviewText">Health Labels: ${
         food.recipe.healthLabels[0] || "N/A"
       };
      <span  class="overviewText"> ${food.recipe.healthLabels[1] || ""}</span>
      </p> 

      <p  class="overviewText">Ingredients:  ${
        food.recipe.ingredients[0].text || "N/A"
      }
      <span  class="overviewText"> ${
        food.recipe.ingredients[1].text || ""
      }</span>
      </p> 
     
      <p  class="overviewText">Source: ${food.recipe.source}</p>
      <p  class="overviewText">Price: $${foodPrices}</p>
      <p  class="overviewText">Cuisine Type: ${food.recipe.cuisineType}</p>
 <a href="../SingleFood/singleFood.html?foodId=${recipeId}&price=${foodPrices}" class="viewDetails">View Details</a>

 <button class="addFood" food_id = "${recipeId}" priceId="${foodPrices}"  > <span class="textCart">Add To Cart</span>
 <span class="spinner-border spinner-border-sm  loader d-none" role="status">
  <span class="visually-hidden"></span>
</span>
 </button>

 </div>
 </div>`;
    });

    inputLoader.classList.add("d-none");
    const vegCart = document.querySelectorAll(".addFood");
    vegCart.forEach((btn) => {
      btn.addEventListener("click", () => {
        const foodId = btn.getAttribute("food_id");
        const priceId = btn.getAttribute("priceId");
        // btn.textContent = "red"

        const searchFoodWithId = inputsFood.find(
          (food) => food.recipe.uri.split("#recipe_")[1] === foodId
        );
        if (searchFoodWithId) {
          // alert( food.recipe.uri)
          const foodItems = {
            id: foodId,
            label: searchFoodWithId.recipe.label,
            image: searchFoodWithId.recipe.image,
            calories: Math.round(searchFoodWithId.recipe.calories),
            dietLabels: searchFoodWithId.recipe.dietLabels,
            healthLabels: searchFoodWithId.recipe.healthLabels,
            ingredients: searchFoodWithId.recipe.ingredients,
            cuisineType: searchFoodWithId.recipe.cuisineType,
            source: searchFoodWithId.recipe.source,
            price: parseFloat(priceId),
          };
          addFoodToCart(foodItems, btn);
          counter();
        }
      });
    });
  } catch (error) {
    console.log();
  } finally {
    inputField.value = "";
  }
};
inputForm.addEventListener("submit", (e) => {
  e.preventDefault();
  inputField.style.borderColor = "green";
  foodSearch();
});

// const arrangeMeal = async()=>{}

///Add Food To Cart
const addFoodToCart = async (foodItems, btn) => {
  const loader = btn.querySelector(".loader");
  const loadText = btn.querySelector(".textCart");

  try {
    // console.log(loader);

    const recipeId = foodItems.idMeal;
    // console.log(recipeId);

    // console.log(foodItems.recipe.label);

    const orderRef = collection(userColReference, userCurrentId, "Cart");

    btn.disabled = true;
    loadText.textContent = "Adding Item";
    loader.classList.remove("d-none");

    await addDoc(orderRef, {
      Label: foodItems.label,
      HealthLabels: foodItems.healthLabels,
      Calories: foodItems.calories,
      DietLabels: foodItems.dietLabels,
      CuisineType: foodItems.cuisineType,
      addedAt: new Date(),
      Price: foodItems.price,
      Source: foodItems.source,
      ingredients: foodItems.ingredients,
    });

    const modalbody = document.querySelector(".modal-body");
    const modaltitle = document.querySelector(".modal-title");
    modalbody.innerHTML = `<h4 class="text-center">Food Added To Cart ✅</h4>`;
    modaltitle.innerHTML = `${foodItems.label}`;
    // modalbody.innerHTML += `<p class="text-center">You have successfully added ${foodItems.recipe.label} to your cart.</p>`

    const successModal = new bootstrap.Modal(
      document.getElementById("myModal")
    );
    successModal.show();

    //  btn.innerHTML = "Added!";
    // btn.style.backgroundColor = "green";

    // setTimeout(() => {

    //   btn.style.backgroundColor = ""; // reset
    // }, 1500);
    // loadText.textContent = "Added ✅";
    counter();
    showItem();
    sums();
    // arrangeMeal()
  } catch (error) {
    console.log(error);
  } finally {
    loadText.textContent = "Add To Cart";
    loader.classList.add("d-none");
    btn.disabled = false;
  }
};

const counter = async () => {
  try {
    const itemCount = collection(userColReference, userCurrentId, "Cart");

    const querySnapShot = await getDocs(itemCount);

    querySnapShot.forEach((doc) => {
      // console.log(doc.data());
    });

    // console.log(querySnapShot.size);
    countText.textContent = querySnapShot.size;

    const modalItemCount = document.getElementById("modalItemCount");
    modalItemCount.textContent = countText.textContent;

    if (countText.textContent.length < 0) {
      countText.textContent = 0;
    }
    // itemSection.classList.toggle("itemSlide")
  } catch (error) {
    console.log(error);
  }
};
counter();
// addFoodToCart()
//Delete Product

const deleteProduct = async (id, del) => {
  //  alert(id)
  const loader = del.querySelector(".loader");
  const loadText = del.querySelector(".textCart");

  try {
    const deleteEach = doc(userColReference, userCurrentId, "Cart", id);
    const docSnapShot = getDoc(deleteEach);
    del.disabled = true;
    loadText.textContent = "Removing Item";
    loader.classList.remove("d-none");
    if (docSnapShot) {
      await deleteDoc(deleteEach);
    }
    counter();
    showItem();
    sums();
  } catch (error) {
    console.log(error);
  } finally {
  }
};
const cartValue = document.querySelector(".cartValue");
const showItem = async () => {
  try {
    const itemCount = collection(userColReference, userCurrentId, "Cart");

    const querySnapShot = await getDocs(itemCount);

    if (querySnapShot.size == 0) {
      itemText.innerHTML = "<p>Cart is empty</p>";
      return;
    }
    itemText.innerHTML = `<p>Order Details</p>
    <b>Sub Total: </b> <span class="totalText"></span>
   `;
    querySnapShot.forEach((doc) => {
      const eachFood = doc.data();
      // console.log(doc.id);
      const showItemId = doc.id;
      const cal = Math.round(eachFood.Calories);

      const myPrice = eachFood.Price;

      itemText.innerHTML += `<div class="itemDetails">
      <hr>
      <b>Label: ${eachFood.Label}</b><br>
      <b>DietLabel: ${eachFood.DietLabels}</b><br>
      <b>Calories: ${cal}</b><br>
      <b>Price: $${eachFood.Price}</b><br>
      <b>Source: ${eachFood.Source}</b><br><br>
      <button class="delBtn"  deleteId="${showItemId}" >
      <span class="textCart">Remove Item</span>
 <span class="spinner-border spinner-border-sm  loader d-none" role="status">
  <span class="visually-hidden"></span>
</span>
      </button>
      <br><br>
      </div>
      `;
    });

    const checkoutBtn = document.createElement("button");
    checkoutBtn.className = "proceedCheckoutBtn";
    checkoutBtn.textContent = "Proceed to Checkout";
    itemText.appendChild(checkoutBtn);

    const totalInputPrice = document.getElementById("totalInputPrice");
    const modalItems = document.getElementById("modalItems");
    const proeedBtn = document.querySelector(".proceedCheckoutBtn");

    ///CheckOut Section

    proeedBtn.addEventListener("click", async () => {
      // alert("kk")

      // itemSection.classList.remove("itemSlide")
      try {
        const itemCount = collection(userColReference, userCurrentId, "Cart");

        const querySnapShot = await getDocs(itemCount);
        modalItems.innerHTML = "";
        querySnapShot.forEach((doc) => {
          let CheckoutData = doc.data();
          modalItems.innerHTML += `<div class="orderCheck">
      <p>${CheckoutData.Label}  <span class="price"> $${CheckoutData.Price} </span><p>
      </div>`;
        });

        const proceedCheckoutModal = document.querySelector(".proceed-body");
        const successModal = new bootstrap.Modal(
          document.getElementById("proceedModal")
        );
        successModal.show();

        // totalInputPrice.value = CheckoutData.Price
      } catch (error) {
        console.log(error);
      }
    });

    const deleteCart = document.querySelectorAll(".delBtn");
    deleteCart.forEach((del) => {
      del.addEventListener("click", () => {
        const getDelBtn = del.getAttribute("deleteId");
        deleteProduct(getDelBtn, del);
      });
    });
    sums();
  } catch (error) {
    console.log(error);
  }
};
const checkCvv = document.getElementById("checkCvv");
cardNumber.addEventListener("input", () => {
  // console.log(cardNumber.value);
  if (!(cardNumber.value.length == 16)) {
    cardNumber.style.borderColor = "red";
    checkCard.textContent = "Card Number must be  exactly 16 digits";
  } else {
    checkCard.textContent = "";
    cardNumber.style.borderColor = "green";
  }
});
cvvText.addEventListener("input", () => {
  if (!(cvvText.value.length == 3)) {
    cvvText.style.borderColor = "red";
    checkCvv.textContent = "Cvv must be three digits";
  } else {
    checkCvv.textContent = "";
    cvvText.style.borderColor = "green";
  }
});

//Popular Meal

let userItem;
// const cardNumberss = document.getElementById("cardNumber")
// const continueShopping = document.querySelector(".")
const CheckOutItemPayment = async () => {
  loaadCkeckOut.classList.remove("d-none");
  proceedText.disabled = true;

  try {
    let allItemsOrdered = [];

    const itemCount = collection(userColReference, userCurrentId, "Cart");
    const userItemCount = await getDocs(itemCount);

    userItemCount.forEach((doc) => {
      console.log(doc.data().Label);

      const userOrdered = doc.data();
      // console.log(userOrdered);

      allItemsOrdered.push({
        Label: userOrdered.Label,
        Price: userOrdered.Price,
        Calories: userOrdered.Calories,
        DietLabels: userOrdered.DietLabels,
        // dietLabels : userOrdered.DietLabels
      });
      console.log(allItemsOrdered.Price);
    });

    const orderCount = collection(userColReference, userCurrentId, "Orders");
    // const orderSnapShot = await getDocs(orderCount)

    await addDoc(orderCount, {
      holderName: holderName.value,
      CardNumber: cardNumber.value,
      FoodItems: allItemsOrdered,
      paidAt: new Date(),

      // Label : foodItems.recipe.label
    });

    const cartDocs = await getDocs(itemCount);
    for (const docSnap of cartDocs.docs) {
      await deleteDoc(doc(userColReference, userCurrentId, "Cart", docSnap.id));
    }

    if (cartDocs) {
      alert("Order placed successfully! Thank you for your purchase.🤑");
      window.location.href = "./index.html";
    }
  
  } catch (error) {
    console.log(error);
  } finally {
    loaadCkeckOut.classList.add("d-none");
    proceedText.disabled = false;
    proceedText.textContent = "Ordered Succesfully";
  }
};
checkOutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // alert("lll")
  CheckOutItemPayment();
});
const orderBody = document.querySelector(".userOrders");
const orderText = document.getElementById("orderText");
const orderItemsCount = document.getElementById("orderItemsCount");
const orderPriceCount = document.getElementById("orderPriceCount");
const showOrders = async () => {
  try {
    const orderCount = collection(userColReference, userCurrentId, "Orders");
    const querySnapShot = await getDocs(orderCount);
    console.log(querySnapShot);
    let orderUserName;
    orderBody.innerHTML = "";
    let orderBodyList;
    let totalItems = 0;

    let totalPrice = 0;

    querySnapShot.forEach((doc) => {
      // console.log(doc.data());
      const orderData = doc.data();
      orderBodyList = orderData.FoodItems || [];

      totalItems += orderBodyList.length;
      orderBody.innerHTML += `<div class="orderCard">
      <p><strong>Holder Name: <br></strong> ${orderData.holderName}</p>
      <p><strong>Paid At:</strong>  <br>${orderData.paidAt
        .toDate()
        .toLocaleString()}</p>
      <ul>
     <strong> Items </strong>:${orderBodyList
       .map((myFood) => {
         totalPrice += myFood.Price || 0;
         return `<li>${myFood.Label}  - $${myFood.Price}</li>`;
       })
       .join("")}
      
      </ul>
      </div>`;
      // alert(totalPrice)

      // console.log(doc.data());
    });
    if (querySnapShot.empty) {
      orderBody.innerHTML = ` You currently have no recorded transactions.<br>
      <span class="fw-bold">Thank you for choosing <span style="color: #007bff;">@Emmart</span>.</span> `;
    } else {
      orderPriceCount.innerHTML = `<strong>$${totalPrice.toLocaleString(
        "en-US",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )}</strong>`;
      orderItemsCount.innerHTML = `<strong>${Number(totalItems)}</strong>`;
      orderText.innerHTML = `<strong>${querySnapShot.size}</strong>`;
    }
    const successModal = new bootstrap.Modal(
      document.getElementById("myOrderHistory")
    );
    successModal.show();
  } catch (error) {
    console.log(error);
  }
};
checkPreviousOrder.addEventListener("click", showOrders);

cartClick.addEventListener("click", () => {
  itemSection.classList.toggle("itemSlide");
  showItem();
  // displayFood.classList.toggle("mediaFood")
  displayFood.classList.toggle("displaySlide");
  navbar.classList.toggle("nav-sho");

  //  displayFood.style.marginInline = "auto"
  // counter()
});
viewCart.addEventListener("click", (e) => {
  e.preventDefault();
  itemSection.classList.toggle("itemSlide");
  displayFood.classList.toggle("displaySlide");
  //  displayFood.classList.toggle("displaySlide");
  showItem();
});
viewCartBtn.addEventListener("click", (e) => {
  e.preventDefault();
  // alert("")
  itemSection.classList.toggle("itemSlide");
  displayFood.classList.toggle("displaySlide");
  //  displayFood.classList.toggle("displaySlide");
  showItem();
});

// showOrders()

const fetchText = document.querySelector(".fetchIng");
const allPopularRecipes = [];
const fetchPopularMeal = async () => {
  fetchText.textContent = `Feteching Food... `;

  const popularMeal = [
    "Egusi Soup",
    "banga soup",
    "okro soup",
    "jollof rice",
    "amala",
    "pounded yam",
    "Maafe",
    "tuwo shinkafa",
    "ogbono soup",
    "Ofada Rice",
    "moi moi",
    "suya",
    "Ewa Agoyin",
  ];

  for (let mealSearch of popularMeal) {
    const foodPrices = `${(Math.random() * 100).toFixed(2)}`;

    //   const recipeId = popularMeal.hits.recipe.uri.split("#recipe_")[1];
    // console.log(recipeId);

    try {
      const baseUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(
        mealSearch
      )}&app_id=${AppId}&app_key=${AppKey}`;
      const response = await fetch(baseUrl, {
        headers: {
          "Edamam-Account-User": userCurrentId,
        },
      });
      const getPopularMeal = await response.json();

      // console.log(getPopularMeal.hits[0]);

      allPopularRecipes.push(getPopularMeal.hits[0]);
      // console.log(getPopularMeal.hits[0].recipe.uri.split("#recipe_")[1]);

      const traditionalFoodId =
        getPopularMeal.hits[0].recipe.uri.split("#recipe_")[1];
      // console.log(traditionalFoodId);

      // popularMeals.innerHTML = ""

      fetchText.textContent = "";
      popularMeals.innerHTML += `<div class="myFood">
    <img src="${getPopularMeal.hits[0].recipe.image}" alt="${getPopularMeal.hits[0].recipe.label}"class="foodImg">
    
    <p class="labelTradText"> ${getPopularMeal.hits[0].recipe.label}</p>
    <p class="labelPriceText"> $${foodPrices}</p>
  <button class="addFood" food_id = "${traditionalFoodId}" priceId="${foodPrices}"   > <span class="textCart">Add To Cart</span>
 <span class="spinner-border spinner-border-sm  loader d-none" role="status">
  <span class="visually-hidden"></span>
</span>
 </button>

    `;

      const addFood = document.querySelectorAll(".addFood");
      addFood.forEach((btn) => {
        btn.addEventListener("click", () => {
          const getTradId = btn.getAttribute("food_id");
          const priceId = btn.getAttribute("priceId");

          const recipe = allPopularRecipes.find((food) => {
            if (!food || !food.recipe || !food.recipe.uri) return false;

            return food.recipe.uri.split("#recipe_")[1] === getTradId;
          });

          if (recipe) {
            const foodItems = {
              id: getTradId,
              label: recipe.recipe.label,
              image: recipe.recipe.image,
              calories: Math.round(recipe.recipe.calories),
              dietLabels: recipe.recipe.dietLabels,
              healthLabels: recipe.recipe.healthLabels,
              ingredients: recipe.recipe.ingredients,
              cuisineType: recipe.recipe.cuisineType,
              source: recipe.recipe.source,
              price: parseFloat(priceId),
            };
            addFoodToCart(foodItems, btn);
            counter();
          }
        });
      });
    } catch (error) {
      // console.log(error);
    } finally {
      // console.log("Donee");
    }
  }
};
fetchPopularMeal();

const sums = async () => {
  try {
    // console.log(userCurrentId);

    const sumItem = collection(userColReference, userCurrentId, "Cart");
    const querySnapShot = await getDocs(sumItem);

    let defaultPrice = 0;
    const totalText = document.querySelector(".totalText");
    //  const prices = sumResult.data()
    querySnapShot.forEach((prices) => {
      // console.log(prices.data().Price);
      const itemPrice = prices.data().Price;
      const eachPrice = parseFloat(itemPrice);
      defaultPrice += eachPrice;
      // console.log(defaultPrice);
      const totalText = document.querySelector(".totalText");
      totalText.innerHTML = `<strong>$${defaultPrice.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}</strong> `;
    });
    const modalPrice = document.getElementById("modalTotalAmount");
    modalPrice.textContent = totalText.textContent;
    totalInputPrice.value = modalPrice.textContent;
  } catch (error) {
    console.log(error);
  }
};

const reviewText = document.querySelector(".reviewText");
const reviewBtn = document.querySelector(".rev");
const storeReviews = async () => {
  reviewBtn.disabled = true;
  reviewLoader.classList.remove("d-none");
  reviewText.textContent = "Submitting";

  try {
    const reviewColRef = collection(db, "Reviews");

    await addDoc(reviewColRef, {
      ReviewMessage: reviewMessage.value,
      UserId: userCurrentId,
      reviewHolder: myName,
      addedAt: new Date(),
      Ratings: reviewRating.value,
    });

    reviewMessage.value = "";
    alert("Review submitted");
    // displayRevieews();
    // displayRevieews();
  } catch (error) {
    console.log(error);
  } finally {
    reviewLoader.classList.add("d-none");
    reviewText.textContent = "Submit Review";
    reviewBtn.disabled = false;
  }
};
reviewForm.addEventListener("submit", (e) => {
  e.preventDefault();
  storeReviews();
  displayRevieews();
});

const displayRevieews = async () => {
  try {
    const reviewColRef = collection(db, "Reviews");

    const showRevie = await getDocs(reviewColRef);

    if (showRevie.empty) {
      testimonialWrapper.innerHTML = "<p>No reviews added yet</p>";
      return;
    }

    testimonialWrapper.innerHTML = "";
    showRevie.forEach((doc) => {
      const eachReview = doc.data();
      // console.log(eachReview);

      const stars = "⭐".repeat(eachReview.Ratings || 0);

      testimonialWrapper.innerHTML += `
           <div class="testimonial-card">${eachReview.reviewHolder}  <span> - ${stars}</span>
           <p class="testimonial-author">${eachReview.ReviewMessage} 
    </p>
    </div>`;
    });
  } catch (error) {
    console.log(error);
  }
};
// displayRevieews()
// displayRevieews(userCurrentId);
// sums()

// sums()
const userLogOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log(error);
  }
};

logOut.addEventListener("click", userLogOut);

logOutSession.addEventListener("click", userLogOut);
