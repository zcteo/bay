#!/bin/bash
if [ ! -d ".public" ]; then
    mkdir .public || exit 1
fi
files=$(ls ./*.md)
parentDir=$(pwd | awk -F "/" '{print $NF}')
for file in $files; do
    if [ -e ".public/$file" ]; then
        echo "正在更新 $file"
        printf '' >".public/$file"
    else
        echo "正在转换$file"
    fi
    
    awk '{
            if(match($0,/(!\[.*?\])\((.*?)\)/,a))
            {
                dir = "'"$parentDir/"'"
                githubUrl = "https://raw.githubusercontent.com/zcteo/zcteo.github.io/master/blog/"
                newUrl = a[1] "" "(" "" githubUrl "" dir "" a[2]"" ")";
                print newUrl;
            }
            else
            {
                print $0
            }
        }' "$file" >>".public/$file"
done
