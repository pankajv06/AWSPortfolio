from flask import Flask, render_template, redirect, url_for

from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    RunReportRequest,
    DateRange,
    Metric,
    Dimension
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
            Metric(name="activeUsers"),
            Metric(name="totalUsers"),
            Metric(name="sessions"),
            Metric(name="screenPageViews")
        ]
    )

    response = client.run_report(request)

    if response.rows:
        values = response.rows[0].metric_values

        return {
            "active_users": int(values[0].value),
            "total_users": int(values[1].value),
            "sessions": int(values[2].value),
            "page_views": int(values[3].value)
        }

    return {
        "active_users": 0,
        "total_users": 0,
        "sessions": 0,
        "page_views": 0
    }

@app.route("/api/analytics/pages")
def analytics_pages():
    client = BetaAnalyticsDataClient()

    request = RunReportRequest(
        property="properties/549768617",
        date_ranges=[
            DateRange(start_date="7daysAgo", end_date="today")
        ],
        dimensions=[
            Dimension(name="pagePath")
        ],
        metrics=[
            Metric(name="screenPageViews"),
            Metric(name="totalUsers")
        ]
    )

    response = client.run_report(request)

    pages = []

    for row in response.rows:
        pages.append({
            "page": row.dimension_values[0].value,
            "page_views": int(row.metric_values[0].value),
            "users": int(row.metric_values[1].value)
        })

    return {
        "pages": pages
    }

if __name__ == "__main__":
    app.run(debug=True)

@app.route("/resume")
def resume():
    return redirect(url_for("static", filename="Pankaj_Verma_Resume.pdf"))