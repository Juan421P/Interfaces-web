# This script creates new contract files in the 'contracts' directory
# based on the service files in the 'services' directory.

# Define source and destination directories
$servicesDir = "services"
$contractsDir = "contracts"

# Ensure the contracts directory exists
if (-not (Test-Path -Path $contractsDir -PathType Container)) {
    Write-Host "Creating directory: $contractsDir"
    New-Item -Path $contractsDir -ItemType Directory | Out-Null
}

# Get all service files and loop through them
Get-ChildItem -Path $servicesDir -Filter "*.service.js" | ForEach-Object {
    # Get the base name (e.g., 'academic-dates')
    $baseName = $_.BaseName -replace "\.service$", ""

    # Construct the new contract file name and path
    $contractFileName = $baseName + ".contract.js"
    $contractFilePath = Join-Path -Path $contractsDir -ChildPath $contractFileName
    
    # Check if the contract file already exists to prevent overwriting
    if (-not (Test-Path -Path $contractFilePath)) {
        # Create the new, empty contract file
        New-Item -Path $contractFilePath -ItemType "File" | Out-Null
        Write-Host "✅ Created contract file: $contractFilePath"
    } else {
        Write-Host "ℹ️  Contract file already exists: $contractFilePath (skipping)"
    }
}

Write-Host " "
Write-Host "Script completed successfully."