function resetForm() {
    const form = document.getElementById('form');

    // Reset all input fields
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        // Handle different input types
        if (input.type === 'text' || input.type === 'email' || input.type === 'tel') {
            input.value = '';
        }
        else if (input.type === 'select-one') {
            input.selectedIndex = 0; // Reset to first option
        }
        else if (input.type === 'date') {
            input.value = '';
        }
    });
}




// Define the function in global scope
function submit_registeration() {
    // UI Loading state
    const button = document.querySelector('.btn-with-spinner');
    const spinner = button.querySelector('.spinner-border');
    const buttonText = button.querySelector('.button-text');
    spinner.classList.remove('d-none');
    buttonText.textContent = 'Processing...';
    button.disabled = true;

    // Validate all fields
    let isValid = true;

    // Personal Information Validation
    const firstName = sanitizeInput(document.getElementById('first_name').value);
    if (!firstName) {
        showError('first_name', 'First name is required');
        isValid = false;
    } else if (firstName.length < 3) {
        showError('first_name', 'First name must be at least 3 characters');
        isValid = false;
    } else if (firstName.length > 15) {
        showError('first_name', 'First name cannot exceed 15 characters');
        isValid = false;
    } else {
        hideError('first_name');
    }

    // Middle Name
    const middleName = sanitizeInput(document.getElementById('middle_name').value);
    if (!middleName) {
        showError('middle_name', 'Middle name is required');
        isValid = false;
    } else if (middleName.length < 3) {
        showError('middle_name', 'Middle name must be at least 3 characters');
        isValid = false;
    } else if (middleName.length > 15) {
        showError('middle_name', 'Middle name cannot exceed 15 characters');
        isValid = false;
    } else {
        hideError('middle_name');
    }

    // Last Name
    const lastName = sanitizeInput(document.getElementById('last_name').value);
    if (!lastName) {
        showError('last_name', 'Last name is required');
        isValid = false;
    } else if (lastName.length < 3) {
        showError('last_name', 'Last name must be at least 3 characters');
        isValid = false;
    } else if (lastName.length > 15) {
        showError('last_name', 'Last name cannot exceed 15 characters');
        isValid = false;
    } else {
        hideError('last_name');
    }

    // Email
    const email = sanitizeInput(document.getElementById('type_email').value);
    if (!email) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    } else {
        hideError('email');
    }

    // Phone Number
    const phoneNumber = sanitizeInput(document.getElementById('phone_number').value);
    if (!phoneNumber) {
        showError('phone_number', 'Phone number is required');
        isValid = false;
    } else if (!isValidPhone(phoneNumber)) {
        showError('phone_number', 'Please enter a valid phone number (10-15 digits)');
        isValid = false;
    } else {
        hideError('phone_number');
    }

    // Gender
    const gender = document.getElementById('gender').value;
    if (!gender) {
        showError('gender', 'Gender is required');
        isValid = false;
    } else {
        hideError('gender');
    }

    // Date of Birth
    const dateOfBirth = document.getElementById('date_of_birth').value;
    if (!dateOfBirth) {
        showError('date_of_birth', 'Date of birth is required');
        isValid = false;
    } else if (!isValidDateOfBirth(dateOfBirth)) {
        showError('date_of_birth', 'Please enter a valid date of birth');
        isValid = false;
    } else {
        hideError('date_of_birth');
    }

    // Place of Birth
    const placeOfBirth = sanitizeInput(document.getElementById('placeOfBirth').value);
    if (!placeOfBirth) {
        showError('placeOfBirth', 'Place of birth is required');
        isValid = false;
    } else {
        hideError('placeOfBirth');
    }

    // Address (optional - no validation needed)
    const address = sanitizeInput(document.getElementById('address').value);

    // Marital Status
    const maritalStatus = document.getElementById('marital').value;
    if (!maritalStatus) {
        showError('marital', 'Marital status is required');
        isValid = false;
    } else {
        hideError('marital');
    }

    // Nationality
    const nationality = document.getElementById('nationality').value;
    if (!nationality) {
        showError('nationality', 'Nationality is required');
        isValid = false;
    } else {
        hideError('nationality');
    }

    // Occupation
    const occupation = document.getElementById('occupation').value;
    if (!occupation) {
        showError('occupation', 'Occupation is required');
        isValid = false;
    } else {
        hideError('occupation');
    }

    // Blood Group
    const bloodGroup = document.getElementById('bloodGroup').value;
    if (!bloodGroup) {
        showError('bloodGroup', 'Blood group is required');
        isValid = false;
    } else {
        hideError('bloodGroup');
    }

    // Mother Name
    const motherName = sanitizeInput(document.getElementById('mother_name').value);
    if (!motherName) {
        showError('mother_name', 'Mother name is required');
        isValid = false;
    } else {
        hideError('mother_name');
    }

    // Mother Phone
    const motherPhone = sanitizeInput(document.getElementById('mother_phone').value);
    if (!motherPhone) {
        showError('mother_phone', 'Mother phone is required');
        isValid = false;
    } else if (!isValidPhone(motherPhone)) {
        showError('mother_phone', 'Please enter a valid phone number for mother');
        isValid = false;
    } else {
        hideError('mother_phone');
    }

    // Academic Year
    const academicYear = document.getElementById('academicYear').value;
    if (!academicYear) {
        showError('academicYear', 'Academic year is required');
        isValid = false;
    } else {
        hideError('academicYear');
    }

    // Academic Degree
    const academicDegree = document.getElementById('academicDegree').value;
    if (!academicDegree) {
        showError('academicDegree', 'Academic degree is required');
        isValid = false;
    } else {
        hideError('academicDegree');
    }

    // Intake
    const intake = document.getElementById('intake').value;
    if (!intake) {
        showError('intake', 'Intake is required');
        isValid = false;
    } else {
        hideError('intake');
    }

    // Shift Type
    const shiftType = document.getElementById('shiftType').value;
    if (!shiftType) {
        showError('shiftType', 'Shift type is required');
        isValid = false;
    } else {
        hideError('shiftType');
    }

    if (!isValid) {
        spinner.classList.add('d-none');
        buttonText.textContent = 'Submit';
        button.disabled = false;
        return;
    }

    // COMPLETE DATA COLLECTION - ALL FORM FIELDS
    const formData = {
        personal_info: {
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            email: email,
            phone_number: phoneNumber,
            gender: gender,
            date_of_birth: dateOfBirth,
            place_of_birth: placeOfBirth,
            address: address, // optional
            marital_status: maritalStatus,
            nationality: nationality,
            occupation: occupation,
            blood_group: bloodGroup
        },
        family_info: {
            mother_name: motherName,
            mother_phone: motherPhone
        },
        academic_info: {
            academic_year: academicYear,
            academic_degree: academicDegree,
            intake: intake,
            shift_type: shiftType
        }
    };

    // Send to backend
    // Send to backend
    fetch('/register_student', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'same-origin'
    })
        .then(async response => {
            const data = await response.json();

            // Debug logging
            console.log('Backend response:', data);

            if (!response.ok || data.status === 'error') {
                // Handle server-side validation errors
                if (data.errors) {
                    Object.entries(data.errors).forEach(([field, message]) => {
                        showError(field, message);
                    });
                }
                throw new Error(data.message || 'Registration failed');
            }

            // Success case
            return data;
        })
        .then(data => {
            showNotification(data.message || 'Registration successful!', true);
            document.querySelector('form').reset();
        })
        .catch(error => {
            console.error('Registration error:', error);
            showNotification(error.message || 'Registration failed. Please try again.', false);
        })
        .finally(() => {
            spinner.classList.add('d-none');
            buttonText.textContent = 'Submit';
            button.disabled = false;
        });
}

// Helper functions (same as before)
function showNotification(message, isSuccess = true) {
    const notification = document.querySelector('.notification');
    if (!notification) return;

    // Create icon element
    const icon = document.createElement('i');
    icon.className = isSuccess ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';

    // Add animation class for success
    if (isSuccess) {
        icon.classList.add('animate__animated', 'animate__bounceIn');
    }

    // Clear previous content
    notification.innerHTML = '';

    // Add icon and message
    notification.appendChild(icon);
    notification.appendChild(document.createTextNode(' ' + message));

    // Set notification style
    notification.className = `notification ${isSuccess ? 'success' : 'error'}`;
    notification.classList.remove('hidden');

    // Auto-hide after 5 seconds
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.classList.add('hidden');
        if (isSuccess) {
            resetForm(); // Reset form only on success
        }
    }, 5000);
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function hideError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidPhone(phone) {
    const re = /^\+?[0-9]{10,15}$/;
    return re.test(phone);
}

function isValidDateOfBirth(dateString) {
    const inputDate = new Date(dateString);
    const today = new Date();
    const minAgeDate = new Date();
    minAgeDate.setFullYear(today.getFullYear() - 120);
    return inputDate < today && inputDate > minAgeDate;
}

function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input.trim()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;");
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function () {
    // Create notification element if it doesn't exist
    if (!document.querySelector('.notification')) {
        const notification = document.createElement('div');
        notification.className = 'notification hidden';
        document.body.appendChild(notification);
    }
});