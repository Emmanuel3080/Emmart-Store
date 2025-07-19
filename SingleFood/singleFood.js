import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import { app } from "../FirebaseConfig/firebase.js";

import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

const userColReference = collection(db, "Users");
const orderColReference = collection(db, "CARTS");

const imageSection = document.querySelector(".imageSection");
const displayFood = document.querySelector(".displayFood");
const foodInfo = document.querySelector(".foodInfo");
const togglenav = document.querySelector(".toggleNav");
const navbar = document.querySelector(".navMenu");
// console.log(recipe.label);
const toogleBtn = document.querySelector(".toggle-button");
const helthText = document.querySelector(".helthText");
const HealthInfo = document.querySelector(".HelathInfo");
const closeNav = document.querySelector(".closeNav");
const ingredientsBody = document.querySelector(".ingredients");
const TotalNutrients = document.querySelector(".TotalNutrients");
const nutritionList = document.querySelector(".nutritionList");

let foodData;




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

const params = new URLSearchParams(window.location.search);
const foodId = params.get("foodId");
const getPrice = params.get("price");
let userCurrentId;
const AppId = "d0c93511"; 
const AppKey = `2a1156174ad4b9be872456f9225f4ad1
`;
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(userColReference, user.uid);
    const docSnapShot = await getDoc(userRef);
    userCurrentId = user.uid;
    const userData = docSnapShot.data();

    if (docSnapShot.exists()) {
      console.log(userData.Username);
    }
    singleFood();
  } else {
    window.location.href = "../SignIn Page/signIn.html";
  }
});

const singleFood = async () => {
  try {
    const baseUrl = `https://api.edamam.com/api/recipes/v2/${foodId}?type=public&app_id=${AppId}&app_key=${AppKey}`;
    const response = await fetch(baseUrl, {
      headers: {
        "Edamam-Account-User": userCurrentId,
      },
    });
    const foodData = await response.json();
    // console.log(foodData);
    // const eachFoods = res.hits

    // console.log(eachFoods);
    imageSection.innerHTML = `<img src="${foodData.recipe.image}" alt="${foodData.recipe.label}" class="singleImg">`;
    foodInfo.innerHTML = `
  <div style="line-height: 1.8; font-family: Arial, sans-serif;">
    <h2 style="margin-bottom: 0.5rem;">${foodData.recipe.label}</h2>
    
    <p><strong>Calories:</strong> ${Math.round(foodData.recipe.calories)}</p>
    <p><strong>Cuisine:</strong> ${
      foodData.recipe.cuisineType?.[0] || "N/A"
    }</p>
    <p><strong>Meal Type:</strong> ${foodData.recipe.mealType?.[0] || "N/A"}</p>
    <p><strong>Dish Type:</strong> ${foodData.recipe.dishType?.[0] || "N/A"}</p>
    <p><strong>Price :</strong> ${getPrice}</p>
    <div class="rating" >
      <strong>Rating:</strong> 
      <span class="icon">    ★★★★★ </span>
      <span style="font-size: 0.9rem; color: #666;">(Customer Reviews)</span>
    </div>
    <a href="../index.html">
    <button class="btnsss">Continue Shopping⏭️</button>
    </a>
  </div>`;
  } catch (error) {
    console.log(error);
  }
};

const getIngredients = async () => {
  try {
    const baseUrl = `https://api.edamam.com/api/recipes/v2/${foodId}?type=public&app_id=${AppId}&app_key=${AppKey}`;
    const response = await fetch(baseUrl, {
      headers: {
        "Edamam-Account-User": userCurrentId,
      },
    });
    const data = await response.json();
    // console.log(data);
    // console.log(data.recipe.ingredients[0].weight);

    const eachIngredients = data.recipe.ingredients
    

    nutritionList.innerHTML = `
 <div class="foodListWrap">
    <li>${eachIngredients[0]?.text || "N/A"},<b>Quantity</b>  ${eachIngredients[0]?.quantity || "N/A"} , <b>Weight</b> ${eachIngredients[0]?.weight}  || "N/A   </li>
    <li>${eachIngredients[1]?.text || "N/A"} ,  <b>Quantity,</b>   ${eachIngredients[1]?.quantity  || "N/A" }  <b>Weight , </b> ${eachIngredients[1]?.weight  || "N/A" }  </li>
    
     </div>`;
  } catch (error) {
    console.log(error);
  }
};
getIngredients();

//Get Ingredients
   ingredientsBody.addEventListener("click",async()=>{
    try {
      const baseUrl = `https://api.edamam.com/api/recipes/v2/${foodId}?type=public&app_id=${AppId}&app_key=${AppKey}`;
    const response = await fetch(baseUrl, {
      headers: {
        "Edamam-Account-User": userCurrentId,
      },
    });
    const data = await response.json();
    // console.log(data);
    // nutritionList.innerHTML = ""

    nutritionList.innerHTML = `
 <div class="foodListWrap">
    <li>${data.recipe.ingredients[0].text},<b>Quantity</b>  ${data.recipe.ingredients[0].quantity} , <b>Weight</b> ${data.recipe.ingredients[0].weight}    </li>
    <li>${data.recipe.ingredients[1].text} ,  <b>Quantity,</b>   ${data.recipe.ingredients[1].text}  <b>Weight , </b> ${data.recipe.ingredients[1].weight} </li>
    <li>${data.recipe.ingredients[2].text} ,  <b>Quantity,</b>   ${data.recipe.ingredients[2].text}  <b>Weight , </b> ${data.recipe.ingredients[2].weight} </li>
     </div>`;
    } catch (error) {
      console.log(error);
      
    }
   })


HealthInfo.addEventListener("click", async () => {
  try {
    const baseUrl = `https://api.edamam.com/api/recipes/v2/${foodId}?type=public&app_id=${AppId}&app_key=${AppKey}`;
    const response = await fetch(baseUrl, {
      headers: {
        "Edamam-Account-User": userCurrentId,
      },
    });
    const data = await response.json();
    // console.log(data);

    nutritionList.innerHTML = "";
    nutritionList.innerHTML = `
         <div>  ${data.recipe.healthLabels
           .map((label) => `<div class="labelTag">${label} , </div>`)
           .join("")}
      </div>`;
  } catch (error) {
    console.log(error);
    
  }
});

TotalNutrients.addEventListener("click",async()=>{
  try {
    
     const baseUrl = `https://api.edamam.com/api/recipes/v2/${foodId}?type=public&app_id=${AppId}&app_key=${AppKey}`;
    const response = await fetch(baseUrl, {
      headers: {
        "Edamam-Account-User": userCurrentId,
      },
    });
    const nutrients = await response.json()
    // console.log(nutrients); 
    
    // const nutrients = datas;
    
    // console.log(nutrients);
    
    nutritionList.innerHTML = `
    <div>
      <h5>Nutritional Information</h5>
      <ul>
        <li><b>Calories:</b> ${Math.round(nutrients.recipe.totalNutrients.CA
.quantity)} kcal</li>
        <li><b>Protein:</b> ${Math.round(nutrients.recipe.totalNutrients.PROCNT.quantity)} g</li>
        <li><b>Fat:</b> ${Math.round(nutrients.recipe.totalNutrients.FAT.quantity)} g</li>
        <li><b>Carbs:</b> ${Math.round(nutrients.recipe.totalNutrients.
ENERC_KCAL
.quantity)} g</li>
        <li><b>Cholesterol:</b> ${Math.round(nutrients.recipe.totalNutrients.CHOLE.quantity)} mg</li>
      </ul>
    </div>`;
  } catch (error) {
    console.log(error);
    
  }
})
