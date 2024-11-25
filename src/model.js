import * as $ from "jquery";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { app } from "./firebaseConfig";

const auth = getAuth(app);

export function changePage(pageName) {
  console.log(pageName);
  if (pageName) {
    $.get("../../pages/" + pageName + ".html")
      .done((data) => {
        $("#app").html(data);
      })
      .fail((error) => {
        console.log("error " + error);
        alert("Error loading page: " + error.statusText);
        $.get("../../pages/home.html", (data) => {
          $("#app").html(data);
        }).fail((err) => {
          console.log("Error loading home: " + err);
        });
      });
  } else {
    $.get("../../pages/home.html", (data) => {
      $("#app").html(data);
    }).fail((error) => {
      console.log("error " + error);
      alert("Error loading home: " + error.statusText);
    });
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
      $("#login").off("click").on("click", () => window.location.hash = "#account");
      $(".footer-nav a:contains('Create Recipe')").hide();
      $(".footer-nav a:contains('Your Recipes')").hide();
      $(".nav a:contains('Create Recipe')").hide();
      $(".nav a:contains('View Your Recipes')").hide();
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