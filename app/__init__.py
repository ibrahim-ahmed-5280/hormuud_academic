from flask import Flask, session

app = Flask(__name__)

from app.admin import admin_view
from app.admin import admin_model

# set secret key
app.secret_key = '5280'