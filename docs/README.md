# Parser-Crashkurs

---

# Motivation

* Verwendung von komplexen strukturierten Daten
* Erstellen eigener menschenlesbarer Datenformate
* Formulieren von Sachverhalt in der Domäne des Sachverhaltes (domänenspezifische Sprachen wie CSS)
* Angst nehmen vor Sprachen zu entwickeln (Aufwand Parserentwicklung?)
* Aufzeigen von Aufwänden nach dem Parsen

---

# Abgrenzung

* keine vollständigen Compiler, nur Parser
* Literatur:

![Bild virtuelle Maschinen](virtuelle_maschinen.jpg)

---

# Inhalte

* Grammatik schreiben
* Grammatikbestandteile
* Sprachklassen
* Gängige Probleme

---

# Grammatik schreiben

<table>
<tr>
<td>
  <p>&quot;Mich beliebt es <i>Angular-like</i> Komponenten mittels Expressions zu definieren. Ich gedenke mir dafür einen Parser zu schreiben. Alle existierenden Lösungen sind Firlefanz!&quot;</p>
  <img src="lord_eingebildet.png"/>
</td>
<td><img src="angular-grammar.png"/></td>
</tr>
</table>

---
# Erklärung: Angular Expressions

* einfache Ausdrücke
* wenn sich eine Variable ändert, wird der komplette Ausdruck neu berechnet

<p style="position: relative; text-align: center;">
<img src="angular-example.png">
<img width="250px" style="position: absolute; z-index: 1000; bottom: -10px; left: -10px;" src="trollface1.png"/>
</p>
---

# Zurück zum Thema: Grammatik

Erstmal am Beispiel arithmetischer Ausdrücke...

```
Expr  ::= Expr '+' Expr
        | Expr '*' Expr
        | Num
Num   ::= Num Digit | Digit
Digit ::= '0' | '1' ... '9'
```

Backus-Naur-Form!

Terminal? Nichtterminal? Regel? Start?

---

# Grammatik: Tokens

* Oft müssen Tokens definiert werden (nur bei formaler Grammatik).
* Definition mittels regulärer Ausdrücke.
* Ein formaler Parser "misst" in Tokens.

```jison
[a-zA-Z][a-zA-Z0-9]*  { return "ID"; }
[0-9]*                { return "NUM"; }
```

---

# Grammatik: Weitere Bestandteile

* Pseudoterminale, Codeblöcke und Rückgabetypen

Beispiel:
```
Num <int>
	::= Num Digit
	    { $$ = $1 * 10 + $2; }
```

* Gängiges Vorgehen, ggf. unvermeidbar!
* Bläht die Grammatik auf!

---

# Grammatik: Weitere Bestandteile

* Metadaten
* Importe

Beipiel aus NPegasus:
```
@namespace MainCore.Common.Comments
@classname CommentLineParser
@using System.Linq;
```

---

# Grammatik: Weitere Bestandteile

* sonst "syntaktischer Zucker" wie \[Referenzen_in_XText\]
* Prüfungen am Lookahead auch denkbar
* ... das wird jetzt zu speziell

---

# Ausgangsgrammatik... Welches Tool?

Ich benutze `Jison`. NodeJS. Installieren mit `npm i -g jison`.

```jison
//Importe, Tokendefinitionen, Startdefinition, weitere Regeln...
expression      : literal
                | ID args?
                | expression DOT ID args?
                | expression PIPE ID filterArg*
                | expression LBRACKET expression RBRACKET
                | preOp expression
                | expression binOp expression
                | expression QUESTION expression COLON expression
                ;
```

* bauen mit `jison input.jison output.js`

---

# Ergebnis

* 1.563 Zeilen an Fehlern
* shift? reduce? WTF?

<p style="position: relative; text-align: center;">
<img src="angular-1-jison-ergebnis.png"/>
<img style="position: absolute; z-index: 1000; bottom: -10px; right: -10px;" src="wtf.png"/>
</p>

---

# Sprackklassen

* Formale Sprachen (Chomsky-Hierarchie)
  * Typ-0-Grammatik: semientscheidbare Sprachen (unbeschränkt)
  * Typ-1-Grammatik: kontextsensitive Sprachen (`2^O(n)`)
  * Typ-2-Grammatik: kontextfreie Sprachen (`O(n^3)`)
  * Typ-3-Grammatik: reguläre Ausdrücke (`O(n)`)
  * Typ 3 &#x2282; Typ 2 &#x2282; Typ 1 &#x2282; Typ 0

<div style="position: relative;  text-align: center;">
  <img src="al_bundy.jpg"/>
  <div style="width: 100%; position: absolute; text-align: center; z-index: 1000; color: white; bottom: 0px; font-size: 36px; font-weight: bold">
  &quot;Form&quot;-AL
  </div>
</div>

---

# Und es gibt noch...

<table>
<tr>
<td>
<div style="position: relative;  text-align: center;">
  <img width="75%" src="peggy_bundy.jpg"/>
  <div style="width: 100%; position: absolute; text-align: center; z-index: 1000; color: white; top: 0px; font-size: 36px; font-weight: bold">
  &quot;PEG&quot;
  </div>
</div>
</td>
<td>
<ul>
<li>kennt keine Tokens</li>
<li>alles in der selben Grammatik definiert</li>
<li>auch &quot;praktische Grammatik&quot; genannt</li>
<li>implementierbar mittel <i>parser combinators</i></li>
</ul>
</td>
</tr>
</table>

---

# Formal: Reguläre Ausdrücke

* beliebter Ansatz: wandle den Strom an Characters um
* ... in einen Strom von "Tokens" (Vorklassifizierung)
* diese werden durch reguläre Ausdrücke beschrieben
* Beispiel für Hexzahlen:

```bnf
HEX_NUMBER ::= [0-9a-fA-F]+
```

---

# Lexikalische Analyse

* Beispiel: `12 * i + 5` wäre
	* `(NUM, "12")`, `(MUL, "*")`, `(ID, "i")`, `(ADD, "+")`, `(NUM, "5")`
* "Komplexität" 10 zu 5
* Werkzeug dazu: "Lexer" oder "Scanner" oder "Tokenizer"
* Artikel: [Wie schreibt man einen Lexer?](http://blog.lotes-lab.de/how-to-build-a-lexer/)

---

# Kontextfreie Grammatiken

* erkennbar mit CYK-Algorithmus in `O(n^3)` mittels dynamischer Programmierung
* besser mittels LL(?)- und LR(?)-Parser
  * das erste 'L' ist die Leserichtung
  * der zweite Buchstabe sagt: "Ich fange mit der linken (rechten) Seite einer Grammatikregel an."
  * das `?` steht für die Größe des Lookaheads

---

---

TODO

* Parsergeneratoren LL/LR erklären
  * LL(1)
    * FIRST-Mengen, Follow-Mengen
    * Parsertabelle
* Unterschiede/Gemeinsamkeiten
* Fehlerbehandlung/Autocompletion
* AST abwandern: Validierung, Generierung
---

---

# Gängige Probleme

TODO

* Mehrdeutigkeiten beseitigen!
  * if-then-else: Dangling else
* shift/reduce nachgucken
* Operatorvorangregeln
* Linksfaktorisierung
* Linksrekursion
* Listenausdrücke
* Operatorenassoziativität

---

# Parser ohne Generator

* zwei Wege
  * in LL-Manier rekursiv absteigen
  * Parser-Kombinatoren

---

# Parsen mittels Rekursion

* Voraussetzung: LL(1)-Grammatik liegt vor
  * keine Mehrdeutigkeiten
  * keine Linksrekursionen
  * keine Linksfaktorisierungen

---

# Parsen mittels Rekursion

Zum Beispiel:

```ebnf
Expr ::= Term '+' Expr | Term
Term ::= Primary '*' Term | Term
Primary ::= NUMBER | '(' Expr  ')'
```

---

# Parsen mittels Rekursion

Implementierung: Jede Regel eine Funktion!

```ebnf
Expr ::= Term '+' Expr | Term
```

wird zu

```csharp
ExpressionNode Expression() {
  var left = Term();
  if(TryConsume(PLUS)) {

    //if(lookahead.type==PLUS) {
    //  lookahead++; return true; }
    //  else return false;

    var right = Expr();
    return new BinaryExprNode(ADD, left, right);
  } else {
    return left;
  }
}
```

---

# Parsen mittels Rekursion

```ebnf
Term ::= Primary '*' Term | Term
```

wird zu

```csharp
ExpressionNode Term() {
  var left = Primary();
  if(TryConsume(MUL)) { //lookahead
    var right = Term();
    return new BinaryExprNode(MULTIPLY, left, right);
  } else {
    return left;
  }
}
```

---

# Parsen mittels Rekursion

```ebnf
Primary ::= NUMBER | '(' Expr  ')'
```

wird zu

```csharp
ExpressionNode Primary() {
  var left = Primary();
  switch(lookahead.Type) {
    case NUMBER:
      var result = new NumberLiteral(Convert.ToInt32(lookahead.Text)));
      lookahead++;
      return result;
    case LPARENTHESIS:
      NextToken();
      var result = Expr();
      Consume(RPARENTHESIS); //throws exception, if not exists
      return result;
  }
  throw new Exception("No match, NUMBER OR '(' expected!");
}
```

---

# Parsen mittels Kombinatoren

Im Prinzip genau das selbe! Nur in Funktionen versteckt.

Grundlegende Operationen auf <i>praktischen</i> Sprachen sind:

* Konsumierung von Buchstaben `'hallo'` (bilden ein <i>Wort</i>)
* Konkatenierung von Wörtern `AB`
* endliche Wiederholung von Wörtern `A*`
* <u>priorisierte</u> Alternativen von Wörtern `A / B / C` (Patternmatching oder `switch`-Anweisung)

---

# Parsen mittels Kombinatoren

Beispiel: ein Wort konsumieren

```csharp
bool TryConsume(ref int position, string text) {
  if(input.At(position).startsWith(text)) {
    position += text.Length;
    return true;
  } else
    return false;
}
```

Konkatenation:

```csharp

```

---
