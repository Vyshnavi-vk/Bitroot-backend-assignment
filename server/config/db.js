const mongoose = require('mongoose')


const connectDB = async () => {
    try {
        const connnection = await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected successfully")
    } catch (error) {
        console.log(error)
        process.exit()
    }
}

module.exports = connectDB