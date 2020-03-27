# Do not change anything in this file for this exercise
import os
import api
from flask import Flask, render_template

app = Flask(__name__)
app.register_blueprint(api.pokemon, url_prefix="/api")
app.register_blueprint(api.teams, url_prefix="/api")

# Home page route that serves index.html
@app.route('/')
def index():
    return render_template('index.html')

# Detail page route that serves detail.html
# For example /1 will give you the detail page for Bulbasaur
@app.route('/<int:id>')
def detail(id):
    return render_template('detail.html')

if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)