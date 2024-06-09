#!/bin/bash
set -e
cd "$1" || exit 1
echo "working directory: $(pwd)"

cp -ar blog _blog.bak
cp blog.md _blog.md.bak
rm -rf blog/SaveOnly

while IFS= read -r line; do
    if [[ $line =~ .*\(blog/.*md\) ]]; then
        file="$(echo "$line" | grep -o 'blog/.*md')"
        title="$(echo "$line" | grep -o '\[.*\]' | sed -e 's/\[//g' -e 's/\]//g')"
        (
            echo '---'
            echo 'layout: page'
            echo "title: '${title}'"
            echo '---'
            echo ''
        ) >tmp_header
        cat tmp_header "$file" >>tmp_md
        sed -e 's#md)#html)#g' -i tmp_md
        mv tmp_md "$file"
        rm tmp_header
    fi
done <blog.md

sed -e 's#(blog#(/blog#g' -e 's#md)#html)#g' -i blog.md

export LC_ALL=en_US.UTF-8

if [ "$1" = "-s" ]; then
    bundle exec jekyll server --future
else
    bundle exec jekyll build --future
fi

rm -rf _site/README.md
rm -rf blog
mv _blog.bak blog
mv _blog.md.bak blog.md
