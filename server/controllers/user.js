import { createError } from "../error.js"
import User from "../models/User.js"
import Video from "../models/Video.js";

export const update = async(req,res,next) => {

    if(req.params.id === req.user.user._id){
        
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                  $set: req.body,
                },
                { new: true }
              );
            
            res.status(200).json(updatedUser)
        } catch (error) {
            next(error)
        }
    }else{
        return next(createError(403, "You can update only your account!"))
    }
}

export const deleteUser = async(req,res,next) => {
    if(req.params.id === req.user.user._id){
        
        try {
            await User.findByIdAndDelete(
                req.params.id,
              );
            
            res.status(200).json("User has been deleted")
        } catch (error) {
            next(error)
        }
    }else{
        return next(createError(403, "You can delete only your account!"))
    }
}

export const getUser = async(req,res,next) => {
    try {
       const user = await User.findById(req.params.id) 
       res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

// export const subscribe = async(req,res,next) => {
//     try {
//         await User.findByIdAndUpdate(req.user.user._id,{
//             $push:{subscribedUsers:req.params.id}
//         })
//         await User.findByIdAndUpdate(req.params.id,{
//             $inc:{subscribers: 1},
//         })
//         res.status(200).json("Subscription successfull.")
//     } catch (error) {
//         next(error)
//     }
// }

export const subscribe = async(req, res, next) => {
  try {
    const userId = req.user.user._id;
    const channelId = req.params.id;
    // console.log(channelId);
    const user = await User.findById(userId);
    if(user.subscribedUsers.includes(channelId)) {
      return res.status(400).json({message: "Ya estás suscrito a este canal."})
    }

    await User.findByIdAndUpdate(userId, {
      $push: { subscribedUsers: channelId }
    });

    
    await User.findByIdAndUpdate(channelId, {
      $inc: { subscribers: 1 }
    });

    res.status(200).json("Suscrito con éxito.");
  } catch (error) {
    console.log(error);
    next(error)
  }
}



// export const unSubscribe = async(req,res,next) => {
  
//     try {
//         await User.findByIdAndUpdate(req.user.user._id,{
//             $pull:{subscribedUsers: req.params.id}
//         })
//         await User.findByIdAndUpdate(req.params.id,{
//             $inc:{subscribers: -1},
//         })
//         res.status(200).json("Unsubscription successfull.")
        
//     } catch (error) {
//         next(error)
//     }
// }

export const unSubscribe = async(req,res,next) => {
  try {
    const userId = req. user.user._id;
    const channelId = req.params.id;
    
    const user = await User.findById(userId);
    if(!user.subscribedUsers.includes(channelId)){
      return res.status(400).json({message: "No estas suscrito a este canal."})
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { subscribedUsers: channelId }
    });

    await User.findByIdAndUpdate(channelId, {
      $inc: { subscribers: -1 }
    });

    res.status(200).json("Desuscrito con éxito.");
  } catch (error) {
    console.log(error);
    next(error)
  }
}



export const like = async(req,res,next) => {
    const id = req.user.user._id
    const videoId = req.params.videoId 
    try {await Video.findByIdAndUpdate(videoId,{
        $addToSet:{likes:id},
        $pull:{dislikes:id}
    })
    res.status(200).json("The video has been liked.")
    } catch (error) {
        next(error)
    }
}

export const dislike = async (req, res, next) => {
    const id = req.user.user._id
    const videoId = req.params.videoId;
    try {
      await Video.findByIdAndUpdate(videoId,{
        $addToSet:{dislikes:id},
        $pull:{likes:id}
      })
      res.status(200).json("The video has been disliked.")
  } catch (err) {
    next(err);
  }
};


export const uploadProfileImage = async (req, res, next) => {
    try {
      // console.log("uploadProfileImage function called");

      if (req.params.id === req.user.user._id) {
        
        if (req.file) {
        
          const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
              $set: { img: req.file.filename }, 
            },
            { new: true }
          );
          
          res.status(200).json(updatedUser);
        } else {
          return next(createError(400, 'No se proporcionó una imagen válida.'));
        }
      } else {
        return next(createError(403, 'Solo puedes actualizar tu propia imagen de perfil.'));
      }
    } catch (error) {
      next(error);
    }
  };