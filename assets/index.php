<html>
<head>
<title>Octank CRM</title>
<link rel="stylesheet" type="text/css" href="https://s3-@@REGION@@.amazonaws.com/@@S3SOURCE@@/style.css">
</head>
<body>
<h1>Octank CRM</h1>
<img src="https://s3-@@REGION@@.amazonaws.com/@@S3SOURCE@@/octank.png" width=10%>

<hr width=60%>
<h3>Octank customers via RDS:</h3>

<table id="customers">
<tr><th>Customer</th><th>Industry</th><th>Market cap</th></tr>
<?php
//phpinfo();

$host = '@@DBENDPOINT@@';
$db   = '@@DBNAME@@';
$user = '@@DBUSERNAME@@';
$pass = '@@DBPASSWORD@@';

$dsn = "mysql:host=$host;dbname=$db";
try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);

    $stmt = $pdo->prepare("SELECT * FROM customers");
    $stmt->execute();
    $arr = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if(!$arr) exit('No rows');
    foreach ($arr as $row) {
        echo "<tr><td>{$row['customer_name']}</td><td>{$row['industry']}</td><td>{$row['market_cap']}</td></tr>";
    }
    $stmt = null;

} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

?>
</table>

<hr width=60%>
<p>(local IP <b>@@INTERNALIP@@</b>)</p>


</body>
</html>