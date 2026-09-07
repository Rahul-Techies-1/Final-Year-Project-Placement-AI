# ============================================================
# MOCK INTERVIEW QUESTION BANK
# ============================================================

MOCK_INTERVIEW_QUESTIONS = {

    "technical": {

        "easy": [
            {
                "question": "What is the difference between a stack and a queue?",
                "question_type": "technical",
                "expected_answer": (
                    "A stack follows LIFO whereas a queue follows FIFO."
                )
            },
            {
                "question": "What is a primary key in a database?",
                "question_type": "technical",
                "expected_answer": (
                    "A primary key uniquely identifies each record in a table."
                )
            },
            {
                "question": "What is OOP?",
                "question_type": "technical",
                "expected_answer": (
                    "Object-oriented programming is a programming paradigm "
                    "based on objects and concepts such as encapsulation, "
                    "inheritance, polymorphism and abstraction."
                )
            }
        ],

        "medium": [
            {
                "question": (
                    "Explain the difference between an array and a linked list."
                ),
                "question_type": "technical",
                "expected_answer": (
                    "Arrays store elements in contiguous memory and provide "
                    "fast indexed access, while linked lists use nodes connected "
                    "through pointers and provide efficient insertion and deletion "
                    "at known positions."
                )
            },
            {
                "question": "What is normalization in DBMS and why is it used?",
                "question_type": "technical",
                "expected_answer": (
                    "Normalization organizes database tables to reduce redundancy "
                    "and improve data consistency."
                )
            },
            {
                "question": "Explain the difference between process and thread.",
                "question_type": "technical",
                "expected_answer": (
                    "A process is an independent program execution unit, while a "
                    "thread is a smaller execution unit within a process that "
                    "shares the process resources."
                )
            }
        ],

        "hard": [
            {
                "question": (
                    "Explain the time complexity of binary search and why "
                    "the input array must be sorted."
                ),
                "question_type": "technical",
                "expected_answer": (
                    "Binary search has O(log n) time complexity because it "
                    "eliminates half of the search space at every step. "
                    "The array must be sorted so that the algorithm can determine "
                    "which half may contain the target."
                )
            },
            {
                "question": (
                    "Explain indexing in databases and discuss one advantage "
                    "and one disadvantage."
                ),
                "question_type": "technical",
                "expected_answer": (
                    "An index is a data structure that improves the speed of "
                    "data retrieval. It can significantly improve SELECT queries "
                    "but requires additional storage and can slow INSERT, UPDATE "
                    "and DELETE operations."
                )
            },
            {
                "question": (
                    "What is deadlock in an operating system? Explain the "
                    "necessary conditions for deadlock."
                ),
                "question_type": "technical",
                "expected_answer": (
                    "Deadlock occurs when processes wait indefinitely for resources "
                    "held by each other. The four necessary conditions are mutual "
                    "exclusion, hold and wait, no preemption and circular wait."
                )
            }
        ]
    },


    "hr": {

        "easy": [
            {
                "question": "Tell me about yourself.",
                "question_type": "hr",
                "expected_answer": (
                    "The candidate should provide a concise professional "
                    "introduction covering education, skills, projects and "
                    "career goals."
                )
            },
            {
                "question": "Why do you want to join our company?",
                "question_type": "hr",
                "expected_answer": (
                    "The answer should connect the candidate's skills and "
                    "career goals with the company's work and opportunities."
                )
            }
        ],

        "medium": [
            {
                "question": "What is your biggest strength?",
                "question_type": "hr",
                "expected_answer": (
                    "The candidate should mention a relevant strength and "
                    "support it with a real example."
                )
            },
            {
                "question": "Tell me about a challenge you faced in a project.",
                "question_type": "hr",
                "expected_answer": (
                    "The candidate should explain the challenge, actions taken "
                    "and the resulting outcome."
                )
            }
        ],

        "hard": [
            {
                "question": (
                    "Tell me about a failure and explain what you learned from it."
                ),
                "question_type": "hr",
                "expected_answer": (
                    "The candidate should honestly explain a meaningful failure "
                    "and demonstrate learning, ownership and improvement."
                )
            },
            {
                "question": (
                    "Why should we hire you over another candidate with "
                    "similar technical skills?"
                ),
                "question_type": "hr",
                "expected_answer": (
                    "The candidate should differentiate themselves through "
                    "problem solving, communication, projects, adaptability "
                    "and other relevant strengths."
                )
            }
        ]
    }
}