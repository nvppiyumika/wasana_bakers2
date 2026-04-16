<?php
$files = glob("api/*.php");
foreach ($files as $file) {
    if (basename($file) === "config.php")
        continue;
    $content = file_get_contents($file);

    // Remove session_start();
    $content = preg_replace('/^\s*session_start\(\);\s*[\r\n]+/m', '', $content);

    // Remove headers
    $content = preg_replace('/^\s*header\([\'"]Content-Type:\s*application\/json.*?[\'"]\);\s*[\r\n]+/m', '', $content);
    $content = preg_replace('/^\s*header\([\'"]Access-Control-Allow-.*?[\'"]\);\s*[\r\n]+/m', '', $content);

    // Remove ini_set
    $content = preg_replace('/^\s*ini_set\([\'"]display_errors[\'"].*?\);\s*[\r\n]+/m', '', $content);
    $content = preg_replace('/^\s*ini_set\([\'"]log_errors[\'"].*?\);\s*[\r\n]+/m', '', $content);
    $content = preg_replace('/^\s*ini_set\([\'"]error_log[\'"].*?\);\s*[\r\n]+/m', '', $content);

    // Replace FILTER_SANITIZE_STRING
    $content = preg_replace('/filter_var\s*\(\s*(.*?)\s*,\s*FILTER_SANITIZE_STRING\s*\)/', 'strip_tags($1)', $content);

    file_put_contents($file, $content);
}
echo "Clean up executed.\n";
?>