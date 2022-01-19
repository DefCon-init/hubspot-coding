const axios = require('axios').default;

const client = axios.create({
    baseURL: `${process.env.BASE_URL}`
})

client.interceptors.response.use(
    (response) => response.data,
    async (err) => {
        if (err.response) {
            return Promise.reject(err.response.data)
        }

        if (err.request) {
            return Promise.reject(new APIError(500, 'NETWORK_ERROR'))
        }

        return Promise.reject(err)
    },
)

module.exports = client