import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { time: '00:00', heartRate: 68, bloodPressure: 115 },
  { time: '04:00', heartRate: 65, bloodPressure: 112 },
  { time: '08:00', heartRate: 72, bloodPressure: 118 },
  { time: '12:00', heartRate: 75, bloodPressure: 120 },
  { time: '16:00', heartRate: 74, bloodPressure: 118 },
  { time: '20:00', heartRate: 70, bloodPressure: 115 },
];

export function HealthChart() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900">Health Trends</h3>
      <div className="mt-6 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="heartRate"
              stroke="#e11d48"
              name="Heart Rate"
            />
            <Line
              type="monotone"
              dataKey="bloodPressure"
              stroke="#2563eb"
              name="Blood Pressure"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}