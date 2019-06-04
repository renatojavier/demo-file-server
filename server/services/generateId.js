const randtoken = require('rand-token')

const generateId = type => {
    const token = randtoken.generate(16)
    let id = null

    type = type === 'video' ? 'vd-' : 'tm-'

    id = `${type}${token}`

    return id
}

module.exports = generateId
