import User from "../models/user.model.js";

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, contactNumber, occupation, location, adress, avatar } = req.body;
  try {
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      contactNumber,
      occupation,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error in registering user" });
  }
};