import React from "react";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import RecipeExcerpt from "./components/RecipeExcerpt";
import RecipeFull from "./components/RecipeFull";
import NewRecipeForm from "./components/NewRecipeForm";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showNewRecipeForm, setShowNewRecipeForm] = useState(false)
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    servings: 1, // conservative default
    description: "",
    image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" //default
  })

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe)
  }

  const handleUnselectRecipe = () => {
    setSelectedRecipe(null)
  }

  const showRecipeForm = () => {
    setShowNewRecipeForm(true)
    setSelectedRecipe(null)
  }

  const hideRecipeForm = () => {
    setShowNewRecipeForm(false)
  }

  const handleChange = (e, action = "new") => {
    const { name, value } = e.target;
    if (action === "update") {
      setSelectedRecipe({ ...selectedRecipe, [name]: value });
    } else {
      setNewRecipe({ ...newRecipe, [name]: value });
    }
  }

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

  const handleNewRecipe = async(e, newRecipe) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newRecipe)
      });
      if (!response.ok) {
        throw new Error(`Failed to add recipe ${response.status}`)
      }
      const data = await response.json();
      setRecipes([...recipes, data.recipe])
      setShowNewRecipeForm(false)
      setNewRecipe({
        title: "",
        ingredients: "",
        instructions: "",
        servings: 1, // conservative default
        description: "",
        image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" //default
      })
    } catch(error) {
      console.error("Error adding recipe", error)
      console.log("Error adding recipe", error.message)
      return
    }
  }

  const handleUpdateRecipe = async(e, selectedRecipe) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/recipes/${selectedRecipe.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(selectedRecipe)
      });
      if (!response.ok) {
        throw new Error(`Failed to update recipe ${response.status}`)
      }
      const data = await response.json();   
      setRecipes(recipes.map((recipe) => {
        if (recipe.id === selectedRecipe.id) {
          return data.recipe;
        } else {
          return recipe;
        }
      }))
      setSelectedRecipe(null)
    } catch(error) {
      console.error("Error updating recipe", error)
      console.log("Error updating recipe", error.message)
      return
    }
  }

  return (
    <div className='recipe-app'>
      <Header showRecipeForm={showRecipeForm} />
      {showNewRecipeForm && <NewRecipeForm newRecipe={newRecipe} hideRecipeForm={hideRecipeForm} handleChange={handleChange} handleNewRecipe={handleNewRecipe} />}
      {selectedRecipe && <RecipeFull selectedRecipe={selectedRecipe} handleUnselectRecipe={handleUnselectRecipe} handleChange={handleChange} handleUpdateRecipe={handleUpdateRecipe} />}
      {selectedRecipe === null && showNewRecipeForm === false && (
        <div className="recipe-list">
          {recipes.map((recipe) => (
            <RecipeExcerpt recipe={recipe} key={recipe.id} handleSelectRecipe={handleSelectRecipe} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;


