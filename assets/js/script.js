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

function updateIngredientsFilter(ingredients) {
    const ingredientsList = document.getElementById('ingredients-list');
    ingredientsList.innerHTML = '';
    let count = 0;

    ingredients.forEach(ingredient => {
        if (count >= 30) return;

        const li = document.createElement('li');
        li.classList.add('tags-ingredients');

        const button = document.createElement('button');
        button.classList.add('dropdown-item', 'btn-tag-ingredient');
        button.type = 'button';
        button.value = ingredient;
        button.textContent = ingredient;
        li.appendChild(button);
        ingredientsList.appendChild(li);

        count++;
    });
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
    const ingredientFilter = document.getElementById('ingredients-list');
    const tagsContainer = document.getElementById('tags-container');

    const selectedIngredients = [];

    ingredientFilter.addEventListener('click', function (event) {
        if (event.target && event.target.classList.contains('btn-tag-ingredient')) {
            const selectedIngredient = event.target.value.toLowerCase();

            if (!selectedIngredients.includes(selectedIngredient)) {
                const tagDiv = document.createElement('div');
                tagDiv.id = selectedIngredient;
                tagDiv.classList.add('tags', 'badge', `tag-${selectedIngredient.replace(/\s+/g, '-')}`, 'bg-primary', 'ps-3', 'pe-2', 'py-2', 'me-3', 'mb-2', 'rounded');

                const tagText = document.createElement('span');
                tagText.textContent = capitalizeFirstLetter(selectedIngredient);
                tagDiv.appendChild(tagText);

                const closeButton = document.createElement('button');
                closeButton.id = `btn-close-${selectedIngredient}`;
                closeButton.classList.add('tag-close-btn', 'align-middle', 'ms-1');
                closeButton.setAttribute('aria-label', 'Close');
                closeButton.innerHTML = `<img src="./assets/img/tag-close.svg" alt="" aria-hidden="true" />`;
                closeButton.onclick = function () {
                    selectedIngredients.splice(selectedIngredients.indexOf(selectedIngredient), 1);
                    tagsContainer.removeChild(tagDiv);
                    filterRecipesByTags();
                };
                tagDiv.appendChild(closeButton);
                tagsContainer.appendChild(tagDiv);
                selectedIngredients.push(selectedIngredient);
                filterRecipesByTags();
            }
        }
    });

    function filterRecipesByTags() {
        const recipes = document.querySelectorAll('.col');
        const recipesList = document.getElementById('recipes-list');
        const noResultsMessage = document.createElement('p');
        noResultsMessage.classList.add('no-results-message');
        let found = false;

        recipes.forEach(recipe => {
            const ingredients = recipe.querySelectorAll('.card-ingredients-list-item-ingredient');
            let matches = selectedIngredients.every(ingredient => {
                return Array.from(ingredients).some(ing => ing.textContent.toLowerCase().includes(ingredient));
            });

            if (matches) {
                recipe.style.display = "block";
                found = true;
            } else {
                recipe.style.display = "none";
            }
        });
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}