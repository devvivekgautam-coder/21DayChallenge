window.onload = function () {
    renderChart();
    renderTable();
    showDate();
};

function renderChart() {
    const chart = document.getElementById("barChartContainer");
    const values = [40, 70, 45, 90, 65, 80, 95];

    values.forEach(function (val) {
        const bar = document.createElement("div");

        bar.className = "bar";
        bar.style.height = val + "%";
        bar.style.flex = "1";
        bar.style.borderRadius = "8px";

        chart.appendChild(bar);
    });
}

function renderTable() {
    const tbody = document.querySelector("#ordersTable tbody");

    const data = [
        { id: "#8821", name: "Alex M.", price: "$120", status: "Success" },
        { id: "#8822", name: "Sara P.", price: "$450", status: "Pending" }
    ];

    data.forEach(function (item) {
        const statusClass = item.status === "Success" ? "success" : "";

        const row = `
      <tr>
        <td data-label="ID">${item.id}</td>
        <td data-label="Customer">${item.name}</td>
        <td data-label="Amount">${item.price}</td>
        <td data-label="Status">
          <span class="badge ${statusClass}">${item.status}</span>
        </td>
      </tr>
    `;

        tbody.innerHTML += row;
    });
}

function showDate() {
    const today = new Date();
    document.getElementById("liveDate").innerText = today.toLocaleDateString();
}