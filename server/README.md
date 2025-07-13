SERVER side setup

1. poetry Setup

``` 
bash

$: poetry --version
```
If not existing in local then install:
``` 
bash

$: curl -sSL https://install.python-poetry.org | python3 -
```

2. Install Dependencies
``` 
bash
$: cd /NiceHajs/server/NajsHajsSerwer
$/NiceHajs/server/NajsHajsSerwer: poetry install
```
Dependencies should be installed, make sure to have Docker installed and service running.

3. SERVER run instruction:
```
$/NiceHajs/server/NajsHajsSerwer: poetry run python manage.py runserver
```

Server should be up and running now.

