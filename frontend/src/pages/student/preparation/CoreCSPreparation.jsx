import { useEffect, useState } from "react";

import {
    getCoreCSOverview,
    getCoreCSTopics,
    getCoreCSProblems,
    markCoreCSProblemCompleted,
    markCoreCSProblemIncomplete
} from "../../../services/coreCSService";


/*
============================================================
CORE CS ANSWER BANK
============================================================

The current backend stores the question/description but does
not yet store an answer field.

For the current PlacementAI MVP, answers are maintained here
so students can immediately view interview-ready explanations.
============================================================
*/

const CORE_CS_ANSWERS = {

    "What is database normalization?": `
Database normalization is the process of organizing data in a
database to reduce data redundancy and improve data integrity.

The main normal forms are:

1NF:
- Each column contains atomic values.
- There are no repeating groups.

2NF:
- The table must already be in 1NF.
- Every non-key attribute must depend on the entire primary key.

3NF:
- The table must already be in 2NF.
- There should be no transitive dependency.

BCNF:
- A stronger version of 3NF.
- Every determinant must be a candidate key.

Example:
Instead of storing student and department information repeatedly
in one large table, we can separate Students and Departments
into different tables and connect them using a foreign key.

Benefits:
- Less duplicate data
- Better consistency
- Easier maintenance
- Reduced update anomalies
`,

    "ACID Properties": `
ACID properties define the reliability of database transactions.

A — Atomicity:
A transaction is treated as one complete unit. Either all
operations succeed or all operations are rolled back.

C — Consistency:
A transaction must move the database from one valid state
to another valid state while maintaining constraints.

I — Isolation:
Concurrent transactions should not interfere with each
other in an unsafe way.

D — Durability:
Once a transaction is committed, its changes remain saved
even if the system crashes.

Example:
During a bank transfer, money should be deducted from one
account and added to another. If the second operation fails,
the first operation must also be rolled back.

This protects the database from partially completed transactions.
`,

    "Indexing in Databases": `
Database indexing is a technique used to make data retrieval
faster.

An index is an additional data structure that helps the database
find rows without scanning the entire table.

B-Tree indexes are commonly used because they maintain data in
a sorted structure and allow efficient searching, insertion and
range queries.

Example:

CREATE INDEX idx_employee_email
ON employees(email);

Advantages:
- Faster SELECT queries
- Faster searching
- Faster sorting and range queries

Disadvantages:
- Requires additional storage
- INSERT, UPDATE and DELETE operations may become slower
  because the index also needs to be updated

Indexes should therefore be created on columns that are frequently
used for searching, filtering, joining or sorting.
`,

    "Process vs Thread": `
A process is an independent program in execution, while a thread
is a smaller execution unit inside a process.

Process:
- Has its own memory space
- More expensive to create
- Processes are isolated from each other
- Communication requires IPC mechanisms

Thread:
- Shares memory with other threads of the same process
- Lightweight compared with processes
- Faster to create and switch
- Communication is easier because memory is shared

Example:
A web browser can be considered a process containing multiple
threads for rendering pages, handling network requests and
processing user interactions.

Main difference:
Processes provide stronger isolation, while threads provide
efficient concurrent execution inside the same process.
`,

    "CPU Scheduling Algorithms": `
CPU scheduling determines which process should receive CPU time.

FCFS — First Come First Serve:
Processes are executed in the order they arrive.
It is simple but can cause long waiting times.

SJF — Shortest Job First:
The process with the shortest CPU burst is selected.
It can reduce average waiting time but requires knowledge or
estimation of burst time.

Round Robin:
Each process receives a fixed time slice called a time quantum.
After the quantum expires, the process goes to the back of the queue.
It is commonly associated with time-sharing systems.

Priority Scheduling:
The process with the highest priority is executed first.
Low-priority processes may suffer from starvation.

There is no single scheduling algorithm that is best for every
scenario. The choice depends on system requirements such as
response time, throughput and fairness.
`,

    "Deadlock": `
Deadlock occurs when a group of processes wait indefinitely for
resources held by each other.

Four necessary conditions for deadlock are:

1. Mutual Exclusion:
A resource can be used by only one process at a time.

2. Hold and Wait:
A process holds one resource while waiting for another.

3. No Preemption:
A resource cannot be forcibly taken from a process.

4. Circular Wait:
Processes form a circular chain where each process waits for
a resource held by the next process.

Deadlock prevention works by ensuring at least one of these
conditions cannot occur.

Deadlock avoidance uses information about resource allocation
to keep the system in a safe state.

The Banker's Algorithm is a well-known deadlock avoidance
algorithm.
`,

    "TCP vs UDP": `
TCP and UDP are transport-layer protocols.

TCP:
- Connection-oriented
- Reliable
- Provides ordered delivery
- Uses acknowledgements
- Performs retransmission when required
- Has more overhead

UDP:
- Connectionless
- Does not guarantee delivery
- Does not guarantee ordering
- Has lower overhead
- Generally provides lower latency

TCP is commonly used for:
- Web applications
- File transfer
- Email
- Applications where reliable delivery matters

UDP is commonly used for:
- Online gaming
- Live streaming
- DNS
- Real-time communication

The main trade-off is reliability versus speed and lower overhead.
`,

    "OSI Model": `
The OSI model contains seven networking layers.

1. Physical:
Transfers raw bits through physical media.

2. Data Link:
Provides frame-level communication and MAC addressing.

3. Network:
Handles logical addressing and routing.
Example: IP.

4. Transport:
Provides end-to-end communication.
Examples: TCP and UDP.

5. Session:
Manages communication sessions between applications.

6. Presentation:
Handles data formatting, encryption and compression.

7. Application:
Provides network services directly to applications.
Examples include HTTP, FTP and SMTP.

A common way to remember the order is:

Physical
Data Link
Network
Transport
Session
Presentation
Application
`,

    "TCP Three-Way Handshake": `
The TCP three-way handshake establishes a reliable connection
between a client and server.

Step 1 — SYN:
The client sends a SYN packet to request a connection.

Step 2 — SYN-ACK:
The server responds with SYN-ACK, confirming the request and
sending its own synchronization information.

Step 3 — ACK:
The client sends an ACK back to the server.

After these three steps, the TCP connection is established.

The handshake allows both sides to synchronize sequence numbers
and confirm that both endpoints are ready to communicate.

It is one of the key reasons TCP can provide reliable,
connection-oriented communication.
`,

    "Four Pillars of OOP": `
The four major principles of Object-Oriented Programming are:

1. Encapsulation:
Combining data and methods into a single unit and controlling
access to internal data.

2. Inheritance:
Creating a new class based on an existing class to reuse
properties and behavior.

3. Polymorphism:
Allowing the same interface or method name to behave differently
depending on the object or context.

4. Abstraction:
Hiding unnecessary implementation details and exposing only
important functionality.

Example:
A Car class can hide internal engine operations while exposing
methods such as start(), stop() and accelerate().

These principles improve code organization, reuse, maintainability
and flexibility.
`,

    "Compile-Time vs Runtime Polymorphism": `
Polymorphism means one interface can have multiple forms.

Compile-time polymorphism is usually achieved through method
overloading.

Example:
A function may have the same name but accept different parameters.

Runtime polymorphism is commonly achieved through method overriding.

In runtime polymorphism, a child class provides its own
implementation of a method inherited from the parent class.

Main difference:

Compile-time:
- Decided during compilation
- Commonly achieved using overloading

Runtime:
- Decided during execution
- Commonly achieved using overriding and dynamic dispatch

Runtime polymorphism is especially useful when working with
parent references and different child objects.
`,

    "Composition vs Inheritance": `
Inheritance represents an "is-a" relationship.

Example:
A Dog is an Animal.

Composition represents a "has-a" relationship.

Example:
A Car has an Engine.

Inheritance allows a class to reuse and extend behavior from
another class.

Composition builds a class by combining objects that provide
specific functionality.

Composition is often preferred when:
- Strong inheritance relationships do not exist
- Behavior needs to change dynamically
- We want lower coupling
- We want greater flexibility

Example:
Instead of making a Car inherit from Engine, a Car can contain
an Engine object.

This follows the principle:
"Favor composition over inheritance" when appropriate.
`,

    "Cache Memory": `
Cache memory is a small and fast memory located close to the CPU.
It stores frequently or recently used data and instructions.

The main cache levels are:

L1:
- Smallest
- Fastest
- Usually closest to the CPU core

L2:
- Larger than L1
- Slightly slower

L3:
- Larger than L2
- Usually shared between multiple CPU cores

Caching improves performance because accessing cache is much
faster than accessing main memory.

Cache efficiency depends heavily on locality of reference.

Temporal locality:
Recently used data is likely to be used again.

Spatial locality:
Data located near recently accessed data is likely to be accessed.
`,

    "RISC vs CISC": `
RISC stands for Reduced Instruction Set Computer.

CISC stands for Complex Instruction Set Computer.

RISC:
- Smaller and simpler instruction set
- Instructions are generally simpler
- Often designed for efficient pipelining
- More operations may require multiple instructions

CISC:
- Larger and more complex instruction set
- Individual instructions can perform more complex operations
- Instructions may have variable lengths
- Hardware can be more complex

The key difference is the design philosophy of the instruction
set.

Modern processors can combine ideas from both approaches, so the
traditional distinction is not always absolute.
`,

    "SDLC Models": `
SDLC stands for Software Development Life Cycle.

It defines the stages used to develop and maintain software.

Waterfall:
- Sequential development model
- Each phase is completed before the next phase begins
- Suitable when requirements are stable

Agile:
- Iterative and incremental
- Work is divided into smaller iterations
- Requirements can evolve
- Continuous feedback is encouraged

Spiral:
- Iterative model focused strongly on risk analysis
- Useful for large and high-risk projects

Typical SDLC activities include:
- Requirement analysis
- Design
- Development
- Testing
- Deployment
- Maintenance

The appropriate model depends on project requirements,
risk and organizational needs.
`,

    "Unit Testing vs Integration Testing": `
Unit testing tests individual components or functions in isolation.

Example:
Testing a calculateSalary() function independently.

Integration testing checks whether multiple components work
correctly together.

Example:
Testing whether the login API correctly communicates with the
database and authentication layer.

Unit testing:
- Smaller scope
- Faster
- Easier to debug
- Focuses on individual components

Integration testing:
- Larger scope
- Tests interactions between components
- Helps identify interface and communication problems

Both are important for building reliable software.
`,

    "SOLID Principles": `
SOLID is a group of five object-oriented design principles.

S — Single Responsibility Principle:
A class should have one primary responsibility.

O — Open/Closed Principle:
Software entities should be open for extension but closed for
modification.

L — Liskov Substitution Principle:
Objects of a child class should be usable wherever objects of
the parent class are expected.

I — Interface Segregation Principle:
Clients should not be forced to depend on methods they do not use.

D — Dependency Inversion Principle:
High-level modules should depend on abstractions rather than
concrete implementations.

SOLID principles help create software that is easier to maintain,
test, extend and modify.
`
};


const CoreCSPreparation = () => {

    const [overview, setOverview] = useState(null);

    const [topics, setTopics] = useState([]);

    const [problems, setProblems] = useState([]);

    const [selectedTopic, setSelectedTopic] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [openAnswerId, setOpenAnswerId] = useState(null);

    const [updatingProblemId, setUpdatingProblemId] = useState(null);


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        loadCoreCSData();
    }, []);


    // ========================================================
    // LOAD CORE CS DATA
    // ========================================================

    const loadCoreCSData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                overviewData,
                topicsData,
                problemsData
            ] = await Promise.all([
                getCoreCSOverview(),
                getCoreCSTopics(),
                getCoreCSProblems()
            ]);

            setOverview(overviewData);

            setTopics(topicsData || []);

            setProblems(
                problemsData?.items || []
            );

        } catch (err) {

            console.error(
                "Failed to load Core CS data:",
                err
            );

            setError(
                err.response?.data?.detail ||
                "Failed to load Core CS preparation data."
            );

        } finally {

            setLoading(false);

        }
    };


    // ========================================================
    // FILTER BY TOPIC
    // ========================================================

    const handleTopicChange = async (topicId) => {

        try {

            setSelectedTopic(topicId);

            setOpenAnswerId(null);

            setError("");

            const data = await getCoreCSProblems({
                topicId
            });

            setProblems(
                data?.items || []
            );

        } catch (err) {

            console.error(
                "Failed to load Core CS problems:",
                err
            );

            setError(
                err.response?.data?.detail ||
                "Failed to load Core CS problems."
            );
        }
    };


    // ========================================================
    // SHOW ALL
    // ========================================================

    const handleShowAll = async () => {

        try {

            setSelectedTopic(null);

            setOpenAnswerId(null);

            setError("");

            const data =
                await getCoreCSProblems();

            setProblems(
                data?.items || []
            );

        } catch (err) {

            console.error(
                "Failed to load Core CS problems:",
                err
            );

            setError(
                err.response?.data?.detail ||
                "Failed to load Core CS problems."
            );
        }
    };


    // ========================================================
    // TOGGLE ANSWER
    // ========================================================

    const handleToggleAnswer = (problemId) => {

        setOpenAnswerId(
            (currentId) =>
                currentId === problemId
                    ? null
                    : problemId
        );
    };


    // ========================================================
    // TOGGLE PROGRESS
    // ========================================================

    const handleToggleProgress = async (problem) => {

        try {

            setUpdatingProblemId(problem.id);

            setError("");

            if (problem.completed) {

                await markCoreCSProblemIncomplete(
                    problem.id
                );

            } else {

                await markCoreCSProblemCompleted(
                    problem.id
                );
            }


            const [
                overviewData,
                problemsData
            ] = await Promise.all([

                getCoreCSOverview(),

                getCoreCSProblems({
                    topicId: selectedTopic
                })

            ]);


            setOverview(
                overviewData
            );

            setProblems(
                problemsData?.items || []
            );

        } catch (err) {

            console.error(
                "Failed to update Core CS progress:",
                err
            );

            setError(
                err.response?.data?.detail ||
                "Failed to update problem progress."
            );

        } finally {

            setUpdatingProblemId(null);

        }
    };


    // ========================================================
    // GET DIFFICULTY CLASS
    // ========================================================

    const getDifficultyClass = (difficulty) => {

        const normalized =
            String(difficulty || "")
                .toLowerCase();

        if (normalized === "easy") {
            return "core-cs-difficulty easy";
        }

        if (normalized === "hard") {
            return "core-cs-difficulty hard";
        }

        return "core-cs-difficulty medium";
    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <div className="core-cs-preparation">

                <div className="core-cs-loading-card">

                    <div className="core-cs-loading-spinner" />

                    <h2>
                        Loading Core CS preparation
                    </h2>

                    <p>
                        Preparing your interview questions...
                    </p>

                </div>

            </div>
        );
    }


    // ========================================================
    // FATAL ERROR
    // ========================================================

    if (error && !overview) {

        return (

            <div className="core-cs-preparation">

                <div className="core-cs-error-card">

                    <div className="core-cs-error-icon">
                        !
                    </div>

                    <h2>
                        Unable to load Core CS
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadCoreCSData}
                        className="core-cs-primary-button"
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }


    return (

        <div className="core-cs-preparation">

            {/* ==================================================
                HEADER
            ================================================== */}

            <section className="core-cs-hero">

                <div className="core-cs-hero-content">

                    <span className="core-cs-eyebrow">
                        PLACEMENT PREPARATION
                    </span>

                    <h1>
                        Core CS Preparation
                    </h1>

                    <p>
                        Master DBMS, Operating Systems,
                        Computer Networks, OOP and other
                        core concepts for technical interviews.
                    </p>

                </div>

                <div className="core-cs-hero-decoration">
                    <span />
                    <span />
                    <span />
                </div>

            </section>


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <div className="core-cs-inline-error">

                    <span>!</span>

                    <p>
                        {error}
                    </p>

                </div>
            )}


            {/* ==================================================
                PROGRESS OVERVIEW
            ================================================== */}

            {overview?.progress && (

                <section className="core-cs-progress-card">

                    <div className="core-cs-progress-top">

                        <div>

                            <span className="core-cs-section-label">
                                YOUR PROGRESS
                            </span>

                            <div className="core-cs-progress-number">

                                {
                                    overview.progress
                                        .progress_percentage
                                }%

                            </div>

                            <p>
                                {
                                    overview.progress
                                        .completed_problems
                                } of{" "}
                                {
                                    overview.progress
                                        .total_problems
                                } questions completed
                            </p>

                        </div>


                        <div className="core-cs-progress-stats">

                            <div>

                                <strong>
                                    {
                                        overview.progress
                                            .completed_problems
                                    }
                                </strong>

                                <span>
                                    Completed
                                </span>

                            </div>

                            <div>

                                <strong>
                                    {
                                        overview.progress
                                            .remaining_problems
                                    }
                                </strong>

                                <span>
                                    Remaining
                                </span>

                            </div>

                        </div>

                    </div>


                    <div className="core-cs-progress-track">

                        <div
                            className="core-cs-progress-fill"
                            style={{
                                width:
                                    `${overview.progress.progress_percentage}%`
                            }}
                        />

                    </div>

                </section>
            )}


            {/* ==================================================
                TOPICS
            ================================================== */}

            <section className="core-cs-topics-section">

                <div className="core-cs-section-heading">

                    <div>

                        <span className="core-cs-section-label">
                            PRACTICE BY TOPIC
                        </span>

                        <h2>
                            Core CS Topics
                        </h2>

                        <p>
                            Choose a subject to focus your preparation.
                        </p>

                    </div>

                </div>


                <div className="core-cs-topic-list">

                    <button
                        type="button"
                        className={
                            selectedTopic === null
                                ? "core-cs-topic active"
                                : "core-cs-topic"
                        }
                        onClick={handleShowAll}
                    >
                        All Topics
                    </button>


                    {topics.map((topic) => (

                        <button
                            key={topic.id}
                            type="button"
                            className={
                                selectedTopic === topic.id
                                    ? "core-cs-topic active"
                                    : "core-cs-topic"
                            }
                            onClick={() =>
                                handleTopicChange(
                                    topic.id
                                )
                            }
                        >
                            {topic.name}
                        </button>

                    ))}

                </div>

            </section>


            {/* ==================================================
                QUESTIONS
            ================================================== */}

            <section className="core-cs-questions-section">

                <div className="core-cs-section-heading">

                    <div>

                        <span className="core-cs-section-label">
                            INTERVIEW PRACTICE
                        </span>

                        <h2>
                            Core CS Questions
                        </h2>

                        <p>
                            Read the question, think through your
                            answer, then reveal the interview-ready
                            explanation.
                        </p>

                    </div>

                    <div className="core-cs-question-count">

                        {problems.length}

                        <span>
                            Questions
                        </span>

                    </div>

                </div>


                {problems.length === 0 ? (

                    <div className="core-cs-empty">

                        <div className="core-cs-empty-icon">
                            ?
                        </div>

                        <h3>
                            No questions found
                        </h3>

                        <p>
                            Try selecting another topic.
                        </p>

                    </div>

                ) : (

                    <div className="core-cs-question-list">

                        {problems.map((problem, index) => {

                            const answer =
                                CORE_CS_ANSWERS[
                                    problem.title
                                ];

                            const isAnswerOpen =
                                openAnswerId === problem.id;

                            return (

                                <article
                                    key={problem.id}
                                    className={
                                        isAnswerOpen
                                            ? "core-cs-question-card answer-open"
                                            : "core-cs-question-card"
                                    }
                                >

                                    <div className="core-cs-question-number">

                                        {String(index + 1).padStart(2, "0")}

                                    </div>


                                    <div className="core-cs-question-main">

                                        <div className="core-cs-question-meta">

                                            <span
                                                className={
                                                    getDifficultyClass(
                                                        problem.difficulty
                                                    )
                                                }
                                            >
                                                {problem.difficulty}
                                            </span>

                                            {problem.completed && (

                                                <span className="core-cs-completed-badge">
                                                    ✓ Completed
                                                </span>

                                            )}

                                        </div>


                                        <h3>
                                            {problem.title}
                                        </h3>


                                        <p className="core-cs-question-description">
                                            {problem.description}
                                        </p>


                                        <div className="core-cs-question-actions">

                                            <button
                                                type="button"
                                                className="core-cs-answer-button"
                                                onClick={() =>
                                                    handleToggleAnswer(
                                                        problem.id
                                                    )
                                                }
                                            >

                                                <span>
                                                    {isAnswerOpen
                                                        ? "Hide Answer"
                                                        : "View Answer"
                                                    }
                                                </span>

                                                <span className="core-cs-answer-arrow">
                                                    {isAnswerOpen
                                                        ? "↑"
                                                        : "↓"
                                                    }
                                                </span>

                                            </button>


                                            <button
                                                type="button"
                                                className={
                                                    problem.completed
                                                        ? "core-cs-complete-button completed"
                                                        : "core-cs-complete-button"
                                                }
                                                disabled={
                                                    updatingProblemId ===
                                                    problem.id
                                                }
                                                onClick={() =>
                                                    handleToggleProgress(
                                                        problem
                                                    )
                                                }
                                            >

                                                {updatingProblemId ===
                                                problem.id

                                                    ? "Updating..."

                                                    : problem.completed
                                                        ? "Mark Incomplete"
                                                        : "Mark Complete"
                                                }

                                            </button>


                                            {problem.external_url && (

                                                <a
                                                    href={
                                                        problem.external_url
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="core-cs-practice-link"
                                                >
                                                    Practice Question ↗
                                                </a>

                                            )}

                                        </div>


                                        {/* ==================================================
                                            ANSWER
                                        ================================================== */}

                                        {isAnswerOpen && (

                                            <div className="core-cs-answer-panel">

                                                <div className="core-cs-answer-header">

                                                    <div className="core-cs-answer-icon">
                                                        ✓
                                                    </div>

                                                    <div>

                                                        <span>
                                                            INTERVIEW-READY ANSWER
                                                        </span>

                                                        <h4>
                                                            Suggested Answer
                                                        </h4>

                                                    </div>

                                                </div>


                                                <div className="core-cs-answer-content">

                                                    {answer ? (

                                                        answer
                                                            .trim()
                                                            .split("\n")
                                                            .map(
                                                                (
                                                                    line,
                                                                    lineIndex
                                                                ) => (

                                                                    <p
                                                                        key={
                                                                            lineIndex
                                                                        }
                                                                        className={
                                                                            line.trim() === ""
                                                                                ? "answer-spacer"
                                                                                : ""
                                                                        }
                                                                    >
                                                                        {
                                                                            line
                                                                        }
                                                                    </p>

                                                                )
                                                            )

                                                    ) : (

                                                        <p>
                                                            Answer for this
                                                            question is being
                                                            prepared.
                                                        </p>

                                                    )}

                                                </div>

                                            </div>
                                        )}

                                    </div>

                                </article>
                            );
                        })}

                    </div>
                )}

            </section>

        </div>
    );
};


export default CoreCSPreparation;