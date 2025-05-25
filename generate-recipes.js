const fs = require('fs');
const path = require('path');

const recipesPath = path.join(__dirname, 'recipes.json');
const templatePath = path.join(__dirname, 'recipe-template.html');
const outputDir = path.join(__dirname, 'recipes', 'self');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const recipes = JSON.parse(fs.readFileSync(recipesPath, 'utf8')).recipes;
const template = fs.readFileSync(templatePath, 'utf8');

recipes.forEach(recipe => {
  // Only process recipes with a local html location and a body
  if (
    recipe.location &&
    recipe.location.startsWith('recipes/self/') &&
    recipe.location.endsWith('.html') &&
    recipe.body
  ) {
    let html = template
      .replace(/{{name}}/g, recipe.name)
      .replace(/{{mainIngredient}}/g, recipe.mainIngredient)
      .replace(/{{type}}/g, recipe.type)
      .replace(/{{notes}}/g, recipe.notes || '')
      .replace(/{{body}}/g, recipe.body);
    const outPath = path.join(__dirname, recipe.location);
    fs.writeFileSync(outPath, html, 'utf8');
    console.log(`Generated ${outPath}`);
  }
});
