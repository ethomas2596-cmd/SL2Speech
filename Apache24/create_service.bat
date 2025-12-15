@echo off
pushd "%~dp0"
cd bin
httpd.exe -k install
cd ..