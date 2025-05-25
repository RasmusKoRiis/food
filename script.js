document.addEventListener("DOMContentLoaded", () => {
    // Main elements
    const mainRandomBtn = document.getElementById("random-recipe-btn");
    const secondaryRandomBtn = document.getElementById("random-recipe-btn-secondary");
    const recipeDisplay = document.getElementById("recipe-display");
   
    
    // Plus and Week buttons in the header
    const plusButton = document.getElementById("plus-button");
    const weekButton = document.getElementById("week-button");
  
    // Recipe fields
    const recipeName = document.getElementById("recipe-name");
    const recipeLocation = document.getElementById("recipe-location");
    const recipeIngredient = document.getElementById("recipe-ingredient");
    const recipeNotes = document.getElementById("recipe-notes");
  
    // Cookbook Overlay
    const cookbookOverlay = document.getElementById("cookbook-overlay");
    const closeOverlayBtn = document.getElementById("back-btn-overlay"); // Reusing back button to close overlay

    /**
     * Function to pick a random recipe based on filters
     */
    function pickRandomRecipe() {
        // Check toggles
        const excludeMeat = document.getElementById("exclude-meat").checked;
        const excludeFish = document.getElementById("exclude-fish").checked;
        const excludeVegetarian = document.getElementById("exclude-vegetarian").checked;
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
                return !loc.startsWith("https://");
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
      
            // Handle clickable link logic
            const locationField = chosenRecipe.location || "";
const isSelfHosted = locationField.startsWith("recipes/self/");
const isWebLink = locationField.startsWith("http://") || locationField.startsWith("https://");
if (isSelfHosted) {
  const fullUrl = `https://rasmuskoriis.github.io/food/${locationField}`;
  recipeLocation.innerHTML = `<a href="${fullUrl}" target="_blank" style="color: #ff820e; font-weight: bold; text-decoration: none;">Let´s Cook!</a>`;
} else if (isWebLink) {
  recipeLocation.innerHTML = `<a href="${locationField}" target="_blank" style="color: #ff820e; font-weight: bold; text-decoration: none;">Let´s Cook!</a>`;
} else {
  recipeLocation.textContent = locationField;
}
      
            // Populate other fields
            recipeName.textContent = chosenRecipe.name;
            recipeIngredient.textContent = chosenRecipe.mainIngredient;
            recipeNotes.textContent = chosenRecipe.notes || "No additional notes";
      
            // Show recipe section, hide the BIG button
            recipeDisplay.classList.remove("hidden");
            mainRandomBtn.style.display = "none";
  
            // Change button labels for recipe display
            plusButton.textContent = '+'; // Change from 'i' to '+'
            weekButton.textContent = '>'; // Change from '+' to '>'
  
            // Optionally, change button positions if needed
            plusButton.classList.add("bottom-position");
            weekButton.classList.add("bottom-position");
          })
          .catch((error) => {
            console.error("Error fetching recipes:", error);
            alert("Could not load recipes. Please try again later.");
          });
      }
    
    /**
     * Function to get filtered recipes
     */
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
                return !loc.startsWith("https://");
              });
            }
      
            return recipes; // Return the filtered list
          });
    }

    /**
     * Function to pick seven unique recipes and send them via email
     */
    function pickSevenRecipes() {
      getFilteredRecipes().then((recipes) => {
        if (recipes.length < 7) {
          alert(`Only ${recipes.length} recipes left after filtering. Need at least 7!`);
          return;
        }
    
        // Pick 7 unique recipes
        const chosenSeven = [];
        const workingArray = [...recipes]; // copy to avoid mutating original
    
        for (let i = 0; i < 7; i++) {
          const randomIndex = Math.floor(Math.random() * workingArray.length);
          chosenSeven.push(workingArray.splice(randomIndex, 1)[0]);
        }
    
        // Create an email body (plain text)
        let bodyText = 'Here are 7 recipes for your week:\n\n';
        chosenSeven.forEach((r, index) => {
          bodyText += `Day ${index + 1}: ${r.name}\n`;
          bodyText += `Main: ${r.mainIngredient}\n`;
          bodyText += `Notes: ${r.notes || "No additional notes"}\n`;
          bodyText += `Location: ${r.location}\n\n`; 
        });
        bodyText += 'Enjoy your meals!';
    
        // Encode the body for the mailto link
        const encodedBody = encodeURIComponent(bodyText);
        const subject = encodeURIComponent('Dinner for a Week');
    
        // Construct a mailto URL 
        const mailtoLink = `mailto:youremail@example.com?subject=${subject}&body=${encodedBody}`;
    
        // Open the default mail client with the pre-filled recipes
        window.location.href = mailtoLink;
      });
    }

    /**
     * Function to save the currently displayed recipe to localStorage
     */
    function saveCurrentRecipe() {
        const currentRecipe = {
            name: recipeName.textContent,
            location: recipeLocation.querySelector('a') ? recipeLocation.querySelector('a').href : recipeLocation.textContent,
            mainIngredient: recipeIngredient.textContent,
            notes: recipeNotes.textContent
        };

        // Retrieve existing saved recipes from localStorage
        let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];

        // Check for duplicates based on 'name'
        if (!savedRecipes.some(r => r.name === currentRecipe.name)) {
            savedRecipes.push(currentRecipe);
            localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
        } else {
            alert('Recipe already saved.');
        }
    }

    /**
     * Function to send saved recipes via email
     */
    function sendSavedRecipesEmail() {
        const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];

        if (savedRecipes.length === 0) {
            //alert('No recipes saved to send.');
            return;
        }

        // Format recipes into text
        let bodyText = 'Saved Recipes:\n\n';
        savedRecipes.forEach((r, index) => {
            bodyText += `Recipe ${index + 1}:\n`;
            bodyText += `Name: ${r.name}\n`;
            bodyText += `Main Ingredient: ${r.mainIngredient}\n`;
            bodyText += `Notes: ${r.notes}\n`;
            bodyText += `Location: ${r.location}\n\n`;
        });
        bodyText += 'Enjoy your recipes!';

        // Encode the body
        const encodedBody = encodeURIComponent(bodyText);
        const subject = encodeURIComponent('My Saved Recipes');

        // Create mailto link
        const mailtoLink = `mailto:?subject=${subject}&body=${encodedBody}`;

        // Trigger mailto
        window.location.href = mailtoLink;

        // Optionally, clear saved recipes after sending
        localStorage.removeItem('savedRecipes');
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
  

    // Plus button (header)
    plusButton.addEventListener("click", () => {
        if (recipeDisplay.classList.contains("hidden")) {
            // Front page: open cookbook overlay
            cookbookOverlay.classList.remove("hidden-overlay");
        } else {
            // Recipe display: save current recipe
            saveCurrentRecipe();

            // Toggle Plus Button Color
            togglePlusButtonColor();
        }
    });
  
    // Week button (header)
    weekButton.addEventListener("click", () => {
        if (recipeDisplay.classList.contains("hidden")) {
            // Front page: pick seven recipes and send email
            pickSevenRecipes();
        } else {
            // Recipe display: send saved recipes via email
            sendSavedRecipesEmail();
        }
    });

      /**
     * Function to toggle the plus button's color between two states
     */
       function togglePlusButtonColor() {
        if (plusButton.classList.contains("plus-button-color1")) {
            plusButton.classList.remove("plus-button-color1");
            plusButton.classList.add("plus-button-color2");
        } else if (plusButton.classList.contains("plus-button-color2")) {
            plusButton.classList.remove("plus-button-color2");
            plusButton.classList.add("plus-button-color1");
        } else {
            // If no color class is present, default to color1
            plusButton.classList.add("plus-button-color1");
        }
    }

    // Close Overlay Button
    closeOverlayBtn.addEventListener("click", () => {
      // Hide the cookbook overlay by adding the "hidden-overlay" class
          cookbookOverlay.classList.add("hidden-overlay");
    });

});