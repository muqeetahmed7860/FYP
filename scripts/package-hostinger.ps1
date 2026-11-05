$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$projectPath = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$releasePath = Join-Path $projectPath 'release'
New-Item -ItemType Directory -Force -Path $releasePath | Out-Null
$zipPath = Join-Path $releasePath 'hisabketabai-hostinger.zip'
$roots = @('src','server','prisma','public','tests','scripts','deploy')
$rootFiles = @('package.json','package-lock.json','app.cjs','index.html','tsconfig.json','vite.config.ts','eslint.config.mjs','playwright.config.ts','README.md')
$included = [Collections.Generic.List[string]]::new()
foreach($file in $rootFiles){ $included.Add((Join-Path $projectPath $file)) }
foreach($folder in $roots){ Get-ChildItem -LiteralPath (Join-Path $projectPath $folder) -File -Recurse | ForEach-Object { $included.Add($_.FullName) } }
# Allowlisted sources only: never package local credentials, PostgreSQL data, caches or installed modules.
if(Test-Path -LiteralPath $zipPath){ Remove-Item -LiteralPath $zipPath -Force }
$archive = [IO.Compression.ZipFile]::Open($zipPath, [IO.Compression.ZipArchiveMode]::Create)
try {
 foreach($file in $included){
  $entryName = $file.Substring($projectPath.Length+1).Replace('\','/')
  if($entryName -match '(^|/)(node_modules|\.local-postgres|\.env|\.npm-cache|release)(/|$)' -or $entryName -match '\.(log|sqlite|zip|dump|bak)$'){ throw "Private or generated file unexpectedly selected: $entryName" }
  [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive,$file,$entryName,[IO.Compression.CompressionLevel]::Optimal) | Out-Null
 }
}finally{ $archive.Dispose() }
$check = [IO.Compression.ZipFile]::OpenRead($zipPath)
try{
 if(!($check.Entries.FullName -contains 'package.json') -or !($check.Entries.FullName -contains 'app.cjs')){throw 'The package must have package.json and app.cjs at its root.'}
 $count=$check.Entries.Count
}finally{$check.Dispose()}
$hash=(Get-FileHash -LiteralPath $zipPath -Algorithm SHA256).Hash
Set-Content -LiteralPath (Join-Path $releasePath 'SHA256.txt') -Value "$hash  hisabketabai-hostinger.zip"
Write-Output "Created $zipPath ($count source files; $([Math]::Round((Get-Item $zipPath).Length/1MB,2)) MB)."
