import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import User from './models/User';
import Leaderboard from './models/Leaderboard';
import Entry from './models/Entry';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const mongoDBUri = `mongodb+srv://charlesmsjalo:${process.env.MONGO_PASSWORD}@cluster0.vfeqwwk.mongodb.net/leaderboardDB`;

mongoose.connect(mongoDBUri);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB successfully!');
});

// app.get('/', (req: Request, res: Response) => {
//   res.send('Welcome to Leaderboards API');
// });

// POST /user
app.post('/user', async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
  
      // Create user
      const user = new User({ name });
      const savedUser = await user.save();
  
      // Check if there are any leaderboards
      const leaderboards = await Leaderboard.find();
      
      let defaultLeaderboardId = null;
  
      if (leaderboards.length > 0) {
        defaultLeaderboardId = leaderboards[0]._id;
      } else {
        console.error('No leaderboards found.');
        res.status(500).json({ error: 'No leaderboards found.' });
        return;
      }

      // Create user entry in the default leaderboard
      const userEntry = new Entry({
        user_id: savedUser._id,
        board_id: defaultLeaderboardId,
        score: 0, // initialize score
        scored_at: new Date(),
      });
      await userEntry.save();
  
      res.json({
        user: {
          _id: savedUser._id.toHexString(),
          name: savedUser.name,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
    
// GET /user/:_id
app.get('/user/:_id', async (req: Request, res: Response) => {
    try {
      const { _id } = req.params;
  
      const user = await User.findById(_id);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userResponse = {
        _id: user._id.toHexString(),
        name: user.name,
      };
  
      res.json({ user: userResponse });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
    
// POST /admin/leaderboard
app.post('/admin/leaderboard', async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
  
      const newLeaderboard = new Leaderboard({ name });
      const savedLeaderboard = await newLeaderboard.save();
  
      res.json({ board: { _id: savedLeaderboard._id.toHexString(), name: savedLeaderboard.name } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // GET /leaderboard/:_id?per_page=x&page=y
  app.get('/leaderboard/:_id', async (req: Request, res: Response) => {
    try {
      const { _id } = req.params;
      
      const { per_page = '10', page = '1' } = req.query;
  
      const pageNumber = Number(page);
      const perPageNumber = Number(per_page);
  
      const leaderboard = await Leaderboard.findById(_id);
      if (!leaderboard) {
        return res.status(404).json({ error: 'Leaderboard not found' });
      }
  
      const entries = await Entry.find({ board_id: _id })
        .sort({ score: -1, scored_at: 1 })
        .skip((pageNumber - 1) * perPageNumber)
        .limit(perPageNumber)
        .populate('user_id', 'name');
  
      const rankedEntries = entries.map((entry, index) => ({
        score: entry.score,
        user_id: entry.user_id._id.toHexString(),
        scored_at: entry.scored_at.toISOString(),
        rank: index,
        name: entry.user_id.name,
      }));
  
      res.json({ board: { _id, name: leaderboard.name, entries: rankedEntries } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });  

  // PUT /leaderboard/:_id/user/:user_id/add_score
  app.put('/leaderboard/:_id/user/:user_id/add_score', async (req: Request, res: Response) => {
    try {
      const { _id, user_id } = req.params;
      const { score_to_add } = req.body;

      console.log(`Received request to add score to leaderboard ${_id} for user ${user_id}.`);

      const leaderboard = await Leaderboard.findById(_id);
      if (!leaderboard) {
        console.log(`Leaderboard with ID ${_id} not found.`);
        return res.status(404).json({ error: 'Leaderboard not found' });
      }

      const userEntry = await Entry.findOne({ board_id: _id, user_id });
      if (!userEntry) {
        console.log(`User entry for user ${user_id} in leaderboard ${_id} not found.`);
        return res.status(404).json({ error: 'User entry not found' });
      }

      userEntry.score += score_to_add;
      userEntry.scored_at = new Date();
      const updatedEntry = await userEntry.save();

      console.log(`Score added successfully. Response: ${JSON.stringify(updatedEntry)}`);

      res.json({
        entry: {
          _id: updatedEntry._id.toHexString(),
          board_id: updatedEntry.board_id.toHexString(),
          score: updatedEntry.score,
          scored_at: updatedEntry.scored_at.toISOString(),
          user_id: updatedEntry.user_id.toHexString(),
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
    
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});