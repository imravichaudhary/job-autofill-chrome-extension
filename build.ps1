# Build script for JobFill Pro extension
$ErrorActionPreference = "Stop"
$compiler = ".\closure-compiler-v20250706.jar"

Write-Host "Starting build process..."

# Check if Java is installed
try {
    $javaVersion = java -version 2>&1
    Write-Host "Found Java:" $javaVersion[0]
}
catch {
    Write-Error "Java is not installed or not in PATH. Please install Java first."
    exit 1
}

# Check if compiler exists
if (-not (Test-Path $compiler)) {
    Write-Error "Closure compiler not found at: $compiler"
    exit 1
}

# Combine files
Write-Host "Combining background scripts..."
try {
    $configContent = Get-Content -Path "config.js" -Raw
    $backgroundContent = Get-Content -Path "background.js" -Raw
    Set-Content -Path "combined_background.js" -Value ($configContent + $backgroundContent)
    Write-Host "Successfully created combined_background.js"
}
catch {
    Write-Error "Failed to combine background scripts: $_"
    exit 1
}

# Function to compile JavaScript with error reporting
function Invoke-Compilation {
    param (
        [string[]]$InputFiles,
        [string]$OutputFile
    )
    
    Write-Host "Compiling $OutputFile..."
    $inputArgs = $InputFiles | ForEach-Object { "--js `"$_`"" }
    $command = "java -jar `"$compiler`" $inputArgs --js_output_file `"$OutputFile`" --language_in=ECMASCRIPT_2020 --language_out=ECMASCRIPT_2020"
    
    Write-Host "Running command: $command"
    $output = cmd /c "$command 2>&1"
    Write-Host "Compiler output:"
    Write-Host $output
    if (-not (Test-Path $OutputFile)) {
        Write-Error "Compilation failed for $OutputFile`:`n$output"
        return $false
    }
    Write-Host "Successfully compiled $OutputFile"
    return $true
}

# Compile content scripts
Write-Host "Compiling content scripts..."
$contentResult = Invoke-Compilation -InputFiles @(
    "content.js",
    "main.js",
    "workday.js",
    "taleo.js",
    "greenhouse.js",
    "lever.js"
) -OutputFile "contentc.js"

if (-not $contentResult) {
    exit 1
}

# Compile popup script
Write-Host "Compiling popup script..."
$popupResult = Invoke-Compilation -InputFiles @("resumepopup.js") -OutputFile "resumepopupc.js"

if (-not $popupResult) {
    exit 1
}

# Move compiled files
Write-Host "Moving compiled files..."
try {
    if (Test-Path "contentc.js") { 
        Move-Item -Force "contentc.js" "content.js"
    }
    if (Test-Path "resumepopupc.js") {
        Move-Item -Force "resumepopupc.js" "resumepopup.js"
    }
}
catch {
    Write-Error "Failed to move compiled files: $_"
    exit 1
}

# Create extension ZIP
Write-Host "Creating extension ZIP..."
try {
    $files = @(
        "content.js",
        "main.js",
        "workday.js",
        "taleo.js",
        "greenhouse.js",
        "lever.js",
        "resumepopup.js",
        "combined_background.js",
        "popup.js",
        "schema.json",
        "index.html",
        "popup.html",
        "manifest.json",
        "style.css",
        "jobfill16.png",
        "jobfill48.png",
        "jobfill128.png",
        "jobfill_tree.png"
    )

    foreach ($file in $files) {
        if (-not (Test-Path $file)) {
            Write-Error "Required file not found: $file"
            exit 1
        }
    }

    Compress-Archive -Force -Path $files -DestinationPath "extension.zip"
    Write-Host "Successfully created extension.zip"
}
catch {
    Write-Error "Failed to create ZIP file: $_"
    exit 1
}

Write-Host "Build completed successfully!"
