@echo off
pushd "%~dp0"
cd bin
httpd.exe -k start
cd ..