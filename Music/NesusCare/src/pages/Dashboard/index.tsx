import { Activity, Heart, Thermometer, Clock, Wind, Droplets } from 'lucide-react';
import { HealthMetricsCard } from './components/HealthMetricsCard';
import { HealthChart } from './components/HealthChart';
import { EmergencyCallLog } from './components/EmergencyCallLog';
import { DeviceConnect } from './components/DeviceConnect';
import { Layout } from '../../components/layout/Layout';

export default function Dashboard() {
  return (
    <Layout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <DeviceConnect />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <HealthMetricsCard
          title="Heart Rate"
          value="72"
          unit="bpm"
          icon={Heart}
          trend="+2"
          color="rose"
        />
        <HealthMetricsCard
          title="Blood Pressure"
          value="120/80"
          unit="mmHg"
          icon={Activity}
          color="blue"
        />
        <HealthMetricsCard
          title="Temperature"
          value="36.6"
          unit="°C"
          icon={Thermometer}
          color="amber"
        />
        <HealthMetricsCard
          title="Sleep Quality"
          value="85"
          unit="%"
          icon={Clock}
          color="indigo"
        />
        <HealthMetricsCard
          title="Air Quality"
          value="Good"
          icon={Wind}
          color="emerald"
        />
        <HealthMetricsCard
          title="Humidity"
          value="45"
          unit="%"
          icon={Droplets}
          color="cyan"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <HealthChart />
        <EmergencyCallLog />
      </div>
    </div>
    </Layout>
  );
}