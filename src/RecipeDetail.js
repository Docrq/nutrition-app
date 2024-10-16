import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function RecipeDetail() {
  const { id } = useParams(); // Récupérer l'id de la recette à partir de l'URL
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = '2fb0ae0397c74c22b9e4a5610c19665b'; // Remplacez par votre clé API
  const apiUrl = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`; // Utiliser l'id dans l'URL

  // Fonction pour récupérer les détails de la recette
  const fetchRecipeDetail = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des détails de la recette.');
      }
      const data = await response.json();
      setRecipe(data);
    } catch (err) {
      console.error('Fetch error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipeDetail();
  }, [id]); // Dépendance sur l'id de la recette

  if (loading) return <div>Chargement des détails de la recette...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="recipe-detail">
      <h2>{recipe.title}</h2>
      <img src={recipe.image} alt={recipe.title} />
      <p dangerouslySetInnerHTML={{ __html: recipe.summary }} /> {/* Utiliser dangerouslySetInnerHTML pour les résumés HTML */}
      <h4>Ingrédients :</h4>
      <ul>
        {recipe.extendedIngredients.map((ingredient) => (
          <li key={ingredient.id}>{ingredient.original}</li>
        ))}
      </ul>
      <h4>Instructions :</h4>
      <p dangerouslySetInnerHTML={{ __html: recipe.instructions }} /> {/* Utiliser dangerouslySetInnerHTML pour les instructions HTML */}
    </div>
  );
}

export default RecipeDetail;
