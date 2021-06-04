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
            if(match($0,/!\[(.*?)\]\((.*?)\)/,a))
            {
                dir = "'"$parentDir/"'"
                githubUrl = "https://raw.githubusercontent.com/zcteo/zcteo.github.io/master/blog/"
                newUrl = githubUrl "" dir "" a[2]
                print "<img src=\"" "" newUrl "" "\" alt=\"" "" a[1] "" "\"/>"
            }
            else
            {
                print $0
            }
        }' "$file" >>".public/$file"

    dep=$(awk '/.*\.md)/{print}' "$file")
    if [ "$dep" ]; then
        {
            echo "$file"
            echo "$dep"
            echo ''
        } >>".public/dep.txt"
    fi
done

if [ -e ".public/dep.txt" ]; then
    cat ".public/dep.txt"
fi
