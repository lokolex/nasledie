<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") { 
  $str_json = file_get_contents('php://input'); //($_POST doesn't work here)
  $response = json_decode($str_json, true); // decoding received JSON to array
  if (!empty($response['name']) && !empty($response['phone'])){
    if (isset($response['name'])) {
      if (!empty($response['name'])) {
        $name = $response['name'];
        $nameFieldset = "Имя пославшего: ";
      }
    }
   
    if (isset($response['phone'])) {
      if (!empty($response['phone'])){
        $phone = $response['phone'];
        $phoneFieldset = "Телефон: ";
      }
    }

    $token = "";
    $chat_id = "";
    $arr = array(
      $nameFieldset => $name,
      $phoneFieldset => urlencode($phone)
    );
    foreach($arr as $key => $value) {
      $txt .= "<b>".$key."</b> ".$value."%0A";
    };

    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_URL, "https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt}");
    
    $ress = json_decode(curl_exec($ch));

    foreach($ress as $key => $value) {
      if($key == 'ok') {
        $data = array(
          $key => $value
        );
      }
      if($key == 'description') {
        array_push($data, $value);
      }
      if($key == 'error_code') {
        array_push($data, $value);
      }
    };

    if ($errno = curl_errno($ch)) {
      $message = curl_strerror($errno);
      echo "cURL error ({$errno}):\n {$message}"; // Выведет: cURL error (35): SSL connect error
    } 
    curl_close($ch);
  } else {
    $data = ['resultCode' => 1, 'message' => 'Вы заполнили не все поля!' ];
  }
  header('Content-type: application/json');
  print_r(json_encode($data));
  return true;
} else {
  header ("Location: /");
}
?>