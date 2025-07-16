SERVER side setup

# 1. poetry Setup

``` 
bash

$: poetry --version
```
If not existing in local then install:
``` 
bash

$: curl -sSL https://install.python-poetry.org | python3 -
```
# 2. Install Dependencies
``` 
bash
$: cd /NiceHajs/server/NajsHajsSerwer
$/NiceHajs/server/NajsHajsSerwer: poetry install
```
Conda interpreter makes it a lil bit easier to set up enviroment more cross-platform so try and upload 
modules also from eviroment.yml file:
```
$: conda env create -f environment.yml
```
After that just activate env:
``` 
$: conda activate nhEnv
```

After It should look like that in terminal:

``` 
(nhEnv) $: 
```
# 3. SERVER run instruction:
Just type that shiii: 
```
(nhEnv) $/NiceHajs/server/NajsHajsSerwer: poetry run python manage.py runserver
```

Server should be up and running now:
```
(nhEnv) $: poetry run python manage.py runserver
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
July 16, 2025 - 21:22:30
Django version 5.2.3, using settings 'najshajsserwer.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.

WARNING: This is a development server. Do not use it in a production setting. Use a production WSGI or ASGI server instead.
For more information on production servers see: https://docs.djangoproject.com/en/5.2/howto/deployment/
```

