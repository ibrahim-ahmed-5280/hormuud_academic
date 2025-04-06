function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
        el.textContent = '';
    });
}

function showError(id, message) {
    const errorDiv = document.getElementById(id);
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function submit_registeration() {
    clearErrors();

    const facultyName = document.getElementById('facultyname').value.trim();
    const remark = document.getElementById('remark').value.trim();

    let isValid = true;

    if (facultyName === '') {
        showError('facultynameError', 'Faculty name is required.');
        isValid = false;
    } else if (facultyName.length < 3) {
        showError('facultynameError', 'Faculty name must be at least 3 characters.');
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
        // Spinner setup
        const button = document.querySelector('.btn-with-spinner');
        const spinner = button.querySelector('.spinner-border');
        const buttonText = button.querySelector('.button-text');
        spinner.classList.remove('d-none');
        buttonText.textContent = 'Processing...';
        button.disabled = true;

        const payload = {
            faculty_name: facultyName,
            remark: remark
        };

        fetch('/register_faculty', {
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
                alert('Faculty registered successfully!');
                document.querySelector('.form').reset();
                window.location.reload();  // Reload the page after success
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Request failed:', error);
            alert('An unexpected error occurred.');
        })
        .finally(() => {
            spinner.classList.add('d-none');
            buttonText.textContent = 'Submit';
            button.disabled = false;
        });
    }
}
