from flask import Flask, json, render_template, request, make_response, session, redirect, url_for, flash, abort, jsonify, send_file, Response
from mysql.connector.utils import read_bytes
from werkzeug.utils import secure_filename
import os, sys
from docxtpl import DocxTemplate, InlineImage
from DateTime import DateTime
import time
import calendar
from datetime import datetime
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Alignment
from docx.shared import Mm
from flask_cors import CORS
import uuid
import io
import base64
from PIL import Image
import json
# sumber mongodb : https://www.w3schools.com/python/python_mongodb_getstarted.asp

# import datetime

app = Flask(__name__)
CORS(app)
app.secret_key = 'randomterserah'

# upload gambar
app.config['UPLOAD_FOLDER'] = 'static'

# mydb = mysql.connector.connect(
#     host="127.0.0.1",
#     user="root",
#     password="",
#     database="nandapro_seismon"
# )

# biar tidak error saat get data yang kedua dst

# mydb = mysql.connector.connect(
#     host="localhost",
#     user="nandapro_nata",
#     password="nawi_bajo",
#     database="nandapro_displaybajo",
#     buffered=True,
# )

# mycursor = mydb.cursor()

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'json'}

@app.route('/', methods=['GET', 'POST'])
def index():
    
    return render_template("index.html")

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    
    return render_template("index.html")
    
@app.errorhandler(404)
def not_found(error=None):
    message = {
        'status': 404,
        'message': 'Not Found ' + request.url
    }
    resp = jsonify(message)
    resp.status_code = 404
    return resp


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
