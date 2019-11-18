const querystring = {
    parse: function() {
        let qs = window.location.search
        if (qs.startsWith('?')) qs = qs.slice(1)
        if (!qs) return {}
    
        let pieces = qs.split('&')
        return pieces.reduce((obj, piece) => {
            let [ key, val ] = piece.split('=')
            obj[key] = val
            return obj
        }, {})
    }
}

export default querystring