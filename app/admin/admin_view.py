from tempfile import template

from app import app
from flask import render_template, request, make_response, jsonify, session, redirect, url_for

@app.route('/')
def admin_dashboard_page():
    return render_template('admin/admin_base.html')

@app.route('/register_student')
def register_student_page():
    return render_template('admin/register_student.html')

@app.route('/view_student')
def view_student_page():
    return render_template('admin/view_student.html')