import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = {
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0
    },
    loadingElement: {
        position: 'relative',
        margin: '0 auto'
    }
}

const Loading = ({loading, color, style}) => {
    style = style || {}
    return loading && <div style={{...styles.loadingContainer, ...style}}>
        <CircularProgress color={color} style={styles.loadingElement} />
    </div>
}

export default Loading
