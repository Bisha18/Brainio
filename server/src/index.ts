import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// ✅ Corrected import paths to match flat file structure
import User from "./models/user.model.ts";
import connectDB from "./config/db.ts";
import userMiddlware from "./middleware/user.middleware.ts";
import Content from "./models/content.model.ts";
import Link from "./models/link.model.ts";
import { random } from "./config/utils.ts";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully" });
  } catch (error: any) {
    // ✅ Improved error handling for duplicate keys
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({ message: `An account with this ${field} already exists.` });
    }
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (isMatched) {
      const jwt_secret = process.env.JWT_TOKEN;
      if (!jwt_secret) {
        return res.status(500).json({ message: "JWT secret is not defined" });
      }
      const token = jwt.sign({ id: user._id }, jwt_secret, { expiresIn: '1d' }); // Good practice to add expiration
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/api/v1/content", userMiddlware, async (req, res) => {
  const { link, title } = req.body;
  try {
    const newContent = new Content({
      link,
      title,
      userId: (req as any)._id, // ✅ Changed to userId
      tags: [] 
    });

    await newContent.save();
    res.status(201).json(newContent); // Use 201 for created resources
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get("/api/v1/content", userMiddlware, async (req, res) => {
  try {
    const userId = (req as any)._id;

    // ✅ Correct way to populate and exclude fields from the populated document
    const content = await Content.find({ userId: userId })
      .populate({
        path: 'userId',
        select: 'username email' // select only username and email, implicitly excluding password
      });
      
    res.status(200).json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.delete("/api/v1/content/:id", userMiddlware, async (req, res) => {
  const contentId = req.params.id;
  try {
    const deletedContent = await Content.findOneAndDelete({
      _id: contentId,
      userId: (req as any)._id  // ✅ ensures only owner can delete content
    });

    if (!deletedContent) {
      return res.status(404).json({ message: "Content not found or not authorized to delete" });
    }

    res.status(200).json({ message: "Content deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/api/v1/brain/share", userMiddlware, async (req, res) => {
  const { share } = req.body; // Expects a boolean: true to create/get, false to delete
  const userId = (req as any)._id;

  try {
    if (share) {
      const existing = await Link.findOne({ userId });

      if (existing) {
        return res.status(200).json({ message: "Sharable link already exists", link: existing.hash });
      }

      // Ensure the generated hash is unique before saving
      let hash;
      let isUnique = false;
      while(!isUnique) {
        hash = random(10);
        const hashExists = await Link.findOne({ hash });
        if (!hashExists) {
          isUnique = true;
        }
      }

      const newLink = await Link.create({ userId, hash });

      res.status(201).json({ message: "Sharable link created", link: newLink.hash });
    } else {
      const deleted = await Link.findOneAndDelete({ userId });

      if (!deleted) {
        return res.status(404).json({ message: "No sharable link found to delete" });
      }

      res.status(200).json({ message: "Sharable link deleted" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const hash = req.params.shareLink;

  try {
    const link = await Link.findOne({ hash });

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    const user = await User.findById(link.userId).select('username'); // Only get username
    if (!user) {
      return res.status(404).json({ message: "Associated user not found" });
    }

    const content = await Content.find({ userId: link.userId }).select('-userId -__v');

    // ✅ Fixed the "double response" bug by sending a single, combined response
    res.status(200).json({
      username: user.username,
      content: content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post("/api/v1/logout", async (req, res) => {
  // Server-side logout for stateless JWTs is largely symbolic.
  // The client is responsible for destroying the token (e.g., from localStorage).
  // This endpoint can be useful for blocklisting tokens if you have such a system.
  // res.clearCookie("token") is only effective if you set the token in a cookie.
  try {
    res.status(200).json({ message: "Logout successful. Please clear the token on the client-side." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

connectDB().then(() => {
  app.listen(4000, () => {
    console.log("🚀 Server is running on port 4000");
  });
});