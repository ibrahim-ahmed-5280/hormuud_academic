from app import app
from flask import render_template, request, make_response, jsonify, session, redirect, url_for
import re
from app.admin.admin_model import AdminModel, AdminDatabase, check_admin_model_connection
from datetime import datetime
@app.route('/dashboard_page')
def admin_dashboard_page():
    connection_status, admin_model = check_admin_model_connection()
    if connection_status:
        student_counts = admin_model.count_students()
        print(student_counts)  # Debugging
        return render_template('admin/index.html', student_counts=student_counts)
    return "Database connection failed."


@app.route('/register_student')
def register_student_page():
    return render_template('admin/register_student.html')

@app.route('/view_student')
def view_student_page():
    print('Connecting to the database...')
    connection_status, admin_model = check_admin_model_connection()
    if connection_status:
        flag,students_data = admin_model.get_all_student_data()
        print(students_data[0])
        return render_template('admin/view_student.html',
                               students = students_data)
    return "Database connection is not available or email is not set in the session."

def validate_email(email):
    """More thorough email validation"""
    if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
        return False
    return True


def validate_phone(phone):
    """More thorough phone validation"""
    if not re.match(r'^\+?[0-9]{10,15}$', phone):
        return False
    return True


def validate_date_of_birth(dob):
    """Validate date is in past and reasonable"""
    try:
        dob_date = datetime.strptime(dob, '%Y-%m-%d').date()
        today = datetime.now().date()
        min_age_date = today.replace(year=today.year - 120)  # Max 120 years old

        if dob_date >= today or dob_date <= min_age_date:
            return False
        return True
    except:
        return False


@app.route('/api/register', methods=['POST'])
def register():
    # First check if data exists and is in correct format
    if not request.is_json:
        return jsonify({
            'status': 'error',
            'message': 'Request must be JSON',
            'errors': {'format': 'Invalid content type'}
        }), 400

    try:
        data = request.get_json()
        print('Received data:', data)  # Debug logging

        if not data:
            return jsonify({
                'status': 'error',
                'message': 'No data received',
                'errors': {}
            }), 400

        errors = {}

        # Required field checks
        required_fields = {
            'personal_info': ['first_name', 'email', 'phone_number', 'date_of_birth'],
            'family_info': ['mother_name', 'mother_phone'],
            'academic_info': ['academic_year', 'academic_degree']
        }

        # Check all required sections exist
        for section, fields in required_fields.items():
            if section not in data:
                errors[section] = f'Missing {section} section'
                continue

            for field in fields:
                if not data[section].get(field):
                    errors[field] = f'{field.replace("_", " ")} is required'

        # Validate phone format (now matches client)
        phone = data.get('personal_info', {}).get('phone_number', '')
        if phone and not re.match(r'^\+?[0-9]{10,15}$', phone):
            errors['phone_number'] = 'Phone must be 10-15 digits, optional + prefix'

        # Validate email
        email = data.get('personal_info', {}).get('email', '')
        if email and not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
            errors['email'] = 'Invalid email format'

        if errors:
            return jsonify({
                'status': 'error',
                'message': 'Validation failed',
                'errors': errors
            }), 400

        print('Connecting to the database...')
        connection_status, admin_model = check_admin_model_connection()
        if connection_status:
            flag, feedback = admin_model.save_student_registration(data)
            if flag:
                print('ok')
                return jsonify({
                    'status': 'success',
                    'message': 'Registration successful',
                    'data': data  # Echo back for debugging
                }), 200
            else:
                print('not ok')
                return jsonify({
                    'status': 'error',
                    'message': 'Registration not happen',
                    'data': data  # Echo back for debugging
                }), 200

        return "Database connection is not available or email is not set in the session."


    except Exception as e:
        print('Server error:', str(e))  # Log the actual error
        return jsonify({
            'status': 'error',
            'message': 'Server processing error',
            'error': str(e)
        }), 500