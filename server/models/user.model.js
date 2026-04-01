import mongoose from 'mongoose'
import bcrypt from  'bcryptjs'
 
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email : {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password:{
        type: String,
        minlength: 6
    },
    googleId: {
        type: String,
    },
    role: {
        type: String, 
        enum: ['customer','admin'],
        default : 'customer'
    },
    savedCars :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Car'
        }
    ],
    viewedCars: [
        {
            car:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Car'
            },
            viewedAt: {
                type: Date,
                default:Date.now
            }
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})
userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) {
        return
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}
const User = mongoose.model('User', userSchema)
export default User