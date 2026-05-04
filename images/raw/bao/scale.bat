@echo off
setlocal enabledelayedexpansion

REM === Find the only image file in the folder ===
set "INPUT="

for %%f in (*.jpg *.jpeg *.png *.webp *.bmp *.tif *.tiff) do (
    set "INPUT=%%f"
)

if "%INPUT%"=="" (
    echo No image found in this folder.
    pause
    exit /b
)

echo Found: %INPUT%

REM === Extract extension ===
for %%a in ("%INPUT%") do (
    set "EXT=%%~xa"
)

REM === Generate scaled images ===
ffmpeg -i "%INPUT%" -vf scale=1280:-1 "1280%EXT%"
ffmpeg -i "%INPUT%" -vf scale=1920:-1 "1920%EXT%"
ffmpeg -i "%INPUT%" -vf scale=3840:-1 "3840%EXT%"

echo Done!
pause
