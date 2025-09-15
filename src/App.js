import React from "react";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import RecipeExcerpt from "./components/RecipeExcerpt";
import RecipeFull from "./components/RecipeFull";
import NewRecipeForm from "./components/NewRecipeForm";
import displayToast from "./helpers/toastHelper.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([])
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showNewRecipeForm, setShowNewRecipeForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
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

  const updateSearchTerm = (text) => {
    setSearchTerm(text)
  }

  const handleSearch = () => {
    const searchResults = recipes.filter((recipe) => {
      const valuesToSearch = [recipe.title, recipe.ingredients, recipe.description];
      return valuesToSearch.some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()));
    });
    return searchResults;
  };
  
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
      displayToast("Recipe added successfully!", "success")
    } catch(error) {
      console.error("Error adding recipe", error)
      displayToast("Oops, could not add recipe", "error")
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
      displayToast("Recipe updated successfully!", "success")
    } catch(error) {
      console.error("Error updating recipe", error)
      displayToast("Oops, could not update recipe", "error")
    }
  }

  const handleDeleteRecipe = async(selectedRecipe) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/recipes/${selectedRecipe.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete recipe ${response.status}`)
      }
      const data = await response.json(); 
      console.log(data.message)
      setRecipes(recipes.filter((recipe) => recipe.id !== selectedRecipe.id))  
      setSelectedRecipe(null)
      displayToast("Recipe deleted successfully!", "success")
    } catch(error) {
      console.error("Error deleting recipe", error)
      displayToast("Oops, could not delete recipe", "error")
    }
  }

  const displayAllRecipes = () => {
    setShowNewRecipeForm(false)
    setSelectedRecipe(null)
    setSearchTerm("")
  }

  const displayedRecipes = searchTerm ? handleSearch() : recipes;

  return (
    <div className='recipe-app'>
      <Header showRecipeForm={showRecipeForm} searchTerm={searchTerm} updateSearchTerm={updateSearchTerm} displayAllRecipes={displayAllRecipes} />
      {showNewRecipeForm && <NewRecipeForm newRecipe={newRecipe} hideRecipeForm={hideRecipeForm} handleChange={handleChange} handleNewRecipe={handleNewRecipe} />}
      {selectedRecipe && <RecipeFull selectedRecipe={selectedRecipe} handleUnselectRecipe={handleUnselectRecipe} handleChange={handleChange} handleUpdateRecipe={handleUpdateRecipe} handleDeleteRecipe={handleDeleteRecipe} />}
      {selectedRecipe === null && showNewRecipeForm === false && (
        <div className="recipe-list">
          {displayedRecipes.map((recipe) => (
            <RecipeExcerpt recipe={recipe} key={recipe.id} handleSelectRecipe={handleSelectRecipe} />
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;


