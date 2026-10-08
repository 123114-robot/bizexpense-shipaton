$ErrorActionPreference = 'Stop'
$repositoryRoot = Split-Path $PSScriptRoot -Parent
$mobileRoot = Join-Path $repositoryRoot 'mobile'
$serverProcess = $null
$serverListenerProcessId = $null

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

        # Cold Metro startup may take well over six seconds before a socket exists.
        # Poll for up to three minutes, then allow the first real request to bundle.
        $ready = $false
        for ($attempt = 0; $attempt -lt 90; $attempt++) {
            Start-Sleep -Seconds 2
            try {
                Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:8081' -TimeoutSec 180 | Out-Null
                $ready = $true
                break
            } catch {
                if ($serverProcess.HasExited) { throw 'Expo Web stopped before becoming ready.' }
            }
        }
        if (-not $ready) { throw 'Expo Web did not become ready within three minutes.' }
        $serverListenerProcessId = Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue |
            Select-Object -First 1 -ExpandProperty OwningProcess
    }

    Push-Location $PSScriptRoot
    try {
        npm install
        npm run record
    } finally {
        Pop-Location
    }
} finally {
    if ($serverListenerProcessId) {
        Stop-Process -Id $serverListenerProcessId -Force -ErrorAction SilentlyContinue
    }
    if ($serverProcess -and -not $serverProcess.HasExited) {
        Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
    }
}
