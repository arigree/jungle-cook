import * as $ from "jquery";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { app } from "./firebaseConfig";

export const auth = getAuth(app);

export function changePage(pageName) {
  if (pageName) {
    $.get(`../dist/pages/${pageName}.html`)
      .done((data) => {
        $("#app").html(data);
      })
      // .fail((error) => {
      //   console.error("Error loading page:", error);
      //   alert("Page not found. Redirecting to home.");
      //   window.location.hash = "#home";
      // });
  } else {
    $.get("../dist/pages/home.html")
      .done((data) => {
        $("#app").html(data);
      })
      // .fail((error) => {
      //   console.error("Error loading home page:", error);
      //   alert("Error loading home page. Please try again later.");
      // });
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in");
    $("#login").text("Sign Out");
    $("#login").attr("href", "#");
    $("#login").off("click").on("click", () => signUserOut());
    $(".footer-nav a:contains('Create Recipe')").show();
    $(".footer-nav a:contains('Your Recipes')").show();
    $(".nav a:contains('Create Recipe')").show();
    $(".nav a:contains('View Your Recipes')").show();
  } else {
    console.log("User is signed out");
    $("#login").text("LogIn");
    $("#login").attr("href", "#account");
    $("#login").off("click").on("click", () => (window.location.hash = "#account"));
    $(".footer-nav a:contains('Create Recipe')").hide();
    $(".footer-nav a:contains('Your Recipes')").hide();
    $(".nav a:contains('Create Recipe')").hide();
    $(".nav a:contains('View Your Recipes')").hide();
    if (window.location.hash === "#create" || window.location.hash === "#yourRecipes") {
      window.location.hash = "#account";
      alert("Please log in to access this page.");
    }
  }
});

export function signUserUp(fn, ln, email, password) {
  // console.log("model.js" + fn, ln, email, password);
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      console.log("User Created");
    })
    .catch((error) => {
      console.log(error);
    });
}

export function signUserOut() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("User signed out");
      })
      .catch((error) => {
        console.log("Error signing out:", error);
      });
  }

export function signUserIn(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.hash = "#yourRecipes";
        console.log("User Signed in");
      })
      .catch((error) => {
        console.log("Error during sign-in:", error.message);
      });
  }

  export function getRecipes() {
    return JSON.parse(localStorage.getItem("recipes")) || [];
  }

  export function getRecipeById(id) {
    const recipes = getRecipes();
    return recipes.find(recipe => recipe.id === id);
  }
  
  export function saveRecipes(recipes) {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }
  
  export function addRecipe(recipe) {
    const recipes = getRecipes();
    recipe.id = new Date().getTime();
    //doubt gonna get this to work but yknow why not
    recipes.push(recipe);
    saveRecipes(recipes);
  }
  
  export function updateRecipe(updatedRecipe) {
    const recipes = getRecipes();
    const index = recipes.findIndex(recipe => recipe.id === updatedRecipe.id);
    if (index !== -1) {
      recipes[index] = updatedRecipe;
      saveRecipes(recipes);
    }
  }
  
  export function deleteRecipe(id) {
    let recipes = getRecipes();
    recipes = recipes.filter(recipe => recipe.id !== id);
    saveRecipes(recipes);
  }