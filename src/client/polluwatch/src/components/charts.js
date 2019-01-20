import React from 'react';
import ResponsiveContainer from 'recharts/lib/component/ResponsiveContainer';
import LineChart from 'recharts/lib/chart/LineChart';
import Line from 'recharts/lib/cartesian/Line';
import XAxis from 'recharts/lib/cartesian/XAxis';
import YAxis from 'recharts/lib/cartesian/YAxis';
import CartesianGrid from 'recharts/lib/cartesian/CartesianGrid';
import Tooltip from 'recharts/lib/component/Tooltip';
import Legend from 'recharts/lib/component/Legend';

const data = [
  { name: 'Mon', Visits: 2200, Orders: 3400 },
  { name: 'Tue', Visits: 1280, Orders: 2398 },
  { name: 'Wed', Visits: 5000, Orders: 4300 },
  { name: 'Thu', Visits: 4780, Orders: 2908 },
  { name: 'Fri', Visits: 5890, Orders: 4800 },
  { name: 'Sat', Visits: 4390, Orders: 3800 },
  { name: 'Sun', Visits: 4490, Orders: 4300 },
];

function SimpleLineChart() {
  return (
    // 99% per https://github.com/recharts/recharts/issues/172
    <ResponsiveContainer width="99%" height={320}>
      <LineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="weight" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}

class HistoryChart extends React.Component {
  state = {
    data: []
  }

  componentDidMount () {
    this.refresh()
    this.setState({
      intervalRefresh: setInterval(this.refresh, 5000)
    })
  }

  componentWillUnmount () {
    this.state.intervalRefresh != null && clearInterval(this.state.intervalRefresh)
  }

  refresh = () => {
    this.props.loadSensorHistory(this.props.position.lat, this.props.position.lng, this.updateChart)
  }

  updateChart = (sensorHistory) => {
    const currentDate = (new Date()).getTime()
    const data = sensorHistory.map(s => ({
      name: `${s.timestamp - currentDate}`,
      weight: s.weight
    }))
    this.setState({data})
  }

  render () {
    return <SimpleLineChart data={this.state.data} />
  }
}

export default HistoryChart;