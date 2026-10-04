$ErrorActionPreference = 'Stop'
$repositoryRoot = Split-Path $PSScriptRoot -Parent
$mobileRoot = Join-Path $repositoryRoot 'mobile'
$serverProcess = $null

try {
    try {
        Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:8081' -TimeoutSec 2 | Out-Null
    } catch {
        $serverCommand = "Set-Location -LiteralPath '$mobileRoot'; `$env:EXPO_PUBLIC_DEMO_MODE='true'; npm run web -- --port 8081"
        $serverProcess = Start-Process -FilePath (Get-Process -Id $PID).Path `
            -ArgumentList '-NoProfile', '-Command', $serverCommand `
            -WindowStyle Hidden -PassThru `
            -RedirectStandardOutput (Join-Path $PSScriptRoot 'server-output.log') `
            -RedirectStandardError (Join-Path $PSScriptRoot 'server-error.log')

        $ready = $false
        for ($attempt = 0; $attempt -lt 90; $attempt++) {
            Start-Sleep -Seconds 1
            try {
                Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:8081' -TimeoutSec 2 | Out-Null
                $ready = $true
                break
            } catch {
                if ($serverProcess.HasExited) { throw 'Expo Web stopped before becoming ready.' }
            }
        }
        if (-not $ready) { throw 'Expo Web did not become ready within 90 seconds.' }
    }

    Push-Location $PSScriptRoot
    try {
        npm install
        npm run record
    } finally {
        Pop-Location
    }
} finally {
    if ($serverProcess -and -not $serverProcess.HasExited) {
        Stop-Process -Id $serverProcess.Id
    }
}
