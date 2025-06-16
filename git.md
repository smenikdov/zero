## THEORY
Коммит - это дельта изменений
Ветка - это ссылка на коммит

## COMMIT
```
// header <type>(<scope>): <description>
chore: drop Node 6 from testing matrix

// body
see the issue for details on the typos fixed

// footer
BREAKING CHANGE: dropping Node 6 which hits end of life in April
Refs: GBR-423
```

```
db(migration): add new column projectId for unique documents

New projectId column referring to the project to which the document is attached

Refs: GBR-423
```

- Type - тип коммита (рефакторинг, исправление багов, новая фича и т.п.)
- Scope - область действия (где были изменения). Это может быть отдельный файл, директория или затронутая часть проекта (rendering, routing и т.д.). Не обязательно для заполнения (но желательно).
- Description - описание сути коммита. Обычно отвечает на вопрос "что было изменено/добавлено/удалено?" Например: add comment section
- Blank line - пустая строка, ей отделяется тело коммита от заголовка, и тело от футера.
- Body - не обязательно для заполнения. Здесь обычно отвечают на вопрос "Зачем были изменения?" и "Почему сделаны именно такие изменения?" (почему не стоит делать по-другому).
- Footer - не обязательно для заполнения. Может содержать информацию о критических изменениях (breaking changes), а также является местом для указания задач из бэклога, GitHub issues, тикетов, и других проблем, которые этот коммит закрывает или с которыми он связан.



## TYPES
- feat - используется при добавлении новой функциональности.
- fix - исправление багов.
- refactor - изменения кода, которые не исправляет баги и не добавляют функционал.
- chore - изменение конфигов, системы сборки, обновление зависимостей и т.д.
- test - всё, что связано с тестированием.
- style - исправление опечаток, изменение форматирования кода (переносы, отступы, точки с запятой и т.п.) без изменения смысла кода.
- docs - изменения только в документации.

- perf - изменения кода, повышающие производительность.
- build - изменения, влияющие на систему сборки или внешние зависимости (webpack, npm).
- ci - изменения в файлах конфигурации.

+ db



## COMMANDS

*git show*
Show various types of Git objects (commits, tags, etc.).

- Show information about the latest commit (hash, message, changes, and other metadata):
`git show`

- Show information about a given commit:
`git show commit`

- Show information about the commit associated with a given tag:
`git show tag`

- Show information about the 3rd commit from the HEAD of a branch:
`git show branch~3`

- Show a commit's message in a single line, suppressing the diff output:
`git show --oneline -s commit`

- Show only statistics (added/removed characters) about the changed files:
`git show --stat commit`

- Show only the list of added, renamed or deleted files:
`git show --summary commit`

- Show the contents of a file as it was at a given revision (e.g. branch, tag or commit):
`git show revision:path/to/file`


*git reset*
Undo commits or unstage changes, by resetting the current Git HEAD to the specified state.
If a path is passed, it works as "unstage"; if a commit hash or branch is passed, it works as "uncommit".

- Unstage everything:
`git reset`

- Unstage specific file(s):
`git reset path/to/file1 path/to/file2 ...`

- Interactively unstage portions of a file:
`git reset --patch path/to/file`

- Undo the last commit, keeping its changes (and any further uncommitted changes) in the filesystem:
`git reset HEAD~`

- Undo the last two commits, adding their changes to the index, i.e. staged for commit:
`git reset --soft HEAD~2`

- Discard any uncommitted changes, staged or not (for only unstaged changes, use `git checkout`):
`git reset --hard`

- Reset the repository to a given commit, discarding committed, staged and uncommitted changes since then:
`git reset --hard commit`


*git status*
Show the changes to files in a Git repository.
Lists changed, added and deleted files compared to the currently checked-out commit.

- Show changed files which are not yet added for commit:
`git status`

- Give output in short format:
`git status [-s|--short]`

- Show verbose information on changes in both the staging area and working directory:
`git status [-vv|--verbose --verbose]`

- Show the branch and tracking info:
`git status [-b|--branch]`

- Show output in short format along with branch info:
`git status [-sb|--short --branch]`

- Show the number of entries currently stashed away:
`git status --show-stash`

- Don't show untracked files in the output:
`git status [-uno|--untracked-files=no]`


*git add*
Adds changed files to the index.

- Add a file to the index:
`git add path/to/file`

- Add all files (tracked and untracked):
`git add [-A|--all]`

- Add all files recursively starting from the current folder:
`git add .`

- Only add already tracked files:
`git add [-u|--update]`

- Also add ignored files:
`git add [-f|--force]`

- Interactively stage parts of files:
`git add [-p|--patch]`

- Interactively stage parts of a given file:
`git add [-p|--patch] path/to/file`

- Interactively stage a file:
`git add [-i|--interactive]`


*git commit*


*git fetch*
Download objects and refs from a remote repository.

- Fetch the latest changes from the default remote upstream repository (if set):
`git fetch`

- Fetch new branches from a specific remote upstream repository:
`git fetch remote_name`

- Fetch the latest changes from all remote upstream repositories:
`git fetch --all`

- Also fetch tags from the remote upstream repository:
`git fetch --tags`

- Delete local references to remote branches that have been deleted upstream:
`git fetch --prune`


*git pull*
`Fetch branch from a remote repository and merge it to local repository.`

- Download changes from default remote repository and merge it:
`git pull`

- Download changes from default remote repository and use fast-forward:
`git pull [-r|--rebase]`

- Download changes from given remote repository and branch, then merge them into HEAD:
`git pull remote_name branch`


*git push*
Push commits to a remote repository.

- Send local changes in the current branch to its default remote counterpart:
`git push`

- Send changes from a specific local branch to its remote counterpart:
`git push remote_name local_branch`

- Send changes from a specific local branch to its remote counterpart, and set the remote one as the default push/pull target of the local one:
`git push [-u|--set-upstream] remote_name local_branch`

- Send changes from a specific local branch to a specific remote branch:
`git push remote_name local_branch:remote_branch`

- Send changes on all local branches to their counterparts in a given remote repository:
`git push --all remote_name`

- Delete a branch in a remote repository:
`git push remote_name [-d|--delete] remote_branch`

- Remove remote branches that don't have a local counterpart:
`git push --prune remote_name`

- Publish tags that aren't yet in the remote repository:
`git push --tags`


*git branch*
Main Git command for working with branches.

- List all branches (local and remote; the current branch is highlighted by `*`):
`git branch [-a|--all]`

- List which branches include a specific Git commit in their history:
`git branch [-a|--all] --contains commit_hash`

- Show the name of the current branch:
`git branch --show-current`

- Create new branch based on the current commit:
`git branch branch_name`

- Create new branch based on a specific commit:
`git branch branch_name commit_hash`

- Rename a branch (you must switch to a different branch before doing this):
`git branch [-m|--move] old_branch_name new_branch_name`

- Delete a local branch (you must switch to a different branch before doing this):
`git branch [-d|--delete] branch_name`

- Delete a remote branch:
`git push remote_name [-d|--delete] remote_branch_name`


*git stash*
Stash local Git changes in a temporary area.

- Stash current changes with a message, except new (untracked) files:
`git stash push [-m|--message] optional_stash_message`

- Stash current changes, including new untracked files:
`git stash [-u|--include-untracked]`

- Interactively select parts of changed files for stashing:
`git stash [-p|--patch]`

- List all stashes (shows stash name, related branch and message):
`git stash list`

- Show the changes as a patch between the stash (default is `stash@{0}`) and the commit back when stash entry was first created:
`git stash show [-p|--patch] stash@{0}`

- Apply a stash (default is the latest, named stash@{0}):
`git stash apply optional_stash_name_or_commit`

- Drop or apply a stash (default is stash@{0}) and remove it from the stash list if applying doesn't cause conflicts:
`git stash pop optional_stash_name`

- Drop all stashes:
`git stash clear`


*git revert*


*git merge*


*git rebase*


*git diff*


*git remote*


*git log*
Show a history of commits.

- Show the sequence of commits starting from the current one, in reverse chronological order of the Git repository in the current working directory:
`git log`

- Show the history of a particular file or directory, including differences:
`git log [-p|--patch] path/to/file_or_directory`

- Show an overview of which file(s) changed in each commit:
`git log --stat`

- Show a graph of commits in the current branch using only the first line of each commit message:
`git log --oneline --graph`

- Show a graph of all commits, tags and branches in the entire repo:
`git log --oneline --decorate --all --graph`

- Show only commits with messages that include a specific string, ignoring case:
`git log [-i|--regexp-ignore-case] --grep search_string`

- Show the last N number of commits from a certain author:
`git log [-n|--max-count] number --author "author"`

- Show commits between two dates (yyyy-mm-dd):
`git log --before "2017-01-29" --after "2017-01-17"`


*git cherry-pick*


*git checkout*
Checkout a branch or paths to the working tree.

- Create and switch to a new branch:
`git checkout -b branch_name`

- Create/reset and switch to a new branch:
`git checkout -B branch_name`

- Create and switch to a new branch based on a specific reference (branch, remote/branch, tag are examples of valid references):
`git checkout -b branch_name reference`

- Switch to an existing local branch:
`git checkout branch_name`

- Switch to the previously checked out branch:
`git checkout -`

- Switch to an existing remote branch:
`git checkout [-t|--track] remote_name/branch_name`

- Discard all unstaged changes in the current directory (see `git reset` for more undo-like commands):
`git checkout .`

- Discard unstaged changes to a given file:
`git checkout path/to/file`

- Replace a file in the current directory with the version of it committed in a given branch:
`git checkout branch_name -- path/to/file`


*git reflog*
Show a log of changes to local references like HEAD, branches or tags.

- Show the reflog for HEAD:
`git reflog`

- Show the reflog for a given branch:
`git reflog branch_name`

- Show only the 5 latest entries in the reflog:
`git reflog [-n|--max-count] 5`


*git config*
Manage custom configuration options for Git repositories.
These configurations can be local (for the current repository) or global (for the current user).

- Globally set your name or email (this information is required to commit to a repository and will be included in all commits):
`git config --global user.name|user.email "Your Name|email@example.com"`

- List local, global or system configuration entries and show their file location:
`git config --list --local|global|system --show-origin`

- Set the global value of a given configuration entry (in this case an alias):
`git config --global alias.unstage "reset HEAD --"`

- Get the value of a given configuration entry:
`git config alias.unstage`

- Use an alias:
`git unstage`

- Revert a global configuration entry to its default value:
`git config --global --unset alias.unstage`

- Edit the local Git configuration (`.git/config`) in the default editor:
`git config --edit`

- Edit the global Git configuration (`~/.gitconfig` by default or `$XDG_CONFIG_HOME/git/config` if such a file exists) in the default editor:
`git config --global --edit`


*git clone*
Clone an existing repository.

- Clone an existing repository into a new directory (the default directory is the repository name):
`git clone remote_repository_location path/to/directory`

- Clone an existing repository and its submodules:
`git clone --recursive remote_repository_location`

- Clone only the `.git` directory of an existing repository:
`git clone [-n|--no-checkout] remote_repository_location`

- Clone a local repository:
`git clone [-l|--local] path/to/local/repository`

- Clone quietly:
`git clone [-q|--quiet] remote_repository_location`

- Clone an existing repository only fetching the 10 most recent commits on the default branch (useful to save time):
`git clone --depth 10 remote_repository_location`

- Clone an existing repository only fetching a specific branch:
`git clone [-b|--branch] name --single-branch remote_repository_location`

- Clone an existing repository using a specific SSH command:
`git clone [-c|--config] core.sshCommand="ssh -i path/to/private_ssh_key" remote_repository_location`


*git init*


*git tag*


*git grep*


*git clean*
Remove files not tracked by Git from the working tree.

- Delete untracked files:
`git clean`

- Interactively delete untracked files:
`git clean [-i|--interactive]`

- Show which files would be deleted without actually deleting them:
`git clean [-n|--dry-run]`

- Forcefully delete untracked files:
`git clean [-f|--force]`

- Forcefully delete untracked [d]irectories:
`git clean [-f|--force] -d`

- Delete untracked files, including e[x]cluded files (files ignored in `.gitignore` and `.git/info/exclude`):
`git clean -x`


*git submodule*


*git prune*


*git gc*


*git rm*
Remove files from repository index and local filesystem.

- Remove file from repository index and filesystem:
`git rm path/to/file`

- Remove directory:
`git rm -r path/to/directory`

- Remove file from repository index but keep it untouched locally:
`git rm --cached path/to/file`


*git restore*
Restore working tree files. Requires Git version 2.23+.
See also `git checkout` and `git reset`.

- Restore an unstaged file to the staged version:
`git restore path/to/file`

- Restore an unstaged file to the version of a specific commit:
`git restore --source commit path/to/file`

- Discard all unstaged changes to tracked files:
`git restore :/`

- Unstage a file:
`git restore --staged path/to/file`

- Unstage all files:
`git restore --staged :/`

- Discard all changes to files, both staged and unstaged:
`git restore --worktree --staged :/`

- Interactively select sections of files to restore:
`git restore --patch`


*git bisect*


*git fsck*


*git describe*


*git blame*
Show commit hash and last author on each line of a file.

- Print file with author name and commit hash on each line:
`git blame path/to/file`

- Print file with author email and commit hash on each line:
`git blame [-e|--show-email] path/to/file`

- Print file with author name and commit hash on each line at a specific commit:
`git blame commit path/to/file`

- Print file with author name and commit hash on each line before a specific commit:
`git blame commit~ path/to/file`

- Print author name and commit hash information for a specific line range:
`git blame -L start_line,end_line path/to/file`

- Ignore whitespaces and line moves:
`git blame -w -C -C -C path/to/file`


*git worktree*


*git archive*


*git mv*


*git shortlog*


*git filter-branch*


*git format-path*
Create patch


*git apply*
Apply patch



## WAYS

ADD TO INDEX: `git add`

INDEX TO COMMIT: `git commit`

MOVE BRANCH TO COMMIT: `git checkout -B` `git reset --hard` `git reset` `git branch -f`

DELETE FROM INDEX FILE: `git reset` `git restore --staged`

DELETE FROM INDEX AND FILE SYSTEM: `git checkout -f` `git reset --hard` `git restore --worktree --staged`

DELETE NOT INDEXED CHANGES: `git checkout .` `git restore --worktree :/`
