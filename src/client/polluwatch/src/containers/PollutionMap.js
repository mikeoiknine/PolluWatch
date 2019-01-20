import React from "react"
import { axios, handleRequestError } from '../utils'


class PollutionMap extends React.Component {
    state = {
        sensorsData: []
    }

    loadSensorsData = () => {
        axios.get('sensors', {params: {}})
        .then((res) => {
            console.log('Data received:', res.data)
            if (!res.data.sensors) {
                console.log('No readings found')
                return;
            }
            this.setState((state) => {
                const updatedData = {sensorsData: [...state.sensorsData, res.data.sensors]}
                const duplicates = []
                for (let i = 0; i < updatedData.sensorsData.length; ++i) {
                    const item = updatedData.sensorsData[i]
                    duplicate = updatedData.sensorsData.slice(i).find(s => s.latitude === item.latitude && s.longitude === item.longitude)
                    while (duplicate > -1) {
                        duplicates.push(updatedData.sensorsData[i])
                    }
                }
                const uniques = duplicates.reduce((uniques, dup) => {
                    uniques.splice(uniques.find(dup))
                    return uniques
                })
                console.log('Uniques readings:', uniques)
                return {sensorsData: uniques}
            })
        }).catch(handleRequestError)
    }
    
    getMapData () {
        return {
            data: this.state.sensorsData.map((s) => makeWeightedLocation(s.latitude, s.longitude, s.gas_resistance))
        }
    }

    render () {
        return this.props.render(this.getMapData())
    }
}
