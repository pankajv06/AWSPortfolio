from flask import Flask, render_template, redirect, url_for

from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    RunReportRequest,
    DateRange,
    Metric,
    Dimension,
    FilterExpression,
    Filter
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

@app.route("/analytics")
def analytics_dashboard():
    return render_template("analytics.html")

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

@app.route("/api/analytics/engagement")
def analytics_engagement():
    client = BetaAnalyticsDataClient()

    request = RunReportRequest(
        property="properties/549768617",
        date_ranges=[
            DateRange(start_date="7daysAgo", end_date="today")
        ],
        dimensions=[
            Dimension(name="eventName")
        ],
        metrics=[
            Metric(name="eventCount"),
            Metric(name="totalUsers")
        ],
        dimension_filter=FilterExpression(
            filter=Filter(
                field_name="eventName",
                in_list_filter={
                    "values": [
                        "portfolio_view_click",
                        "resume_click",
                        "linkedin_click"
                    ]
                }
            )
        )
    )

    response = client.run_report(request)

    events = []

    for row in response.rows:
        events.append({
            "event": row.dimension_values[0].value,
            "count": int(row.metric_values[0].value),
            "users": int(row.metric_values[1].value)
        })

    return {
        "events": events
    }

@app.route("/api/analytics/portfolio")
def analytics_portfolio():
    client = BetaAnalyticsDataClient()

    request = RunReportRequest(
        property="properties/549768617",
        date_ranges=[
            DateRange(start_date="7daysAgo", end_date="today")
        ],
        dimensions=[
            Dimension(name="customEvent:view_type")
        ],
        metrics=[
            Metric(name="eventCount"),
            Metric(name="totalUsers")
        ],
        dimension_filter=FilterExpression(
            filter=Filter(
                field_name="eventName",
                in_list_filter={
                    "values": ["portfolio_view_click"]
                }
            )
        )
    )

    response = client.run_report(request)

    portfolio_views = []

    for row in response.rows:
        portfolio_views.append({
            "view_type": row.dimension_values[0].value,
            "clicks": int(row.metric_values[0].value),
            "users": int(row.metric_values[1].value)
        })

    return {
        "portfolio_views": portfolio_views
    }

@app.route("/api/analytics/geo")
def analytics_geo():
    client = BetaAnalyticsDataClient()

    request = RunReportRequest(
        property="properties/549768617",
        date_ranges=[
            DateRange(start_date="7daysAgo", end_date="today")
        ],
        dimensions=[
            Dimension(name="country"),
            Dimension(name="region")
        ],
        metrics=[
            Metric(name="totalUsers")
        ]
    )

    response = client.run_report(request)

    locations = []

    for row in response.rows:
        locations.append({
            "country": row.dimension_values[0].value,
            "region": row.dimension_values[1].value,
            "users": int(row.metric_values[0].value)
        })

    return {
        "locations": locations
    }


@app.route("/api/analytics/technology")
def analytics_technology():
    client = BetaAnalyticsDataClient()

    request = RunReportRequest(
        property="properties/549768617",
        date_ranges=[
            DateRange(start_date="7daysAgo", end_date="today")
        ],
        dimensions=[
            Dimension(name="deviceCategory"),
            Dimension(name="browser"),
            Dimension(name="operatingSystem")
        ],
        metrics=[
            Metric(name="totalUsers")
        ]
    )

    response = client.run_report(request)

    technology = []

    for row in response.rows:
        technology.append({
            "device": row.dimension_values[0].value,
            "browser": row.dimension_values[1].value,
            "os": row.dimension_values[2].value,
            "users": int(row.metric_values[0].value)
        })

    return {
        "technology": technology
    }

if __name__ == "__main__":
    app.run(debug=True)

@app.route("/resume")
def resume():
    return redirect(url_for("static", filename="Pankaj_Verma_Resume.pdf"))