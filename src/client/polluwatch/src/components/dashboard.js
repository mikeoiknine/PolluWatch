import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import RefreshIcon from '@material-ui/icons/Refresh';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop'
import { MainListItems } from './listItems';
import SimpleLineChart from './charts';
import SimpleTable from './table';
import HeatMap from './heatmap';
import PollutionMap from '../containers/PollutionMap'
import PollutionStats from './PollutionStats'
import Loading from './loading'
import Charts from './charts'
import { InfoWindow, Marker } from "react-google-maps";


const drawerWidth = 241;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    /*padding: theme.spacing.unit * 3,*/
    height: '100vh',
    overflow: 'auto',
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 320,
  },
  h5: {
    marginBottom: theme.spacing.unit * 2,
  },
  mapContainer: {
    height: '100%'
  },
  statsContainer: {
    padding: theme.spacing.unit * 3
  },
  button: {
    margin: theme.spacing.unit
  },
  statsCard: {
    margin: theme.spacing.unit
  }
});

const Comments = ({comments, active, nextComment, classes, goToReading}) => {
  const comment = comments[active % comments.length]
  return <div className="comment">
    <Grid container justify="center" alignItems="center">
      {comment.picture ? <Avatar src={comment.picture} alt="" />
        : <Avatar>{comment.author.charAt(0)}</Avatar>}
      <h4>{comment.author} said:</h4>
    </Grid>
    
    <p>{comment.message}</p>
    <Button variant="contained" color="primary" className={classes.button} onClick={nextComment}>
      Next
    </Button>
  </div>
}

const StatCard = ({data, nextComment, classes}) => {
  return <div className="stat">
    <Typography color="textSecondary" gutterBottom>
     PolluWatch Data
   </Typography>
   <Typography variant="h4" color="primary">
    {data.weight}
   </Typography>
   <Button variant="contained" color="primary" className={classes.button} onClick={nextComment}>
      Comments
    </Button>
  </div>
}

class Dashboard extends React.Component {
  state = {
    open: true,
    activeLocation: null,
    activeComment: -1,
    loading: true,
    openSection: 'dashboard'
  };

  onStartLoading = () => {
    this.setState({ loading: true })
  }

  onEndLoading = () => {
    this.setState({ loading: false }) 
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };
  
  showMap = () => {
    this.setState({ openSection: 'map' })
  }

  showStats = () => {
    this.setState({ openSection: 'stats' })
  }

  hideStats = () => {
    this.setState({ openSection: 'map' })
  }

  showCharts = () => {
    this.setState({ openSection: 'charts' })
  }

  hideCharts = () => {
    this.setState({ openSection: 'map' })
  }

  isStatsOpen = () => {
    return this.state.openSection === 'stats'
  }

  isChartsOpen = () => {
    return this.state.openSection === 'charts'
  }

  setNextComment = () => {
    this.setState(state => ({activeComment: state.activeComment + 1}))
  }

  hideComments = () => {
    this.setState({activeLocation: null, activeComment: -1})
  }

  setActiveLocation = (position) => {
    this.setState({activeLocation: position})
    this.onMarkerClick && this.onMarkerClick()
  }
  
  renderCommentsMarkers (comments) {
    return React.Children.toArray(Object.keys(comments).map(locationKey => {
      const coords = locationKey.split(' ').map(s => parseFloat(s))
      const position = {lat: coords[0], lng: coords[1]}
      return <Marker position={position} onClick={() => this.setActiveLocation(position)} />
    }))
  }

  renderHeatMap = ({getData, getOptions, setMap, onZoomChanged, onMarkerClick, options, data, comments}) => {
    this.onMarkerClick = onMarkerClick
    const activeLocation = this.state.activeLocation
    const activeComment = this.state.activeComment
    
    const locationKey = activeLocation ? `${activeLocation.lat} ${activeLocation.lng}` : null
    console.log('Active Location', activeLocation)
    return <HeatMap
      getData={getData}
      getOptions={getOptions}
      options={options}
      data={data}
      setMap={setMap}
      onMarkerClick={this.setActiveLocation}
      onZoomChanged={onZoomChanged} >
      {comments[locationKey] && (activeLocation && 
        <InfoWindow position={activeLocation} onCloseClick={this.hideComments} >
          {activeComment > -1 ?
            <Comments classes={this.props.classes} comments={comments[locationKey]} active={activeComment} nextComment={this.setNextComment} />
            : <StatCard classes={this.props.classes} data={activeLocation} nextComment={this.setNextComment} />}
        </InfoWindow>) }
      {this.renderCommentsMarkers(comments)}
    </HeatMap>
  }

  renderCharts = ({loadSensorHistory}) => {
    return <Charts loadSensorHistory={loadSensorHistory} position={this.state.activeLocation} />
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
        >
          <Toolbar disableGutters={!this.state.open} className={classes.toolbar}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(
                classes.menuButton,
                this.state.open && classes.menuButtonHidden,
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              PolluWatch
            </Typography>
            <Loading loading={this.state.loading} color="secondary" style={{position: 'relative'}} />
            <IconButton color="inherit">
              <RefreshIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List><MainListItems actions={[this.showMap, this.showStats, this.state.activeLocation && this.showCharts]} /></List>
          {/*
          <Divider />
          <List>{secondaryListItems}</List>*/}
        </Drawer>
        <main className={classes.content}>
          {/*<Typography variant="h4" gutterBottom component="h2">
            Orders
          </Typography>
          <Typography component="div" className={classes.chartContainer}>
            <SimpleLineChart />
          </Typography>*/}
          {this.isStatsOpen() ?
            <div className={classes.statsContainer}>
              <div className={classes.appBarSpacer}></div>
              <Typography variant="h4" gutterBottom component="h2">
                City Air Quality
              </Typography>
              <PollutionStats
                onStartLoading={this.onStartLoading}
                onEndLoading={this.onEndLoading} />
            </div>
            : <div className={this.isChartsOpen() ? classes.statsContainer : classes.mapContainer}>
              {this.isChartsOpen() && <div className={classes.appBarSpacer}></div>}
                <PollutionMap
                  render={this.isChartsOpen() ? this.renderCharts : this.renderHeatMap}
                  classes={classes}
                  onStartLoading={this.onStartLoading}
                  onEndLoading={this.onEndLoading} />
              </div>}
          {!this.isChartsOpen() && this.state.loading && <Backdrop open={this.state.loading} />}
        </main>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);