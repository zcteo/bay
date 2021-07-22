#!/bin/bash
# 将相对url转为绝对url，方便其他博客直接发文
# CSDN会强制将markdown格式的图片链接转存，只能使用html img标签
if [ ! -d ".public" ]; then
    mkdir .public || exit 1
fi
files=$(ls ./*.md)
parentDir=$(pwd | awk -F "/" '{print $NF}')
githubUrl="https://raw.githubusercontent.com/zcteo/zcteo.github.io/master/blog/"
blogUrl="https://zcteo.top/blog/"
for file in $files; do
    if [ -e ".public/$file" ]; then
        echo "正在更新 $file"
        printf '' >".public/$file"
    else
        echo "正在转换$file"
    fi

    awk '{
            # 处理图片链接
            if(match($0, /!\[(.*?)\]\((.*?)\)/ ,m))
            {
                newUrl = "'"$githubUrl"'" "" "'"$parentDir/"'" "" m[2]
                print "<img src=\"" "" newUrl "" "\" alt=\"" "" m[1] "" "\"/>"
            }
            # 处理站内文章链接
            else if(match($0, /\(((.*?)\.md)\)/, m))
            {
                newUrl = "'"($blogUrl"'" "" "'"$parentDir/"'" "" m[2] "" ".html)"
                sub(/\(.*?\.md\)/, newUrl, $0)
                print $0
            }
            else
            {
                print $0
            }
        }' "$file" >>".public/$file"

done
