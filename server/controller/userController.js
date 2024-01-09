const User = require('../model/UserModel.js');
const bcrypt = require("bcrypt");
const cloudinary = require('../utils/cloudinary.js');
const jwt = require("jsonwebtoken");
const ProfilePicModel = require('../model/ProfilePicModel.js');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log(username, " ", password);

    // CHECKING IF THE USER ALREADY EXISTS
    let existingUser;
    try {
      existingUser = await User.findOne({ username });
    } catch (error) {
      console.log(error.message);
    }

    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // CHECKING IF THE PASSWORD IS CORRECT
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // CREATING A TOKEN
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "2h",
    });

    res.cookie("yourTokenCookieName", token, {
      path: "/",
      expiresIn: new Date(Date.now() + 1000 * 30),
      httpOnly: true,
      sameSite: "lax",
    });
    

    console.log(username, " ", password);
    return res.status(200).json({ message: "Successfully logged in" });
  } catch (error) {
    console.error("An error occurred during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


exports.register = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      
      console.log(username, email, password);
  
    
      const userWithEmail = await User.findOne({ email });
      if (userWithEmail) {
        return res.status(400).json({ msg: "Email already used", status: false });
      }
  
     
      const userWithUsername = await User.findOne({ username });
      if (userWithUsername) {
        return res.status(400).json({ msg: "Username already used", status: false });
      }
  
    
      const hashedPassword = await bcrypt.hash(password, 10);
  
     
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });
  
     
      res.status(200).json({ msg: "Registration successful", status: true, user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Internal server error", status: false });
    }
  };
  
  exports.uploadCloudinary = async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
     
      // console.log(result.url);

      const username = req.body.username;
      
      const newPic = await ProfilePicModel.create({username:username,ImageUrl:result.url});


      res.status(200).json({
        success: true,
        message: 'Profile picture uploaded to Cloudinary',
        imageUrl: result.url,
      });
            

    } catch (error) {
      console.error('Error during Cloudinary upload:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

  exports.getUser = async (req, res) => {
    const userId = req.id;
  
    try {
      const user = await User.findById(userId, "-password");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      return res.status(200).json({user});
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: "Internal Server Error" });   // LINE -> 139 
    }
  };

  exports.fetchUrl = async (req, res) => {
    const username = req.body.username;
    // console.log(username);

    try {
        const profile = await ProfilePicModel.findOne({ username: username });

        if (profile) {
            const url = profile.ImageUrl;
            // Send the url in the response
            res.status(200).json({ url: url });
        } else {
            console.log("Profile not found");
            // Send a 404 status code with an error message
            res.status(404).json({ error: "Profile not found" });
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
        // Send a 500 status code with an error message
        res.status(500).json({ error: "Internal Server Error" });
    }
}
