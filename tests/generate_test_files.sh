#!/bin/bash
./random_file.sh 1MB 1_mb_file.txt
echo '[+] Generated 1MB file'
./random_file.sh 10MB 10_mb_file.txt
echo '[+] Generated 10MB file'
./random_file.sh 50MB 50_mb_file.txt
echo '[+] Generated 50MB file'
./random_file.sh 100MB 100_mb_file.txt
echo '[+] Generated 100MB file'
echo "this is line1

here's line number 2

line3

what about line #4?" > log_with_empty_lines.txt
echo '[+] Generated log file with empty lines'