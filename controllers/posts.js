import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    console.log("creando post...");
    const { userId, description, picturePath } = req.body;
    //log de userId, description y picturePath
    console.log("userId ", userId);
    console.log("description ", description);
    console.log("picturePath ", picturePath);

    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });

    console.log("newPost ", newPost);
    await newPost.save();
    console.log("post creado");

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

//Obtener los likes de un post
export const getCountLikes = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    const countLikes = post.likes.size;
    res.status(200).json({ countLikes });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

//obtener los likes de un post
export const checkPostLike = async (req, res) => {
  try {
    const { id } = req.params;
    const idUser = req.user.id;
    const post = await Post.findById(id);
  
    const idPost = post._id.toString();
    console.log("idUser ", idUser);
    console.log("idPost ", idPost);

    // Obtener el valor booleano asociado con la clave específica
    const likePost = post.likes.get(idUser) || false;

    console.log("likePost ", likePost);
    
    res.status(200).json({ isLiked: likePost }); // Devolver solo el valor booleano
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};



export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
