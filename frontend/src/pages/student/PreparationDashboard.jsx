import { useNavigate } from "react-router-dom";


function PreparationDashboard() {

    const navigate = useNavigate();


    // ========================================================
    // PREPARATION MODULES
    // ========================================================

    const preparationModules = [

        {
            title: "DSA",
            description:
                "Practice data structures and algorithms for coding rounds.",
            progress: 0,
            path: "/student/preparation/dsa"
        },

        {
            title: "SQL",
            description:
                "Improve SQL and database skills for placement interviews.",
            progress: 0,
            path: "/student/preparation/sql"
        },

        {
            title: "Core CS",
            description:
                "Prepare DBMS, OS, Computer Networks and OOP concepts.",
            progress: 0,
            path: "/student/preparation/core-cs"
        },

        {
            title: "Aptitude",
            description:
                "Practice quantitative, logical and verbal aptitude.",
            progress: 0,
            path: "/student/preparation/aptitude"
        },

        {
            title: "Mock Interviews",
            description:
                "Practice technical and placement interviews.",
            progress: 0,
            path: "/student/preparation/interviews"
        },

        {
            title: "PDF / AI Mentor",
            description:
                "Upload study material and ask questions using AI.",
            progress: 0,
            path: "/student/preparation/ai-mentor"
        }

    ];


    return (

        <div className="preparation-dashboard">


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="page-header">

                <div>

                    <h1>
                        Preparation Dashboard
                    </h1>

                    <p>
                        Prepare smarter and track your placement
                        readiness in one place.
                    </p>

                </div>

            </div>


            {/* ==================================================
                OVERALL PROGRESS
            ================================================== */}

            <section className="preparation-overview">

                <div>

                    <p>
                        Overall Preparation
                    </p>

                    <h2>
                        0%
                    </h2>

                    <p>
                        Start preparing to build your placement
                        readiness.
                    </p>

                </div>


                <div>

                    <div
                        className="progress-bar"
                        role="progressbar"
                        aria-valuenow="0"
                        aria-valuemin="0"
                        aria-valuemax="100"
                    >

                        <div
                            className="progress-bar-fill"
                            style={{
                                width: "0%"
                            }}
                        />

                    </div>

                </div>

            </section>


            {/* ==================================================
                PREPARATION MODULES
            ================================================== */}

            <section>

                <div className="section-header">

                    <div>

                        <h2>
                            Preparation Modules
                        </h2>

                        <p>
                            Choose an area and start preparing.
                        </p>

                    </div>

                </div>


                <div className="preparation-grid">

                    {preparationModules.map(
                        (module) => (

                            <div
                                className="preparation-card"
                                key={module.title}
                            >

                                <div>

                                    <h3>
                                        {module.title}
                                    </h3>

                                    <p>
                                        {module.description}
                                    </p>

                                </div>


                                <div>

                                    <p>
                                        Progress:{" "}
                                        {module.progress}%
                                    </p>

                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        aria-valuenow={
                                            module.progress
                                        }
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >

                                        <div
                                            className="progress-bar-fill"
                                            style={{
                                                width:
                                                    `${module.progress}%`
                                            }}
                                        />

                                    </div>

                                </div>


                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            module.path
                                        )
                                    }
                                >
                                    Start Preparing
                                </button>

                            </div>

                        )
                    )}

                </div>

            </section>


            {/* ==================================================
                PLACEMENT READINESS
            ================================================== */}

            <section className="readiness-section">

                <h2>
                    Placement Readiness
                </h2>

                <p>
                    Your readiness score will be calculated from
                    your activity across DSA, SQL, Core CS,
                    Aptitude, interviews and other preparation
                    activities.
                </p>

                <div>

                    <strong>
                        Readiness Score
                    </strong>

                    <h2>
                        Not calculated yet
                    </h2>

                </div>

            </section>

        </div>
    );
}


export default PreparationDashboard;