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

    const container = document.getElementById("portfolio-chart");

    if (!data.portfolio_views || data.portfolio_views.length === 0) {
        container.innerHTML =
            '<div class="loading">No portfolio data available</div>';
        return;
    }

    let html = "";

    data.portfolio_views.forEach(item => {
        html += `
            <div style="margin-bottom: 20px;">
                <div style="
                    display:flex;
                    justify-content:space-between;
                    margin-bottom:7px;
                    font-size:13px;
                ">
                    <span>${item.view_type}</span>
                    <span>${item.clicks} clicks · ${item.users} users</span>
                </div>

                <div style="
                    height:8px;
                    background:rgba(255,255,255,0.08);
                    border-radius:10px;
                    overflow:hidden;
                ">
                    <div style="
                        width:${Math.min(item.clicks * 10, 100)}%;
                        height:100%;
                        background:#6c7cff;
                        border-radius:10px;
                    "></div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
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
            loadGeo()
        ]);

        console.log("Analytics dashboard loaded");

    } catch (error) {

        console.error("Analytics dashboard error:", error);

    }
}


loadDashboard();