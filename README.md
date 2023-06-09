# code-crunch
- A platform similar to leetcode where you can solve codding problems in various languages.
- To build java_sandbox image docker build -t java_sandbox .
- To Start the mysql container on local machine 
    docker run --name mysql-server -e MYSQL_ROOT_PASSWORD=codecrunch_password -e MYSQL_DATABASE=codecrunch -p 3306:3306 -d mysql:latest

- To start the rabbitmq container on local machine
    docker run -d --hostname rabbit --name rabbit-server -p 8008:15672 -p 5672:5672 rabbitmq:3-management

- To start the redis container on local machine
    docker run --name redis-server -p 6379:6379 -d redis
