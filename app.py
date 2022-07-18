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
import requests
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

@app.route('/gempa', methods=['GET', 'POST'])
def gempa():
    x = requests.get("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json")
    
    # print(x.json())
    
    return x.json()

@app.route('/sat', methods=['GET', 'POST'])
def sat():
    response = requests.get("http://satelit.bmkg.go.id/IMAGE/HIMA/H08_EH_NTT.png")
    base64cuy = base64.b64encode(response.content).decode("utf-8")
    uri = ("data:" +  response.headers['Content-Type'] + ";" + "base64," + base64cuy)
    
    dat = {
        "uri":uri
    }
    # print(aa)
    
    return dat


@app.route('/', methods=['GET', 'POST'])
def index():
    
    lf1 = os.listdir("./static/img/forecast1")
    lf2 = os.listdir("./static/img/forecast2")
    lf3 = os.listdir("./static/img/forecast3")
    lswh = os.listdir("./static/img/swh")
    lw = os.listdir("./static/img/warning")
    
    dat = {
        "forecast1":"img/forecast1/" + lf1[len(lf1)-1],
        "forecast2":"img/forecast2/" + lf2[len(lf2)-1],
        "forecast3":"img/forecast3/" + lf3[len(lf3)-1],
        "swh":"img/swh/" + lswh[len(lswh)-1],
        "warning":"img/warning/" + lw[len(lw)-1]
    }
    
    
    return render_template("index.html", data=dat, f1=dat["forecast1"], f2=dat["forecast2"], f3=dat["forecast3"], swh=dat["swh"], wrn=dat["warning"])

@app.route('/list', methods=['GET', 'POST'])
def list():
    lf1 = os.listdir("./static/img/forecast1")
    lf2 = os.listdir("./static/img/forecast2")
    lf3 = os.listdir("./static/img/forecast3")
    lswh = os.listdir("./static/img/swh")
    lw = os.listdir("./static/img/warning")
    
    dat = {
        "forecast1":"./static/img/forecast1/" + lf1[len(lf1)-1],
        "forecast2":"./static/img/forecast2/" + lf2[len(lf2)-1],
        "forecast3":"./static/img/forecast3/" + lf3[len(lf3)-1],
        "swh":"./static/img/swh/" + lswh[len(lswh)-1],
        "warning":"./static/img/warning/" + lw[len(lw)-1]
    }
    return dat

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        req = request
        forecast1 = req.files['forecast1']
        forecast2 = req.files['forecast2']
        forecast3 = req.files['forecast3']
        swh = req.files['swh']
        warning = req.files['warning']
        
        nameForecast1 = secure_filename(forecast1.filename)
        nameForecast2 = secure_filename(forecast2.filename)
        nameForecast3 = secure_filename(forecast3.filename)
        nameSWH = secure_filename(swh.filename)
        nameWarning = secure_filename(warning.filename)
        
        now = datetime.now()
        timestamp = now.strftime("%Y%m%d_%H%M%S")
        
        if nameForecast1 != '':
            listFile = os.listdir("./static/img/forecast1")
            for n in listFile:
                os.remove("./static/img/forecast1/" + n)
            forecast1.save("./static/img/forecast1/forecast_" + timestamp + os.path.splitext(nameForecast1)[1])
        
        if nameForecast2 != '':
            listFile = os.listdir("./static/img/forecast2")
            for n in listFile:
                os.remove("./static/img/forecast2/" + n)
            forecast2.save("./static/img/forecast2/forecast_" + timestamp + os.path.splitext(nameForecast2)[1])
        
        if nameForecast3 != '':
            listFile = os.listdir("./static/img/forecast3")
            for n in listFile:
                os.remove("./static/img/forecast3/" + n)
            forecast3.save("./static/img/forecast3/forecast_" + timestamp + os.path.splitext(nameForecast3)[1])
        
        if nameSWH != '':
            listFile = os.listdir("./static/img/swh")
            for n in listFile:
                os.remove("./static/img/swh/" + n)
            swh.save("./static/img/swh/swh_" + timestamp + os.path.splitext(nameSWH)[1])
        
        if nameWarning != '':
            listFile = os.listdir("./static/img/warning")
            for n in listFile:
                os.remove("./static/img/warning/" + n)
            warning.save("./static/img/warning/warning_" + timestamp + os.path.splitext(nameWarning)[1])
    
    return render_template("upload.html")
    
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
