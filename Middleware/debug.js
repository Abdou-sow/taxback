const debug = (req, res, next) => {
    
    console.log("This message is from debug middleware");

    next()
}

module.exports =  debug;