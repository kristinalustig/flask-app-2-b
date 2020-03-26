# Do not change anything in this file for this exercise
import json
import os
from flask import Flask, escape, request, jsonify, render_template

app = Flask(__name__)

# Take data from pokemon.json and turn it into a Python dictionary to store in DATABASE
with open('data/pokemon.json') as f:
  DATABASE = json.load(f)

# Track the ID that will be used for new pokemon when they are added to DATABASE
current_id = len(DATABASE) + 1

# Home page route that serves index.html
@app.route('/')
def index():
    return render_template('index.html')

# Detail page route that serves detail.html
# For example /1 will give you the detail page for Bulbasaur
@app.route('/<int:id>')
def detail(id):
    return render_template('detail.html')

# API route that returns all pokemon from DATABASE
@app.route('/api/pokemon', methods=['GET'])
def api_pokemon_get():
    return jsonify(DATABASE), 200

# API route that returns a single pokemon from DATABASE according to the ID in the URL
# For example /api/pokemon/1 will give you Bulbasaur
@app.route('/api/pokemon/<int:id>', methods=['GET'])
def api_pokemon_id_get(id):
    for pokemon in DATABASE:
        if pokemon.get("id") == id:
            return jsonify(pokemon), 200
    return jsonify({}), 404

# API route that creates a new pokemon using the request body JSON and inserts it at the end of DATABASE
# For example, sending { "name": "Chikorita", ... } to /api/pokemon will add a dictionary representing Chikorita into DATABASE
@app.route('/api/pokemon', methods=['POST'])
def api_pokemon_id_post():
    # Declare current_id as a global so it can be used correctly in this function
    global current_id

    # Get the JSON from the request body and turn it into a Python dictionary
    json = request.get_json()

    # Validating the request body before inserting it into DATABASE
    keys = ["name", "description", "img_url", "types", "evolutions"]
    for key in keys:
        # Make sure all the required keys in the keys list is in the response json
        if key not in json:
            return jsonify({
                "error": ("You are missing the '" + key  + "' in your request body")
            }), 400
        # Make sure the values at the types and evolutions keys are lists
        if key in ["types", "evolutions"] and not isinstance(json[key],list):
            return jsonify({
                "error": ("Your value at '" + key  + "' must be a list, not a '" + type(json[key]).__name__ + "'")
            }), 400

    # Create a dictionary that contains all of the request json information and a new ID
    pokemon = {
        "id": current_id,
        "name": json["name"],
        "description": json["description"],
        "img_url": json["img_url"],
        "types": [],
        "evolutions": []
    }
    # Add the new pokemon entry to the end of the global DATABASE list
    DATABASE.append(pokemon)

    # Increment the current_id by 1 so it will be unique for the next inserted pokemon
    current_id = current_id + 1

    # Return the newly inserted pokemon as a response
    return jsonify(pokemon)

# API route that does a full update by replacing the entire pokemon dictionary at the specified ID with the request body JSON
# For example sending { "name": "Foobar" } to /api/pokemon/1 would replace the Bulbasaur dictionary with the object { "name": "Foobar" }
@app.route('/api/pokemon/<int:id>', methods=['PUT'])
def api_pokemon_id_put(id):

    # Get the JSON from the request body and turn it into a Python dictionary
    json = request.get_json(id)

    # Iterate through the pokemon DATABASE, making sure the index is available by using enumerate()
    for index, pokemon in enumerate(DATABASE):

        # If the ID matches, replace the entire pokemon dictionary with the request body JSON at the same index
        if pokemon.get("id") == id:
            DATABASE[index] = json
            return jsonify(json), 200
    
    # If no pokemon with the ID in the URL can be found in DATABASE, return nothing
    return jsonify({}), 404

# API route that does a partial update by changing the values of the pokemon dictionary at the specified ID with the values in request body JSON
# For example sending { "name": "Foobar" } to /api/pokemon/1 would only change Bulbasaur's name to "Foobar" - nothing else would change
@app.route('/api/pokemon/<int:id>', methods=['PATCH'])
def api_pokemon_id_patch(id):

    # Get the JSON from the request body and turn it into a Python dictionary
    json = request.get_json()

    # Iterate through all of the pokemon DATABASE
    for pokemon in DATABASE:
        # Find a matching pokemon with the ID specified in the URL
        if pokemon.get("id") == id:
            # Go through every key in the pokemon dictionary
            for key in pokemon:
                # Get the value of the key, or if it has no value, False
                jsonValue = json.get(key, False)
                # Make sure there is a value and make it's the same type as the existing value
                if jsonValue and type(jsonValue) == type(pokemon[key]):
                    # Replace the value of the key
                    pokemon[key] = jsonValue
            
            # Return the modified pokemon dictionary as a response
            return jsonify(pokemon), 200

    # If no pokemon with the ID in the URL can be found in DATABASE, return nothing
    return jsonify({}), 404

# API route that deletes a single pokemon from DATABASE
# For example /api/pokemon/1 will delete Bulbasaur
@app.route('/api/pokemon/<int:id>', methods=['DELETE'])
def api_pokemon_id_delete(id):
    # Declare DATABASE as a global so it can be used correctly in this function
    global DATABASE

    # Filter the list so any pokemon dictionaries with the ID specified in the URL are removed from DATABASE
    DATABASE = list(filter(lambda x: x.get("id") != id, DATABASE))

    # Return an empty object
    return jsonify({}), 200

if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)