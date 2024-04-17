const { hashPassword: hashPwd, comparePassword } = require("../helper/auth");
const User = require("../models/user");
var jwt = require('jsonwebtoken');
var randomString = require('random-string');
const cloudinary = require("cloudinary")


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const register = async (req, res) => {
    // console.log("register",req.body)
    const { name, email, password ,about } = req.body;
    // console.log(req.body);
    if (!name) return res.status(400).send("Name is required")
    if (!email) return res.status(400).send("Email is required")
    if (!password || password.length < 6) return res.status(400).send("Password is required")

    const exist = await User.findOne({ email });
    if (exist) {
        return res.status(400).send("Email exist login to continue")
    }

    const hashPassword = await hashPwd(password);

    const newUser = new User({ name, email,about, password: hashPassword })
    try {
        await newUser.save()
        // console.log("register success",newUser)
        return res.json({ ok: true })
    } catch (err) {
        console.log(err)
        return res.status(400).send("Try Again")
    }

};

//login
const login = async (req, res) => {
    // console.log("login")
    try {
        const { email, password } = req.body;
        //check is our database has user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send("User doesn't exists!")

        //check password
        console.log(user.password, "password");
        const match = await comparePassword(password, user.password)
        if (!match) return res.status(400).send("Incorrect password")
        //create signed token
        const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        user.password = undefined;
        res.json({
            token,
            user,
        })

    } catch (error) {
        console.log("error while login", error);
        return res.status(400).send("Something went wrong!")
    }
}

const currentUser = async (req, res) => {
    // console.log(req.user);
    console.log("current user called")
    try {
        const user = await User.findById(req.user);
        // console.log(user);
        res.json({ ok: "true" })
    } catch (error) {
        console.log("Error while verifying token=>", error);
        res.sendStatus(400);
    }
}

const getUserData = async(req,res) => {
    try {
        const user = await User.findById(req.user).select({ password: 0, email: 0 });
        res.json({user});
    } catch (error) {
        res.sendStatus(400);
    }
} 

//get single user details
const UserDetail = async(req,res)=>{
    console.log("userdetail")
    try {
        const user = await User.findById(req.params.id).select({ password: 0, email: 0 });
        console.log(user); // Log the user data to check if it's retrieved successfully
        res.json(user); // Send the user data in the response
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' }); // Send an error response
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    // console.log(req.body.email)
    const user = await User.findOne({ email })
    if (user) {
        const resetToken = randomString({
            length: 16,
            numeric: true,
            letters: true,
            special: false,
            exclude: ['a', 'b', '1', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', '2']
        });

        await user.updateOne({ _id: user.id }, { $set: { resetToken: resetToken } })
            .then(result => {
                // console.log('Reset token updated successfully:', result);
                res.status(200).send("Reset password link send to your email")
            })
            .catch(error => {
                res.send("something went wrong!")
            });
        console.log("found", resetToken, user)
    } else {
        res.status(200).send("Reset password link send to your email")
    }
}

//for updatin user profile
const profileUpdate = async (req, res) => {
    //req.user gettinf id from
    // console.log(req.user._id,req.body);

    try {
        const data = {};
        if (req.body.name) {
            data.name = req.body.name
        }
        if (req.body.email) {
            data.email = req.body.email
        }
        if (req.body.about) {
            data.about = req.body.about;
        }
        if (req.body.password) {
            if (req.body.password < 6) {
                return res.json({ error: "Password is required and should be minimun 6 character long" });
            } else {
                data.password = req.body.password;
            }
        }
        // console.log(data);
        let user = await User.findByIdAndUpdate(req.user._id, data, { new: true });
        user.password = undefined;
        // console.log(user)
        res.json(user);
    } catch (error) {
        if (error.code == 11000) {
            return res.json({ error: "duplicate username" });
        }
    }
}

const profileImage = async (req, res) => {
    // const result = await cloudinar
    try {
        console.log(req.files);

        const result = await cloudinary.uploader.upload(req.files.images.path);
        //extracting image url and public Id
        const imageUrl = result.secure_url;
        const imagePublicId = result.public_id;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        //update user profile with the image data
        user.photo = imageUrl;
        await user.save();

        console.log(user);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }

}

//find people
const findPeople = async (req, res) => {
    console.log("find")
    try {
        const user = await User.findById(req.user._id);
        //string database data user following in following 
        console.log(user);
        let following = user.following;
        following.push(user._id);
        //get information of all other user except following array
        //nin not include
        const people = await User.find({ _id: { $nin: following } }).select('-password').limit(10);
        res.json(people);
        // console.log(people,"pppppppp")
    } catch (error) {

    }
}

//middleware userfollow
const addFollower = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.body._id, {
            $addToSet: { followers: req.user._id }
        });
        next();
    } catch (error) {
        console.log(error);
    }
}

const userFollow = async (req, res) => {
    try {
        //addToSet: unique only added once
        console.log(req.body._id,"follow");
        const user = await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { following: req.body._id }
        },{ new: true });
        await User.findByIdAndUpdate(req.body._id, {
            $addToSet: { Followers: req.user._id }
        }, { new: true });
        res.json(user);
    } catch (error) {
        console.log(error);
    }
}

const allFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const following = await User.find({ _id: user.following }).limit(50);
        res.json(following);
    } catch (error) {
        console.log(error);
    }
}
const allFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const followers = await User.find({ _id: user.Followers }).limit(50);
        res.json(followers);
    } catch (error) {
        console.log(error);
    }
}

const removeFollower = async (req, res, next) => {
    try {
        const user = User.findByIdAndUpdate(req.user._id,
            { $pull: { follower: req.user._id } });
        next();
    } catch (error) {
        console.log(error)
    }
}

const userUnfollow = async (req, res) => {
    // console.log("reomve")
    try {
        const user = await User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body._id }
        }, { new: true });

        await User.findByIdAndUpdate(req.body._id, {
            $pull: { Followers: req.user._id }
        }, { new: true });

        res.json(user);
    } catch (error) {
        console.log(error);
    }
}

const resetPassword = async(req,res)=>{
    // console.log(req.body,req.user);
    const id = req.user._id;
    const {currentpassword,newpassword,confirmpassword} = req.body;
    if(!currentpassword || !newpassword || !confirmpassword) return res.status(400).send("Value required");
    if(newpassword !== confirmpassword) return res.status(400).send("Password not match");
    if(newpassword.length < 6) return res.status(400).send("Password must be greater");
    const user = await User.findById(req.user);
    const match = await comparePassword(currentpassword, user.password)
    if(match){
        const hashPassword = await hashPwd(newpassword);
        await user.updateOne({ _id: user.id }, { $set: { password: newpassword } })
            .then(result => {
                // console.log('Reset token updated successfully:', result);
                res.status(200).send("Password changed")
            })
            .catch(error => {
                res.send("something went wrong!")
            });
    }else{
        return res.status(400).send("Old Password is incorrect!");
    }
    // res.json({user:user});
}

module.exports = {
    register, login, currentUser, UserDetail, forgotPassword, profileUpdate, profileImage, findPeople, userFollow,
    addFollower, allFollowing, userUnfollow, removeFollower,resetPassword,getUserData,allFollowers
};