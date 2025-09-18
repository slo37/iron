<?php

// Autoriser les requêtes CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Si la méthode de la requête est OPTIONS, renvoyer une réponse 200 (préflight request)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Vérifier si la méthode de la requête est POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // 405 Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée']);
    exit;
}

// Charger les fichiers PHPMailer
require './php-mailer/src/Exception.php';
require './php-mailer/src/PHPMailer.php';
require './php-mailer/src/SMTP.php';

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

function getContactEmailTemplate($prenom, $entreprise, $email, $phone, $message)
{
    return "
    <!DOCTYPE html>
    <html lang='fr'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <style>
            body { font-family: 'Inter', Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0; }
            .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); color: white; padding: 30px 20px; text-align: center; }
            .header h2 { margin: 0; font-size: 28px; font-weight: 600; }
            .header .logo { margin-bottom: 10px; }
            .content { padding: 30px; }
            .content h3 { font-size: 22px; margin-bottom: 15px; color: #2c3e50; }
            .content p { font-size: 16px; color: #555; line-height: 1.8; margin-bottom: 12px; }
            .content strong { color: #2c3e50; font-weight: 600; }
            .info-box { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3498db; }
            .footer { background-color: #2c3e50; color: #ecf0f1; text-align: center; padding: 20px; font-size: 14px; }
            .footer a { color: #3498db; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class='email-container'>
            <div class='header'>
                <div class='logo'>
                    <strong>IRON WELDING COMPANY</strong>
                </div>
                <h2>Nouvelle Demande de Contact</h2>
            </div>
            <div class='content'>
                <h3>Bonjour,</h3>
                <p>Vous avez reçu une nouvelle demande de contact depuis votre site web. Voici les détails :</p>
                <div class='info-box'>
                    <p><strong>Nom & Prénom :</strong> $prenom</p>
                    <p><strong>Entreprise :</strong> " . ($entreprise ?: 'Non spécifiée') . "</p>
                    <p><strong>Email :</strong> $email</p>
                    <p><strong>Téléphone :</strong> " . ($phone ?: 'Non spécifié') . "</p>
                    <p><strong>Message :</strong></p>
                    <p style='background: white; padding: 15px; border-radius: 6px; border: 1px solid #ddd;'>$message</p>
                </div>
                <p>Veuillez contacter ce prospect dans les plus brefs délais pour répondre à sa demande.</p>
            </div>
            <div class='footer'>
                <p>&copy; " . date('Y') . " IRON Welding Company. Tous droits réservés.</p>
                <p>Email : Contact@iron.tn | Tél : +216 53 348 000</p>
            </div>
        </div>
    </body>
    </html>";
}

function getIndexContactEmailTemplate($prenom, $email, $address, $message)
{
    return "
    <!DOCTYPE html>
    <html lang='fr'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <style>
            body { font-family: 'Inter', Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0; }
            .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 30px 20px; text-align: center; }
            .header h2 { margin: 0; font-size: 28px; font-weight: 600; }
            .header .logo { margin-bottom: 10px; }
            .content { padding: 30px; }
            .content h3 { font-size: 22px; margin-bottom: 15px; color: #e74c3c; }
            .content p { font-size: 16px; color: #555; line-height: 1.8; margin-bottom: 12px; }
            .content strong { color: #e74c3c; font-weight: 600; }
            .info-box { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e74c3c; }
            .footer { background-color: #e74c3c; color: #ecf0f1; text-align: center; padding: 20px; font-size: 14px; }
            .footer a { color: #ffffff; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class='email-container'>
            <div class='header'>
                <div class='logo'>
                    <strong>IRON WELDING COMPANY</strong>
                </div>
                <h2>Contact depuis la Page d'Accueil</h2>
            </div>
            <div class='content'>
                <h3>Bonjour,</h3>
                <p>Vous avez reçu une nouvelle demande de contact depuis la page d'accueil de votre site web. Voici les détails :</p>
                <div class='info-box'>
                    <p><strong>Nom & Prénom :</strong> $prenom</p>
                    <p><strong>Email :</strong> $email</p>
                    <p><strong>Adresse :</strong> " . ($address ?: 'Non spécifiée') . "</p>
                    <p><strong>Message :</strong></p>
                    <p style='background: white; padding: 15px; border-radius: 6px; border: 1px solid #ddd;'>$message</p>
                </div>
                <p>Cette demande provient du formulaire de contact de la page d'accueil. Veuillez contacter ce prospect dans les plus brefs délais.</p>
            </div>
            <div class='footer'>
                <p>&copy; " . date('Y') . " IRON Welding Company. Tous droits réservés.</p>
                <p>Email : Contact@iron.tn | Tél : +216 53 348 000</p>
            </div>
        </div>
    </body>
    </html>";
}

function getBlogEmailTemplate($name, $email, $company, $comment)
{
    return "
    <!DOCTYPE html>
    <html lang='fr'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <style>
            body { font-family: 'Inter', Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0; }
            .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); color: white; padding: 30px 20px; text-align: center; }
            .header h2 { margin: 0; font-size: 28px; font-weight: 600; }
            .header .logo { margin-bottom: 10px; }
            .content { padding: 30px; }
            .content h3 { font-size: 22px; margin-bottom: 15px; color: #27ae60; }
            .content p { font-size: 16px; color: #555; line-height: 1.8; margin-bottom: 12px; }
            .content strong { color: #27ae60; font-weight: 600; }
            .info-box { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #27ae60; }
            .footer { background-color: #27ae60; color: #ecf0f1; text-align: center; padding: 20px; font-size: 14px; }
            .footer a { color: #ffffff; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class='email-container'>
            <div class='header'>
                <div class='logo'>
                    <strong>IRON WELDING COMPANY</strong>
                </div>
                <h2>Nouveau Commentaire Blog</h2>
            </div>
            <div class='content'>
                <h3>Bonjour,</h3>
                <p>Un nouveau commentaire a été posté sur votre blog. Voici les détails :</p>
                <div class='info-box'>
                    <p><strong>Nom :</strong> $name</p>
                    <p><strong>Email :</strong> $email</p>
                    <p><strong>Entreprise :</strong> " . ($company ?: 'Non spécifiée') . "</p>
                    <p><strong>Commentaire :</strong></p>
                    <p style='background: white; padding: 15px; border-radius: 6px; border: 1px solid #ddd;'>$comment</p>
                </div>
                <p>Article : <em>Comment choisir la bonne machine à souder pour votre activité</em></p>
                <p>Vous pouvez répondre directement à ce commentaire en contactant la personne via son email.</p>
            </div>
            <div class='footer'>
                <p>&copy; " . date('Y') . " IRON Welding Company. Tous droits réservés.</p>
                <p>Email : Contact@iron.tn | Tél : +216 53 348 000</p>
            </div>
        </div>
    </body>
    </html>";
}

function sendEmail($to, $subject, $body, $userEmail, $fullName)
{
    $mail = new PHPMailer(true);

    try {
        // Configurer le serveur SMTP
        $mail->isSMTP();
        $mail->Host = 'smtp.mail.ovh.net'; // Remplacez par votre serveur SMTP
        $mail->SMTPAuth = true;
        $mail->Username = 'contact@iron.tn'; // Remplacez par votre email
        $mail->Password = '53348000iron.tn'; // Utilisez une variable d'environnement pour la sécurité
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;

        // Expéditeur et destinataire
        $mail->setFrom('contact@iron.tn', 'IRON Welding Company');
        $mail->addReplyTo($userEmail, $fullName);
        $mail->addAddress('contact@iron.tn'); // Email de réception IRON

        // Contenu de l'email
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $body;
        $mail->CharSet = 'UTF-8';

        $mail->send();
        return ['status' => 'success', 'message' => 'Email envoyé avec succès'];
    } catch (Exception $e) {
        error_log("Erreur d'envoi de l'email : {$mail->ErrorInfo}");
        return ['status' => 'error', 'message' => "Erreur lors de l'envoi de l'email. Veuillez réessayer."];
    }
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Exécution de l'envoi d'e-mail si la requête est en POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $formType = htmlspecialchars($_POST['form_type'] ?? 'contact');
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    
    if (!$email) {
        echo json_encode(['status' => 'error', 'message' => 'Email invalide']);
        exit;
    }

    if ($formType === 'contact') {
        // Formulaire de contact
        $prenom = htmlspecialchars($_POST['prenom'] ?? null);
        $entreprise = htmlspecialchars($_POST['entreprise'] ?? '');
        $phone = htmlspecialchars($_POST['phone'] ?? '');
        $message = htmlspecialchars($_POST['message'] ?? null);
        
        if (!$prenom || !$message) {
            echo json_encode(['status' => 'error', 'message' => 'Le nom et le message sont obligatoires']);
            exit;
        }
        
        $subject = 'Nouvelle demande de contact - IRON Welding Company';
        $body = getContactEmailTemplate($prenom, $entreprise, $email, $phone, $message);
        $fullName = $prenom;
        
    } elseif ($formType === 'index_contact') {
        // Formulaire de contact depuis la page d'accueil
        $prenom = htmlspecialchars($_POST['prenom'] ?? null);
        $address = htmlspecialchars($_POST['address'] ?? '');
        $message = htmlspecialchars($_POST['message'] ?? null);
        
        if (!$prenom || !$message) {
            echo json_encode(['status' => 'error', 'message' => 'Le nom et le message sont obligatoires']);
            exit;
        }
        
        $subject = 'Contact depuis la page d\'accueil - IRON Welding Company';
        $body = getIndexContactEmailTemplate($prenom, $email, $address, $message);
        $fullName = $prenom;
        
    } elseif ($formType === 'blog') {
        // Formulaire de commentaire blog
        $name = htmlspecialchars($_POST['name'] ?? null);
        $company = htmlspecialchars($_POST['company'] ?? '');
        $comment = htmlspecialchars($_POST['comment'] ?? null);
        
        if (!$name || !$comment) {
            echo json_encode(['status' => 'error', 'message' => 'Le nom et le commentaire sont obligatoires']);
            exit;
        }
        
        $subject = 'Nouveau commentaire sur le blog - IRON Welding Company';
        $body = getBlogEmailTemplate($name, $email, $company, $comment);
        $fullName = $name;
        
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Type de formulaire non reconnu']);
        exit;
    }

    $result = sendEmail('contact@iron.tn', $subject, $body, $email, $fullName);
    echo json_encode($result);
    exit;
}

echo json_encode(['status' => 'error', 'message' => 'Requête invalide']);
