import StatCard from "./StatCard";


function ApplicationOverview({ statistics }) {

    return (

        <section className="dashboard-section">

            <div className="section-header">

                <div>

                    <h2>
                        Application Overview
                    </h2>

                    <p>
                        Track your current placement journey.
                    </p>

                </div>

            </div>


            <div className="stats-grid">

                <StatCard
                    title="Total Applications"
                    value={
                        statistics?.total_applications ?? 0
                    }
                    description="Jobs applied"
                />


                <StatCard
                    title="Applied"
                    value={
                        statistics?.applied ?? 0
                    }
                    description="Applications submitted"
                />


                <StatCard
                    title="Shortlisted"
                    value={
                        statistics?.shortlisted ?? 0
                    }
                    description="Applications shortlisted"
                />


                <StatCard
                    title="Interviews"
                    value={
                        statistics?.interview_scheduled ?? 0
                    }
                    description="Interviews scheduled"
                />


                <StatCard
                    title="Rejected"
                    value={
                        statistics?.rejected ?? 0
                    }
                    description="Applications rejected"
                />


                <StatCard
                    title="Hired"
                    value={
                        statistics?.hired ?? 0
                    }
                    description="Successful applications"
                />

            </div>

        </section>
    );
}

export default ApplicationOverview;