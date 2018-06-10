md2slides README.md index.html
find *.dot -exec dot {} -Tpng -o{}.png \;
find *.ebnf -exec grammkit -f ebnf -t md {} \;
