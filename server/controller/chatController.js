const User = require('../model/UserModel.js');
const Message = require('../model/messageModel.js');
const ProfilePicModel = require('../model/ProfilePicModel.js');

exports.fetchOther = async (req, res) => {
  try {
     const usernameToExclude = req.body.username;
    //  console.log("hooooooo",usernameToExclude)
      const users = await User.find({username:{ $ne : usernameToExclude}});

      for (let i = 0; i < users.length; i++) {
          const username = users[i].username;
          const profilePic = await ProfilePicModel.findOne({ username: username });

          if (profilePic) {
              users[i] = { ...users[i]._doc, ImageUrl: profilePic.ImageUrl }; // Include existing properties of users[i]
          } else {
              users[i] = { ...users[i]._doc, ImageUrl: 'https://darrenjameseeley.files.wordpress.com/2014/09/expendables3.jpeg'};
          }
      }
      // console.log("yha hain sb -> ", users);
      res.status(200).json(users);
  } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};



exports.getmsg = async (req, res) => {
    try {
        const { from, to } = req.body;
        // console.log("fhygjuhiuhjukj",from,to);
        const messages = await Message.find({
          users: {
            $all: [from, to],
          },
        }).sort({ updatedAt: 1 });
    
        const projectedMessages = messages.map((msg) => {
          return {
            fromSelf: msg.sender.toString() === from,
            message: msg.message.text,
          };
        });
        res.json(projectedMessages);
      } catch (err) {
        console.log(err);
      }
};

exports.addmsg = async (req, res) => {
    try {
      const { from, to, message } = req.body;
    //   console.log(from,to,message);

      const data = await Message.create({
        message: { text: message },
        users: [from, to],
        sender: from,
      });
  
      if (data) {
        // console.log("done");
        return res.json({ msg: 'Message added successfully.' });
      } else {
        // console.log("failed");
        return res.json({ msg: 'Failed to add message to the database' });
      }
    } catch (ex) {
      res.status(400).json({msg:"can not add msg"});
    }
  };
  