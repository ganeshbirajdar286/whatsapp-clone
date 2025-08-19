import { uploadFileToCloudinary } from "../config/cloudinary.config";
import Conversation from "../models/conversation.model";
import response from "../utils/responseHandle";
import Message from "../models/messages.model";

export const sendMessage = async (req, res) => {
    try {
        const { sender, receiver, content, messageStatus } = req.body;
        const file = req.file;
        const participants = [sender, receiver].sort();
        //check converstion already exits
        let conversation = await Conversation.findOne({ participants });
        if (!conversation) {
            conversation = new Conversation({
                participants,
            })
            await conversation.save();
        }
        let imageOrVideoUrl = null;
        let contentType = null;

        //handle file upload
        if (file) {
            const uploadfile = await uploadFileToCloudinary(file.path);
            if (!uploadfile?.secure_url) {
                return response(res, 400, "Failed to upload media");
            }
                imageOrVideoUrl = uploadfile?.secure_url;
            if (file.mimetype.startwith("image")) {
                contentType = "image"
            } else if (file.mimetype.startwith("video")) {
                contentType = "video"
            } else {
                return response(res, 400, "Unsupported file type")
            } 
        } else if (contentType?.trim()) {
            contentType = "text"
        } else {
            return response(res, 400, "Message contain in required");
        }
    const message= new Message({
        conversation:conversation?._id,
        sender,
        receiver,
        content,
        imageOrVideoUrl,
        contentType,
        messageStatus
    })
    await message.save();
   if(message?.content){
       conversation.lastMessage=message?.id;
   }
   conversation.unreadCount+=1;
   await conversation.save();

   const populateMessage =await Message.findOne(message?._id)
   .populate("sender","username profilePicture")
   .populate("receiver","username profilePicture");

   return response(res,200,"Message send succesfully!",populateMessage);
    } catch (error) {
       console.error(error);
    return response(res, 500, "Internal server error");
    }
}