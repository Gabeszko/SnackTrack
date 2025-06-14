import StatisticsDashboard from "../components/StatisticsDashboard/StatisticsDashboard";

const Stats: React.FC = () => {
  return (
    <div className="bg-blue-400/20 px-15 pb-10">
      <div className="bg-white rounded-lg p-4">
        <StatisticsDashboard />
      </div>
    </div>
  );
};

export default Stats;
