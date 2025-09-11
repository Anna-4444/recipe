import time
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///recipes.db'
db = SQLAlchemy(app)

class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    ingredients = db.Column(db.String(500), nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=True, default='Delicious. You need to try it!')
    image_url = db.Column(db.String(500), nullable=True, default="https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")
    servings = db.Column(db.Integer, nullable=False)
    def __repr__(self):
        return f"Recipe(id={self.id}, title='{self.title}', description='{self.description}', servings={self.servings})"

# with app.app_context():
#     db.create_all()
#     db.session.commit()

@app.route("/api/recipes", methods=["GET"])
def get_all_recipes():
    recipes = Recipe.query.all()
    recipe_list = []
    for recipe in recipes:
        recipe_list.append({
            "id": recipe.id,
            "title": recipe.title,
            "ingredients": recipe.ingredients,
            "instructions": recipe.instructions,
            "description": recipe.description,
            "image_url": recipe.image_url,
            "servings": recipe.servings
        })
    return jsonify(recipe_list)

@app.route("/api/recipes", methods=["POST"])
def add_recipe():
    data = request.get_json()  # parses JSON from http request and returns python dictionary or none
    required_fields = ["title", "ingredients", "instructions", "description", "image_url", "servings"]
    for field in required_fields:
        if field not in data or data[field] == "":
            return jsonify({"error": f"Missing required field: {field}"}), 400
    # add recipe to database. new_recipe is an instance of the Recipe class. It is an object.
    new_recipe = Recipe(
        title = data["title"],
        ingredients = data["ingredients"],
        instructions = data["instructions"],
        description = data["description"],        
        image_url = data["image_url"],
        servings = data["servings"]
    )
    db.session.add(new_recipe)
    db.session.commit()
    # serialization - convert the object to a dictionary so python can transform it back into JSON to send as API response
    new_recipe_dictionary = {
        "id": new_recipe.id,
        "title": new_recipe.title,
        "ingredients": new_recipe.ingredients,
        "instructions": new_recipe.instructions,
        "description": new_recipe.description,
        "image_url": new_recipe.image_url,
        "servings": new_recipe.servings
    }
    return jsonify({"message": "Recipe added successfully", "recipe": new_recipe_dictionary})

@app.route("/api/recipes/<int:recipe_id>", methods=["PUT"])
def update_recipe(recipe_id):
    recipe_to_update = Recipe.query.get(recipe_id) # returns an object or none
    if not recipe_to_update:
        return jsonify({"error": "Recipe not found"}), 404
    data = request.get_json() # parses JSON from http request and returns python dictionary or none
    required_fields = ["title", "ingredients", "instructions", "description", "image_url", "servings"]
    for field in required_fields:
        if field not in data or data[field] == "":
            return jsonify({"error": f"Missing required field: {field}"}), 400
    # update recipe in the database
    recipe_to_update.title = data['title']
    recipe_to_update.ingredients = data['ingredients']
    recipe_to_update.instructions = data['instructions']
    recipe_to_update.servings = data['servings']
    recipe_to_update.description = data['description']
    recipe_to_update.image_url = data['image_url']
    db.session.commit()
    #serialization - Turn database model objects into JSON-serializable dictionaries to send as API responses.
    updated_recipe_dictionary = {
        "id": recipe_to_update.id,
        "title": recipe_to_update.title,
        "ingredients": recipe_to_update.ingredients,
        "instructions": recipe_to_update.instructions,
        "description": recipe_to_update.description,
        "image_url": recipe_to_update.image_url,
        "servings": recipe_to_update.servings
    }
    return jsonify({"message": "Recipe Updated successfully", "recipe": updated_recipe_dictionary})

@app.route("/api/recipes/<int:recipe_id>", methods=["DELETE"])
def delete_recipe(recipe_id):
    recipe = Recipe.query.get(recipe_id)
    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404
    db.session.delete(recipe)
    db.session.commit()  
    return jsonify({"message": "Recipe deleted successfully"})

if __name__ == '__main__':
    app.run(debug=True)
