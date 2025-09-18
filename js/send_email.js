// Fonction utilitaire pour afficher les messages
function showMessage(elementId, message, isSuccess = false) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = message;
        element.className = isSuccess ? 'response-message success' : 'response-message error';
        element.style.display = 'block';
        
        // Masquer le message après 5 secondes si c'est un succès
        if (isSuccess) {
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        }
    }
}

// Fonction utilitaire pour envoyer les données
function sendFormData(formData, responseElementId) {
    fetch('send_email.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            showMessage(responseElementId, 'Votre message a été envoyé avec succès! Nous vous répondrons dans les plus brefs délais.', true);
            // Réinitialiser le formulaire
            const form = document.querySelector(`#${responseElementId}`).closest('form');
            if (form) form.reset();
        } else {
            showMessage(responseElementId, 'Erreur : ' + data.message);
        }
    })
    .catch(error => {
        showMessage(responseElementId, 'Erreur lors de l\'envoi. Veuillez réessayer plus tard.');
        console.error('Erreur:', error);
    });
}

// Gestionnaire pour le formulaire de contact
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-page-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            // Récupérer les valeurs des champs
            const prenom = document.getElementById('prenom').value.trim();
            const entreprise = document.getElementById('entreprise').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            // Vérifier les champs obligatoires
            if (!prenom || !email || !message) {
                showMessage('contactResponse', 'Le nom, l\'email et le message sont obligatoires.');
                return;
            }

            // Créer l'objet de données à envoyer
            const formData = new FormData();
            formData.append('form_type', 'contact');
            formData.append('prenom', prenom);
            formData.append('entreprise', entreprise);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('message', message);

            // Envoyer les données
            sendFormData(formData, 'contactResponse');
        });
    }

    // Gestionnaire pour le formulaire de commentaire blog
    const blogForm = document.querySelector('.comment-form');
    if (blogForm) {
        blogForm.addEventListener('submit', function (event) {
            event.preventDefault();

            // Récupérer les valeurs des champs
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const company = document.getElementById('company').value.trim();
            const comment = document.getElementById('comment').value.trim();

            // Vérifier les champs obligatoires
            if (!name || !email || !comment) {
                showMessage('blogResponse', 'Le nom, l\'email et le commentaire sont obligatoires.');
                return;
            }

            // Créer l'objet de données à envoyer
            const formData = new FormData();
            formData.append('form_type', 'blog');
            formData.append('name', name);
            formData.append('email', email);
            formData.append('company', company);
            formData.append('comment', comment);

            // Envoyer les données
            sendFormData(formData, 'blogResponse');
        });
    }
});
