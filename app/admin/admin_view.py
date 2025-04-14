from app import app
from flask import render_template, request, make_response, jsonify, session, redirect, url_for
import re
from app.admin.admin_model import AdminModel, AdminDatabase, check_admin_model_connection
from datetime import datetime
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt(app)

# Helper function to safely get session data
def get_session_data():
    """Retrieve session data."""
    return session.get('email')

@app.route('/')
def signin_page():
    return render_template('admin/signin.html')

@app.route('/admin_login',methods=['POST'])
def admin_login():
    data = request.get_json()
    print(data)
    email = data.get('email', '').strip()
    password = data.get('password', '').strip()

    # Initialize response
    response = {'error': '','message': ''}

    # Validate Email and Password
    if not email:
        response['error'] = 'invalid_email'
        response['message']='Please enter an email.'
        return jsonify(response)


    if not password:
        response['error'] = 'invalid_password'
        response['message'] = 'Please enter password.'
        return jsonify(response)
    connection_status, admin_model = check_admin_model_connection()
    if connection_status:
        flag, result = admin_model.check_admin_login(email,password)
        if flag:
            print(result)
            session['email'] = result[0].get('email')
            return jsonify({'success': True})
        return jsonify({'error': True,'message':'Email or password is incorrect.'})


    return jsonify({'error': True, 'message': 'Database connection failed.'})

@app.route('/admin_dashboard')
def admin_dashboard_page():
    email = get_session_data()
    if not email:
        return redirect(url_for('signin_page'))
    connection_status, admin_model = check_admin_model_connection()
    if connection_status:
        student_counts = admin_model.count_students()
        print(student_counts)  # Debugging
        return render_template('admin/index.html', student_counts=student_counts)
    return "Database connection failed."


@app.route('/register_student')
def register_student_page():
    email = get_session_data()
    if not email:
        return redirect(url_for('signin_page'))
    return render_template('admin/register_student.html')

@app.route('/classes')
def classes():
    email = get_session_data()
    if not email:
        return redirect(url_for('signin_page'))
    return render_template('admin/classes.html')

@app.route('/faculties')
def faculties():
    email = get_session_data()
    if not email:
        return redirect(url_for('signin_page'))
    # Initialize AdminModel with the existing DB connection
    print('Connecting to the database...')
    connection_status, admin_model = check_admin_model_connection()
    if connection_status:
        faculties_data = admin_model.get_all_faculties()  # Fetch all faculties
        print(faculties_data)
    
    # Pass faculties data to the template
    return render_template('admin/faculty.html', faculties=faculties_data)


@app.route('/register_faculty', methods=['POST'])
def register_faculty():
    if not request.is_json:
        return jsonify({
            'status': 'error',
            'message': 'Request must be JSON',
            'errors': {'format': 'Invalid content type'}
        }), 400

    try:
        data = request.get_json()
        print('Received faculty data:', data)

        # Connect to the DB using your existing pattern
        print('Connecting to the database...')
        connection_status, admin_model = check_admin_model_connection()

        if connection_status:
            try:
                query = """
                    INSERT INTO faculty (facultyname, remark)
                    VALUES (%s, %s)
                """
                values = (
                    data.get('faculty_name'),
                    data.get('remark')
                )
                admin_model.cursor.execute(query, values)
                admin_model.connection.commit()

                return jsonify({
                    'status': 'success',
                    'message': 'Faculty registered successfully',
                    'data': data
                }), 200
            except Exception as db_err:
                admin_model.connection.rollback()
                print('Database insert error:', str(db_err))
                return jsonify({
                    'status': 'error',
                    'message': 'Failed to insert into database',
                    'error': str(db_err)
                }), 500
        else:
            return jsonify({
                'status': 'error',
                'message': 'Database connection failed'
            }), 500

    except Exception as e:
        print('Server error:', str(e))
        return jsonify({
            'status': 'error',
            'message': 'Server processing error',
            'error': str(e)
        }), 500



# Departments view
@app.route('/departments')
def departments():
    email = get_session_data()
    if not email:
        return redirect(url_for('signin_page'))
    # Initialize AdminModel with the existing DB connection
    print('Connecting to the database...')
    connection_status, admin_model = check_admin_model_connection()
    if connection_status:
        faculties_data = admin_model.get_all_faculties()  # Fetch all faculties
        departments_data = admin_model.get_all_department()
        print(departments_data)
        
    return render_template('admin/departments.html', faculties_data= faculties_data,
                           departments_data= departments_data)


@app.route('/register_departments', methods=['POST'])
def register_departments():
    if not request.is_json:
        return jsonify({
            'status': 'error',
            'message': 'Request must be JSON',
            'errors': {'format': 'Invalid content type'}
        }), 400

    try:
        data = request.get_json()
        print('Received data:', data)

        # Sample required fields check (optional)
        required_fields = ['department_name', 'faculty', 'remark']
        for field in required_fields:
            if field not in data or not data[field].strip():
                return jsonify({
                    'status': 'error',
                    'message': f'{field.replace("_", " ").title()} is required.',
                    'field': field
                }), 400

        # Connect to the DB using your existing pattern
        print('Connecting to the database...')
        connection_status, admin_model = check_admin_model_connection()

        if connection_status:
            try:
                query = """
                    INSERT INTO department_faculty (department_name,faculty_id, remark)
                    VALUES (%s, %s,%s)
                """
                values = (
                    data.get('department_name'),
                    data.get('faculty'),
                    data.get('remark')
                )
                admin_model.cursor.execute(query, values)
                admin_model.connection.commit()

                return jsonify({
                    'status': 'success',
                    'message': 'Faculty registered successfully',
                    'data': data
                }), 200
            except Exception as db_err:
                admin_model.connection.rollback()
                print('Database insert error:', str(db_err))
                return jsonify({
                    'status': 'error',
                    'message': 'Failed to insert into database',
                    'error': str(db_err)
                }), 500
        else:
            return jsonify({
                'status': 'error',
                'message': 'Database connection failed'
            }), 500

    except Exception as e:
        print('Server error:', str(e))
        return jsonify({
            'status': 'error',
            'message': 'Server processing error',
            'error': str(e)
        }), 500


@app.route('/view_student')
def view_student_page():
    email = get_session_data()
    if not email:
        return redirect(url_for('signin_page'))
    print('Connecting to the database...')
    connection_status, admin_model = check_admin_model_connection()
    if connection_status:
        flag,students_data = admin_model.get_all_student_data()
        print(students_data[0])
        flag,classes = admin_model.get_all_classes()
        print(classes[0])
        return render_template('admin/view_student.html',
                               students = students_data,
                               classes = classes)
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
        max_age_date = today.replace(year=today.year - 80)
        min_age_date = today.replace(year=today.year - 17)

        if dob_date >= min_age_date or dob_date <= max_age_date:
            return False
        return True
    except:
        return False


@app.route('/register_student', methods=['POST'])
def register_student():
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

@app.route('/change_student_status', methods = ['POST'])
def change_student_status():
    data = request.get_json()
    print(data)
    status = data.get('data').get('status')
    allowed_status = ['Active', 'Inactive', 'Graduated', 'Suspended']

    # Check if status is valid
    if not status or status not in allowed_status:
        return jsonify({'success': False, 'message': 'Invalid status selected!'}), 400

    print('Connecting to the database...')
    connection_status, admin_model = check_admin_model_connection()
    if connection_status:
        flag = admin_model.change_student_status(status,data.get('data').get('student_id'))
        if flag:
            return jsonify({'success': True, 'message': 'Changes status.'}), 400
        return jsonify({'success': True, 'message': 'Changes status.'}), 400
    return "Database connection is not available or email is not set in the session."

@app.route('/change_class',methods=['POST'])
def change_class():
    data = request.get_json()
    print(data)
    # Check if status is valid
    if not data.get('class_name'):
        return jsonify({'success': False, 'message': 'Invalid status selected!'}), 400
    print('Connecting to the database...')
    connection_status, admin_model = check_admin_model_connection()
    if connection_status:
        flag = admin_model.change_student_class(data.get('class_name'), data.get('student_id'))
        if flag:
            print(flag)
            return jsonify({'success': True, 'message': 'Changes class.'}), 400
        return jsonify({'success': False, 'message': 'Not change class.'}), 400
    return "Database connection is not available or email is not set in the session."


@app.route('/change_password', methods=['POST'])
def change_password_user():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data received', 'field': 'general'}), 400

        # Validate input
        new_password = data.get('new_password')
        confirm_password = data.get('confirm_password')
        student_id = data.get('student_id')

        if not new_password:
            return jsonify({'success': False, 'message': 'New password is required', 'field': 'new'}), 400
        if not confirm_password:
            return jsonify({'success': False, 'message': 'Confirm password is required', 'field': 'confirm'}), 400
        if not student_id:
            return jsonify({'success': False, 'message': 'Student ID is required', 'field': 'general'}), 400
        if new_password != confirm_password:
            return jsonify({'success': False, 'message': 'Passwords do not match', 'field': 'confirm'}), 400

        # Database operations
        connection_status, admin_model = check_admin_model_connection()
        if not connection_status:
            return jsonify({'success': False, 'message': 'Database connection failed', 'field': 'general'}), 500

        # Change password
        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        success = admin_model.change_student_password(hashed_password, student_id)
        if success:
            return jsonify({'success': True, 'message': 'Password changed successfully'}), 200
        else:
            return jsonify({'success': False, 'message': 'Failed to change password', 'field': 'general'}), 400

    except Exception as e:
        print(f"Error in change_password_user: {str(e)}")
        return jsonify({'success': False, 'message': 'An error occurred', 'field': 'general'}), 500

@app.route('/admin_logout', methods=['POST', 'GET'])
def admin_logout():
    # Clear the session data
    session.clear()
    # Redirect to the signin page
    return redirect(url_for('signin_page'))