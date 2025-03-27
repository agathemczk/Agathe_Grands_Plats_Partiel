fetch('../assets/json/recipes.json')
    .then(response => response.json())
    .then(recettes => {
        displayRecipes(recettes);
        attachSearchListener();
        attachIngredientFilterListener(recettes);
    });

function displayRecipes(recettes) {
    const recipesList = document.getElementById('recipes-list');
    recipesList.innerHTML = '';

    const uniqueIngredients = new Set();

    recettes.slice(0, 50).forEach(recette => {
        const recetteCard = document.createElement('div');
        recetteCard.classList.add('col');

        const ingredientsHTML = recette.ingredients.map(ing => {
            uniqueIngredients.add(ing.ingredient.toLowerCase());

            return `
                <li class="card-ingredients-list-item">
                    <span class="card-ingredients-list-item-ingredient">${ing.ingredient}</span>
                    <span class="card-ingredients-list-item-quantity">${ing.quantity || ''}</span>
                    <span class="card-ingredients-list-item-unit">${ing.unit || ''}</span>
                </li>
            `;
        }).join('');

        recetteCard.innerHTML = `
            <div class="card h-100">
                <div class="card-img-top"></div>
                <div class="card-body">
                    <div class="row mb-2">
                        <h2 class="card-title col-8 card-name">${recette.name}</h2>
                        <div class="card-title col-4 text-end card-time-container">
                            <img class="me-1 card-time-watch" alt="" src="./assets/img/watch-time.svg" />
                            <span class="card-time">${recette.time || 'N/A'} min</span>
                        </div>
                    </div>
                    <div class="row">
                        <ul class="card-text col-6 list-unstyled card-ingredients-list">
                            ${ingredientsHTML}
                        </ul>
                        <p class="card-text col-6 card-description">${recette.description || 'Pas de description disponible.'}</p>
                    </div>
                </div>
            </div>
        `;
        recipesList.appendChild(recetteCard);
    });

    updateIngredientsFilter(uniqueIngredients);
}

function attachSearchListener() {
    const searchInput = document.getElementById("search");
    const recipes = document.querySelectorAll(".col");
    const recipesList = document.getElementById('recipes-list');
    const noResultsMessage = document.createElement('p');
    noResultsMessage.classList.add('no-results-message');

    searchInput.addEventListener("input", function () {
        const query = searchInput.value.trim().toLowerCase();
        let found = false;

        if (query.length < 3) {
            recipes.forEach(recipe => recipe.style.display = "block");
            recipesList.removeChild(noResultsMessage);
            return;
        }

        recipes.forEach(recipe => {
            const title = recipe.querySelector(".card-name").textContent.toLowerCase();
            const description = recipe.querySelector(".card-description").textContent.toLowerCase();

            if (title.includes(query) || description.includes(query)) {
                recipe.style.display = "block";
                found = true;
            } else {
                recipe.style.display = "none";
            }
        });

        if (!found) {
            noResultsMessage.textContent = "Aucune recette ne correspond à votre recherche :/" + "\nVous pouvez chercher « tarte aux pommes », « poisson », etc.";
            if (!recipesList.contains(noResultsMessage)) {
                recipesList.appendChild(noResultsMessage);
            }
        } else {
            recipesList.removeChild(noResultsMessage);
        }
    });
}

function attachIngredientFilterListener(recettes) {
    const ingredientFilter = document.getElementById('search-ingredient');
    ingredientFilter.addEventListener('input', function () {
        const selectedIngredient = ingredientFilter.value.toLowerCase();
        const recipes = document.querySelectorAll('.col');
        const recipesList = document.getElementById('recipes-list');
        const noResultsMessage = document.createElement('p');
        noResultsMessage.classList.add('no-results-message');
        let found = false;

        recipes.forEach(recipe => {
            const ingredients = recipe.querySelectorAll('.card-ingredients-list-item-ingredient');
            let matches = false;

            ingredients.forEach(ingredient => {
                if (ingredient.textContent.toLowerCase().includes(selectedIngredient)) {
                    matches = true;
                }
            });

            if (matches) {
                recipe.style.display = "block";
                found = true;
            } else {
                recipe.style.display = "none";
            }
        });

        if (!found) {
            noResultsMessage.textContent = "Aucune recette ne correspond à votre filtre d'ingrédient.";
            if (!recipesList.contains(noResultsMessage)) {
                recipesList.appendChild(noResultsMessage);
            }
        } else {
            recipesList.removeChild(noResultsMessage);
        }
    });
}