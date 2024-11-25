import * as $ from "jquery";
import { signUserUp, signUserOut, signUserIn } from "./model";
import { changePage } from "../src/model.js";

let isSubmitting = false;  // Flag to prevent multiple submissions

function initSite() {
  $(window).on("hashchange", route);
  route();
}

function setupMenu() {
  const hamburgerMenu = document.querySelector(".hamburgerMenu");
  const nav = document.querySelector(".nav");

  hamburgerMenu.addEventListener("click", () => {
    nav.classList.toggle("active");
  });

  $(document).on("click", ".nav", () => {
    nav.classList.toggle("active");
  });
}

function initListeners() {
  console.log("Initializing listeners...");

  if ($("#submit").length) {
    console.log("Sign-up button found");
    $(document).on("click", "#submit", (e) => {
      e.preventDefault();
      console.log("Sign-up button clicked");
      const firstName = $("#fName").val();
      const lastName = $("#lName").val();
      const email = $("#email").val();
      const password = $("#password").val();
      signUserUp(firstName, lastName, email, password);
    });
  } else {
    console.log("Sign-up button not found");
  }

  if ($("#siSubmit").length) {
    console.log("Login button found");
    $(document).on("click", "#siSubmit", (e) => {
      e.preventDefault();
      console.log("Login button clicked");
      const siEmail = $("#siEmail").val();
      const siPassword = $("#siPassword").val();
      signUserIn(siEmail, siPassword);
    });
  } else {
    console.log("Login button not found");
  }

  $(document).on("click", "#so", () => {
    signUserOut();
  });

  $(document).on("click", "#ingredBtn", function () {
    const currentIngredCount = $(".ingreds input").length + 1;
    $(".ingreds").append(
      `<input type="text" id="ingred${currentIngredCount}" placeholder="ingredient #${currentIngredCount}" />`
    );
  });

  $(document).on("click", "#instructBtn", function () {
    const currentInstructCount = $(".instructs input").length + 1;
    $(".instructs").append(
      `<input type="text" id="instruct${currentInstructCount}" placeholder="instruction #${currentInstructCount}" />`
    );
  });

  $(document).on("click", "#submitBtn", function (e) {
    e.preventDefault();
    console.log("Submit button clicked");

    // Prevent multiple submissions
    if (isSubmitting) {
      console.log("Already submitting...");
      return; // Exit if already submitting
    }
    isSubmitting = true;

    let recipe = {
      recipeName: $("#recipeName").val(),
      recipeImageURL: $("#imageURL").val(),
      ingredients: [],
      instructions: [],
    };

    $(".ingreds input").each(function () {
      const value = $(this).val();
      if (value) recipe.ingredients.push(value);
    });

    $(".instructs input").each(function () {
      const value = $(this).val();
      if (value) recipe.instructions.push(value);
    });

    // Update the recipes array in localStorage
    let userRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    userRecipes.push(recipe);
    localStorage.setItem("recipes", JSON.stringify(userRecipes));

    alert("Recipe submitted successfully!");
    $(".form input").val(""); // Clear the form inputs
    console.log("Updated recipes:", userRecipes);

    setTimeout(() => {
      isSubmitting = false;
    }, 10); 
  });
}

function route() {
  const hashTag = window.location.hash || "#";
  const pageID = hashTag.replace("#", "");

  console.log("Routing to:", pageID);

  $.get(`pages/${pageID}.html`, function (data) {
    $("#app").html(data);
    initListeners();

    if (pageID === "create") {
      initListeners(); // Only call once
    } else if (pageID === "showAllRecipes") {
      renderRecipes();
    }
  });

  changePage(pageID);
}

function renderRecipes() {
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  let recipeHTML = "";

  if (recipes.length > 0) {
    recipes.forEach((recipe) => {
      recipeHTML += `
        <div class="recipe">
          <div class="recipeImageHolder">
            <img src="${recipe.recipeImageURL}" alt="Recipe Image" />
          </div>
          <div class="recipeDescription">
            <h2>${recipe.recipeName}</h2>
            <p><strong>Ingredients:</strong> ${recipe.ingredients.join(", ")}</p>
            <p><strong>Instructions:</strong> ${recipe.instructions.join(", ")}</p>
          </div>
        </div>`;
    });
  } else {
    recipeHTML = "<p>No recipes available! Please create one first.</p>";
  }

  $("#showAllRecipes").html(recipeHTML);
}

$(document).ready(function () {
  console.log("Document is ready");
  initSite();
  setupMenu();
});
