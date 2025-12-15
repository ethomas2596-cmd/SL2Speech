@echo off
pushd "%~dp0"
cd bin
httpd.exe -k stop
cd ..