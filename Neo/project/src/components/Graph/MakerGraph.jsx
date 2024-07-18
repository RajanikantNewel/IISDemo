import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MakerLineChart = ({ graphData = [] }) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (graphData.length > 0) {
      const labels = graphData.map((data) => data.month);
      const disputedFromChecker = graphData.map((data) => parseFloat(data.disputedFromChecker) / 100000); // Convert to Lakhs
      const disputedFromAccountsTeam = graphData.map((data) => parseFloat(data.disputedFromAccount) / 100000); // Convert to Lakhs

      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Disputed from Checker",
            data: disputedFromChecker,
            borderColor: "#429cb6",
            backgroundColor: "#429cb6",
            fill: false,
            tension: 0.3,
          },
          {
            label: "Disputed from Accounts Team",
            data: disputedFromAccountsTeam,
            borderColor: "red",
            backgroundColor: "red",
            fill: false,
            tension: 0.3,
          },
        ],
      });
    }
  }, [graphData]);

  return (
    <div>
      {chartData.labels ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Months",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Total Amount (in Lakhs)",
                },
                beginAtZero: true,
              },
            },
          }}
        />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default MakerLineChart;
