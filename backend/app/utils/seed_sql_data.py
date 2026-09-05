from app.database.session import SessionLocal

from app.models.sql_topic import SQLTopic
from app.models.sql_problem import SQLProblem


def seed_sql_data():

    db = SessionLocal()

    try:

        # ====================================================
        # SQL TOPICS
        # ====================================================

        topics = [
            {
                "name": "SQL Basics",
                "description": "Fundamentals of SQL, SELECT, filtering and sorting.",
                "display_order": 1,
            },
            {
                "name": "Filtering and Operators",
                "description": "WHERE clause, logical operators and comparison operators.",
                "display_order": 2,
            },
            {
                "name": "Aggregate Functions",
                "description": "COUNT, SUM, AVG, MIN, MAX and GROUP BY.",
                "display_order": 3,
            },
            {
                "name": "Joins",
                "description": "INNER JOIN, LEFT JOIN, RIGHT JOIN and self joins.",
                "display_order": 4,
            },
            {
                "name": "Subqueries",
                "description": "Nested queries and correlated subqueries.",
                "display_order": 5,
            },
            {
                "name": "Window Functions",
                "description": "ROW_NUMBER, RANK, DENSE_RANK and analytical queries.",
                "display_order": 6,
            },
            {
                "name": "CTE",
                "description": "Common Table Expressions using WITH.",
                "display_order": 7,
            },
            {
                "name": "Advanced SQL",
                "description": "Complex SQL queries commonly asked in technical interviews.",
                "display_order": 8,
            },
        ]

        topic_map = {}

        for topic_data in topics:

            existing_topic = (
                db.query(SQLTopic)
                .filter(
                    SQLTopic.name == topic_data["name"]
                )
                .first()
            )

            if existing_topic:

                topic_map[
                    topic_data["name"]
                ] = existing_topic

            else:

                topic = SQLTopic(
                    name=topic_data["name"],
                    description=topic_data["description"],
                    display_order=topic_data["display_order"],
                )

                db.add(topic)

                db.flush()

                topic_map[
                    topic_data["name"]
                ] = topic


        # ====================================================
        # SQL PROBLEMS
        # ====================================================

        problems = [

            # ------------------------------------------------
            # SQL BASICS
            # ------------------------------------------------

            {
                "topic": "SQL Basics",
                "title": "Select All Employees",
                "description": "Write a query to retrieve all records from the employees table.",
                "difficulty": "Easy",
            },

            {
                "topic": "SQL Basics",
                "title": "Select Specific Columns",
                "description": "Write a query to retrieve employee names and salaries.",
                "difficulty": "Easy",
            },

            {
                "topic": "SQL Basics",
                "title": "Sort Employees By Salary",
                "description": "Display employees ordered by salary from highest to lowest.",
                "difficulty": "Easy",
            },

            # ------------------------------------------------
            # FILTERING
            # ------------------------------------------------

            {
                "topic": "Filtering and Operators",
                "title": "Employees With High Salary",
                "description": "Find employees whose salary is greater than 50000.",
                "difficulty": "Easy",
            },

            {
                "topic": "Filtering and Operators",
                "title": "Employees In Multiple Departments",
                "description": "Find employees belonging to either the IT or HR department.",
                "difficulty": "Easy",
            },

            {
                "topic": "Filtering and Operators",
                "title": "Employees With Missing Email",
                "description": "Find employees whose email address is NULL.",
                "difficulty": "Easy",
            },

            # ------------------------------------------------
            # AGGREGATE FUNCTIONS
            # ------------------------------------------------

            {
                "topic": "Aggregate Functions",
                "title": "Count Total Employees",
                "description": "Find the total number of employees.",
                "difficulty": "Easy",
            },

            {
                "topic": "Aggregate Functions",
                "title": "Average Salary",
                "description": "Calculate the average salary of all employees.",
                "difficulty": "Easy",
            },

            {
                "topic": "Aggregate Functions",
                "title": "Department Wise Employee Count",
                "description": "Find the number of employees in each department.",
                "difficulty": "Medium",
            },

            # ------------------------------------------------
            # JOINS
            # ------------------------------------------------

            {
                "topic": "Joins",
                "title": "Employee Department Details",
                "description": "Display employee names along with their department names.",
                "difficulty": "Easy",
            },

            {
                "topic": "Joins",
                "title": "Employees Without Department",
                "description": "Find employees who are not assigned to any department.",
                "difficulty": "Medium",
            },

            {
                "topic": "Joins",
                "title": "Highest Paid Employee By Department",
                "description": "Find the highest-paid employee in every department.",
                "difficulty": "Hard",
            },

            # ------------------------------------------------
            # SUBQUERIES
            # ------------------------------------------------

            {
                "topic": "Subqueries",
                "title": "Employees Earning Above Average",
                "description": "Find employees whose salary is greater than the average salary.",
                "difficulty": "Medium",
            },

            {
                "topic": "Subqueries",
                "title": "Second Highest Salary",
                "description": "Find the second highest salary from the employee table.",
                "difficulty": "Medium",
            },

            # ------------------------------------------------
            # WINDOW FUNCTIONS
            # ------------------------------------------------

            {
                "topic": "Window Functions",
                "title": "Rank Employees By Salary",
                "description": "Rank employees according to their salary using a window function.",
                "difficulty": "Medium",
            },

            {
                "topic": "Window Functions",
                "title": "Top Three Salaries Per Department",
                "description": "Find the top three highest-paid employees from each department.",
                "difficulty": "Hard",
            },

            {
                "topic": "Window Functions",
                "title": "Running Salary Total",
                "description": "Calculate a running total of salaries ordered by employee.",
                "difficulty": "Hard",
            },

            # ------------------------------------------------
            # CTE
            # ------------------------------------------------

            {
                "topic": "CTE",
                "title": "Employees Above Department Average",
                "description": "Using a CTE, find employees whose salary is above their department average.",
                "difficulty": "Hard",
            },

            {
                "topic": "CTE",
                "title": "Department Salary Summary",
                "description": "Use a CTE to calculate department-level salary statistics.",
                "difficulty": "Medium",
            },

            # ------------------------------------------------
            # ADVANCED SQL
            # ------------------------------------------------

            {
                "topic": "Advanced SQL",
                "title": "Find Duplicate Records",
                "description": "Find duplicate employee records based on email address.",
                "difficulty": "Medium",
            },

            {
                "topic": "Advanced SQL",
                "title": "Nth Highest Salary",
                "description": "Write a query to find the Nth highest distinct salary.",
                "difficulty": "Hard",
            },

        ]


        # ====================================================
        # INSERT PROBLEMS
        # ====================================================

        for problem_data in problems:

            existing_problem = (
                db.query(SQLProblem)
                .filter(
                    SQLProblem.title ==
                    problem_data["title"]
                )
                .first()
            )

            if existing_problem:
                continue

            topic = topic_map[
                problem_data["topic"]
            ]

            problem = SQLProblem(

                topic_id=topic.id,

                title=problem_data["title"],

                description=problem_data["description"],

                difficulty=problem_data["difficulty"],

                is_active=True,

            )

            db.add(problem)


        db.commit()

        print("SQL topics and problems seeded successfully.")


    except Exception:

        db.rollback()

        raise

    finally:

        db.close()


if __name__ == "__main__":

    seed_sql_data()