import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Statistics({ data }) {
  const validData = Array.isArray(data) ? data.filter(d => d && d.price !== undefined) : [];

  const priceData = {
    labels: validData.map(d => d.address || 'Unknown'),
    datasets: [{
      label: 'Price',
      data: validData.map(d => d.price || 0),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }]
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Price Distribution</h2>
      <Bar data={priceData} />
    </div>
  );
}