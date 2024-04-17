export const http = {
    request: function (options) {
        let requestOptions = Object.assign({
            method: 'get',
            url: null,
            param: {},
            data: {},
            headers: {}
        }, options)

        requestOptions.param = this.formatParams(requestOptions.param)
        const _url = requestOptions.url + `${requestOptions.param ? `?${requestOptions.param}` : ''}`

        let _data = requestOptions.data
        if (typeof _data === 'string') {
            requestOptions.headers['Content-type'] = 'text/plain;charset=utf-8'
            _data = requestOptions.data
        } else if (typeof requestOptions.data === 'object') {
            requestOptions.headers['Content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
            _data = requestOptions.data
        }

        let fetchOptions = {
            method: requestOptions.method,
            cache: 'default',
            credential: 'include',
            headers: requestOptions.headers,
            redirect: 'follow',
            referrerPolicy: 'strict-origin-when-cross-origin'
        }

        if (requestOptions.method.toUpperCase() !== 'GET' && requestOptions.method.toUpperCase() !== 'HEAD') {
            fetchOptions.body = _data
        }

        return fetch(_url, fetchOptions)
    },

    get: function (options) {
        options.method = 'GET'
        return this.request(options)
    },

    post: function (options) {
        options.method = 'POST'
        return this.request(options)
    },

    formatParams: data => {
        const arr = []
        for (let name in data) {
            arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]))
        }
        return arr.join('&')
    }
}
