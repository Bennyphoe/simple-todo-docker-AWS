URL : http://simple-todo-lb-frontend-170241889.us-west-2.elb.amazonaws.com/

URL might be down if services on AWS are stopped (will incur charges if I keep it running forever) :(

`Steps during development:`
1. Make sure docker compose is able to run locally first, or start with using docker commands like docker run to test if Dockerfile is configured properly
2. Locally instead of using RDS managed services, we can use dockerhub’s mySQL image to run a mySQL container along side spring boot application
3. Use env variables in the application.properties file in spring boot to connect to the database. When run locally, we can set env variables in a .env file e.g. username, password, database name, host address, port. Select this .env file in docker compose
4. Once locally its working i.e. front end can communicate with backend and backend can pull and write data to the database
5. Create a Database in AWS RDS, set up a security group to allow connection from the backend container’s security group to the port of the database e.g. 3306. Create an initial database too.
6. Copy the database’s credentials and also the endpoint.
7. Configure the backend container’s task definition, set Environment variables e.g. credentials for DB, host address of DB, port number etc, security groups e.g. 80 or 8080 and override Entry Point if required.
8. Start the service with a load balancer, set correct path for health checks and choose the port to listen on and also the appropriate security groups to allow inbound connection to the application
9. Once service is up and running, get the load balancer’s endpoint
10. In the front end code, configure the API address to use the backend’s load balancer endpoint if process.env.NODE_ENV is in production. If its development use localhost
11. Create a separate Dockerfile e.g. Dockerfile.prod that builds the React project and use NGINX to serve the files on a web server hosted on port 80
12. Build image and push to docker hub
13. Create task definition and create service for the front end application, security group should allow incoming to port 80
14. Access Load balancer’s endpoint of front end


`Screenshots:`

**Add Task**

![image](https://github.com/user-attachments/assets/e3940f1b-4db5-408e-9103-1b65bb13e8ac)


**Update Task**

![image](https://github.com/user-attachments/assets/2d880f7d-0b00-454c-bb25-02819d8b22b2)

![image](https://github.com/user-attachments/assets/be0272af-b1c1-4695-9a56-c8035843d521)


**Delete Task**

![image](https://github.com/user-attachments/assets/c3fd52a1-68ac-4c6d-be90-0a3837e0421b)




`Some Learning Points`
- When setting the configurations for application.properties, use ENV variables
Syntax is ${<ENV name>:<default value>}
This is so that we can override the ENV variables during development and deployment differently	

- Use wait_for_it.sh script If deploying both Mysql and spring app on AWS ECS
According to MySQL image documentation on docker hub: If there is no database initialized when the container starts, then a default database will be created. While this is the expected behavior, this means that it will not accept incoming connections until such initialization completes. This will cause problems when containers run simultaneously
So the solution is to use a script. Place this script in backend application directory, update the DockerFile
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh
ENTRYPOINT ["/wait-for-it.sh", "db:3306", "--", "java", "-jar", "app.jar"]
In the Task definition, override the Entry point, instead of using db:3306 use localhost:3306 since containers within the same task definition can communicate using localhost
The purpose of this script is to ensure that the Spring Boot application will not attempt to connect to the MySQL database until it is fully initialized and ready to accept connections.

- However when deploying databases using ECS, there can be issues, we shouldn’t persist data in containers. Instead should use AWS RDS
**AWS RDS**
  1. Set up VPC security group to allow inbound connection to the DB instance from an EC2/ECS task
        - Type: Custom TCP
        - Port: 3306
        - Source: Select the security group for the backend container
  2. Create Database
      - Select Standard create
      - Choose the newly created security group in networking
      - In additional configuration, add the initial database to be created
      - Configure username and password for authentication to the DB instance, record down the master password
      - Once the DB instance is created, we now have access to the DB’s endpoint
      - Use this DB endpoint, username, password, port and database name within the AWS ECS task definition for the backend task so as to connect properly to the DB instance. 
      - In this case, wait_for_it script might not be needed anymore since DB is already initialized in RDS


**REMOVE SERVICES WHEN NOT IN USE in both ECS and RDS to avoid charge**
