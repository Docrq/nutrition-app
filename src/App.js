import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FastTracker from './FastTracker'; // Assurez-vous que ce chemin est correct
import Recipes from './Recipes'; // Assurez-vous que le chemin est correct
import RecipeDetail from './RecipeDetail'; // Assurez-vous que ce chemin est correct pour le détail de recette
import './App.css';

// Clé API Spoonacular
const API_KEY = '2fb0ae0397c74c22b9e4a5610c19665b';

function App() {
  const [currentDate] = useState(new Date());
  const [calories, setCalories] = useState({
    remaining: 2000,
    eaten: 0,
    burned: 0,
  });
  const [nutrients] = useState({
    carbs: { current: 0, target: 244 },
    protein: { current: 0, target: 98 },
    fat: { current: 0, target: 65 },
  });
  const [meals, setMeals] = useState([
    { id: 1, name: 'Petit déjeuner', calories: 0, target: 500, icon: '⏳', foods: [] },
    { id: 2, name: 'Déjeuner', calories: 0, target: 1000, icon: '🍜', foods: [] },
    { id: 3, name: 'Dîner', calories: 0, target: 1000, icon: '🥗', foods: [] },
    { id: 4, name: 'En-cas', calories: 0, target: 200, icon: '⏳', foods: [] },
  ]);
  const [newFood, setNewFood] = useState({ name: '', calories: 0, mealId: 1 });

  // Gérer l'ajout d'un aliment
  const handleAddFood = (e) => {
    e.preventDefault();
    const updatedMeals = meals.map((meal) => {
      if (meal.id === newFood.mealId) {
        const updatedFoods = [...meal.foods, { name: newFood.name, calories: newFood.calories }];
        const updatedCalories = meal.calories + parseInt(newFood.calories, 10);
        return { ...meal, foods: updatedFoods, calories: updatedCalories };
      }
      return meal;
    });

    const totalEaten = updatedMeals.reduce((sum, meal) => sum + meal.calories, 0);
    setCalories({
      ...calories,
      eaten: totalEaten,
      remaining: 2000 - totalEaten,
    });

    setMeals(updatedMeals);
    setNewFood({ name: '', calories: 0, mealId: 1 });
  };

  // Gérer la suppression d'un aliment
  const handleRemoveFood = (mealId, foodIndex) => {
    const updatedMeals = meals.map((meal) => {
      if (meal.id === mealId) {
        const updatedFoods = meal.foods.filter((_, index) => index !== foodIndex);
        const foodCalories = meal.foods[foodIndex].calories;
        const updatedCalories = meal.calories - foodCalories;
        return { ...meal, foods: updatedFoods, calories: updatedCalories };
      }
      return meal;
    });

    const totalEaten = updatedMeals.reduce((sum, meal) => sum + meal.calories, 0);
    setCalories({
      ...calories,
      eaten: totalEaten,
      remaining: 2000 - totalEaten,
    });

    setMeals(updatedMeals);
  };

  // Ajouter Spoonacular API pour les recettes
  const [spoonacularRecipes, setSpoonacularRecipes] = useState([]);

  useEffect(() => {
    const fetchSpoonacularRecipes = async () => {
      try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=10&maxCalories=800`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setSpoonacularRecipes(data.results);
      } catch (error) {
        console.error('Erreur lors de la récupération des recettes Spoonacular :', error.message);
      }
    };
    fetchSpoonacularRecipes();
  }, []);

  return (
    <Router>
      <div className="app">
        <header className="header">
          <h1>Aujourd'hui</h1>
          <div className="icons-container">
            <span className="icon">🔥 {calories.remaining}</span>
            <span className="icon">📈</span>
            <span className="icon">📅</span>
          </div>
        </header>

        {/* Barre de navigation */}
        <nav className="navigation">
          <Link to="/" className="nav-item">Journal</Link>
          <Link to="/fast" className="nav-item">Jeûne</Link>
          <Link to="/recipes" className="nav-item">Recettes</Link>
          <Link to="/profile" className="nav-item">Profil</Link>
        </nav>

        <Routes>
          {/* Page principale : Suivi des calories et des repas */}
          <Route
            path="/"
            element={
              <>
                <div className="summary-card">
                  <div className="circular-progress">
                    <div className="calories-remaining">
                      <h2>{calories.remaining}</h2>
                      <p>Restantes</p>
                    </div>
                  </div>

                  <div className="nutrient-bars">
                    <div className="nutrient-bar">
                      <div className="bar-label">
                        <span>Glucides</span>
                        <span>{nutrients.carbs.current} / {nutrients.carbs.target} g</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${(nutrients.carbs.current / nutrients.carbs.target) * 100}%` }}></div>
                      </div>
                    </div>

                    <div className="nutrient-bar">
                      <div className="bar-label">
                        <span>Protéines</span>
                        <span>{nutrients.protein.current} / {nutrients.protein.target} g</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${(nutrients.protein.current / nutrients.protein.target) * 100}%` }}></div>
                      </div>
                    </div>

                    <div className="nutrient-bar">
                      <div className="bar-label">
                        <span>Lipides</span>
                        <span>{nutrients.fat.current} / {nutrients.fat.target} g</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${(nutrients.fat.current / nutrients.fat.target) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <p className="current-instruction">🦊 Maintenant : Mangez</p>
                </div>

                <section className="meals-section">
                  <div className="section-header">
                    <h2>Alimentation</h2>
                    <button className="text-button">Plus</button>
                  </div>

                  <div className="meal-list">
                    {meals.map((meal) => (
                      <div key={meal.id} className="meal-item">
                        <div className="meal-info">
                          <span className="meal-icon">{meal.icon}</span>
                          <div className="meal-details">
                            <span className="meal-name">{meal.name}</span>
                            <span className="meal-calories">{meal.calories} / {meal.target} kcal</span>
                          </div>
                        </div>

                        <ul className="food-list">
                          {meal.foods.map((food, index) => (
                            <li key={index}>
                              {food.name} - {food.calories} kcal
                              <button onClick={() => handleRemoveFood(meal.id, index)}>Supprimer</button>
                            </li>
                          ))}
                        </ul>

                        <form onSubmit={handleAddFood}>
                          <input
                            type="text"
                            placeholder="Aliment"
                            value={newFood.name}
                            onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                          />
                          <input
                            type="number"
                            placeholder="Calories"
                            value={newFood.calories}
                            onChange={(e) => setNewFood({ ...newFood, calories: e.target.value })}
                          />
                          <button type="submit" onClick={() => setNewFood({ ...newFood, mealId: meal.id })}>
                            Ajouter
                          </button>
                        </form>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            }
          />

          {/* Page de jeûne */}
          <Route path="/fast" element={<FastTracker />} />

          {/* Page de recettes */}
          <Route path="/recipes" element={<Recipes recipes={spoonacularRecipes} />} />

          {/* Page de détails de la recette */}
          <Route path="/recipe/:id" element={<RecipeDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
