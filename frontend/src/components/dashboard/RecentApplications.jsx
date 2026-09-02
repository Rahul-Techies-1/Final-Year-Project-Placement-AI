import { useNavigate } from "react-router-dom";


function RecentApplications({
    applications = []
}) {

    const navigate = useNavigate();


    return (

        <section className="dashboard-section">

            <div className="section-header">

                <div>

                    <h2>
                        Recent Applications
                    </h2>

                    <p>
                        Your latest job applications.
                    </p>

                </div>

            </div>


            {applications.length === 0 ? (

                <div className="empty-state">

                    <p>
                        You haven't applied for any jobs yet.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/student/jobs")
                        }
                    >
                        Explore Jobs
                    </button>

                </div>

            ) : (

                <div className="applications-list">

                    {applications.map(
                        (application) => (

                            <div
                                className="application-item"
                                key={
                                    application.application_id
                                }
                            >

                                <div>

                                    <h3>
                                        {
                                            application.job_title
                                        }
                                    </h3>

                                    <p>
                                        {
                                            application.company
                                        }
                                    </p>

                                    <span>
                                        {
                                            application.location
                                        }
                                    </span>

                                </div>


                                <div>

                                    <span
                                        className={
                                            `status status-${application.status
                                                ?.toLowerCase()
                                                .replaceAll(
                                                    " ",
                                                    "-"
                                                )}`
                                        }
                                    >
                                        {
                                            application.status
                                        }
                                    </span>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </section>
    );
}


export default RecentApplications;