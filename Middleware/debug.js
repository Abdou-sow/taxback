const debug = (req, res, next) => {

    console.log("This message is from debug middleware");

    console.log(`The route is: ${req.originalUrl} and the method is ${req.method}`)
    
    next()
}

module.exports = { debug };