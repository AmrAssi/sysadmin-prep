# Minimal static file server for SysAdmin Prep (no Node/Python required).
# Usage:  powershell -ExecutionPolicy Bypass -File serve.ps1   ->  http://localhost:8777
param([int]$Port = 8777)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$prefix = "http://localhost:$Port/"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "SysAdmin Prep serving $root at $prefix (Ctrl+C to stop)"

$mime = @{
  ".html"="text/html; charset=utf-8"; ".css"="text/css; charset=utf-8";
  ".js"="application/javascript; charset=utf-8"; ".json"="application/json; charset=utf-8";
  ".svg"="image/svg+xml"; ".png"="image/png"; ".ico"="image/x-icon"; ".txt"="text/plain; charset=utf-8";
  ".webmanifest"="application/manifest+json"; ".webp"="image/webp"
}

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $path = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
    if ($path -eq "/") { $path = "/index.html" }
    $file = Join-Path $root ($path.TrimStart("/"))
    if ((Test-Path $file) -and -not (Get-Item $file).PSIsContainer) {
      $ext = [System.IO.Path]::GetExtension($file).ToLower()
      $ct = $mime[$ext]; if (-not $ct) { $ct = "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $ctx.Response.ContentType = $ct
      $ctx.Response.ContentLength64 = $bytes.Length
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
      $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $ctx.Response.OutputStream.Close()
  } catch { }
}
