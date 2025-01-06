document.addEventListener("DOMContentLoaded", () => {
    // Main elements
    const mainRandomBtn = document.getElementById("random-recipe-btn");
    const secondaryRandomBtn = document.getElementById("random-recipe-btn-secondary");
    const recipeDisplay = document.getElementById("recipe-display");
    const backBtn = document.getElementById("back-btn");
    
    // Plus button in the top-left (for future use)
    const plusButton = document.getElementById("plus-button");
  
    // Recipe fields
    const recipeName = document.getElementById("recipe-name");
    const recipeLocation = document.getElementById("recipe-location");
    const recipeIngredient = document.getElementById("recipe-ingredient");
    const recipeNotes = document.getElementById("recipe-notes");
  
  
    // Reusable function to fetch & pick a random recipe
    function pickRandomRecipe() {
        // Check toggles
        const excludeMeat = document.getElementById("exclude-meat").checked;
        const excludeFish = document.getElementById("exclude-fish").checked;
        const excludeVegetarian = document.getElementById("exclude-vegetarian").checked;
      
        // Load JSON
        fetch("recipes.json")
          .then((response) => response.json())
          .then((data) => {
            let recipes = data.recipes;
      
            // Apply filters
            if (excludeMeat) {
              recipes = recipes.filter((r) => r.type.toLowerCase() !== "meat");
            }
            if (excludeFish) {
              recipes = recipes.filter((r) => r.type.toLowerCase() !== "fish");
            }
            if (excludeVegetarian) {
              recipes = recipes.filter((r) => r.type.toLowerCase() !== "vegetarian");
            }
      
            if (recipes.length === 0) {
              alert("No recipes match your filters!");
              return;
            }
      
            // Pick a random recipe
            const randomIndex = Math.floor(Math.random() * recipes.length);
            const chosenRecipe = recipes[randomIndex];
      
            // Update 'Location' field
            const locationField = chosenRecipe.location || "";
            const isLink =
              locationField.startsWith("http://") ||
              locationField.startsWith("https://");
      
            // If it looks like a link, render as clickable <a>
            if (isLink) {
              recipeLocation.innerHTML = `<a href="${locationField}" target="_blank">Let´s cook!</a>`;
            } else {
              // If not a link, show normal text (e.g., "Cookbook Page 88")
              recipeLocation.textContent = locationField;
            }
      
            // Populate other fields
            recipeName.textContent = chosenRecipe.name;
            recipeIngredient.textContent = chosenRecipe.mainIngredient;
            recipeNotes.textContent = chosenRecipe.notes || "No additional notes";
      
            // Show recipe section, hide the BIG button
            recipeDisplay.classList.remove("hidden");
            mainRandomBtn.style.display = "none";
          })
          .catch((error) => {
            console.error("Error fetching recipes:", error);
            alert("Could not load recipes. Please try again later.");
          });
      }
      
  
    // Main BIG button
    mainRandomBtn.addEventListener("click", pickRandomRecipe);
  
    // Smaller random button on the recipe page
    secondaryRandomBtn.addEventListener("click", pickRandomRecipe);
  
    // Spacebar triggers pickRandomRecipe
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault(); 
        pickRandomRecipe();
      }
    });
  
    // Back button => Hide recipe section, show BIG button again
    backBtn.addEventListener("click", () => {
      recipeDisplay.classList.add("hidden");
      mainRandomBtn.style.display = "inline-block";
    });
  
    // Plus button (top-left corner) => placeholder
    plusButton.addEventListener("click", () => {
      alert("Plus button clicked! Add your desired functionality here.");
    });
  });
  