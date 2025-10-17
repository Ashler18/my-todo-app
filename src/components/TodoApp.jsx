import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, Calendar } from 'lucide-react';

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const savedTasks = window.todoTasks || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    window.todoTasks = tasks;
  }, [tasks]);

  const addTask = () => {
    if (inputValue.trim() === '') return;
    const newTask = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
    setInputValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') addTask();
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditValue(task.text);
  };

  const saveEdit = (id) => {
    if (editValue.trim() === '') return;
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: editValue } : task
    ));
    setEditingId(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const activeTasks = totalTasks - completedTasks;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">Ma To-Do List</h1>
          <p className="text-gray-600">Organisez vos tâches efficacement</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-md text-center">
            <p className="text-2xl font-bold text-indigo-600">{totalTasks}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md text-center">
            <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
            <p className="text-sm text-gray-600">Terminées</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md text-center">
            <p className="text-2xl font-bold text-orange-600">{activeTasks}</p>
            <p className="text-sm text-gray-600">En cours</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ajouter une nouvelle tâche..."
              className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors"
            />
            <button
              onClick={addTask}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium shadow-md"
            >
              <Plus size={20} />
              Ajouter
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 bg-white rounded-lg p-2 shadow-md">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              filter === 'active' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            En cours
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              filter === 'completed' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Terminées
          </button>
        </div>

        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center shadow-md">
              <p className="text-gray-400 text-lg">
                {filter === 'completed' ? 'Aucune tâche terminée' : 
                 filter === 'active' ? 'Aucune tâche en cours' : 
                 'Aucune tâche. Commencez par en ajouter une !'}
              </p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className={`bg-white rounded-lg p-4 shadow-md transition-all hover:shadow-lg ${
                  task.completed ? 'opacity-75' : ''
                }`}
              >
                {editingId === task.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-3 py-2 border-2 border-indigo-500 rounded-md focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => saveEdit(task.id)}
                      className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Check size={20} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-400 text-white p-2 rounded-md hover:bg-gray-500 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task.id)}
                      className="w-5 h-5 rounded border-2 border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className={`text-lg ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {task.text}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <Calendar size={12} />
                        {new Date(task.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => startEdit(task)}
                      className="text-blue-600 p-2 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-600 p-2 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}