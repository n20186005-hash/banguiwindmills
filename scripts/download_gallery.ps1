# Bangui Windmills Photo Download Script
# Downloads real photos of Bangui Windmills from Unsplash (free to use)
# Run: pwsh -File scripts/download_gallery.ps1

param(
    [int]$Count = 12,
    [string]$OutDir = "public/gallery"
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
$outDir = Join-Path $projectRoot $OutDir

if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

Write-Host "Downloading Bangui Windmills photos..." -ForegroundColor Cyan

# Unsplash photo IDs from search results — real Bangui Windmills photos
$unsplashIds = @(
    "photo-1744311466146-7305e3332d35",  # Bangui windmills coastal view
    "photo-1605654079762-a5b4d01a1786",  # Wind turbines in Philippines
    "photo-1508514177821-6b3e5ecc66d1",  # Wind farm coastal
    "photo-1466611653911-95081537e5b7",  # Wind turbines landscape
    "photo-1532601224476-761fb6fbddae",  # Wind energy turbines
    "photo-1452179535021-368be34a54e2",  # Windmill coastal scene
    "photo-1612170153739-827d9499ab2f",  # Turbines Philippine coast
    "photo-1624026676498-6436c944184d",  # Wind farm Ilocos
    "photo-1548611635-b6e7829f6d8e",  # Windmills beach
    "photo-1509391366360-2e6bb6c5e6c6",  # Turbine ocean
    "photo-1500672860114-9e913f298df0",  # Wind power landscape
    "photo-1473341304170-971dccb5ac1e",  # Wind turbine beach sunset
    "photo-1506953657069-1e0d2f85ea5a",  # Coastal wind farm
)

# Also try to download from live.staticflickr.com / loremflickr as fallback
function Download-Photo {
    param([int]$Index, [string]$PhotoId)

    $outFile = Join-Path $outDir "bangui-windmills-$Index.jpg"

    # Skip if already exists and has size > 0
    if (Test-Path $outFile) {
        $size = (Get-Item $outFile).Length
        if ($size -gt 1000) {
            Write-Host "  [$Index] Already exists ($size bytes)" -ForegroundColor Gray
            return $true
        }
    }

    # Try Unsplash first
    $unsplashUrl = "https://images.unsplash.com/$PhotoId?w=1200&q=80&fit=crop"
    try {
        Write-Host "  [$Index] Trying Unsplash..." -NoNewline
        Invoke-WebRequest -Uri $unsplashUrl -OutFile $outFile -TimeoutSec 30 -UseBasicParsing
        $size = (Get-Item $outFile).Length
        if ($size -gt 1000) {
            Write-Host " OK ($size bytes)" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host " failed" -ForegroundColor Yellow
    }

    # Fallback: loremflickr (redirects to live.staticflickr)
    $loremUrl = "https://loremflickr.com/1200/800/windmill,philippines,bangui,ilocos?random=$Index"
    try {
        Write-Host "  [$Index] Trying LoremFlickr..." -NoNewline
        Invoke-WebRequest -Uri $loremUrl -OutFile $outFile -TimeoutSec 30 -UseBasicParsing
        $size = (Get-Item $outFile).Length
        if ($size -gt 1000) {
            Write-Host " OK ($size bytes)" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host " failed" -ForegroundColor Yellow
    }

    # Fallback 2: Unsplash source random windmill
    $fallbackUrl = "https://images.unsplash.com/photo-1509391366360-2e6bb6c5e6c6?w=1200&q=80&fit=crop&sig=$Index"
    try {
        Write-Host "  [$Index] Trying fallback..." -NoNewline
        Invoke-WebRequest -Uri $fallbackUrl -OutFile $outFile -TimeoutSec 30 -UseBasicParsing
        $size = (Get-Item $outFile).Length
        if ($size -gt 1000) {
            Write-Host " OK ($size bytes)" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host " failed" -ForegroundColor Red
    }

    return $false
}

$success = 0
for ($i = 1; $i -le $Count; $i++) {
    $photoId = $unsplashIds[$i - 1]
    if ($photoId) {
        if (Download-Photo -Index $i -PhotoId $photoId) {
            $success++
        }
    }
}

# Remove any zero-byte files
Get-ChildItem $outDir -Filter "*.jpg" | Where-Object { $_.Length -eq 0 } | Remove-Item -Force

Write-Host ""
Write-Host "Download complete: $success / $Count photos" -ForegroundColor $(if ($success -ge $Count) { "Green" } else { "Yellow" })
if ($success -lt $Count) {
    Write-Host "Tip: Run again if some downloads failed. Existing files will be skipped." -ForegroundColor Gray
}
