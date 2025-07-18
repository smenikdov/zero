vdeloDudeBot: 8092178325:AAFnYsZOW1XIWQq4AScxYWPc6tyqOMFAFR0
group: -1002822275411


:set colorcolumn=
Ctrl Z + fg      hide and show active process
zf zc zo         
AA AC             my custom command
gp                git preview
S                 in visual mode to surround
K                 in normal move code hover
gq                in visual to format
gr                some cull staff
<C-]>             go to tag
Q                 to reapaet last macro
<C-r>=            to calc
g<C-a>            in visual mode to increase numbers correctly
:s/foo/&bar       & is a placeholder for the search pattern so this replaces foo with foobar 
gv                last selection
gi                last insert

EasyAlign
Undotree
GenerateCtags

:g/foo/s/bar/baz/
:v//

*ctags C+\\*
ctags -R --exclude=node_modules .

*cq - quickfix*
*cx - diagnostic (cX buffer)*
*cs - symbols*
cl(Cl) - trouble list, not working :( 

plugin to stream cli in buffer

copen
cclose
cw
cnext
cprev
cfirest
clas
cc
colder
cnewer
chistory
make
*vimgrep*
grep
*cdo*

lmake
lgrep
lvimgrep
lopen
lclose
lnext
lprev

============================================================

:vimgrep[!] /pattern/[g][j] {file(s)}
! — если добавлен, очищает предыдущий Quickfix-список.
pattern — регулярное выражение Vim (см. :help pattern).
g — включает поиск всех совпадений в строке (по умолчанию только первое).
j — не прыгает к первому совпадению автоматически.
file(s) — файлы или шаблон (например, *.py, **/*.lua, % - текущий файл)

:vimgrep /TODO/ **/*.py
:vimgrep /function/g %

============================================================

:grep[!] [options] {pattern} {file(s)}
! — очищает предыдущий Quickfix-список.
options — аргументы для внешней утилиты (например, -i для grep).
pattern — строка или регулярное выражение, зависящее от утилиты.
file(s) — файлы или шаблон.

:grep TODO .
:grep -i todo **/*.py

============================================================

:[range]s/pattern/replacement/[flags]
range — Указывает диапазон строк
    :s — замена в текущей строке.
    :%s — замена во всём файле.
    :1,5s — замена в строках с 1 по 5.
    :'<,'>s
pattern: Регулярное выражение, которое ищет текст для замены.
replacement: Текст, на который заменяется найденное вхождение
[flags]: Модификаторы поведения команды. Часто используемые:
    g — заменить все вхождения в строке (без g заменяется только первое вхождение).
    i — игнорировать регистр.
    c — запрашивать подтверждение для каждой замены.
    e — подавлять ошибки, если совпадений не найдено.
