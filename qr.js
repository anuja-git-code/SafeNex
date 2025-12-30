// QR Code Generation

document.addEventListener('DOMContentLoaded', () => {
    loadPatientsForQR();
});

function loadPatientsForQR() {
    const user = auth.currentUser;
    if (!user) return;

    const select = document.getElementById('patientSelect');
    if (!select) return;

    db.collection('patients').where('caretakerId', '==', user.uid)
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                const patient = doc.data();
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = patient.name;
                select.appendChild(option);
            });
        });
}

function generateQR() {
    const patientId = document.getElementById('patientSelect').value;
    if (!patientId) {
        alert('Please select a patient');
        return;
    }

    db.collection('patients').doc(patientId).get()
        .then((doc) => {
            if (doc.exists) {
                const patient = doc.data();
                const qrData = `
Name: ${patient.name}
Age: ${patient.age}
Medical Condition: ${patient.medicalCondition}
Emergency Contact: ${patient.emergencyContact}
Device ID: ${patient.deviceId}
                `.trim();

                const qrBox = document.getElementById('qrBox');
                qrBox.innerHTML = '';

                const qrImg = document.createElement('img');
                qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;
                qrBox.appendChild(qrImg);
            }
        })
        .catch((error) => {
            alert('Error: ' + error.message);
        });
}
