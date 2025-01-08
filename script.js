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
      
        // New toggle => exclude recipes NOT on the web
        const excludeNonWeb = document.getElementById("exclude-non-web").checked;
      
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
      
            // Filter out recipes not on the web (location must start with http:// or https://)
            if (excludeNonWeb) {
              recipes = recipes.filter((r) => {
                const loc = r.location || "";
                return loc.startsWith("http://") || loc.startsWith("https://");
              });
            }
      
            // If no recipes left, show an alert
            if (recipes.length === 0) {
              alert("No recipes match your filters!");
              return;
            }
      
            // Pick a random recipe
            const randomIndex = Math.floor(Math.random() * recipes.length);
            const chosenRecipe = recipes[randomIndex];
      
            // --- Handle clickable link logic (if you have it) ---
            // For example:
            const locationField = chosenRecipe.location || "";
            const isLink = locationField.startsWith("http://") || locationField.startsWith("https://");
            if (isLink) {
              recipeLocation.innerHTML = `<a href="${locationField}" target="_blank" style="color: #ff820e;">
                Let´s Cook!
              </a>`;
            } else {
              recipeLocation.textContent = locationField;
            }
            // ----------------------------------------------------
      
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
  