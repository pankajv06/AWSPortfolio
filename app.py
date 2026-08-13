from flask import Flask, render_template, redirect, url_for

from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    RunReportRequest,
    DateRange,
    Metric
)

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/executive")
def executive():
    return render_template("executive.html")

@app.route("/cinematic")
def cinematic():
    return render_template("cinematic.html")

@app.route("/api/analytics/overview")
def analytics_overview():
    client = BetaAnalyticsDataClient()

    request = RunReportRequest(
        property="properties/549768617",
        date_ranges=[
            DateRange(start_date="7daysAgo", end_date="today")
        ],
        metrics=[
            Metric(name="activeUsers")
        ]
    )

    response = client.run_report(request)

    active_users = (
        response.rows[0].metric_values[0].value
        if response.rows
        else "0"
    )

    return {
        "active_users": int(active_users)
    }

if __name__ == "__main__":
    app.run(debug=True)

@app.route("/resume")
def resume():
    return redirect(url_for("static", filename="Pankaj_Verma_Resume.pdf"))