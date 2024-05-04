import InfoBox from "./components/InfoBox"
import {CurrencyExchange, BoxFill, CartFill, PersonFill, Box, Meta} from 'react-bootstrap-icons'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Card } from "@/components/ui";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);


const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({});

  const fetchDashboardData = async ()=>{
    const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/admin/dashboard', {
      method: 'GET',
      credentials: 'include'
    })

    const result = await response.json();
    console.log(result.data)
    setDashboardData(result.data);
  }

  useEffect(()=>{
    fetchDashboardData();
  }, [])

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Bar Chart',
      },
    },
  };

  const barChartData = {
    labels: ['January', 'February', 'March', 'April'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [650, 700, 400, 810],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const piData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <section>
        {/* Sale Infos */}
        <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-6">
          <InfoBox tag="Sales" title={"$" + dashboardData.totalSales} subTitle={<><span className="text-green-600 font-semibold">+33%</span> since last month</>} icon={<CurrencyExchange />} />
          <InfoBox tag="Orders" title={dashboardData.newOrders} subTitle={<><span className="text-red-600 font-semibold">-20%</span> since last month</>} icon={<CartFill />} />
          <InfoBox tag="Products" title={dashboardData.totalProducts} subTitle={"Your stock is good"} icon={<BoxFill />} />
          <InfoBox tag="New Customers" title={dashboardData.newCustomers} subTitle={"since last month"} icon={<PersonFill />} />
        </div>
      </section>

      <section className="mt-4">
        <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
          <div>
            <Card><Bar options={barChartOptions} data={barChartData} /></Card>
          </div>
          
          <div>
            <Card className="max-h-[500px] flex justify-center"><Pie data={piData} /></Card>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard