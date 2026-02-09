<?php
/**
 * Stories Gallery Image Inventory Script
 *
 * Instructions:
 * 1. Upload this file to your image server (e.g., as list.php).
 * 2. Ensure your images are in a subfolder (default: 'content/images').
 * 3. Update the $trusted_origins array with your Vercel URLs.
 * 4. Update the $secret_key to match the one in your index.html.
 */

// 1. CONFIGURATION
$secret_key = "st_8a2b_9f41de3c6e";
$image_directory = 'content/images';
$trusted_origins = [
    "http://playground.local",
    "http://localhost:8080",
    "https://longzero.com"
];

// 2. CORS SECURITY
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $trusted_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Headers: X-API-KEY, Content-Type");
    header("Access-Control-Allow-Methods: GET, OPTIONS");
}

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

header("Content-Type: application/json");

// 3. API KEY VALIDATION
$header_key = $_SERVER['HTTP_X_API_KEY'] ?? $_SERVER['X-API-KEY'] ?? '';
if ($header_key !== $secret_key) {
    http_response_code(403);
    echo json_encode(["error" => "Unauthorized access"]);
    exit;
}

// 4. GENERATE INVENTORY
if (!is_dir($image_directory)) {
    echo json_encode(["images" => [], "error" => "Directory not found"]);
    exit;
}

$directory = new RecursiveDirectoryIterator($image_directory);
$flattened = new RecursiveIteratorIterator($directory);
$files = new RegexIterator($flattened, '/\.(?:jpg|jpeg|png|webp|avif)$/i');

$images = [];
foreach ($files as $file) {
    if (!$file->isDir()) {
        // Return path relative to this script for the JS to prepend BASE_URL
        $images[] = str_replace('\\', '/', $file->getPathname());
    }
}

sort($images);

echo json_encode([
    "images" => $images,
    "count" => count($images),
    "timestamp" => time()
]);
