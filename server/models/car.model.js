import mongoose from 'mongoose'

const carSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    make: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    condition: {
        type: String,
        enum: ['new', 'used'],
        required: true
    },
    bodyType: {
        type: String,
        enum: ['sedan', 'suv', 'truck', 'coupe', 'hatchback', 'van', 'convertible'],
        required: true
    },
    fuelType: {
        type: String,
        enum: ['petrol', 'diesel', 'electric', 'hybrid'],
        required: true
    },
    transmission: {
        type: String,
        enum: ['automatic', 'manual'],
        required: true
    },
    mileage: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    images: [
        {
            type: String
        }
    ],
    videoUrl: {
        type: String,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
        default: 1
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

const Car = mongoose.model('Car', carSchema)

export default Car