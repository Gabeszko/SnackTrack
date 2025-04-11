const Home: React.FC = () => {
  const stats = [
    { title: 'Összes termék', value: 124, color: 'bg-primary-200' },
    { title: 'Aktív automaták', value: 8, color: 'bg-primary-300' },
    { title: 'Mai eladások', value: '312 db', color: 'bg-primary-400' },
    { title: 'Napi bevétel', value: '45 200 Ft', color: 'bg-primary-500' },
  ]

  return (
    <div>
      <h2 className="text-3xl font-bold text-primary-400 mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`rounded-2xl p-6 shadow-md text-white ${stat.color} transition-transform hover:scale-[1.02]`}
          >
            <h3 className="text-lg font-semibold">{stat.title}</h3>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
