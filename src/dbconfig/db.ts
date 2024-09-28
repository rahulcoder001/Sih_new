import mongoose from 'mongoose';

const dbconnect = async () => {
    // Check if a connection is already established
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    // Establish a new connection if none exists
    return mongoose.connect("mongodb+srv://rahulbhaihero9:oi0QG0k5RFG1Cqo1@cluster0.iglgh.mongodb.net/verify?retryWrites=true&w=majority&appName=Cluster0", {
        //@ts-ignore
        useNewUrlParser: true,     
        useUnifiedTopology: true,
    });
};

export { dbconnect };
