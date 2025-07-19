import {
  getAuth,
  createUserWithEmailAndPassword,sendEmailVerification
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import { app } from "../FirebaseConfig/firebase.js";

import {
  getFirestore,
  setDoc,
  doc,
  collection,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

// const auth = getAuth(app)

const userColReference = collection(db, "Users");

const usernameEl = document.getElementById("username");
const fullNameEl = document.getElementById("name");
const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const signUpForm = document.querySelector(".signup-container");
const btnEl = document.querySelector(".textCart");

const checkPassword = document.getElementById("showPassword");
const errorMessageEl = document.getElementById("errorMessage");
const loaderBtn = document.querySelector(".loader")

checkPassword.addEventListener("change", function () {
  passwordEl.type = this.checked ? "text" : "password";
});

const signUserUp = async () => {
  btnEl.textContent = "Signingg Up...";
  btnEl.disabled = true;
  loaderBtn.classList.remove("d-none")

  try {
    const userLogin = await createUserWithEmailAndPassword(
      auth,
      emailEl.value,
      passwordEl.value
    );
    const userCredentials = await userLogin.user;
    console.log(userCredentials);

    if (userCredentials) {
      await setDoc(doc(userColReference, userCredentials.uid), {
        Name: fullNameEl.value,
        Username: usernameEl.value,
        Email: emailEl.value,
        createdAt: new Date(),
      });
      await sendEmailVerification(userCredentials)
      alert("Succesful Sign Up");
      window.location.href = "../SignIn Page/index.html";
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
    } else if (error.code == "auth/email-already-in-use") {
      errorMessageEl.textContent = "Email Already in use";
    }
    console.log(error);
  } finally {
     loaderBtn.classList.add("d-none")
    btnEl.textContent = "Register";
    btnEl.disabled = false;
  }
};

signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  signUserUp();
});
