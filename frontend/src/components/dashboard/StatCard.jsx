function StatCard({
    title,
    value,
    description
}) {

    return (
        <div className="stat-card">

            <div className="stat-card-content">

                <p className="stat-card-title">
                    {title}
                </p>

                <h2 className="stat-card-value">
                    {value}
                </h2>

                {description && (
                    <p className="stat-card-description">
                        {description}
                    </p>
                )}

            </div>

        </div>
    );
}

export default StatCard;