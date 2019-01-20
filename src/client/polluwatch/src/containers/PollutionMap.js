import React from "react"
import { axios, handleRequestError } from '../utils'


export default class PollutionMap extends React.Component {
    state = {
        sensorsData: [],
        comments: {},
        status: 'loading',
        radius: 100
    }

    componentDidMount () {
        const reload = () => {
            this.loadSensorsData(() => {
                this.setState({status: 'done'})
            })
        }
        this.loadSensorsData(() => {
            const intervalId = setInterval(reload, 10000)
            this.setState({status: 'done', intervalRefresh: intervalId})
        })
    }

    componentWillUnmount () {
        this.state.intervalRefresh && clearInterval(this.state.intervalRefresh)
    }
    
    onStartLoading () {
        this.props.onStartLoading && this.props.onStartLoading()
    }

    onEndLoading () {
        this.props.onEndLoading && this.props.onEndLoading()
    }

    loadSensorsData = (callbackOk) => {
        const MAX_LENGTH = 500
        this.onStartLoading()
        axios.get('sensors', {params: {}})
        .then((res) => {
            console.log('Data received:', res.data)
            const receivedData = res.data
            if (!receivedData.length) {
                console.log('No readings found')
                return;
            }
            this.setState((state) => {
                const sensorsData = [...state.sensorsData, ...receivedData]
                const maxWeight = sensorsData.reduce((max, s) => s.gas_resistance > max ? s.gas_resistance : max, 0)
                const limite = sensorsData.length > MAX_LENGTH ? MAX_LENGTH : sensorsData.length;
                let uniques = sensorsData.slice(- limite + 1)
                for (let i = 0; i < limite; ++i) {
                    let item = uniques[i]
                    if (!item) continue
                    for (let j=i+1; j < limite; ++j) {
                        let s = uniques[j]
                        if (!s) continue
                        if (s.latitude === item.latitude && s.longitude === item.longitude) {
                            uniques[j] = null
                        }
                    }
                }
                uniques = uniques.filter(s => !!s)
                console.log('Unique readings:', uniques)
                this.onEndLoading()
                return {sensorsData: uniques, maxReading: maxWeight}
            }, callbackOk)
        }).catch(handleRequestError)
    }

    loadSensorHistory = (lat, lng, callbackOk) => {
        const MAX_LENGTH = 500
        this.onStartLoading()
        axios.get('sensors', {params: {}})
        .then((res) => {
            console.log('Data received:', res.data)
            const receivedData = res.data
            if (!receivedData.length) {
                console.log('No readings found')
                return;
            }
            const sensorsData = receivedData
            const maxWeight = sensorsData.reduce((max, s) => s.gas_resistance > max ? s.gas_resistance : max, 0)
            const limite = sensorsData.length > MAX_LENGTH ? MAX_LENGTH : sensorsData.length;
            const history = sensorsData.filter(s => s.latitude === lat && s.longitude === lng)
            history.sort((a, b) => a.timestamp - b.timestamp).slice(- limite + 1)
            console.log('History readings:', history)
            this.onEndLoading()
            callbackOk && callbackOk(history)
        }).catch(handleRequestError)
    }

    loadCommentsData = () => {
        axios.get('comment', {params: {}})
        .then((res) => {
            console.log('Data received:', res.data)
            const receivedData = res.data
            if (!receivedData.length) {
                console.log('No comments found')
                return;
            }
            const messages = receivedData.reduce((comments, c) => {
                const key = `${c.latitude} ${c.longitude}`
                return {
                    ...comments,
                    [key]: [
                        ...((comments[key] && comments[key].length) ? comments[key] : []),
                        c
                    ]
                }
            }, {})
            console.log('Comments:', messages)
            this.setState({comments: messages})
        })
        .catch(handleRequestError)
    }
    
    getComments () {
        return {
            comments: this.state.comments
        }
    }
    
    compWeight (s) {
        return this.state.maxReading ? Math.trunc(s.gas_resistance / this.state.maxReading * 10000) / 100 : s.gas_resistance
    }

    getMapData () {
        const data = this.state.sensorsData.map((s) => ({lat: s.latitude, lng: s.longitude, weight: this.compWeight(s)}))
        console.log('Data pollution', data)
        return {
            getData: () => data,
            data,
            getOptions: this.getMapOptions,
            options: this.getMapOptions({ defaultZoom: 15 }),
            setMap: this.setMap,
            loading: this.state.status === 'loading',
            onZoomChanged: this.setRadius,
            onMarkerClick: this.loadCommentsData,
            loadSensorHistory: this.loadSensorHistory
        }
    }

    getMapOptions = ({ defaultZoom }) => {
        console.log('Map object:', this.gmap)
        return { radius: this.state.radius < defaultZoom ? this.state.radius : defaultZoom,
            maxIntensity: 100
         }
    }

    setMap = (googleMap) => {
        this.gmap = googleMap
    }

    setRadius = () => {
        this.gmap && this.setState({radius: this.gmap.getZoom()})
    }

    render () {
        return this.props.render({...this.getMapData(), ...this.getComments()})
    }
}
