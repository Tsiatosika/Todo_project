const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/todolist';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => console.error('❌ Erreur connexion MongoDB:', err));

// Schéma et modèle Task
const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    default: 'non terminée'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Task = mongoose.model('Task', taskSchema);

// Routes
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const { name, description, status } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Le nom de la tâche est requis' });
    }

    const task = new Task({
      name,
      description,
      status: status || 'non terminée'
    });

    const result = await task.save();
    res.status(201).json({ 
      insertedId: result._id,
      task: result 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID invalide' });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID invalide' });
    }

    const task = await Task.findByIdAndDelete(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }
    
    res.json({ 
      message: 'Tâche supprimée avec succès',
      deletedTask: task 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 API Todo App est en ligne!',
    endpoints: {
      'GET /tasks': 'Récupérer toutes les tâches',
      'POST /tasks': 'Créer une nouvelle tâche',
      'PUT /tasks/:id': 'Mettre à jour une tâche',
      'DELETE /tasks/:id': 'Supprimer une tâche'
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎯 Serveur backend démarré sur http://localhost:${PORT}`);
});