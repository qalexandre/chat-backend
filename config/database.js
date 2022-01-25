const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose
    .connect(
        "mongodb+srv://qalexandre:020517x%23@cluster0.7gjun.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => console.log("Connection successful"))
    .catch((err) => console.log(err));