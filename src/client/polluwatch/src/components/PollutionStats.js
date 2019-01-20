import React from 'react'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { axios, handleRequestError} from '../utils'

const POOR = {"PM2.5": "25", "O3": "180", "SO2": "170", "CO": "7000", "NO2": "40", "AQI": "150"}
const FAIR = {"PM2.5": "10", "O3": "100", "SO2": "50", "CO": "1000", "NO2": "20", "AQI": "50"}

export default class PollutionStats extends React.Component {
  state = {
    stats: {}
  }
  
  componentDidMount () {
    this.loadStats()
  }

  onStartLoading () {
      this.props.onStartLoading && this.props.onStartLoading()
  }

  onEndLoading () {
      this.props.onEndLoading && this.props.onEndLoading()
  }

  loadStats () {
    this.onStartLoading()
    axios.get('stats', {params: {}})
      .then((res) => {
          console.log('Data received:', res.data)
          const receivedData = res.data
          if (!Object.keys(receivedData).length) {
              console.log('No stats found')
              return;
          }
          this.setState((state) => ({stats: receivedData}))
          this.onEndLoading()
      })
      .catch(handleRequestError)
  }

  render () {
    const { stats } = this.state
    const { classes } = this.props
    return <div>
      <Grid container spacing={24}>
        {React.Children.toArray(Object.keys(stats).map((name) => <Grid item sm={6} md={4}>
          <Card style={{margin: 12}}>
          <CardContent >
             <Typography color="textSecondary" gutterBottom>
               {name}
             </Typography>
             <Grid>
               <Typography variant="h1" color="primary">
                {stats[name]}
               </Typography>
               {parseFloat(stats[name]) > POOR[name] ?
                  <Typography color="error">Poor</Typography>
                  : parseFloat(stats[name]) > FAIR[name] ?
                  <Typography> <span style={{color: 'orange'}}>Fair</span></Typography>
                  : <Typography> <span style={{color: 'green'}}>Good</span></Typography>}
             </Grid>
          </CardContent>
        </Card>
        </Grid>
        ))}
      </Grid>
    </div>
  }
}

PollutionStats.defaultProps = {
  classes: {}
}
