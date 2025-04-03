const mongoose = require('mongoose')

module.exports = {
    connectMongoDB: function (mongoURI){
        mongoose.connect(mongoURI,{
            useNewUrlParser: true,
            useUnifiedTopology: true
          })
          .then(() => {
            console.log('MongoDB connected');
          })
          .catch(err => console.error(err));
    }
}

