document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordField = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        eyeIcon.classList.remove('mdi-eye');
        eyeIcon.classList.add('mdi-eye-off');
    } else {
        passwordField.type = 'password';
        eyeIcon.classList.remove('mdi-eye-off');
        eyeIcon.classList.add('mdi-eye');
    }
});

function submitting_login() {
    const form = document.getElementById('login_form');
    const inputs = form.querySelectorAll('input, button')
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const Error = document.getElementById('error');
    const emailError = document.getElementById('email_error');
    const passwordError = document.getElementById('password_error');
    const button = document.getElementById('submit_button');
    const spinner = document.getElementById('spinner');
    const buttonText = button.querySelector('.button-text');

    // Reset Errors
    emailError.style.opacity = 0;
    passwordError.style.opacity = 0;
    Error.style.opacity = 0;

    // Basic Validation
    let hasError = false;

    if (!email || !email.includes('@')) {
        emailError.style.opacity = 1;
        hasError = true;
    }

    if (!password) {
        passwordError.style.opacity = 1;
        hasError = true;
    }

    if (hasError) return;

    // Disable button and show spinner
    button.disabled = true;
    spinner.classList.remove('d-none');
    buttonText.textContent = 'Loading...';
    form.style.opacity = 0.8;
    inputs.forEach(input => input.disabled = true);
    // Perform the fetch request
    fetch('admin_login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    })
        .then(function (response) {
            return response.json();  // Parse the JSON response
        })
        .then(function (data) {
            if (data.success) {
                form.style.opacity = 1;
                inputs.forEach(input => input.disabled = false);
                // Login Success - Redirect to dashboard page
                window.location.href = 'dashboard_page';
            } else {
                form.style.opacity = 1;
                inputs.forEach(input => input.disabled = false);

                // Show specific error for email or password if necessary
                if (data.error === 'invalid_email') {
                    emailError.style.opacity = 1;
                    emailError.innerHTML = data.message;
                } else if (data.error === 'invalid_password') {
                    passwordError.style.opacity = 1;
                    passwordError.innerHTML = data.message;
                }
                else {
                    // Show error message
                    Error.style.opacity = 1;
                    Error.innerHTML = data.message;
                }
            }
        })
        .catch(function (error) {
            console.error('Error:', error);
            alert('Something went wrong. Try again.');
        })
        .finally(function () {
            // Reset button and spinner
            button.disabled = false;
            spinner.classList.add('d-none');
            buttonText.textContent = 'Submit';
        });
}

