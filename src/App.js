import React from "react";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import RecipeExcerpt from "./components/RecipeExcerpt";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const fetchAllRecipes = async() => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/recipes");
      if (!response.ok) {
        throw new Error(`Failed to fetch recipes: ${response.status}`);
      }
      const data = await response.json();
      setRecipes(data) 
    } catch(error) {
      console.error("Error loading recipes", error)
      console.log("Error loading recipes", error.message)
    }   
  }

  useEffect(() => {
    fetchAllRecipes()
  }, [])

  return (
    <div className='recipe-app'>
      <Header />
      <p>Your recipes here! </p>
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <RecipeExcerpt recipe={recipe} key={recipe.id}/>
        ))}
      </div>
    </div>
  );
}

export default App;


