


import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import { app } from "../FirebaseConfig/firebase.js";

import {
  getFirestore,
  collection,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);


const togglenav = document.querySelector(".toggleNav");
const navbar = document.querySelector(".navMenu");
// console.log(recipe.label);
const toogleBtn = document.querySelector(".toggle-button");
const closeNav = document.querySelector(".closeNav");
const userColReference = collection(db, "Users");

const viewMoreBtn = document.querySelector(".viewMore")

onAuthStateChanged(auth, async(user)=>{
    if(user){
        const docRef =  doc(userColReference,user.uid)
        const userCredentials = await getDoc(docRef)
        console.log(userCredentials.data());
        
        console.log(user.uid);
        
    }
    else{
        window.location.href = "../SignIn Page/signIn.html"
    }
})


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


viewMoreBtn.addEventListener("click",()=>{
  window.location.href = "../DashBoardPage/dashboard.html"
})