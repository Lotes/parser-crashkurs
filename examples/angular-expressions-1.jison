/* lexical grammar */
%lex

%%
<<EOF>>               return 'EOF';
\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b  return 'NUMBER';
["]([^\b\f\n\r\t\v\0\"\\]|[\\][bfnrtv0"\\]|[\\][u][0-9A-Fa-f]{4})*["]    return 'STRING';
[']([^\b\f\n\r\t\v\0\'\\]|[\\][bfnrtv0'\\]|[\\][u][0-9A-Fa-f]{4})*[']    return 'STRING';
";"                   return 'SEMICOLON';
"."                   return 'DOT';
"|"                   return 'PIPE';
"["                   return 'LBRACKET';
"]"                   return 'RBRACKET';
"?"                   return 'QUESTION';
":"                   return 'COLON';
"("                   return 'LPAREN';
")"                   return 'RPAREN';
","                   return 'COMMA';
"null"                return 'NULL';
"{"                   return 'LBRACE';
"}"                   return 'RBRACE';
"="                   return 'ASSIGN';
"+"                   return 'PLUS';
"!"                   return 'NOT';
"-"                   return 'MINUS';
"||"                  return 'OR';
"&&"                  return 'AND';
"=="                  return 'EQ';
"instanceof"          return 'INSTANCEOF';
"<"                   return 'LT';
"<="                  return 'LTE';
">"                   return 'GT';
">="                  return 'GTE';
"true"                return 'TRUE';
"false"               return 'FALSE';
[a-zA-Z_][a-zA-Z_0-9]* return 'ID';

/lex

%start start

%% /* language grammar */
start           : expressions EOF
                ;
expressions     : expression
                | expression SEMICOLON expressions
                ;
expression      : literal
                | ID args?
                | expression DOT ID args?
                | expression PIPE ID filterArg*
                | expression LBRACKET expression RBRACKET
                | NOT expression
                | MINUS expression %prec UMINUS
                | PLUS expression %prec UPLUS
                | expression ASSIGN expression
                | expression PLUS expression
                | expression MINUS expression
                | expression MUL expression
                | expression DIV expression
                | expression MOD expression
                | expression EQ expression
                | expression NEQ expression
                | expression GT expression
                | expression GTE expression
                | expression LT expression
                | expression LTE expression
                | expression AND expression
                | expression OR expression
                | expression INSTANCEOF expression
                | expression QUESTION expression COLON expression
                ;
args            : LPAREN expressionList? RPAREN
                ;
filterArg       : COLON expression
                ;
expressionList  : expression COMMA expressionList
                | expression
                ;
literal         : NULL
                | STRING
                | NUMBER
                | boolLiteral
                | LBRACKET expressionList RBRACKET
                | LBRACE (keyValuePair (COMMA keyValuePair)? )? RBRACE
                ;
boolLiteral     : TRUE
                | FALSE
                ;
keyValuePair    : expression COLON expression
                ;
