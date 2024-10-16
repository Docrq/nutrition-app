import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Recipes = () => {
  const [apiRecipes, setApiRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Liste de recettes locales faibles en calories
  const lowCalorieRecipes = [
    {
      id: 1,
      name: 'Salade de quinoa aux légumes grillés',
      description:
        "Une salade légère et nutritive à base de quinoa, légumes grillés et une vinaigrette au citron.",
      calories: 250,
      ingredients: [
        '1 tasse de quinoa cuit',
        '1 courgette grillée',
        '1 poivron rouge grillé',
        '1/2 avocat',
        '1 cuillère à soupe de vinaigre de cidre',
        '1 cuillère à soupe de jus de citron',
        'Sel et poivre au goût',
      ],
      instructions: [
        'Cuire le quinoa selon les instructions sur l’emballage.',
        'Griller les légumes et les couper en morceaux.',
        'Mélanger le quinoa avec les légumes grillés, l’avocat coupé en dés et la vinaigrette.',
        'Servir frais ou à température ambiante.',
      ],
    },
    {
      id: 2,
      name: 'Smoothie vert détox',
      description:
        "Un smoothie riche en fibres et faible en calories, parfait pour un petit-déjeuner léger.",
      calories: 180,
      ingredients: [
        '1 tasse de lait d’amande non sucré',
        '1 poignée d’épinards frais',
        '1/2 banane',
        '1/2 pomme verte',
        '1 cuillère à soupe de graines de chia',
        'Jus d’un citron',
      ],
      instructions: [
        'Mettre tous les ingrédients dans un blender.',
        'Mixer jusqu’à obtenir une texture lisse.',
        'Servir immédiatement.',
      ],
    },
  ];

  // Utilisation de l'API Spoonacular
  const API_KEY = '2fb0ae0397c74c22b9e4a5610c19665b'; // Clé API
  const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=10&minCalories=50&maxCalories=800`;

  // Fonction pour récupérer des recettes depuis l'API Spoonacular
  useEffect(() => {
    const fetchApiRecipes = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Une erreur est survenue lors de la récupération des données.');
        }
        const data = await response.json();
        setApiRecipes(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApiRecipes();
  }, [apiUrl]);

  // Affichage des recettes locales et celles de l'API
  return (
    <div className="recipes-section">
      <h2>Recettes faibles en calories</h2>

      {/* Recettes locales */}
      <h3>Recettes locales</h3>
      <ul>
        {lowCalorieRecipes.map((recipe) => (
          <li key={recipe.id} className="recipe-item">
            <Link to={`/recipe/${recipe.id}`}>
              <h3>{recipe.name}</h3>
              <p>{recipe.description}</p>
              <strong>Calories: {recipe.calories} kcal</strong>
              <h4>Ingrédients :</h4>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              <h4>Instructions :</h4>
              <ol>
                {recipe.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </Link>
          </li>
        ))}
      </ul>

      {/* Recettes provenant de l'API Spoonacular */}
      <h3>Recettes depuis Spoonacular</h3>
      {loading && <p>Chargement des recettes...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {apiRecipes.map((recipe) => (
          <li key={recipe.id} className="recipe-item">
            <Link to={`/recipe/${recipe.id}`}>
              <h3>{recipe.title}</h3>
              <p>Temps de préparation : {recipe.readyInMinutes} minutes</p>
              <p>Nombre de portions : {recipe.servings}</p>
            </Link>
            <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
              Voir la recette complète
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recipes;
