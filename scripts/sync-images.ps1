# Sync site images from Images/Mockups only (+ logos from Images/Logo)
$ErrorActionPreference = "Stop"
$base = Split-Path $PSScriptRoot -Parent
$mockups = Join-Path $base "Images\Mockups"
$pub = Join-Path $base "public\images"
$logoSrc = Join-Path $base "Images\Logo\logo.png"

if (-not (Test-Path $mockups)) {
  Write-Error "Mockups folder not found: $mockups"
}

@("hero", "fleet", "logos", "about", "blog") | ForEach-Object {
  New-Item -ItemType Directory -Path (Join-Path $pub $_) -Force | Out-Null
}

# All photo assets — sourced only from Images/Mockups
$map = @{
  "photo_2026-05-22_06-21-56.jpg"       = @(
    "hero\hero-main.jpg",
    "fleet\branded-van.jpg",
    "blog\community-cleanup.jpg"
  )
  "photo_2026-05-22_06-22-17.jpg"       = @(
    "hero\page-banner.jpg",
    "fleet\branded-truck.jpg",
    "blog\commercial-fleet.jpg"
  )
  "photo_2026-05-22_06-46-50.jpg"       = @("about\before-after-cleanup.jpg")
  "photo_2026-05-22_06-47-03.jpg"       = @("fleet\branded-dumpster.jpg")
  "photo_2026-05-22_06-47-07.jpg"       = @(
    "fleet\branded-bin.jpg",
    "blog\recycling-toronto.jpg"
  )
  "FLEET WRAP MOCKUP VARIATION.png"     = @("fleet\fleet-wrap-mockup.png")
}

foreach ($entry in $map.GetEnumerator()) {
  $from = Join-Path $mockups $entry.Key
  if (-not (Test-Path $from)) {
    Write-Warning "Missing mockup: $($entry.Key)"
    continue
  }
  foreach ($rel in @($entry.Value)) {
    Copy-Item $from (Join-Path $pub $rel) -Force
    Write-Host "OK $rel <- $($entry.Key)"
  }
}

# Flyer assets (homepage hero reference)
$flyerSrc = Join-Path $base "Images\Flyers\CALL-TO-ACTION BANNERS.png"
if (Test-Path $flyerSrc) {
  Copy-Item $flyerSrc (Join-Path $pub "hero\cta-banner-flyer.png") -Force
  Write-Host "OK hero\cta-banner-flyer.png <- CALL-TO-ACTION BANNERS.png"
}

# Logos (not in Mockups — use Images/Logo)
if (Test-Path $logoSrc) {
  foreach ($name in @(
    "logos\logo-header.png", "logos\logo-light.png",
    "logos\logo-dark.png", "logos\logo-footer.png", "logos\logo-on-green.png"
  )) {
    Copy-Item $logoSrc (Join-Path $pub $name) -Force
    Write-Host "OK $name <- Logo\logo.png"
  }
} else {
  Write-Warning "Missing logo: $logoSrc"
}

# Open Graph / social preview — hero truck from mockups
$ogSrc = Join-Path $pub "hero\hero-main.jpg"
if (Test-Path $ogSrc) {
  Copy-Item $ogSrc (Join-Path $base "public\og-image.jpg") -Force
  Write-Host "OK public\og-image.jpg"
}

Write-Host "Done. All photos synced from Images/Mockups only."
