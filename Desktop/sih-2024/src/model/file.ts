import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
    Documenttype: { type: String, required: true },
    Name: { type: String, required: true },
    startdate: { type: Date },
    enddate: { type: Date },
    uploadfile: { type: String, required: true },
    hash: { type: String }  // Make sure this field is of type String
});


const userschema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    superuser: Boolean,
});

// Check if the model already exists before compiling it
export const File = mongoose.models.File || mongoose.model("File", FileSchema);
export const User = mongoose.models.User || mongoose.model("User", userschema);


