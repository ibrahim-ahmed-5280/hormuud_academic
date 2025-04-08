function submit_status_change(student_id, event) {
    event.stopPropagation();

    let status = document.getElementById('select_status_' + student_id).value;
    let errorDiv = document.getElementById('status_error_' + student_id);
    let successDiv = document.getElementById('status_success_' + student_id);
    let button = event.target.closest('button');
    let spinner = button.querySelector('.spinner-border');
    let buttonText = button.querySelector('.button-text');

    errorDiv.innerHTML = '';
    successDiv.innerHTML = '';

    if (!status) {
        errorDiv.innerHTML = 'Please select a status.';
        return;
    }

    let data = {
        status: status,
        student_id: student_id
    }

    spinner.classList.remove('d-none');
    buttonText.textContent = 'Submitting...';

    fetch('/change_student_status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                successDiv.innerHTML = data.message || 'Status Updated Successfully!';
            } else {
                errorDiv.innerHTML = data.error || 'Something went wrong!';
            }
        })
        .catch(error => {
            errorDiv.innerHTML = 'Network Error!';
        })
        .finally(() => {
            spinner.classList.add('d-none');
            buttonText.textContent = 'Submit';
        });
}

function submit_class_change(student_id, event) {
    event.stopPropagation();

    let form = event.target.closest('form');
    let select = document.getElementById('select_class_' + student_id);
    let selectedClass = select.value;
    let button = form.querySelector('button');
    let spinner = button.querySelector('.spinner-border');
    let buttonText = button.querySelector('.button-text');

    // Reset the previous success and error messages
    let successMessage = document.getElementById('class_success_' + student_id);
    let errorMessage = document.getElementById('class_error_' + student_id);

    successMessage.textContent = ''; // Clear any previous success message
    errorMessage.textContent = ''; // Clear any previous error message
    select.classList.remove('is-invalid');  // Remove error border
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';

    if (!selectedClass) {
        select.classList.add('is-invalid');  // Add error border (red)
        errorMessage.textContent = 'Please select a class'; // Set the error message
        return;
    }

    spinner.classList.remove('d-none');
    buttonText.textContent = 'Submitting...';

    fetch('/change_class', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            student_id: student_id,
            class_name: selectedClass
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                successMessage.style.display = 'block';
                successMessage.textContent = 'Class changed successfully!'; // Set the success message
            } else {
                errorMessage.style.display = 'block';
                errorMessage.textContent = data.message || 'Failed to change class. Please try again.'; // Set error message from server
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessage.textContent = 'An error occurred. Please try again later.'; // Set error message if network or other error
        })
        .finally(() => {
            spinner.classList.add('d-none');
            buttonText.textContent = 'Submit';
        });
}

function submit_password_change(student_id, event) {
    event.preventDefault();
    event.stopPropagation();
    
    const form = event.target.closest('form');
    const newPassword = document.getElementById(`newPassword_${student_id}`).value;
    const confirmPassword = document.getElementById(`confirmPassword_${student_id}`).value;
    const button = form.querySelector('button');
    const spinner = button.querySelector('.spinner-border');
    const buttonText = button.querySelector('.button-text');
    const successMessage = document.getElementById(`password_success_${student_id}`);
    const errorMessageNew = document.getElementById(`password_error_${student_id}`);
    const errorMessageConfirm = document.getElementById(`confirm_error_${student_id}`);

    // Reset messages
    successMessage.style.display = 'none';
    errorMessageNew.style.display = 'none';
    errorMessageConfirm.style.display = 'none';

    // Validation
    if (!newPassword) {
        errorMessageNew.textContent = 'New password is required';
        errorMessageNew.style.display = 'block';
        return;
    }
    
    if (!confirmPassword) {
        errorMessageConfirm.textContent = 'Please confirm your password';
        errorMessageConfirm.style.display = 'block';
        return;
    }
    
    if (newPassword !== confirmPassword) {
        errorMessageConfirm.textContent = 'Passwords do not match';
        errorMessageConfirm.style.display = 'block';
        return;
    }

    // Show loading state
    spinner.classList.remove('d-none');
    buttonText.textContent = 'Processing...';
    button.disabled = true;

    fetch('/change_password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            new_password: newPassword,
            confirm_password: confirmPassword,
            student_id: student_id
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        if (data.success) {
            successMessage.textContent = data.message;
            successMessage.style.display = 'block';
            form.reset();
        } else {
            const errorField = data.field || 'new';
            const errorElement = errorField === 'confirm' ? errorMessageConfirm : errorMessageNew;
            errorElement.textContent = data.message;
            errorElement.style.display = 'block';
        }
    })
    .catch(error => {
        errorMessageNew.textContent = 'Error: ' + (error.message || 'Failed to change password');
        errorMessageNew.style.display = 'block';
    })
    .finally(() => {
        spinner.classList.add('d-none');
        buttonText.textContent = 'Submit';
        button.disabled = false;
    });
}







