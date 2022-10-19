<?php

use Carbon\Carbon;

/**
 * Copy a file, or recursively copy a folder and its contents
 * @author      Aidan Lister <aidan@php.net>
 * @version     1.0.1
 * @link        http://aidanlister.com/2004/04/recursively-copying-directories-in-php/
 * @param       string   $source    Source path
 * @param       string   $dest      Destination path
 * @param       int      $permissions New folder creation permissions
 * @return      bool     Returns true on success, false on failure
 */
function xcopy($source, $dest, $permissions = 0755)
{
    // Check for symlinks
    if (is_link($source)) {
        return symlink(readlink($source), $dest);
    }

    // Simple copy for a file
    if (is_file($source)) {
        return copy($source, $dest);
    }

    // Make destination directory
    if (!is_dir($dest)) {
        mkdir($dest, $permissions);
    }

    // Loop through the folder
    $dir = dir($source);
    while (false !== $entry = $dir->read()) {
        // Skip pointers
        if ($entry == '.' || $entry == '..') {
            continue;
        }

        // Deep copy directories
        xcopy("$source/$entry", "$dest/$entry", $permissions);
    }

    // Clean up
    $dir->close();
    return true;
}

/**
 * Delete a file or recursively delete a directory
 *
 * @param string $str Path to file or directory
 */
function recursiveDelete($str)
{
    if (is_file($str)) {
        return @unlink($str);
    } elseif (is_dir($str)) {
        $scan = glob(rtrim($str, '/') . '/*');
        foreach ($scan as $index => $path) {
            recursiveDelete($path);
        }
        return @rmdir($str);
    }
}

function get_latest_date(string $img_type = "forecast")
{
    if ($img_type == "ewb") {
        $json_file = "../resources/model/info_ewb.json";
    } else {
        $json_file = "../resources/model/info.json";
    }
    $info = file_get_contents($json_file);
    $info = json_decode($info, true);
    $date_str = "{$info['year']}-{$info['month']}-{$info['day']}_{$info['hour']}";
    $ts = Carbon::createFromFormat('Y-m-d_H', $date_str, 'Asia/Manila');
    return $ts;
}
