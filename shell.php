<?php
/*
$t1 = $_GET["t1"];
$t2 = $_GET["t2"];
//$output = shell_exec('ls -lart'); // linux
$output = shell_exec('dir'); // windows
echo "$t1 vient de $t2";
echo "<pre>$output</pre>";
*/

$t1 = $_REQUEST["t1"];
$t2 = $_REQUEST["t2"];
$t3 = $_REQUEST["t3"];

//$output = shell_exec('ls -lart'); // linux
//$output = shell_exec('dir'); // windows

$output = shell_exec("./prog/moteur $t1 $t2 $t3");

$hint = "$output";

echo $hint;

?>
