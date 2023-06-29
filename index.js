 // Importing the Inquirer library for user prompts
const inquirer = require("inquirer");
// Importing the database connection
const connection = require("./config/connection");

// Function to start the application and display the main menu
function startApp() {
  // Prompting the user for an action
  inquirer
    .prompt([
      {
        name: "action",
        type: "list",
        message: "What action do you want?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a new department",
          "Add a new role",
          "Add a new employee",
          "Update employee roles",
          "Exit",
        ],
      },
    ])
    .then(function (response) {
      // Handling the user's response
      switch (response.action) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
          break;
        case "Add a new department":
          addDepartment();
          break;
        case "Add a new role":
          addRole();
          break;
        case "Add a new employee":
          addEmployee();
          break;
        case "Update employee roles":
          employeeUpdate();
          break;
        case "Exit":
          connection.end();
          break;
      }
    });
}

// Function to view all departments
const viewDepartments = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) {
      throw err;
    }
    console.table(res);
    startApp();
  });
};

// Function to view all roles
const viewRoles = () => {
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) {
      throw err;
    }
    console.table(res);
    startApp();
  });
};

// Function to view all employees
const viewEmployees = () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) {
      throw err;
    }
    console.table(res); 
    startApp(); 
  });
};

// Function to add a new department
const addDepartment = () => {
  
  inquirer
    .prompt([
      {
        name: "name",
        message: "Enter the department:",
        type: "input",
      },
    ])
    .then((answers) => {
      const query = `INSERT INTO department(name) VALUES (?)`;
      const value = [answers.name];

      connection.query(query, value, (err, res) => {
        if (err) {
          throw err;
        }
        console.log("Department added successfully!");
        startApp();
      });
    });
};

// Function to add a new role
const addRole = () => {
  inquirer
    .prompt([
      {
        name: "title",
        message: "Enter title: ",
        type: "input",
      },
      {
        name: "salary",
        message: "Enter salary: ",
        type: "input",
      },
      {
        name: "department_id",
        message: "Enter department ID: ",
        type: "input",
      },
    ])
    .then((answers) => {
      const query =
        "INSERT INTO role(title,salary,department_id) VALUES (?,?,?)";
      const values = [
        [answers.title],
        [answers.salary],
        [answers.department_id],
      ];

      connection.query(query, values, (err, res) => {
        if (err) {
          throw err;
        }
        console.log("Role added successfully!");
        startApp();
      });
    });
};

// Function to add a new employee
const addEmployee = () => {
  inquirer
    .prompt([
      {
        name: "first_name",
        message: "Enter first name:",
        type: "input",
      },
      {
        name: "last_name",
        message: "Enter last name:",
        type: "input",
      },
      {
        name: "role_id",
        message: "Enter the role ID:",
        type: "input",
      },
      {
        name: "manager_id",
        message: "Enter the manager ID (null if none):",
        type: "input",
      },
    ])
    .then((answers) => {
      const query = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
      const values = [
        [answers.first_name],
        [answers.last_name],
        [answers.role_id],
        [answers.manager_id],
      ];

      connection.query(query, values, (err, res) => {
        if (err) {
          throw err;
        }
        console.log("Employee added successfully!");
        startApp();
      });
    });
};

// Function to update an eployee's role (I honestly can't take credit for this part, I got so much help)
const employeeUpdate = () => {
  connection.query(
    "SELECT id, first_name, last_name FROM employee",
    function (err, employee) {
      if (err) {
        console.error(err);
        return;
      }

      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Select an employee to update:",
            choices: employee.map((row) => ({
              name: `${row.first_name} ${row.last_name}`,
              value: row.id,
            })),
          },
        ])
        .then((employeeAnswer) => {
          const selectedEmployeeId = employeeAnswer.employee;

          connection.query("SELECT id, title FROM role", function (err, role) {
            if (err) {
              console.error(err);
              return;
            }

            inquirer
              .prompt([
                {
                  type: "list",
                  name: "role",
                  message: "Select a new role for the employee:",
                  choices: role.map((row) => ({
                    name: row.title,
                    value: row.id,
                  })),
                },
              ])
              .then((roleAnswer) => {
                const newRoleId = roleAnswer.role;

                connection.query(
                  "UPDATE employee SET role_id = ? WHERE id = ?",
                  [newRoleId, selectedEmployeeId],
                  function (err, res) {
                    if (err) {
                      console.error(err);
                      return;
                    }
                    console.log("Employee role updated successfully!");
                    startApp();
                  }
                );
              });
          });
        });
    }
  );
};

startApp();
