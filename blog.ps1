$python = Get-Command py -ErrorAction SilentlyContinue
if ($python) {
    & $python.Source -3 "$PSScriptRoot\tools\blog.py" @args
} else {
    $python = Get-Command python -ErrorAction SilentlyContinue
    if (-not $python) {
        Write-Error 'Python 3 is required. Install Python and reopen the terminal.'
        exit 1
    }
    & $python.Source "$PSScriptRoot\tools\blog.py" @args
}
exit $LASTEXITCODE
