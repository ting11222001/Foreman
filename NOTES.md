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