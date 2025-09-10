from flask import Flask, render_template, jsonify
import json, os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/db-connection')
def dbConnection():
    return render_template('db-connection.html')

@app.route('/settings')
def settingsPage():
    return render_template('settings.html')

@app.route('/getBookmarks')
def getConfig():
    with open('./app-config/bookmarks.json', 'r') as f:
        bookmarks = json.load(f)
    return jsonify(bookmarks)