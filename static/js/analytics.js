async function fetchJSON(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
}


/* ==============================
   Overview
   ============================== */

async function loadOverview() {
    const data = await fetchJSON("/api/analytics/overview");

    document.getElementById("total-users").textContent =
        data.total_users.toLocaleString();

    document.getElementById("sessions").textContent =
        data.sessions.toLocaleString();

    document.getElementById("page-views").textContent =
        data.page_views.toLocaleString();

    document.getElementById("active-users").textContent =
        data.active_users.toLocaleString();
}


/* ==============================
   Page Performance
   ============================== */

async function loadPages() {
    const data = await fetchJSON("/api/analytics/pages");

    const container = document.getElementById("page-table");

    if (!data.pages || data.pages.length === 0) {
        container.innerHTML = '<div class="loading">No page data available</div>';
        return;
    }

    let html = `
        <table class="analytics-table">
            <thead>
                <tr>
                    <th>Page</th>
                    <th>Views</th>
                    <th>Users</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.pages.forEach(page => {
        html += `
            <tr>
                <td>${page.page}</td>
                <td>${page.page_views.toLocaleString()}</td>
                <td>${page.users.toLocaleString()}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    container.innerHTML = html;
}


/* ==============================
   Portfolio Choice
   ============================== */

async function loadPortfolio() {
    const data = await fetchJSON("/api/analytics/portfolio");

    const canvas = document.getElementById("portfolioChart");

    if (!data.portfolio_views || data.portfolio_views.length === 0) {
        canvas.parentElement.innerHTML =
            '<div class="loading">No portfolio data available</div>';
        return;
    }

    const validPortfolioViews = data.portfolio_views.filter(
        item => item.view_type && item.view_type.trim() !== ""
    );

    const labels = validPortfolioViews.map(item =>
        item.view_type.charAt(0).toUpperCase() + item.view_type.slice(1)
    );

    const values = validPortfolioViews.map(item => item.clicks);

    new Chart(canvas, {
        type: "doughnut",

        data: {
            labels: labels,

            datasets: [{
                data: values
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "bottom",

                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },

                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data
                                .reduce((sum, value) => sum + value, 0);

                            const percentage = total
                                ? Math.round((context.raw / total) * 100)
                                : 0;

                            return `${context.label}: ${context.raw} clicks (${percentage}%)`;
                        }
                    }
                }
            },

            cutout: "68%"
        }
    });
}


/* ==============================
   Engagement
   ============================== */

async function loadEngagement() {
    const data = await fetchJSON("/api/analytics/engagement");

    const container = document.getElementById("engagement-data");

    if (!data.events || data.events.length === 0) {
        container.innerHTML =
            '<div class="loading">No engagement data available</div>';
        return;
    }

    let html = "";

    data.events.forEach(event => {
        html += `
            <div style="
                display:flex;
                justify-content:space-between;
                padding:14px 0;
                border-bottom:1px solid rgba(255,255,255,0.05);
            ">
                <span>${formatEventName(event.event)}</span>

                <strong>${event.count.toLocaleString()}</strong>
            </div>
        `;
    });

    container.innerHTML = html;
}


/* ==============================
   Technology
   ============================== */

async function loadTechnology() {
    const data = await fetchJSON("/api/analytics/technology");

    const container = document.getElementById("technology-data");

    if (!data.technology || data.technology.length === 0) {
        container.innerHTML =
            '<div class="loading">No technology data available</div>';
        return;
    }

    let html = "";

    data.technology.slice(0, 8).forEach(item => {
        html += `
            <div style="
                display:flex;
                justify-content:space-between;
                padding:12px 0;
                border-bottom:1px solid rgba(255,255,255,0.05);
                font-size:13px;
            ">
                <span>
                    ${item.device} · ${item.browser}
                </span>

                <strong>${item.users}</strong>
            </div>
        `;
    });

    container.innerHTML = html;
}


/* ==============================
   Geography
   ============================== */

async function loadGeo() {
    const data = await fetchJSON("/api/analytics/geo");

    const container = document.getElementById("geo-data");

    if (!data.locations || data.locations.length === 0) {
        container.innerHTML =
            '<div class="loading">No location data available</div>';
        return;
    }

    let html = `
        <table class="analytics-table">
            <thead>
                <tr>
                    <th>Country</th>
                    <th>Region</th>
                    <th>Users</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.locations.slice(0, 15).forEach(location => {
        html += `
            <tr>
                <td>${location.country}</td>
                <td>${location.region}</td>
                <td>${location.users.toLocaleString()}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    container.innerHTML = html;
}


/* ==============================
   Helpers
   ============================== */

function formatEventName(name) {
    const names = {
        "resume_click": "Resume downloads",
        "linkedin_click": "LinkedIn clicks",
        "portfolio_view_click": "Portfolio selections"
    };

    return names[name] || name;
}

async function loadVisitorTrend() {
    const data = await fetchJSON("/api/analytics/trend");

    const canvas = document.getElementById("visitorTrendChart");

    if (!data.trend || data.trend.length === 0) {
        return;
    }

    const labels = data.trend.map(item => {
        const date = item.date;

        return `${date.substring(4, 6)}/${date.substring(6, 8)}`;
    });

    const users = data.trend.map(item => item.users);

    new Chart(canvas, {
        type: "line",

        data: {
            labels: labels,

            datasets: [{
                label: "Users",
                data: users,
                tension: 0.35,
                fill: true
            }]
        },

        options: {
            responsive: true,

            plugins: {
                legend: {
                    display: false
                }
            },

            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

/* ==============================
   Dashboard initialization
   ============================== */

async function loadDashboard() {

    try {
        await Promise.all([
            loadOverview(),
            loadPages(),
            loadPortfolio(),
            loadEngagement(),
            loadTechnology(),
            loadGeo(),
            loadVisitorTrend()
        ]);

        console.log("Analytics dashboard loaded");

    } catch (error) {

        console.error("Analytics dashboard error:", error);

    }
}



loadDashboard();