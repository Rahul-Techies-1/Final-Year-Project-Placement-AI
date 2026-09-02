import { useState } from "react";


function DSAPreparation() {

    const [selectedTopic, setSelectedTopic] = useState("All");


    const topics = [
        "All",
        "Arrays",
        "Strings",
        "Linked List",
        "Stack",
        "Queue",
        "Trees",
        "Graphs",
        "Dynamic Programming"
    ];


    const problems = [
        {
            id: 1,
            title: "Two Sum",
            topic: "Arrays",
            difficulty: "Easy",
            completed: false
        },
        {
            id: 2,
            title: "Best Time to Buy and Sell Stock",
            topic: "Arrays",
            difficulty: "Easy",
            completed: false
        },
        {
            id: 3,
            title: "Valid Parentheses",
            topic: "Stack",
            difficulty: "Easy",
            completed: false
        },
        {
            id: 4,
            title: "Reverse Linked List",
            topic: "Linked List",
            difficulty: "Easy",
            completed: false
        },
        {
            id: 5,
            title: "Binary Tree Inorder Traversal",
            topic: "Trees",
            difficulty: "Medium",
            completed: false
        }
    ];


    const filteredProblems =
        selectedTopic === "All"
            ? problems
            : problems.filter(
                (problem) =>
                    problem.topic === selectedTopic
            );


    return (

        <div className="dsa-preparation">


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="page-header">

                <div>

                    <h1>
                        DSA Preparation
                    </h1>

                    <p>
                        Practice Data Structures and Algorithms
                        for placement coding rounds.
                    </p>

                </div>

            </div>


            {/* ==================================================
                PROGRESS
            ================================================== */}

            <section className="preparation-overview">

                <div>

                    <p>
                        DSA Progress
                    </p>

                    <h2>
                        0%
                    </h2>

                    <p>
                        0 of {problems.length} problems completed
                    </p>

                </div>


                <div className="progress-bar">

                    <div
                        className="progress-bar-fill"
                        style={{
                            width: "0%"
                        }}
                    />

                </div>

            </section>


            {/* ==================================================
                TOPICS
            ================================================== */}

            <section>

                <div className="section-header">

                    <div>

                        <h2>
                            DSA Topics
                        </h2>

                        <p>
                            Select a topic to practice.
                        </p>

                    </div>

                </div>


                <div className="topic-list">

                    {topics.map(
                        (topic) => (

                            <button
                                key={topic}
                                type="button"
                                className={
                                    selectedTopic === topic
                                        ? "topic-button active"
                                        : "topic-button"
                                }
                                onClick={() =>
                                    setSelectedTopic(topic)
                                }
                            >
                                {topic}
                            </button>

                        )
                    )}

                </div>

            </section>


            {/* ==================================================
                PROBLEMS
            ================================================== */}

            <section>

                <div className="section-header">

                    <div>

                        <h2>
                            Problems
                        </h2>

                        <p>
                            Solve problems and track your progress.
                        </p>

                    </div>

                </div>


                <div className="problems-list">

                    {filteredProblems.map(
                        (problem) => (

                            <div
                                className="problem-card"
                                key={problem.id}
                            >

                                <div>

                                    <h3>
                                        {problem.title}
                                    </h3>

                                    <p>
                                        {problem.topic}
                                    </p>

                                </div>


                                <div>

                                    <span>
                                        {problem.difficulty}
                                    </span>


                                    <button
                                        type="button"
                                    >
                                        Start Problem
                                    </button>

                                </div>

                            </div>

                        )
                    )}

                </div>

            </section>

        </div>
    );
}


export default DSAPreparation;