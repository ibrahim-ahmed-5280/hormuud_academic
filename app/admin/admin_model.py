import mysql.connector
from app.configuration import AdminDbConfiguration
from mysql.connector import Error, IntegrityError
from app import app
import datetime

class AdminDatabase:
    def __init__(self, host, port, user, password, database):
        self.host = host
        self.port = port
        self.user = user
        self.password = password
        self.database = database

    def make_connection(self):
        try:
            self.connection = mysql.connector.connect(
                host=self.host,
                port=self.port,
                user=self.user,
                password=self.password,
                database=self.database,
            )
            self.cursor = self.connection.cursor()
        except Exception as e:
            print(e)

    def my_cursor(self):
        return self.cursor


class AdminModel:
    def __init__(self, connection):
        try:
            self.connection = connection
            self.cursor = connection.cursor()
        except Exception as err:
            print('Something went wrong! Internet connection or database connection. (Admin DB)')
            print(f'Error: {err}')

    def check_admin_login(self,email,password):
        sql = """
                 SELECT * FROM admin_login 
                 WHERE email = %s AND password = %s;"""

        try:
            self.cursor.execute(sql,(email,password))
            result = self.cursor.fetchall()
            if result:
                print('Waa la helay Adeegsadaha.')
                result = [dict(zip([key[0] for key in self.cursor.description], row)) for row in result]

                return True, result
            else:
                print('Lama helin wax Adeegsade ah.')
                return False, {}
        except Exception as e:
            print(f'Error: {e}')
            return False, f'Error {e}.'


    # Garsame added this
    def save_faculty_registration(self,):
        try:
            query = """
                INSERT INTO faculty (facultyname, remark)
                VALUES (%s, %s)
            """
            self.cursor.execute(query,)
            self.connection.commit()
            return True, 'Faculty registration successful'
        except Exception as e:
            self.connection.rollback()
            print('Database insert error:', str(e))
            return False, str(e)
        
    # Function to fetch all faculties from the database
    def get_all_faculties(self):
        try:
            # SQL query to fetch all faculty data
            query = "SELECT * FROM faculty" 
            self.cursor.execute(query)  # Execute the query
            result = self.cursor.fetchall()  # Fetch all results
            
            # Return the result
            return result
        except Exception as err:
            print('Error fetching faculties.')
            print(f'Error: {err}')
            return []
    # Function to fetch all Department data from the database
    def get_all_department(self):
        try:
            # SQL query to fetch all faculty data
            query = "SELECT * FROM department_faculty" 
            self.cursor.execute(query)  # Execute the query
            result = self.cursor.fetchall()  # Fetch all results
            
            # Return the result
            return result
        except Exception as err:
            print('Error fetching department_faculty.')
            print(f'Error: {err}')
            return []
    # Function to fetch all course data from the database
    def get_all_courses(self):
        try:
            query = """
                SELECT 
                    course.id AS course_id,
                    department_faculty.department_name,
                    course.course_code,
                    course.course_name,
                    course.remark,
                    course.credit_hours,
                    
                    course.created_at
                FROM 
                    course
                JOIN 
                    department_faculty 
                ON 
                    course.department_id = department_faculty.id
            """

            self.cursor.execute(query)  # Execute the query
            result = self.cursor.fetchall()  # Fetch all results

            # Return the result
            return result
        except Exception as err:
            print('Error fetching classes.')
            print(f'Error: {err}')
            return []

    # END OF GARSAME

    def count_students(self):
        sql_total = "SELECT COUNT(*) FROM student;"
        sql_graduated = "SELECT COUNT(*) FROM student WHERE status = 'Graduated';"

        try:
            self.cursor.execute(sql_total)
            total_students = self.cursor.fetchone()[0]

            self.cursor.execute(sql_graduated)
            graduated_students = self.cursor.fetchone()[0]

            return {"total_students": total_students, "graduated_students": graduated_students}

        except Exception as e:
            print(f"Error: {e}")
            return {"error": str(e)}

    def save_student_registration(self, student_data):
        sql = """
        INSERT INTO student (
            f_name, s_name, l_name, email, password, phone, sex, 
            date_of_birth, address, marital_status, nationality, 
            place_of_birth, academic_year, Academic_degree, 
            occupation_status, blood_group, mother_name, mother_phone, 
            intake, shift_type
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, 
            %s, %s, %s, %s, 
            %s, %s, %s, 
            %s, %s, %s, %s, 
            %s, %s
        )
        """

        try:
            # Extract values from student_data dictionary
            values = (
                student_data.get('personal_info')['first_name'],
                student_data.get('personal_info').get('middle_name', ''),  # Middle name is optional
                student_data.get('personal_info')['last_name'],
                student_data.get('personal_info')['email'],
                student_data.get('personal_info').get('password', '0000'),  # Default password
                student_data.get('personal_info')['phone_number'],
                student_data.get('personal_info')['gender'],
                student_data.get('personal_info').get('date_of_birth'),
                student_data.get('personal_info').get('address'),
                student_data.get('personal_info').get('marital_status'),
                student_data.get('personal_info')['nationality'],
                student_data.get('personal_info')['place_of_birth'],
                student_data.get('academic_info')['academic_year'],
                student_data.get('academic_info')['academic_degree'],
                student_data.get('personal_info')['occupation'],
                student_data.get('personal_info').get('blood_group'),
                student_data.get('family_info')['mother_name'],
                student_data.get('family_info')['mother_phone'],
                student_data.get('academic_info')['intake'],
                student_data.get('academic_info').get('shift_type')
            )

            self.cursor.execute(sql, values)
            self.connection.commit()

            student_id = self.cursor.lastrowid
            print(f'Diwaangalinta ardayga aqoonsigiisu yahay {student_id} ayaa lagu guuleystay')
            return True, f'Diwaangalinta ardayga ayaa lagu guuleystay. Aqoonsi: {student_id}'

        except Exception as e:
            print('Khalad ayaa dhacay markii lagu diwaangalinayay ardayga')
            print(f'Error: {e}')
            self.connection.rollback()

            # Handle duplicate email error specifically
            if "Duplicate entry" in str(e) and "email" in str(e):
                return False, 'Email-kan hore ayaa loo diwaangalinay'

            return False, f'Khalad ayaa dhacay: {str(e)}'

    def get_all_student_data(self):
        sql = """
                SELECT * FROM student;
              """
        try:
            self.cursor.execute(sql)
            result = self.cursor.fetchall()
            if result:
                print('Waa la helay ardayda.')
                result = [dict(zip([key[0] for key in self.cursor.description], row)) for row in result]

                return True, result
            else:
                print('Lama helin wax arday ah.')
                return False, {}
        except Exception as e:
            print(f'Error: {e}')
            return False, f'Error {e}.'

    def get_all_classes(self):
        sql = """
                SELECT * from classes;;
            """
        try:
            self.cursor.execute(sql)
            result = self.cursor.fetchall()
            if result:
                print('Waa la helay classes-ka.')
                result = [dict(zip([key[0] for key in self.cursor.description], row)) for row in result]

                return True, result
            else:
                print('Lama helin wax class ah.')
                return False, {}
        except Exception as e:
            print(f'Error: {e}')
            return False, f'Error {e}.'

    def change_student_status(self,status,student_id):
        sql = """
                UPDATE student 
                SET status = %s 
                WHERE student_id = %s;
                """
        try:
            self.cursor.execute(sql, (status,student_id))
            self.connection.commit()  # Commit the transaction
            return True
        except Exception as e:
            print(f"Error: {e}")
            return False

    def change_student_class(self, class_name, student_id):
        # SQL query to get the class_id based on class_name
        get_class_id_sql = """
            SELECT id
            FROM classes
            WHERE class_name = %s;
        """

        # SQL query to update the student's class_id
        update_student_sql = """
            UPDATE student
            SET class_id = %s
            WHERE student_id = %s;
        """

        try:
            # First, get the class_id based on the class_name
            self.cursor.execute(get_class_id_sql, (class_name,))
            result = self.cursor.fetchone()

            if result:
                class_id = result[0]
                # Update the student table with the obtained class_id
                self.cursor.execute(update_student_sql, (class_id, student_id))
                self.connection.commit()  # Commit the transaction
                return True
            else:
                print(f"Class name '{class_name}' not found.")
                return False

        except Exception as e:
            print(f"Error: {e}")
            return False

    def change_student_password(self, password,student_id):
        sql = """
                   UPDATE student 
                   SET password = %s 
                   WHERE student_id = %s;
                   """
        try:
            self.cursor.execute(sql, (password, student_id))
            self.connection.commit()  # Commit the transaction
            print(f"success happen.")
            return True
        except Exception as e:
            print(f"Error: {e}")
            print(f'there is an error happen.')
            return False
admin_db_configuration = AdminDbConfiguration()


def check_admin_model_connection():
    try:
        mysql_connect = AdminDatabase(
            host=admin_db_configuration.DB_HOSTNAME,
            port=3306,
            user=admin_db_configuration.DB_USERNAME,
            password=admin_db_configuration.DB_PASSWORD,
            database=admin_db_configuration.DB_NAME
        )
        # Create an instance of the Store class
        mysql_connect.make_connection()
        my_admin_model = AdminModel(mysql_connect.connection)

        return True, my_admin_model
    except Exception as e:
        print(f'')
        return False, f'Error: {e}.'
