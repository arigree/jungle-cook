import * as $ from "jquery";
import { signUserUp, signUserOut, signUserIn } from "./model";
import { changePage } from "../src/model.js";

let isSubmitting = false;

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
    $(document).on("click", "#submit", (e) => {
      e.preventDefault();
      console.log("Sign-up button clicked");
      const firstName = $("#fName").val();
      const lastName = $("#lName").val();
      const email = $("#email").val();
      const password = $("#password").val();
      signUserUp(firstName, lastName, email, password);
    });
  }

  if ($("#siSubmit").length) {
    $(document).on("click", "#siSubmit", (e) => {
      e.preventDefault();
      console.log("Login button clicked");
      const siEmail = $("#siEmail").val();
      const siPassword = $("#siPassword").val();
      signUserIn(siEmail, siPassword);
    });
  }

  $(document).on("click", "#so", () => {
    signUserOut();
  });

  $(document).on("click", "#ingredBtn", function () {
    const currentIngredCount = $(".ingreds input").length + 1;
    $(".ingreds").append(
      `<input type="text" id="ingred${currentIngredCount}" placeholder="Ingredient #${currentIngredCount}" />`
    );
  });

  $(document).on("click", "#instructBtn", function () {
    const currentInstructCount = $(".instructs input").length + 1;
    $(".instructs").append(
      `<input type="text" id="instruct${currentInstructCount}" placeholder="Instruction #${currentInstructCount}" />`
    );
  });

  $(document).on("click", "#uploadImageBtn", function() {
    $("#imageFile").click();
  });

  $(document).on("change", "#imageFile", function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const imageUrl = e.target.result;
        $("#imageURL").val(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  });

  $(document).on("click", "#submitBtn", function (e) {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }
    isSubmitting = true;
    console.log("Submit button clicked");

    const recipe = {
      recipeName: $("#recipeName").val(),
      recipeDesc: $("#recipeDesc").val(),
      recipeTime: $("#recipeTime").val(),
      recipeServing: $("#recipeServing").val(),
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

    if (!recipe.recipeName || !recipe.recipeDesc || !recipe.recipeTime || !recipe.recipeServing || recipe.ingredients.length === 0 || recipe.instructions.length === 0) {
      alert("Please fill out all fields before submitting!");
      isSubmitting = false;
      return;
    }
    let userRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    userRecipes.push(recipe);
    localStorage.setItem("recipes", JSON.stringify(userRecipes));
    console.log("Saved recipes:", userRecipes);
    $(".form input").val("");
    alert("Recipe submitted successfully!");
    isSubmitting = false;
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

      if (pageID === "recipeDetail") {
        const recipeId = window.location.hash.split('/')[1];
        displayRecipeDetail(recipeId);
      } else if (pageID === "create") {
        initCreatePage();
      } else if (pageID === "showAllRecipes") {
        renderRecipes();
      } else if (pageID === "edit") {
        initEditPage();
      }
    });
  } else {
    $.get(`pages/create.html`, function (data) {
      $("#app").html(data);
      initListeners();
      initCreatePage();
    });
  }

  changePage(pageID);
}

function renderRecipes() {
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  console.log("Loaded recipes:", recipes);
  const recipeList = document.getElementById("showAllRecipes");

  if (!recipeList) {
    console.error("recipeList element not found.");
    return;
  }

  recipeList.innerHTML = "";

  recipes.forEach((recipe, index) => {
    const recipeImage = recipe.recipeImageURL || "./images/default.jpg";

    const recipeElement = document.createElement("div");
    recipeElement.classList.add("box");

    recipeElement.innerHTML = `
      <div class="image" style="background-image: url('${recipeImage}')"></div>
      <div class="textHolder">
        <h4>${recipe.recipeName}</h4>
        <p>${recipe.ingredients.join(", ")}</p>
        <div class="icons">
          <p><img src="../images/time.svg" alt="Timer Icon" /> ${recipe.recipeTime}</p>
          <p><img src="../images/servings.svg" alt="Servings" /> ${recipe.recipeServing}</p>
        </div>
      </div>
      <div class="btns">
        <button class="viewBtn" onclick="viewRecipe(${index})">View</button>
        <button class="editBtn" onclick="editRecipe(${index})">Edit</button>
        <button class="deleteBtn" onclick="deleteRecipe(${index})">Delete</button>
      </div>
    `;

    recipeList.appendChild(recipeElement);
  });
}

$(document).ready(() => {
  initSite();
});
