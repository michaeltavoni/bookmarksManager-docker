from flask import Flask, render_template, jsonify
import json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dbConnection')
def dbConnection():
    return render_template('dbConnection.html')

@app.route('/getBookmarks')
def getConfig():
    with open('./app-config/bookmarks.json', 'r') as f:
        bookmarks = json.load(f)
    return jsonify(bookmarks)