import React from "react";

const EditRecipeForm = ({ selectedRecipe, handleCancel, handleChange, handleUpdateRecipe}) => {
    return (
        <div className='recipe-form'>
            <h2>Edit "{selectedRecipe.title}"</h2>
            <button className='cancel-button' onClick={handleCancel}>Cancel</button>
            <form onSubmit={(e) => handleUpdateRecipe(e, selectedRecipe)}>
                <label htmlFor="title">Title</label>
                <input id="title" type='text' name='title' value={selectedRecipe.title} onChange={(e) => handleChange(e, "update")} required />

                <label htmlFor="ingredients">Ingredients</label>
                <textarea id="ingredients" name='ingredients' value={selectedRecipe.ingredients} onChange={(e) => handleChange(e, "update")} required />

                <label htmlFor="instructions">Instructions</label>
                <textarea id="instructions" name='instructions' value={selectedRecipe.instructions} onChange={(e) => handleChange(e, "update")} required />

                <label htmlFor="description">Description</label>
                <textarea id="description" name='description' value={selectedRecipe.description} onChange={(e) => handleChange(e, "update")} required />

                <label htmlFor="image">Image</label>
                <input id="image" type='text' name='image_url' value={selectedRecipe.image_url} onChange={(e) => handleChange(e, "update")} required />

                <label htmlFor="servings">Servings</label>
                <input id="servings" type='number' name='servings' value={selectedRecipe.servings} onChange={(e) => handleChange(e, "update")} required />

                <button type='submit'>Update Recipe</button>
            </form>
        </div>
    );
}

export default EditRecipeForm;