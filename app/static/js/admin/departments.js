function clearErrors() {
    document.getElementById('department_nameError').style.display = 'none';
    document.getElementById('facultyTypeError').style.display = 'none';
    document.getElementById('remarkError').style.display = 'none';
}

function showError(id, message) {
    const errorDiv = document.getElementById(id);
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function submit_registeration() {
    clearErrors();

    const departmentName = document.getElementById('department_name').value.trim();
    const facultyType = document.getElementById('facultyType').value;
    const remark = document.getElementById('remark').value.trim();

    let isValid = true;

    if (departmentName === '') {
        showError('department_nameError', 'Department name is required.');
        isValid = false;
    } else if (departmentName.length < 3) {
        showError('department_nameError', 'Department name must be at least 3 characters.');
        isValid = false;
    }

    if (facultyType === '') {
        showError('facultyTypeError', 'Please select a faculty.');
        isValid = false;
    }

    if (remark === '') {
        showError('remarkError', 'Remark is required.');
        isValid = false;
    } else if (remark.length < 10) {
        showError('remarkError', 'Remark must be at least 10 characters long.');
        isValid = false;
    }

    if (isValid) {
        // Activate spinner and disable button
        const button = document.querySelector('.btn-with-spinner');
        const spinner = button.querySelector('.spinner-border');
        const buttonText = button.querySelector('.button-text');

        spinner.classList.remove('d-none');
        buttonText.textContent = 'Processing...';
        button.disabled = true;

        const payload = {
            department_name: departmentName,
            faculty: facultyType,
            remark: remark
        };

        fetch('/register_departments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);

            if (data.status === 'success') {
                alert('✅ Department registered successfully!');
                document.querySelector('.form').reset();
                window.location.reload();  // Reload the page after success
            } else {
                alert('❌ Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Request failed:', error);
            alert('⚠️ An unexpected error occurred.');
        })
        .finally(() => {
            // Deactivate spinner and enable button
            spinner.classList.add('d-none');
            buttonText.textContent = 'Submit';
            button.disabled = false;
        });
    }
}
