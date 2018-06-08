<?php

// http://www.freecontactform.com/email_form.php

    // EDIT THE 2 LINES BELOW AS REQUIRED
    $email_to = "losco.xavier@gmail.com";
    $email_subject = "Email de FRC";

    function died($error) {
        // your error code can go here
        echo "Un problème est survenu lors de la soumission de votre message.";
        echo "Les erreurs suivantes apparaissent.<br /><br />";
        echo $error."<br /><br />";
        echo "Veuillez retourner en arrière et corriger les erreurs.<br /><br />";
        die();
    }

    // validation expected data exists
    if(!isset($_POST['prenom']) ||
        !isset($_POST['nom']) ||
        !isset($_POST['email']) ||
        !isset($_POST['message'])) {
        died('Un problème est survenu lors de la soumission de votre message.');
    }

    $prenom = $_POST['prenom']; // required
    $nom = $_POST['nom']; // required
    $email_from = $_POST['email']; // required
    $message = $_POST['message']; // required

    $error_message = "";
    $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';

  if(!preg_match($email_exp,$email_from)) {
    $error_message .= "L'adresse mail entrée n'est pas valide. <br />";
  }

    $string_exp = "/^[A-Za-z .'-]+$/";

  if(!preg_match($string_exp,$prenom)) {
    $error_message .= "Le prénom entré n'est pas valide. <br />";
  }

  if(!preg_match($string_exp,$nom)) {
    $error_message .= "Le nom entré n'est pas valide. <br />";
  }

  if(strlen($message) < 2) {
    $error_message .= "Le message entré n'est pas valide. <br />";
  }

  if(strlen($error_message) > 0) {
    died($error_message);
  }

    $email_message = "Informations : \n\n";

    function clean_string($string) {
      $bad = array("content-type","bcc:","to:","cc:","href");
      return str_replace($bad,"",$string);
    }


    $email_message .= "Prénom : ".clean_string($prenom)."\n";
    $email_message .= "Nom : ".clean_string($nom)."\n";
    $email_message .= "Email : ".clean_string($email_from)."\n";
    $email_message .= "Message : ".clean_string($message)."\n\n\n";

// create email headers
$headers = 'From: '.$email_from."\r\n".
'Reply-To: '.$email_from."\r\n" .
'X-Mailer: PHP/' . phpversion();
//@mail($email_to, $email_subject, $email_message, $headers);
$monfichier = fopen('contact.txt', 'a');
fputs($monfichier, $email_message);
fclose($monfichier);

include("contact.html");

?>
