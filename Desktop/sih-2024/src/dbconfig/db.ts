
import mongoose from 'mongoose';

const dbconnect = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    return mongoose.connect("mongodb+srv://rahulbhaihero9:oi0QG0k5RFG1Cqo1@cluster0.iglgh.mongodb.net/verify?retryWrites=true&w=majority&appName=Cluster0", {
        //@ts-ignore
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

export { dbconnect };
