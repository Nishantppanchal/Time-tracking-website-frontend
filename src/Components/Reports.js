import { PieChart, Pie, Tooltip } from 'recharts';
const data = [
  { name: 'test1', time: 10 },
  { name: 'test2', time: 20 },
  { name: 'test3', time: 30 },
  { name: 'test4', time: 40 },
  { name: 'test5', time: 10 },
  { name: 'test6', time: 50 },
];

function Reports() {
  function renderCustomizedLabel({ x, y, name, cx }) {
    return (
      <text x={x} y={y} fill='black' textAnchor={x > cx ? "start" : "end"} >
        {name}
      </text>
    );
  }

  return (
    <div>
      <h1>Reports</h1>
      <PieChart width={730} height={250}>
        <Pie
          data={data}
          dataKey='time'
          nameKey='name'
          cx='50%'
          cy='50%'
          outerRadius='100%%'
          fill='#8884d8'
          label={renderCustomizedLabel}
        />
        <Tooltip />
      </PieChart>
    </div>
  );
}

export default Reports;
