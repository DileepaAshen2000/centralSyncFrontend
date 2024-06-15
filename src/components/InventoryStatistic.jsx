import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import axios from 'axios';

export default function InventoryStatistic() {
  const [stockInData, setStockInData] = useState([]);
  const [stockOutData, setStockOutData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonthlyStockData();
  }, []);

  const fetchMonthlyStockData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/stocks/monthly');
      const stockIn = Array(12).fill(0);
      const stockOut = Array(12).fill(0);

      response.data.stockIn.forEach(item => {
        stockIn[item.month - 1] = item.quantity;
      });

      response.data.stockOut.forEach(item => {
        stockOut[item.month - 1] = item.quantity;
      });

      setStockInData(stockIn);
      setStockOutData(stockOut);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching monthly stock data:', error);
    }
  };

  const xLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <LineChart
          width={700}
          height={300}
          series={[
            { data: stockInData, label: 'stock-in' },
            { data: stockOutData, label: 'stock-out' },
          ]}
          xAxis={[{ scaleType: 'point', data: xLabels }]}
          grid={{ vertical: true, horizontal: true }}
        />
      )}
    </div>
  );
}
