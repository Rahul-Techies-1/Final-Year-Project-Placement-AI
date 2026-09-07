from app.database.session import SessionLocal

from app.models.core_cs import (
    CoreCSTopic,
    CoreCSProblem
)


def seed_core_cs():

    db = SessionLocal()

    try:

        # ====================================================
        # PREVENT DUPLICATE SEEDING
        # ====================================================

        existing_topics = db.query(CoreCSTopic).count()

        if existing_topics > 0:

            print(
                "Core CS topics already exist. "
                "Skipping seed."
            )

            return


        # ====================================================
        # TOPICS
        # ====================================================

        topics = [

            CoreCSTopic(
                name="DBMS",
                description=(
                    "Database Management Systems, "
                    "SQL concepts, normalization, "
                    "transactions and indexing."
                ),
                display_order=1
            ),

            CoreCSTopic(
                name="Operating Systems",
                description=(
                    "Processes, threads, memory management, "
                    "scheduling and synchronization."
                ),
                display_order=2
            ),

            CoreCSTopic(
                name="Computer Networks",
                description=(
                    "Networking fundamentals, protocols, "
                    "TCP/IP, HTTP and network security."
                ),
                display_order=3
            ),

            CoreCSTopic(
                name="OOP",
                description=(
                    "Object-oriented programming concepts "
                    "including inheritance, polymorphism "
                    "and abstraction."
                ),
                display_order=4
            ),

            CoreCSTopic(
                name="Computer Architecture",
                description=(
                    "CPU, memory hierarchy, cache, "
                    "instruction execution and architecture."
                ),
                display_order=5
            ),

            CoreCSTopic(
                name="Software Engineering",
                description=(
                    "Software development lifecycle, "
                    "testing, design principles and "
                    "development methodologies."
                ),
                display_order=6
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
            # DBMS
            # ------------------------------------------------

            CoreCSProblem(
                topic_id=topics[0].id,
                title="What is database normalization?",
                description=(
                    "Explain normalization and describe "
                    "1NF, 2NF, 3NF and BCNF with examples."
                ),
                difficulty="Medium",
                external_url=None,
                is_active=True
            ),

            CoreCSProblem(
                topic_id=topics[0].id,
                title="ACID Properties",
                description=(
                    "Explain Atomicity, Consistency, "
                    "Isolation and Durability and why "
                    "they are important in database transactions."
                ),
                difficulty="Medium",
                external_url=None,
                is_active=True
            ),

            CoreCSProblem(
                topic_id=topics[0].id,
                title="Indexing in Databases",
                description=(
                    "Explain database indexes, how B-Tree "
                    "indexes work and the advantages and "
                    "disadvantages of indexing."
                ),
                difficulty="Hard",
                external_url=None,
                is_active=True
            ),

            # ------------------------------------------------
            # OPERATING SYSTEMS
            # ------------------------------------------------

            CoreCSProblem(
                topic_id=topics[1].id,
                title="Process vs Thread",
                description=(
                    "Explain the difference between a process "
                    "and a thread. Discuss memory sharing, "
                    "overhead and use cases."
                ),
                difficulty="Medium",
                external_url=None,
                is_active=True
            ),

            CoreCSProblem(
                topic_id=topics[1].id,
                title="CPU Scheduling Algorithms",
                description=(
                    "Compare FCFS, SJF, Round Robin and "
                    "Priority Scheduling. Explain their "
                    "advantages and disadvantages."
                ),
                difficulty="Medium",
                external_url=None,
                is_active=True
            ),

            CoreCSProblem(
                topic_id=topics[1].id,
                title="Deadlock",
                description=(
                    "Explain the four necessary conditions "
                    "for deadlock and discuss deadlock "
                    "prevention and avoidance."
                ),
                difficulty="Hard",
                external_url=None,
                is_active=True
            ),

            # ------------------------------------------------
            # COMPUTER NETWORKS
            # ------------------------------------------------

            CoreCSProblem(
                topic_id=topics[2].id,
                title="TCP vs UDP",
                description=(
                    "Compare TCP and UDP with respect to "
                    "connection establishment, reliability, "
                    "ordering and performance."
                ),
                difficulty="Medium",
                external_url=None,
                is_active=True
            ),

            CoreCSProblem(
                topic_id=topics[2].id,
                title="OSI Model",
                description=(
                    "Explain all seven layers of the OSI "
                    "model and give examples of protocols "
                    "operating at each layer."
                ),
                difficulty="Medium",
                external_url=None,
                is_active=True
            ),

            CoreCSProblem(
                topic_id=topics[2].id,
                title="TCP Three-Way Handshake",
                description=(
                    "Explain how the TCP three-way handshake "
                    "works and why SYN, SYN-ACK and ACK "
                    "messages are required."
                ),
                difficulty="Hard",
                external_url=None,
                is_active=True
            ),

            # ------------------------------------------------
            # OOP
            # ------------------------------------------------

            CoreCSProblem(
                topic_id=topics[3].id,
                title="Four Pillars of OOP",
                description=(
                    "Explain encapsulation, inheritance, "
                    "polymorphism and abstraction with "
                    "real-world examples."
                ),
                difficulty="Medium",
                external_url=None,
                is_active=True
            ),

            CoreCSProblem(
                topic_id=topics[3].id,
                title="Compile-Time vs Runtime Polymorphism",
                description=(
                    "Explain method overloading and method "
                    "overriding and distinguish compile-time "
                    "and runtime polymorphism."
                ),
                difficulty="Medium",
                external_url=None,
                is_active=True
            ),

            CoreCSProblem(
                topic_id=topics[3].id,
                title="Composition vs Inheritance",
                description=(
                    "Compare composition and inheritance. "
                    "Explain when composition is preferable "
                    "to inheritance."
                ),
                difficulty="Hard",
                external_url=None,
                is_active=True
            ),

            # ------------------------------------------------
            # COMPUTER ARCHITECTURE
            # ------------------------------------------------

            CoreCSProblem(
                topic_id=topics[4].id,
                title="Cache Memory",
                description=(
                    "Explain cache memory, cache levels "
                    "L1, L2 and L3, locality of reference "
                    "and why caching improves performance."
                ),
                difficulty="Medium",
                external_url=None,
                is_active=True
            ),

            CoreCSProblem(
                topic_id=topics[4].id,
                title="RISC vs CISC",
                description=(
                    "Compare RISC and CISC architectures "
                    "and explain their differences in "
                    "instruction design and execution."
                ),
                difficulty="Medium",
                external_url=None,
                is_active=True
            ),

            # ------------------------------------------------
            # SOFTWARE ENGINEERING
            # ------------------------------------------------

            CoreCSProblem(
                topic_id=topics[5].id,
                title="SDLC Models",
                description=(
                    "Explain Waterfall, Agile and Spiral "
                    "software development models and "
                    "compare their use cases."
                ),
                difficulty="Medium",
                external_url=None,
                is_active=True
            ),

            CoreCSProblem(
                topic_id=topics[5].id,
                title="Unit Testing vs Integration Testing",
                description=(
                    "Explain unit testing and integration "
                    "testing and describe when each should "
                    "be used."
                ),
                difficulty="Medium",
                external_url=None,
                is_active=True
            ),

            CoreCSProblem(
                topic_id=topics[5].id,
                title="SOLID Principles",
                description=(
                    "Explain all five SOLID principles and "
                    "describe how they help create maintainable "
                    "and scalable software."
                ),
                difficulty="Hard",
                external_url=None,
                is_active=True
            )
        ]


        # ====================================================
        # SAVE PROBLEMS
        # ====================================================

        db.add_all(problems)

        db.commit()

        print(
            f"Core CS seed completed successfully. "
            f"Added {len(topics)} topics and "
            f"{len(problems)} problems."
        )


    except Exception:

        db.rollback()

        raise

    finally:

        db.close()


if __name__ == "__main__":

    seed_core_cs()