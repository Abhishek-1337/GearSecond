import mongoose from "mongoose";

const contentSchema = new mongoose.Model({
    link: { 
        type: String,
        required: true
    },
    type: {
        enum: {
            values: ['document', 'tweet', "youtube", "link"], 
            message: '{Value} is not supported'
        },
        required: true
    },
    title: {
        type: String,
        required: true
    },
    tags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tags'
        }
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    }

});

const Content = mongoose.model('Content', contentSchema);
export default Content;