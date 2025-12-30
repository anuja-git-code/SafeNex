// ===============================
// Patient Management - Safenex
// ===============================

// Wait for auth state to be ready
auth.onAuthStateChanged((user) => {
    if (!user) {
        // Safety redirect (extra protection)
        window.location.replace("login.html");
        return;
    }

    // Load patients only after auth is confirmed
    loadPatients(user.uid);

    const form = document.getElementById("patientForm");
    if (form) {
        form.addEventListener("submit", (e) => savePatient(e, user.uid));
    }
});

// -------------------------------
// Save Patient
// -------------------------------
function savePatient(e, caretakerId) {
    e.preventDefault();

    const name = document.getElementById("pName").value.trim();
    const age = parseInt(document.getElementById("pAge").value);
    const condition = document.getElementById("pCondition").value.trim();
    const emergencyContact = document.getElementById("pEmergencyContact").value.trim();
    const deviceId = document.getElementById("pDeviceId").value.trim();

    if (!name || !age || !condition || !emergencyContact || !deviceId) {
        alert("Please fill all fields");
        return;
    }

    db.collection("patients")
        .add({
            caretakerId: caretakerId,
            name: name,
            age: age,
            medicalCondition: condition,
            emergencyContact: emergencyContact,
            deviceId: deviceId,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            alert("Patient saved successfully");
            document.getElementById("patientForm").reset();
        })
        .catch((error) => {
            console.error("Firestore Error:", error);
            alert(error.message);
        });
}

// -------------------------------
// Load Patients
// -------------------------------
function loadPatients(caretakerId) {
    const list = document.getElementById("patientList");
    if (!list) return;

    db.collection("patients")
        .where("caretakerId", "==", caretakerId)
        .orderBy("createdAt", "desc")
        .onSnapshot(
            (snapshot) => {
                list.innerHTML = "";

                if (snapshot.empty) {
                    list.innerHTML = "<p>No patients added yet.</p>";
                    return;
                }

                snapshot.forEach((doc) => {
                    const patient = doc.data();

                    const div = document.createElement("div");
                    div.className = "patient-card";
                    div.innerHTML = `
                        <h3>${patient.name}</h3>
                        <p><strong>Age:</strong> ${patient.age}</p>
                        <p><strong>Condition:</strong> ${patient.medicalCondition}</p>
                        <p><strong>Emergency:</strong> ${patient.emergencyContact}</p>
                        <p><strong>Device ID:</strong> ${patient.deviceId}</p>
                    `;
                    list.appendChild(div);
                });
            },
            (error) => {
                console.error("Snapshot Error:", error);
                alert(error.message);
            }
        );
}

// -------------------------------
// Edit Patient (Placeholder)
// -------------------------------
function editPatient(id) {
    alert("Edit functionality coming soon");
}

// -------------------------------
// Delete Patient
// -------------------------------
function deletePatient(id) {
    if (!confirm("Are you sure you want to delete this patient?")) return;

    db.collection("patients")
        .doc(id)
        .delete()
        .then(() => {
            alert("Patient deleted successfully");
        })
        .catch((error) => {
            console.error("Delete Error:", error);
            alert(error.message);
        });
}
