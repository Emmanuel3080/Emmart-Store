import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import { app } from "../FirebaseConfig/firebase.js";


const auth = getAuth(app);


const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const signUpForm = document.querySelector(".form");
const btnEl = document.querySelector(".textCart");

const loader = document.querySelector(".loader")
const checkPassword = document.getElementById("showPassword");
const errorMessageEl = document.getElementById("errorMessage");

checkPassword.addEventListener("change", function () {
//   alert(passwordEl.value);
  passwordEl.type = this.checked ? "text" : "password";
});

const userLoginSession = async () => {
  btnEl.textContent = "Autenticating User..";
  loader.classList.remove("d-none")
  btnEl.disabled = true;

  try {
    const userLogin = await signInWithEmailAndPassword(
      auth,
      emailEl.value,
      passwordEl.value
    );
    const userCredentials = await userLogin.user;
    console.log(userCredentials);


    if(userCredentials){
        alert("Sign In Succesful")
        window.location.href = "../DashBoardPage/dashboard.html"
    }
  } catch (error) {
    errorMessageEl.textContent = "";
    if (error.code == "auth/password-does-not-meet-requirements") {
      errorMessageEl.textContent =
        "Password should include upperCase(A-Z),special characters(#,%,,$) and more than six characters";
    } else if (error.code == "auth/invalid-email") {
      errorMessageEl.textContent = "Invalid Email";
    } else if (error.code === "auth/weak-password") {
      errorMessageEl.textContent = "Password should be at least 6 characters";
    } else if (error.code == "auth/invalid-credential") {
      errorMessageEl.textContent = "Invalid Details";
    }
    console.log(error);
  } finally {
    btnEl.textContent = "Sign In";
     loader.classList.add("d-none")
    btnEl.disabled = false;
  }
};

signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  userLoginSession();
});
