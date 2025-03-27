fetch('../assets/json/recipes.json')
    .then(response => response.json())
    .then(recettes => displayRecipes(recettes))

function displayRecipes(recettes) {
    const recipesList = document.getElementById('recipes-list');
    recipesList.innerHTML = '';

    recettes.slice(0, 50).forEach(recette => {
        const recetteCard = document.createElement('div');
        recetteCard.classList.add('col');

        const ingredientsHTML = recette.ingredients.map(ing => `
            <li class="card-ingredients-list-item">
                <span class="card-ingredients-list-item-ingredient">${ing.ingredient}</span>
                <span class="card-ingredients-list-item-quantity">${ing.quantity || ''}</span>
                <span class="card-ingredients-list-item-unit">${ing.unit || ''}</span>
            </li>
        `).join('');

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
}
