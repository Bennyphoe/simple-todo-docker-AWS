URL : http://simple-todo-lb-frontend-170241889.us-west-2.elb.amazonaws.com/

URL might not down if services are stopped. Im currently using free tier so it won't be up forever!

Some Learning Points
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
