$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$pgBin = 'C:\Program Files\PostgreSQL\18\bin'
$clusterPath = Join-Path $projectRoot '.local-postgres'
$envPath = Join-Path $projectRoot '.env'
function New-PrivateToken([int]$count) {
  $bytes = New-Object byte[] $count
  $generator = [Security.Cryptography.RandomNumberGenerator]::Create()
  try { $generator.GetBytes($bytes) } finally { $generator.Dispose() }
  return [BitConverter]::ToString($bytes).Replace('-', '')
}
if (!(Test-Path $envPath)) {
  $dbPassword = New-PrivateToken 24
  $demoPassword = New-PrivateToken 16
  $contents = "DATABASE_URL=postgresql://hisabketab:${dbPassword}@127.0.0.1:55432/hisabketab`nPORT=3000`nAPP_ORIGIN=http://127.0.0.1:3000`nDEMO_PASSWORD=$demoPassword`n"
  [IO.File]::WriteAllText($envPath, $contents)
}
$connectionLine = Get-Content -LiteralPath $envPath | Where-Object { $_ -like 'DATABASE_URL=*' }
$connection = [Uri]($connectionLine.Substring(13))
if ($connection.Port -ne 55432) { throw 'Local helper only manages the isolated port 55432 cluster.' }
$dbPassword = $connection.UserInfo.Split(':')[1]
if (!(Test-Path (Join-Path $clusterPath 'PG_VERSION'))) {
  $passwordFile = Join-Path $projectRoot '.pg-password.tmp'
  try {
    [IO.File]::WriteAllText($passwordFile, $dbPassword)
    & "$pgBin\initdb.exe" -D $clusterPath -U hisabketab --auth=scram-sha-256 --pwfile=$passwordFile --encoding=UTF8 --locale=C
    if ($LASTEXITCODE -ne 0) { throw 'initdb failed' }
  } finally { if (Test-Path $passwordFile) { Remove-Item -LiteralPath $passwordFile } }
}
& "$pgBin\pg_ctl.exe" -D $clusterPath status | Out-Null
if ($LASTEXITCODE -ne 0) {
  & "$pgBin\pg_ctl.exe" -D $clusterPath -l (Join-Path $clusterPath 'server.log') -o '-h 127.0.0.1 -p 55432' -w start
  if ($LASTEXITCODE -ne 0) { throw 'PostgreSQL start failed' }
}
$env:PGPASSWORD = $dbPassword
try {
  $exists = & "$pgBin\psql.exe" -h 127.0.0.1 -p 55432 -U hisabketab -d postgres -Atc "SELECT 1 FROM pg_database WHERE datname='hisabketab'"
  if ($exists -ne '1') { & "$pgBin\createdb.exe" -h 127.0.0.1 -p 55432 -U hisabketab hisabketab }
} finally { Remove-Item Env:PGPASSWORD }
Write-Output 'Isolated PostgreSQL ready on port 55432. Credentials are in ignored .env.'
