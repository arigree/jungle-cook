import * as $ from "jquery";
import { signUserUp, signUserOut, signUserIn } from "./model";
import { changePage } from "../src/model.js";

const userRecipes = JSON.parse(localStorage.getItem("recipes")) || [];

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

  $(document).on("click", "#submitBtn", function () {
    console.log("Submit button clicked");

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

    userRecipes.push(recipe);
    localStorage.setItem("recipes", JSON.stringify(userRecipes));

    alert("Recipe submitted successfully!");
    $(".form input").val("");
    console.log("Updated recipes:", userRecipes);
  });
}

function route() {
  const hashTag = window.location.hash || "#";
  const pageID = hashTag.replace("#", "");

  console.log("Routing to:", pageID);

  if (pageID) {
    $.get(`pages/${pageID}.html`, function (data) {
      $("#app").html(data);
      initListeners();

      if (pageID === "create") {
        initListeners();
      } else if (pageID === "showAllRecipes") {
        renderRecipes();
      }
    });
  } else {
    $.get(`pages/create.html`, function (data) {
      $("#app").html(data);
      initListeners();
    });
  }

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

