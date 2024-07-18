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

const LineChart = ({ graphData = [] }) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (graphData.length > 0) {
      const fundNames = graphData.map((data) => data.fundName || data.month);
      const totalAmounts = graphData.map(
        (data) => parseFloat(data.totalAmount || data.totalDisputedAmount || data.totalPendingAmount || data.totalApprovedAmount) / 100000
      ); // Convert to Lakhs

      setChartData({
        labels: fundNames,
        datasets: [
          {
            label: graphData[0].fundName
              ? "Total Commitment (in Lakhs)"
              : graphData[0].totalDisputedAmount
              ? "Disputed Amount (in Lakhs)"
              : graphData[0].totalPendingAmount ? 
              
              "Pending Amount (in Lakhs)" :
              graphData[0].totalApprovedAmount ? "Approved Amount (in Lakhs)" : "Amount Paid (in Lakhs)",
            data: totalAmounts ,
            borderColor: graphData[0].fundName
              ? "#eb5e28"
              : graphData[0].totalDisputedAmount
              ? "red"
              :graphData[0].totalApprovedAmount ? "#7ac29a" : "#429cb6",
            backgroundColor: graphData[0].fundName
              ? "#eb5e28"
              : graphData[0].totalDisputedAmount
              ? "red"
              :graphData[0].totalApprovedAmount ? "#7ac29a" : "#429cb6",
            fill: true,
            tension: 0.3,
            font: {
              family: "Helvetica, Arial, sans-serif !important",
              size: 19,
              style: "normal",
              lineHeight: 1.2,
              weight: "normal",
            },
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
                  text: graphData[0].fundName ? "Fund Names" : "Months",
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

export default LineChart;
