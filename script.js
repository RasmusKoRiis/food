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

            // Move buttons to the bottom
            plusButton.classList.add("bottom-position");
            weekButton.classList.add("bottom-position");
          })
          .catch((error) => {
            console.error("Error fetching recipes:", error);
            alert("Could not load recipes. Please try again later.");
          });
      }
    
    function getFilteredRecipes() {
        return fetch("recipes.json")
          .then((response) => response.json())
          .then((data) => {
            let recipes = data.recipes;
      
            const excludeMeat = document.getElementById("exclude-meat").checked;
            const excludeFish = document.getElementById("exclude-fish").checked;
            const excludeVegetarian = document.getElementById("exclude-vegetarian").checked;
            const excludeNonWeb = document.getElementById("exclude-non-web").checked;
      
            if (excludeMeat) {
              recipes = recipes.filter((r) => r.type.toLowerCase() !== "meat");
            }
            if (excludeFish) {
              recipes = recipes.filter((r) => r.type.toLowerCase() !== "fish");
            }
            if (excludeVegetarian) {
              recipes = recipes.filter((r) => r.type.toLowerCase() !== "vegetarian");
            }
            if (excludeNonWeb) {
              recipes = recipes.filter((r) => {
                const loc = r.location || "";
                return loc.startsWith("http://") || loc.startsWith("https://");
              });
            }
      
            return recipes; // Return the filtered list
          });
    }

    function pickSevenRecipes() {
      getFilteredRecipes().then((recipes) => {
        if (recipes.length < 7) {
          alert(`Only ${recipes.length} recipes left after filtering. Need at least 7!`);
          return;
        }
    
        // 1. Shuffle or randomly pick 7 unique recipes from the array
        const chosenSeven = [];
        const workingArray = [...recipes]; // copy to avoid mutating original
    
        for (let i = 0; i < 7; i++) {
          const randomIndex = Math.floor(Math.random() * workingArray.length);
          chosenSeven.push(workingArray.splice(randomIndex, 1)[0]);
        }
    
        // 2. Create an email body (plain text)
        // Each recipe: name, mainIngredient, notes, location, etc.
        let bodyText = 'Here are 7 recipes for your week:\n\n';
        chosenSeven.forEach((r, index) => {
          bodyText += `Day ${index + 1}: ${r.name}\n`;
          bodyText += `Main: ${r.mainIngredient}\n`;
          bodyText += `Notes: ${r.notes || "No additional notes"}\n`;
          bodyText += `Location: ${r.location}\n\n`; 
        });
        bodyText += 'Enjoy your meals!';
    
        // 3. Encode the body for the mailto link
        const encodedBody = encodeURIComponent(bodyText);
        // Also encode the subject
        const subject = encodeURIComponent('Dinner for a Week');
    
        // 4. Construct a mailto URL 
        // Replace "youremail@example.com" with the address you want to send to
        const mailtoLink = `mailto:youremail@example.com?subject=${subject}&body=${encodedBody}`;
    
        // 5. Open the default mail client with the pre-filled recipes
        window.location.href = mailtoLink;
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

        // Move buttons back to the top
      plusButton.classList.remove("bottom-position");
      weekButton.classList.remove("bottom-position");
    });
  
    // Plus button (top-left corner) => placeholder

    // The red overlay & close button
    const cookbookOverlay = document.getElementById("cookbook-overlay");
    const closeOverlayBtn = document.getElementById("back-btn");

    plusButton.addEventListener("click", () => {
      cookbookOverlay.classList.remove("hidden-overlay");
      });
  
      // Close button inside the overlay
      closeOverlayBtn.addEventListener("click", () => {
      // Hide the overlay by re-adding the "hidden-overlay" class
      cookbookOverlay.classList.add("hidden-overlay");
    });

    const weekButton = document.getElementById("week-button");
    weekButton.addEventListener("click", pickSevenRecipes);

  });
  