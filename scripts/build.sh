#!/bin/bash
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
cd "${SCRIPT_DIR}/.." || exit 1

cat <<EOF>tmp_header
---
layout: default
---

EOF

while IFS= read -r line; do
    if [[ $line =~ .*\(blog/.*md\) ]]; then
        file=$(echo "$line" | grep -o 'blog/.*md')
        cat tmp_header "$file" >> tmp_md
        sed -e 's#md)#html)#g' -i tmp_md
        mv tmp_md "$file"
    fi
done < blog.md

rm tmp_header

sed -e 's#(blog#(/blog#g' -e 's#md)#html)#g' -i blog.md

export LC_ALL=en_US.UTF-8
bundle exec jekyll build --future

rm -rf _site/scripts
rm -rf _site/blog/SaveOnly
