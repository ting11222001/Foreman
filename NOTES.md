# NOTES

## Create Laravel API

### Install PHP

Download it from: https://windows.php.net/download/

Get the VS17 x64 Non Thread Safe zip. 

Go to C:\ in File Explorer and make a new folder named php.

Move all the downloaded zip folder's  files in C:\php.

Next, add PHP to your PATH so Windows can find it. Follow these steps:
```
Press the Windows key, type environment variables, click the result
Click "Environment Variables" button at the bottom
In the bottom section (System variables), find Path, click it, click Edit
Click New
Type C:\php
Click OK on all 3 windows
```

### Verify PHP works
Close your terminal or VS code, open a new one, then run:
```
php --version

PHP version 8.5.5 (C:\php\php.exe)
```

###  Install Composer
Download the installer from: https://getcomposer.org/Composer-Setup.exe

Run it. It will find your PHP automatically.

### Verify Composer works
```
composer --version

Composer version 2.9.7 2026-04-14 13:31:52
```

### What is Composer and why does it need PHP?

Think of it like this:
```
PHP is the language. Like how Node.js runs JavaScript.
Composer is the package manager for PHP. Like how npm installs packages for your Vue app.
Laravel is a package that Composer downloads and sets up for you.
```

So the order is: PHP runs Composer, Composer installs Laravel.

### Create a new folder `foreman-api`

At the project root level `Projects\Foreman`, run:
```
composer create-project laravel/laravel foreman-api
```

That will create a new folder foreman-api next to your existing foreman and demo folders.
So your structure will look like:
```
Foreman/
  demo/
  foreman/        ← your Vue app
  foreman-api/    ← new Laravel app
```

### Issue: enable extensions in `.ini` files

Problem: PHP extensions are disabled.
You need to enable them in your `php.ini` file. Run this to open it:
```
notepad C:\php\php.ini
```

Then search for these two lines (use Ctrl+F):
```
;extension=fileinfo
;extension=zip
```

Remove the ; at the start of each line so they look like:
```
extension=fileinfo
extension=zip
```

Save the file, then run the composer command again:
```
composer create-project laravel/laravel foreman-api
```

### Issue: `\Projects\Foreman\foreman-api` is not empty

The first attempt left a half-empty folder. Delete it first, then try again:
```
Remove-Item -Recurse -Force foreman-api
composer create-project laravel/laravel foreman-api
```

### Enable the SQLite extension in `php.ini`

Run this to open `php.ini`:
```
notepad C:\php\php.ini
```

Search for this line:
```
;extension=pdo_sqlite
```

Remove the `;` so it looks like:
```
extension=pdo_sqlite
```

Also find and do the same for:
```
;extension=sqlite3
```

Save the file, then run:
```
cd foreman-api
php artisan migrate
```

Output:
```
  INFO  Preparing database.  

  Creating migration table ........................................................................................................ 12.93ms DONE

   INFO  Running migrations.  

  0001_01_01_000000_create_users_table ............................................................................................ 32.75ms DONE
  0001_01_01_000001_create_cache_table ............................................................................................ 19.42ms DONE
  0001_01_01_000002_create_jobs_table ............................................................................................. 28.67ms DONE
```

### Build the API endpoints

```
php artisan make:model Task -mc --api
```

This creates 3 files:
```
the tasks database table definition
the TaskController with empty CRUD methods
a model called Task
```

About the command:
```
php artisan: this is Laravel's command line tool. Like npm run but for Laravel.
make:model Task: create a Model called Task. A Model is a PHP class that represents one row in the database. Think of it like your Task interface in TypeScript.
-m: also create a migration file. A migration is a file that tells Laravel what columns the tasks table should have.
-c: also create a controller. A controller is the file that handles the 4 API requests (GET, POST, PUT, DELETE).
--api: make the controller API-ready, meaning it skips the HTML form methods you do not need.
```

Output:
```

   INFO  Model [C:\...\Foreman\foreman-api\app\Models\Task.php] created successfully.  

   INFO  Migration [C:\...\Foreman\foreman-api\database\migrations\2026_04_23_140601_create_tasks_table.php] created successfully.  

   INFO  Controller [C:\...\Foreman\foreman-api\app\Http\Controllers\TaskController.php] created successfully.  
```

### Running migrations

Fill out the file, `2026_04_23_140601_create_tasks_table.php`, TypeScript Task interface exactly, then run:
```
php artisan migrate
```

Output:
```
INFO  Running migrations.  

  2026_04_23_140601_create_tasks_table .................................................................................. 10.15ms DONE
```

### Start the Laravel server:

```
php artisan serve
```

but Laravel 11 removed `api.php` by default. You need to create it. 

Run this to create `routes/api.php`:
```
php artisan install:api
```

It does three things:
```
Creates routes/api.php where you define your API routes
Adds the API middleware so Laravel knows to handle /api/... requests
Creates a personal_access_tokens table for API authentication (you can ignore this for now)
```

Add `Route::apiResource` in `api.php`:
 
Route::apiResource automatically creates all 4 routes for you:
```
GET /api/tasks → index
POST /api/tasks → store
PUT /api/tasks/{task} → update
DELETE /api/tasks/{task} → destroy
```

Save the file, then run:
```
php artisan serve
```

It will show something like http://127.0.0.1:8000.

Then in Postman, make a GET request to:
```
http://127.0.0.1:8000/api/tasks
```

## Testing with Postman

### Get

Run:
```
http://127.0.0.1:8000/api/tasks
```


### POST /api/tasks

Run:
```
POST http://127.0.0.1:8000/api/tasks
```

Body > Raw > JSON:
```
{
    "title": "test",
    "description": "test",
    "priority": "low",
    "status": "todo"
    
}
```

It should respond with 201 Created.

### GET /api/tasks

Run:
```
GET http://127.0.0.1:8000/api/tasks
```

It should respond with 200 OK.


### PUT /api/tasks/{task} 

In Postman, replace {task} with the actual task ID from database.

For example, update the task with `id = 019dbca9-826f-7212-b5dc-0029389f8de2`:
```
PUT http://localhost:8000/api/tasks/019dbca9-826f-7212-b5dc-0029389f8de2
```

Then in the Body tab, select raw and JSON, and send only the fields you want to change:
```
{
  "title": "Updated title",
  "status": "inprogress"
}
```

It should respond with 200 OK.

### DELETE /api/tasks/{task}

Create another task first and delete this new task with this endpoint.

Get the new task's id and feed in the endpoint.

For example, delete the task with `id = 019dbcb1-2441-7132-8374-181c9bdea3df`:
```
DELETE http://localhost:8000/api/tasks/019dbcb1-2441-7132-8374-181c9bdea3df
```

It should respond with 204 No content.

## Add Yup

### Install Yup

```
npm install yup
```

And start to addd it in TaskModal component.


## Add Cypress

### Run the first three Cypress tests

#### Step 1: Start both servers
You need two terminals open at the same time.

Terminal 1, Laravel backend:
```
php artisan serve
```

This starts the API at http://localhost:8000.

Terminal 2, Vue frontend:
```
npm run dev
```

This starts the frontend at http://localhost:5173 (Vite default).

#### Step 2: Open Cypress

Terminal 3:
```
npx cypress open
```

This opens the Cypress GUI. Click "E2E Testing", then choose Chrome. You will see your test file listed. Click it to run.

To run headlessly (no GUI, faster):
```
npx cypress run --spec "cypress/e2e/board.cy.ts"
```

Also, Change baseUrl to the dev server
In `cypress.config.ts`, change:
```
typescriptbaseUrl: 'http://localhost:4173'
```

to:
```
typescriptbaseUrl: 'http://localhost:5173'
```

Then, it can start:
```
  (Run Starting)
   Running:  board.cy. ts      (1 of 1)


  Kanban board
    √ shows three columns (1779ms)
    √ requires a task name to save (395ms)
    √ adds a task and shows it on the board (753ms)
    √ opens edit modal when a card is clicked (643ms)
    1) deletes a task when delete button is clicked
    - persists tasks after page reload


  4 passing (9s)
  1 pending
  1 failing

  ...
```