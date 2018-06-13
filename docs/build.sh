markdown-to-slides -t "Parser-Crashkurs by Lotes" -s style.css -o index.html README.md
find *.dot -exec dot {} -Tsvg -o{}.svg \;
find *.ebnf -exec grammkit -f ebnf -t md {} \;
