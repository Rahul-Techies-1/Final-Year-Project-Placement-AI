MOCK_INTERVIEW_QUESTIONS = {

    # ============================================================
    # TECHNICAL INTERVIEW
    # ============================================================

    "technical": {

        # ========================================================
        # EASY
        # ========================================================

        "easy": [

            {
                "question": "What is the difference between a stack and a queue?",
                "question_type": "technical",
                "expected_answer": (
                    "A stack follows LIFO (Last In, First Out), while "
                    "a queue follows FIFO (First In, First Out)."
                )
            },

            {
                "question": "What is a primary key in a database?",
                "question_type": "technical",
                "expected_answer": (
                    "A primary key uniquely identifies each record in a "
                    "database table. It cannot contain duplicate or NULL values."
                )
            },

            {
                "question": "What is OOP?",
                "question_type": "technical",
                "expected_answer": (
                    "Object-oriented programming is a programming paradigm "
                    "based on objects. Its four major concepts are "
                    "encapsulation, inheritance, polymorphism and abstraction."
                )
            },

            {
                "question": "What is the difference between a list and a tuple in Python?",
                "question_type": "technical",
                "expected_answer": (
                    "A list is mutable, meaning its elements can be changed "
                    "after creation. A tuple is immutable and cannot be changed "
                    "after creation. Lists use square brackets while tuples "
                    "normally use parentheses."
                )
            },

            {
                "question": "What is a Python dictionary?",
                "question_type": "technical",
                "expected_answer": (
                    "A dictionary is a Python data structure that stores data "
                    "as key-value pairs. Keys must be unique and hashable, "
                    "while values can be of different data types."
                )
            },

            {
                "question": "What is the purpose of an API?",
                "question_type": "technical",
                "expected_answer": (
                    "An API provides a defined way for different software "
                    "applications or services to communicate with each other. "
                    "For example, a frontend can communicate with a backend "
                    "through REST APIs."
                )
            }
        ],


        # ========================================================
        # MEDIUM
        # ========================================================

        "medium": [

            {
                "question": (
                    "Explain the difference between an array and a linked list."
                ),
                "question_type": "technical",
                "expected_answer": (
                    "Arrays store elements in contiguous memory and provide "
                    "fast indexed access, usually O(1). Linked lists store "
                    "elements in nodes connected using pointers or references. "
                    "Linked lists can provide efficient insertion and deletion "
                    "when the relevant node or position is known, but accessing "
                    "an arbitrary element takes O(n) time."
                )
            },

            {
                "question": "What is normalization in DBMS and why is it used?",
                "question_type": "technical",
                "expected_answer": (
                    "Normalization organizes database tables to reduce data "
                    "redundancy and improve consistency. It divides data into "
                    "related tables and uses relationships between them. "
                    "Common normal forms include 1NF, 2NF and 3NF."
                )
            },

            {
                "question": "Explain the difference between a process and a thread.",
                "question_type": "technical",
                "expected_answer": (
                    "A process is an independent program execution unit with "
                    "its own memory space, while a thread is a smaller execution "
                    "unit within a process. Threads of the same process share "
                    "resources such as memory, which makes communication between "
                    "them faster but requires synchronization."
                )
            },

            {
                "question": "What is the difference between supervised and unsupervised learning?",
                "question_type": "technical",
                "expected_answer": (
                    "Supervised learning uses labeled data where the target "
                    "output is known. It is commonly used for classification "
                    "and regression. Unsupervised learning works with unlabeled "
                    "data and discovers patterns or structures, such as clusters."
                )
            },

            {
                "question": "What is overfitting in machine learning and how can you reduce it?",
                "question_type": "technical",
                "expected_answer": (
                    "Overfitting occurs when a model learns the training data "
                    "too closely, including noise, and performs poorly on unseen "
                    "data. It can be reduced using techniques such as "
                    "cross-validation, regularization, pruning, dropout, "
                    "data augmentation and collecting more training data."
                )
            },

            {
                "question": "What is REST API and how does it work?",
                "question_type": "technical",
                "expected_answer": (
                    "A REST API is an architectural approach for communication "
                    "between clients and servers over HTTP. It commonly uses "
                    "methods such as GET, POST, PUT, PATCH and DELETE. Data is "
                    "often exchanged in JSON format and each request is generally "
                    "handled independently."
                )
            }
        ],


        # ========================================================
        # HARD
        # ========================================================

        "hard": [

            {
                "question": (
                    "Explain the time complexity of binary search and why "
                    "the input array must be sorted."
                ),
                "question_type": "technical",
                "expected_answer": (
                    "Binary search has O(log n) time complexity because it "
                    "eliminates approximately half of the remaining search "
                    "space at every step. The input must be sorted so the "
                    "algorithm can determine whether to continue searching "
                    "the left or right half."
                )
            },

            {
                "question": (
                    "Explain indexing in databases and discuss one advantage "
                    "and one disadvantage."
                ),
                "question_type": "technical",
                "expected_answer": (
                    "A database index is a data structure that improves the "
                    "speed of data retrieval for indexed columns. It can make "
                    "SELECT queries significantly faster, but indexes require "
                    "additional storage and can slow INSERT, UPDATE and DELETE "
                    "operations because the index must also be maintained."
                )
            },

            {
                "question": (
                    "What is deadlock in an operating system? Explain the "
                    "necessary conditions for deadlock."
                ),
                "question_type": "technical",
                "expected_answer": (
                    "Deadlock occurs when processes wait indefinitely for "
                    "resources held by one another. The four necessary "
                    "conditions are mutual exclusion, hold and wait, "
                    "no preemption and circular wait."
                )
            },

            {
                "question": (
                    "Explain the bias-variance tradeoff in machine learning."
                ),
                "question_type": "technical",
                "expected_answer": (
                    "Bias represents error caused by overly simple assumptions "
                    "in a model, while variance represents error caused by the "
                    "model being too sensitive to training data. High bias can "
                    "lead to underfitting and high variance can lead to "
                    "overfitting. The goal is to find a suitable balance."
                )
            },

            {
                "question": (
                    "What is the difference between RAG and fine-tuning "
                    "in Generative AI?"
                ),
                "question_type": "technical",
                "expected_answer": (
                    "RAG retrieves relevant external information and provides "
                    "it to the language model as context during generation. "
                    "Fine-tuning changes the model parameters by training it "
                    "on task-specific data. RAG is useful when knowledge changes "
                    "frequently or needs external sources, while fine-tuning "
                    "is useful for adapting model behavior, style or specialized "
                    "task performance."
                )
            },

            {
                "question": (
                    "Explain how a RAG system works from document ingestion "
                    "to generating the final answer."
                ),
                "question_type": "technical",
                "expected_answer": (
                    "A typical RAG pipeline loads documents, splits them into "
                    "chunks, converts the chunks into vector embeddings and "
                    "stores them in a vector database. When a user asks a "
                    "question, the system embeds the query and retrieves "
                    "relevant chunks using similarity search. The retrieved "
                    "context is then provided to the language model, which "
                    "generates an answer grounded in that context."
                )
            }
        ]
    },


    # ============================================================
    # HR INTERVIEW
    # ============================================================

    "hr": {

        # ========================================================
        # EASY
        # ========================================================

        "easy": [

            {
                "question": "Tell me about yourself.",
                "question_type": "hr",
                "expected_answer": (
                    "The candidate should provide a concise professional "
                    "introduction covering education, relevant technical "
                    "skills, projects, experience and career goals."
                )
            },

            {
                "question": "Why do you want to join our company?",
                "question_type": "hr",
                "expected_answer": (
                    "The answer should connect the candidate's skills and "
                    "career goals with the company's work, culture, products "
                    "and learning opportunities."
                )
            },

            {
                "question": "What are your career goals?",
                "question_type": "hr",
                "expected_answer": (
                    "The candidate should describe realistic short-term and "
                    "long-term professional goals and explain how the role "
                    "supports those goals."
                )
            },

            {
                "question": "What are your biggest strengths?",
                "question_type": "hr",
                "expected_answer": (
                    "The candidate should mention relevant strengths and "
                    "support them with specific examples from academic, "
                    "project or professional experience."
                )
            },

            {
                "question": "Why did you choose a career in technology?",
                "question_type": "hr",
                "expected_answer": (
                    "The candidate should explain their genuine interest "
                    "in technology and connect it with problem solving, "
                    "learning, building products or another relevant motivation."
                )
            },

            {
                "question": "Where do you see yourself in the next five years?",
                "question_type": "hr",
                "expected_answer": (
                    "The candidate should describe realistic professional "
                    "growth, increasing technical responsibility and meaningful "
                    "contributions to the organization."
                )
            }
        ],


        # ========================================================
        # MEDIUM
        # ========================================================

        "medium": [

            {
                "question": "What is your biggest strength?",
                "question_type": "hr",
                "expected_answer": (
                    "The candidate should mention a relevant strength and "
                    "support it with a real example demonstrating how that "
                    "strength produced a useful result."
                )
            },

            {
                "question": "Tell me about a challenge you faced in a project.",
                "question_type": "hr",
                "expected_answer": (
                    "The candidate should explain the situation, identify "
                    "the challenge, describe the actions taken and explain "
                    "the final outcome or lesson learned."
                )
            },

            {
                "question": "Tell me about a time you worked in a team.",
                "question_type": "hr",
                "expected_answer": (
                    "The candidate should describe a real teamwork situation, "
                    "their specific responsibility, how they communicated "
                    "with teammates and the outcome."
                )
            },

            {
                "question": "How do you handle pressure and tight deadlines?",
                "question_type": "hr",
                "expected_answer": (
                    "The candidate should explain a practical approach such "
                    "as prioritizing tasks, breaking work into smaller parts, "
                    "communicating risks and maintaining focus under pressure."
                )
            },

            {
                "question": "How do you handle criticism or negative feedback?",
                "question_type": "hr",
                "expected_answer": (
                    "The candidate should demonstrate openness to constructive "
                    "feedback, explain how they evaluate it and describe how "
                    "they use useful feedback to improve their performance."
                )
            },

            {
                "question": "Describe a project that you are particularly proud of.",
                "question_type": "hr",
                "expected_answer": (
                    "The candidate should explain the project's problem, "
                    "their contribution, technologies used, challenges faced "
                    "and the measurable or practical outcome."
                )
            }
        ],


        # ========================================================
        # HARD
        # ========================================================

        "hard": [

            {
                "question": (
                    "Tell me about a failure and explain what you learned from it."
                ),
                "question_type": "hr",
                "expected_answer": (
                    "The candidate should honestly explain a meaningful failure "
                    "without blaming others and demonstrate ownership, learning "
                    "and specific improvements made afterward."
                )
            },

            {
                "question": (
                    "Why should we hire you over another candidate with "
                    "similar technical skills?"
                ),
                "question_type": "hr",
                "expected_answer": (
                    "The candidate should differentiate themselves using "
                    "evidence such as problem solving, communication, projects, "
                    "learning ability, adaptability, ownership and relevant "
                    "practical experience."
                )
            },

            {
                "question": (
                    "Tell me about a time you disagreed with a teammate. "
                    "How did you handle the situation?"
                ),
                "question_type": "hr",
                "expected_answer": (
                    "The candidate should explain the disagreement objectively, "
                    "show that they listened to the other person's perspective, "
                    "used facts to discuss the issue and worked toward a "
                    "professional solution."
                )
            },

            {
                "question": (
                    "What would you do if you were assigned a task using "
                    "a technology you had never worked with before?"
                ),
                "question_type": "hr",
                "expected_answer": (
                    "The candidate should explain a structured learning "
                    "approach: understand the requirements, study the relevant "
                    "documentation, build a small proof of concept, ask "
                    "appropriate questions and then implement and test the solution."
                )
            },

            {
                "question": (
                    "What would you do if you realized that you had made "
                    "a serious mistake in a project just before the deadline?"
                ),
                "question_type": "hr",
                "expected_answer": (
                    "The candidate should prioritize understanding the impact, "
                    "communicate the issue promptly, work on the safest fix, "
                    "test the solution and avoid hiding the mistake. The answer "
                    "should demonstrate ownership and responsible decision making."
                )
            },

            {
                "question": (
                    "Imagine your manager gives you two important tasks with "
                    "the same deadline. How would you decide what to do first?"
                ),
                "question_type": "hr",
                "expected_answer": (
                    "The candidate should compare business impact, urgency, "
                    "dependencies and estimated effort. They should communicate "
                    "with the manager when priorities are unclear and agree on "
                    "the order rather than silently making an assumption."
                )
            }
        ]
    }
}