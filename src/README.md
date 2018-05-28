# Parser-Crashkurs

---

# Motivation

* Verwendung von komplexen strukturierten Daten
* Erstellen eigener menschenlesbarer Datenformate
* Formulieren von Sachverhalten in der Domäne des Sachverhaltes (domänenspezifische Sprachen wie CSS)
* Angst nehmen vor Sprachen zu entwickeln (Aufwand Parserentwicklung?)
* Aufzeigen von Aufwänden nach dem Parsen

---

# Abgrenzung

* keine vollständigen Compiler, nur Parser

---

# Inhalte

* Grammatik schreiben
* Grammatikbestandteile
* Sprachklassen
* Gängige Probleme

# Eiskalt: Grammatik schreiben

Am Beispiel arithmetischer Ausdrücke

```
Expr  ::= Expr + Expr
        | Expr * Expr
        | Num
Num   ::= Num Digit | Digit
Digit ::= '0' | '1' ... '9'
```

Terminal? Nichtterminal? Regel?


# Weitere Bestandteile 1

* Pseudoterminale, Codeblöcke und Rückgabetypen

Beispiel:
```
Num <int> 
	::= Num Digit 
	    { $$ = $1 * 10 + $2; }
```

* Gängiges Vorgehen, ggf. unvermeidbar!
* Bläht die Grammatik auf!

# Weitere Bestandteile 2

* Metadaten
* Importe

Beipiel aus NPegasus:
```
@namespace MainCore.Common.Comments
@classname CommentLineParser
@using System.Linq;
```

# Weitere Bestandteile 3
* TODO Semantische Blöcke

# Sprackklassen

* Formale Sprachen (Chomsky-Hierarchie)
  * Typ-0-Grammatik: semientscheidbare Sprachen (unbeschränkt)
  * Typ-1-Grammatik: kontextsensitive Sprachen (2^O(n))
  * Typ-2-Grammatik: kontextfreie Sprachen (O(n^3))
  * Typ-3-Grammatik: reguläre Ausdrücke (O(n))
BILD

# Reguläre Ausdrücke (aka Tokens)

* beliebter Ansatz: wandle den Strom an Characters um
* ... in einen Strom von "Tokens" (Vorklassifizierung)
* diese werden durch reguläre Ausdrücke beschrieben
	
# Lexikalische Analyse

* Beispiel: "12 * i + 5" wäre
	* (NUM, "12"), (MUL, "*"), (ID, "i"), (ADD, "+"), (NUM, "5")
* "Komplexität" 10 zu 5
* Werkzeug dazu: "Lexer" oder "Scanner" oder "Tokenizer"
	
# Kontextfreie Grammatiken

* erkennbar mit CYK-Algorithmus in O(n^3)
* besser mittels LL(?)- und LR(?)-Parser
	
	
	
* PEGs
  
BILD
