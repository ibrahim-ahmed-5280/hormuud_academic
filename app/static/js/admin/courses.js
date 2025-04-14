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
    const isCourseCodeValid = validateField("course_code", "course_codeError", "Please enter course code.");
    const isCourseNameValid = validateField("course_name", "course_nameError", "Please enter course name.");
    const isCreditHoursValid = validateField("credit_Hours", "creadit_Hours_Error", "Please enter credit hours.");
    const isRemarkValid = validateField("remark", "remarkError", "Please enter a remark.");

    if (!(isDepartmentValid && isCourseCodeValid && isCourseNameValid && isCreditHoursValid && isRemarkValid)) {
        return; // Stop if any validation fails
    }

    const formData = {
        departmentType: document.getElementById("departmentType").value,
        course_code: document.getElementById("course_code").value,
        course_name: document.getElementById("course_name").value,
        credit_Hours: document.getElementById("credit_Hours").value,
        remark: document.getElementById("remark").value,
    };

    const button = document.querySelector(".btn-with-spinner");
    const spinner = button.querySelector(".spinner-border");
    const buttonText = button.querySelector(".button-text");

    spinner.classList.remove("d-none");
    buttonText.innerText = "Submitting...";

    fetch("/register_course", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
    .then(response => {
        if (!response.ok) throw new Error("Server error");
        return response.json();
    })
    .then(data => {
        alert(data.message || "Course registered successfully!");
        document.getElementById("registerCorseForm").reset();
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Failed to register course.");
    })
    .finally(() => {
        spinner.classList.add("d-none");
        buttonText.innerText = "Submit";
    });
}
