@echo off
setlocal enabledelayedexpansion

set "input_folder=raw"
set "output_folder=compressed"

mkdir "%output_folder%" 2>nul

for %%I in ("%input_folder%\*.jpg") do (
    set "input_file=%%~fI"
    set "output_file=%output_folder%\%%~nI_compressed.jpg"
    ffmpeg -i "!input_file!" -vf "scale=300:-1" "!output_file!" -y
)

echo Compression completed.
pause
