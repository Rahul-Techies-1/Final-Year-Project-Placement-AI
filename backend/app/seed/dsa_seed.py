from app.database.session import SessionLocal

from app.models.dsa_topic import DSATopic
from app.models.dsa_problem import DSAProblem


def seed_dsa():

    db = SessionLocal()

    try:

        # ====================================================
        # PREVENT DUPLICATE SEEDING
        # ====================================================

        existing_topics = db.query(DSATopic).count()

        if existing_topics > 0:

            print(
                "DSA topics already exist. "
                "Skipping seed."
            )

            return

        # ====================================================
        # TOPICS
        # ====================================================

        topics = [

            DSATopic(
                name="Arrays",
                description=(
                    "Array traversal, searching, sorting, "
                    "prefix sums and common array patterns."
                ),
                display_order=1
            ),

            DSATopic(
                name="Strings",
                description=(
                    "String manipulation, frequency counting, "
                    "two pointers and pattern-based problems."
                ),
                display_order=2
            ),

            DSATopic(
                name="Linked Lists",
                description=(
                    "Singly and doubly linked lists, "
                    "reversal, cycles and pointer techniques."
                ),
                display_order=3
            ),

            DSATopic(
                name="Stacks & Queues",
                description=(
                    "Stack and queue operations, monotonic stacks "
                    "and common interview problems."
                ),
                display_order=4
            ),

            DSATopic(
                name="Binary Search",
                description=(
                    "Binary search, search space reduction "
                    "and sorted-array problems."
                ),
                display_order=5
            ),

            DSATopic(
                name="Trees",
                description=(
                    "Binary trees, BSTs, traversals, "
                    "height and tree-based problems."
                ),
                display_order=6
            ),

            DSATopic(
                name="Graphs",
                description=(
                    "Graph traversal, BFS, DFS, shortest paths "
                    "and connected components."
                ),
                display_order=7
            ),

            DSATopic(
                name="Dynamic Programming",
                description=(
                    "Memoization, tabulation, state transitions "
                    "and optimization problems."
                ),
                display_order=8
            )

        ]

        # ====================================================
        # SAVE TOPICS
        # ====================================================

        db.add_all(topics)

        db.flush()

        # ====================================================
        # PROBLEMS
        # ====================================================

        problems = [

            # ------------------------------------------------
            # ARRAYS
            # ------------------------------------------------

            DSAProblem(
                topic_id=topics[0].id,
                title="Two Sum",
                description=(
                    "Given an array of integers and a target, "
                    "find two indices whose values add up to "
                    "the target."
                ),
                difficulty="Easy",
                external_url=(
                    "https://leetcode.com/problems/two-sum/"
                ),
                is_active=True
            ),

            DSAProblem(
                topic_id=topics[0].id,
                title="Best Time to Buy and Sell Stock",
                description=(
                    "Find the maximum profit that can be obtained "
                    "by buying and selling a stock once."
                ),
                difficulty="Easy",
                external_url=(
                    "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"
                ),
                is_active=True
            ),

            DSAProblem(
                topic_id=topics[0].id,
                title="Maximum Subarray",
                description=(
                    "Find the contiguous subarray with the "
                    "largest possible sum."
                ),
                difficulty="Medium",
                external_url=(
                    "https://leetcode.com/problems/maximum-subarray/"
                ),
                is_active=True
            ),

            DSAProblem(
                topic_id=topics[0].id,
                title="Product of Array Except Self",
                description=(
                    "Return an array where each element contains "
                    "the product of all other elements without "
                    "using division."
                ),
                difficulty="Medium",
                external_url=(
                    "https://leetcode.com/problems/product-of-array-except-self/"
                ),
                is_active=True
            ),

            # ------------------------------------------------
            # STRINGS
            # ------------------------------------------------

            DSAProblem(
                topic_id=topics[1].id,
                title="Valid Anagram",
                description=(
                    "Determine whether two strings contain the "
                    "same characters with the same frequencies."
                ),
                difficulty="Easy",
                external_url=(
                    "https://leetcode.com/problems/valid-anagram/"
                ),
                is_active=True
            ),

            DSAProblem(
                topic_id=topics[1].id,
                title="Valid Palindrome",
                description=(
                    "Determine whether a string is a palindrome "
                    "after ignoring non-alphanumeric characters."
                ),
                difficulty="Easy",
                external_url=(
                    "https://leetcode.com/problems/valid-palindrome/"
                ),
                is_active=True
            ),

            DSAProblem(
                topic_id=topics[1].id,
                title="Longest Substring Without Repeating Characters",
                description=(
                    "Find the length of the longest substring "
                    "without repeating characters."
                ),
                difficulty="Medium",
                external_url=(
                    "https://leetcode.com/problems/longest-substring-without-repeating-characters/"
                ),
                is_active=True
            ),

            # ------------------------------------------------
            # LINKED LISTS
            # ------------------------------------------------

            DSAProblem(
                topic_id=topics[2].id,
                title="Reverse Linked List",
                description=(
                    "Reverse a singly linked list and return "
                    "the new head."
                ),
                difficulty="Easy",
                external_url=(
                    "https://leetcode.com/problems/reverse-linked-list/"
                ),
                is_active=True
            ),

            DSAProblem(
                topic_id=topics[2].id,
                title="Middle of the Linked List",
                description=(
                    "Find the middle node of a singly linked list "
                    "using an efficient pointer technique."
                ),
                difficulty="Easy",
                external_url=(
                    "https://leetcode.com/problems/middle-of-the-linked-list/"
                ),
                is_active=True
            ),

            DSAProblem(
                topic_id=topics[2].id,
                title="Linked List Cycle",
                description=(
                    "Determine whether a linked list contains "
                    "a cycle."
                ),
                difficulty="Easy",
                external_url=(
                    "https://leetcode.com/problems/linked-list-cycle/"
                ),
                is_active=True
            ),

            # ------------------------------------------------
            # STACKS & QUEUES
            # ------------------------------------------------

            DSAProblem(
                topic_id=topics[3].id,
                title="Valid Parentheses",
                description=(
                    "Determine whether brackets in a string "
                    "are correctly matched and nested."
                ),
                difficulty="Easy",
                external_url=(
                    "https://leetcode.com/problems/valid-parentheses/"
                ),
                is_active=True
            ),

            DSAProblem(
                topic_id=topics[3].id,
                title="Min Stack",
                description=(
                    "Design a stack that supports push, pop, "
                    "top and retrieving the minimum element "
                    "in constant time."
                ),
                difficulty="Medium",
                external_url=(
                    "https://leetcode.com/problems/min-stack/"
                ),
                is_active=True
            ),

            # ------------------------------------------------
            # BINARY SEARCH
            # ------------------------------------------------

            DSAProblem(
                topic_id=topics[4].id,
                title="Binary Search",
                description=(
                    "Search for a target value in a sorted array "
                    "using binary search."
                ),
                difficulty="Easy",
                external_url=(
                    "https://leetcode.com/problems/binary-search/"
                ),
                is_active=True
            ),

            DSAProblem(
                topic_id=topics[4].id,
                title="Search in Rotated Sorted Array",
                description=(
                    "Search for a target in a rotated sorted array "
                    "in logarithmic time."
                ),
                difficulty="Medium",
                external_url=(
                    "https://leetcode.com/problems/search-in-rotated-sorted-array/"
                ),
                is_active=True
            ),

            # ------------------------------------------------
            # TREES
            # ------------------------------------------------

            DSAProblem(
                topic_id=topics[5].id,
                title="Maximum Depth of Binary Tree",
                description=(
                    "Find the maximum depth of a binary tree."
                ),
                difficulty="Easy",
                external_url=(
                    "https://leetcode.com/problems/maximum-depth-of-binary-tree/"
                ),
                is_active=True
            ),

            DSAProblem(
                topic_id=topics[5].id,
                title="Binary Tree Level Order Traversal",
                description=(
                    "Return the level-order traversal of "
                    "a binary tree."
                ),
                difficulty="Medium",
                external_url=(
                    "https://leetcode.com/problems/binary-tree-level-order-traversal/"
                ),
                is_active=True
            ),

            # ------------------------------------------------
            # GRAPHS
            # ------------------------------------------------

            DSAProblem(
                topic_id=topics[6].id,
                title="Number of Islands",
                description=(
                    "Count the number of connected islands "
                    "in a two-dimensional grid."
                ),
                difficulty="Medium",
                external_url=(
                    "https://leetcode.com/problems/number-of-islands/"
                ),
                is_active=True
            ),

            DSAProblem(
                topic_id=topics[6].id,
                title="Clone Graph",
                description=(
                    "Create a deep copy of an undirected graph."
                ),
                difficulty="Medium",
                external_url=(
                    "https://leetcode.com/problems/clone-graph/"
                ),
                is_active=True
            ),

            # ------------------------------------------------
            # DYNAMIC PROGRAMMING
            # ------------------------------------------------

            DSAProblem(
                topic_id=topics[7].id,
                title="Climbing Stairs",
                description=(
                    "Count the number of distinct ways to reach "
                    "the top of a staircase."
                ),
                difficulty="Easy",
                external_url=(
                    "https://leetcode.com/problems/climbing-stairs/"
                ),
                is_active=True
            ),

            DSAProblem(
                topic_id=topics[7].id,
                title="House Robber",
                description=(
                    "Determine the maximum amount of money that "
                    "can be robbed without robbing adjacent houses."
                ),
                difficulty="Medium",
                external_url=(
                    "https://leetcode.com/problems/house-robber/"
                ),
                is_active=True
            )

        ]

        # ====================================================
        # SAVE PROBLEMS
        # ====================================================

        db.add_all(problems)

        db.commit()

        print(
            f"DSA seed completed successfully. "
            f"Added {len(topics)} topics and "
            f"{len(problems)} problems."
        )

    except Exception:

        db.rollback()

        raise

    finally:

        db.close()


if __name__ == "__main__":

    seed_dsa()