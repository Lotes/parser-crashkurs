markdown-to-slides -t "Parser-Crashkurs by Lotes" -s style.css -o index.html README.md
find *.dot -exec dot {} -Tpng -o{}.png \;
find *.ebnf -exec grammkit -f ebnf -t md {} \;
