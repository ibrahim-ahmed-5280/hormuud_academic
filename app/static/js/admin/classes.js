// classes.js

function validateField(id, errorId, message) {
    const value = document.getElementById(id).value.trim();
    const errorDiv = document.getElementById(errorId);

    if (!value) {
        errorDiv.style.display = "block";
        errorDiv.innerText = message;
        return false;
    } else {
        errorDiv.style.display = "none";
        return true;
    }
}

function submit_class_registeration() {
    const isDepartmentValid = validateField("departmentType", "departmentTypeError", "Please select a department.");
    const isClassNameValid = validateField("class_name", "class_nameError", "Please enter class name.");
    const isFeeValid = validateField("feeAmount", "feeAmountError", "Please enter fee amount.");
    const isRemarkValid = validateField("remark", "remarkError", "Please enter a remark.");

    if (!(isDepartmentValid && isClassNameValid && isFeeValid && isRemarkValid)) {
        return; // Stop submission if validation fails
    }

    // Get form data
    const formData = {
        departmentType: document.getElementById("departmentType").value,
        class_name: document.getElementById("class_name").value,
        feeAmount: document.getElementById("feeAmount").value,
        remark: document.getElementById("remark").value,
    };

    // Show spinner
    const button = document.querySelector(".btn-with-spinner");
    const spinner = button.querySelector(".spinner-border");
    const buttonText = button.querySelector(".button-text");

    spinner.classList.remove("d-none");
    buttonText.innerText = "Submitting...";

    // Send data to backend using Fetch
    fetch("/register_classes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
    .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok.");
        return response.json();
    })
    .then((data) => {
        alert(data.message || "Class registered successfully!");
        document.getElementById("registerClassForm").reset();
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("Failed to register class.");
    })
    .finally(() => {
        spinner.classList.add("d-none");
        buttonText.innerText = "Submit";
    });
}
