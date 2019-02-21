# Questionnaire (Community Edition)

This is a simple, web based application to create polls. It originates from a self-assessment in the german
car industry for their employees to check how 'digital' they already are. The questions themselves are not
part of this reposititory, it is only the 'application' part which can be used to create own polls.

## Key features

- Questions can have different answer types: single and multiple selection, and rating.
- You can define multiple, different questionnaires.
- You can start multiple questioning rounds, so it is possible to do the same questionnaire multiple times and see the progress.
- Users can acccess questionnaires via a QR code or a short URL.
- After each assessment users get a report how they compare to other users.
- As an administrator, you see reports with even more information.
- But data is anoymized completely, no cookies required for users.


## System requirements

- Works at least with MySQL / MariaDB, but others might work as well
- Implemented with Node.js and React.JS
- Has a Dockerfile to create a small container

If you just want to spin up a simple MySQL database in your local docker for development purposes, use the following
commands:

    docker network create mysql
    docker volume create questce_data
    docker run --rm -d \
        -p 3306:3306 \
        -v questce_data:/var/lib/mysql \
        -e MYSQL_ROOT_PASSWORD=<db-root-password> \
        -e MYSQL_DATABASE=<name-of-your-database> \
        -e MYSQL_USER=<db-username> \
        -e MYSQL_PASSWORD=<db-pasword> \
        --name mysql mysql:5.7

## Installation with docker

Currently, there is no image ready to use, because you need some modifications in the code to adapt to
your needs. So, after checkout with

    git clone https://github.com/JustsoSoftware/questionnaire-ce.git
    cd questionnaire-ce
    
    
open the following files in the text editor of your choice and add your custom information:

- src/MainPage.js - This page is called if the user simply calls the base URL of your installation. It can be used for general information and links to different questionnaires. 
- src/StartPage.js - this page is called whenever the user starts an assessment and should be more specific about the goal of this specific questionnaire.

Then, build the container by calling

    docker build . --tag <name-of-your-image>
    
After that, you can simply start a container from that image:

    docker run --it --rm --name <name-of-your-container> \
        -e DB_URL="mysql://<db-username>:<db-password>@mysql/<name-of-your-database>" \
        -e AUTH_SECRET="<your-auth-secret>>" \
        -p 8080:8080 \
        --network <your-network-name> \
        <name-of-your-image> \
        npm run migrate
        
The last line (and the trailing backslash at the line begore) is only needed the first time you start the container.
It creates the database structure. After that, just call the command again without it.

As you can see, you need some enviroment variables (`-e` options) which configures your container some more:

- DB_URL - this is the database connection string which contains the username and password to access the database
- AUTH_SECRET - This should be a random string which is used to salt the encoding of stored user passwords (needed for administrator accounts)
- NODE_ENV - optional to specify `production` mode (which prevents error logging on the frontend)

The `--network` parameter is only needed if the database is accessible via a docker network, for example in your local
docker development environment.

## Initialize database

The database, which is built in the `migrate` step is intially empty. You need to execute a couple of SQL statements to fill minimal required data: a first questionnaire and some 'Competences', which are, in fact, simply categories.

    INSERT INTO `Questionnaires` VALUES (1,'test','My first questionnaire',now(),now(),'Here are some questions for you','Please answer the following questions.');
    INSERT INTO `Competences` VALUES (1, 'category 1', now(), now(), 0, 1);
    INSERT INTO `Competences` VALUES (2, 'category 2', now(), now(), 0, 2);
    INSERT INTO `Competences` VALUES (3, 'category 3', now(), now(), 0, 3);
    INSERT INTO `Competences` VALUES (4, 'category 4', now(), now(), 0, 4);
    INSERT INTO `Competences` VALUES (5, 'category 5', now(), now(), 0, 5);
    INSERT INTO `Competences` VALUES (6, 'category 6', now(), now(), 1, 6);

Now, you can create a user by calling a REST API:

    curl http://127.0.0.1:8080/api/signup -H 'Content-Type: application/json' -d '{"username":"your-username","password":"your-password"}'
    
After that, you can log in to http://127.0.0.1:8080/admin/test to your new questionnaire and create some questions and a first questioning round.
On the screen you will see a URL under which this round is accessible for the users.
