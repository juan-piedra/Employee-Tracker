USE workplace_db;

INSERT INTO department(name)
VALUES('Engineering'),('Management');

INSERT INTO role(title,salary,department_id)
VALUES('Engineer',100000,1),('Manager',80000,2);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES('John','Rock',2,null),('Gary','Smith',2,null),('Stacy','Gray',1,2);