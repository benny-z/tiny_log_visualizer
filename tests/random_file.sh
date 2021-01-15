#!/bin/bash
# dehumanize function based on: https://stackoverflow.com/questions/26621647/convert-human-readable-to-bytes-in-bash/26621833
dehumanize() {
  echo $1 | awk '
    function printpower(n,b,p) {printf "%u\n", n*b^p}
    { $1=tolower($1); b=p=0 }
     /[0-9]$/{print $1;next};
     /k[b]?$/{printpower($1,  2, 10)}
     /m[b]?$/{printpower($1,  2, 20)}
     /g[b]?$/{printpower($1,  2, 30)}
     /t[b]?$/{printpower($1,  2, 40)}'
}



if [ "$#" -ne 2 ]; then
    echo "Usage example: " $0 " 120MB large_filename.txt"
	exit 1
fi

base64 /dev/urandom | head -c $((`dehumanize $1`)) > $2