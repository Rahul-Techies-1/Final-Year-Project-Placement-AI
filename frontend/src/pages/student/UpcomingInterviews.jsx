function UpcomingInterviews({
    interviews = []
}) {

    return (

        <section className="dashboard-section">

            <div className="section-header">

                <div>

                    <h2>
                        Upcoming Interviews
                    </h2>

                    <p>
                        Your scheduled interviews.
                    </p>

                </div>

            </div>


            {interviews.length === 0 ? (

                <div className="empty-state">

                    <p>
                        No upcoming interviews.
                    </p>

                </div>

            ) : (

                <div className="interviews-list">

                    {interviews.map(
                        (interview) => (

                            <div
                                className="interview-item"
                                key={
                                    interview.id
                                }
                            >

                                <div>

                                    <h3>
                                        {
                                            interview.job_title
                                        }
                                    </h3>

                                    <p>
                                        {
                                            interview.company
                                        }
                                    </p>

                                    <p>
                                        {
                                            interview.interview_type
                                        }
                                    </p>

                                    <p>
                                        {new Date(
                                            interview.scheduled_at
                                        ).toLocaleString()}
                                    </p>

                                </div>


                                <div>

                                    <span>
                                        {
                                            interview.status
                                        }
                                    </span>


                                    {interview.meeting_link && (

                                        <a
                                            href={
                                                interview.meeting_link
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Join Interview
                                        </a>

                                    )}

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </section>
    );
}


export default UpcomingInterviews;