import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Checkbox,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Divider,
  Fade,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from '@mui/icons-material';
import { todosApi } from '../../services/api';

interface Todo {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: 'urgent' | 'normal' | 'someday';
  category?: string;
  completed: boolean;
  tags?: string[];
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'urgent' | 'normal' | 'someday'>('normal');
  const [category, setCategory] = useState('');

  useEffect(() => {
    loadTodos();
    loadStats();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const response = await todosApi.list({ page_size: 100 });
      setTodos(response.data.todos);
      setError(null);
      await loadStats(); // Refresh stats after loading todos
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await todosApi.getStats();
      setStats(response.data);
    } catch (err) {
      // Stats are optional, fail silently
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      if (todo.completed) {
        await todosApi.uncomplete(todo.id);
      } else {
        await todosApi.complete(todo.id);
      }
      await loadTodos();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update todo');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this todo?')) {
      return;
    }
    try {
      await todosApi.delete(id);
      await loadTodos();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete todo');
    }
  };

  const handleOpenDialog = (todo?: Todo) => {
    if (todo) {
      setEditingTodo(todo);
      setTitle(todo.title);
      setDescription(todo.description || '');
      setPriority(todo.priority);
      setCategory(todo.category || '');
    } else {
      setEditingTodo(null);
      setTitle('');
      setDescription('');
      setPriority('normal');
      setCategory('');
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTodo(null);
    setTitle('');
    setDescription('');
    setPriority('normal');
    setCategory('');
  };

  const handleSubmit = async () => {
    try {
      const data = {
        title,
        description: description || undefined,
        priority,
        category: category || undefined,
      };

      if (editingTodo) {
        await todosApi.update(editingTodo.id, data);
      } else {
        await todosApi.create(data);
      }

      handleCloseDialog();
      await loadTodos();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save todo');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'normal':
        return 'primary';
      case 'someday':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'Urgent';
      case 'normal':
        return 'Normal';
      case 'someday':
        return 'Someday';
      default:
        return priority;
    }
  };

  const pendingTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Card 
              elevation={2}
              sx={{ 
                bgcolor: 'primary.main',
                color: 'white',
                textAlign: 'center'
              }}
            >
              <CardContent>
                <Typography variant="h4" fontWeight="bold">
                  {stats.total}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card 
              elevation={2}
              sx={{ 
                bgcolor: 'success.main',
                color: 'white',
                textAlign: 'center'
              }}
            >
              <CardContent>
                <Typography variant="h4" fontWeight="bold">
                  {stats.completed}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Done
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card 
              elevation={2}
              sx={{ 
                bgcolor: 'warning.main',
                color: 'white',
                textAlign: 'center'
              }}
            >
              <CardContent>
                <Typography variant="h4" fontWeight="bold">
                  {stats.pending}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Pending
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card 
              elevation={2}
              sx={{ 
                bgcolor: stats.urgent > 0 ? 'error.main' : 'grey.500',
                color: 'white',
                textAlign: 'center'
              }}
            >
              <CardContent>
                <Typography variant="h4" fontWeight="bold">
                  {stats.urgent}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Urgent
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Header with Add Button */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          Your Tasks
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 3,
          }}
        >
          Add Todo
        </Button>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }} 
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Pending Todos */}
      {pendingTodos.length > 0 && (
        <Paper 
          elevation={2}
          sx={{ 
            mb: 3,
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <Box sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Pending ({pendingTodos.length})
            </Typography>
          </Box>
          <List sx={{ p: 0 }}>
            {pendingTodos.map((todo, index) => (
              <Fade in timeout={300 + index * 50} key={todo.id}>
                <ListItem
                  sx={{
                    borderBottom: index < pendingTodos.length - 1 ? 1 : 0,
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    }
                  }}
                  secondaryAction={
                    <Box display="flex" gap={0.5}>
                      <Tooltip title="Edit">
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => handleOpenDialog(todo)}
                          size="small"
                          sx={{ 
                            color: 'primary.main',
                            '&:hover': { bgcolor: 'primary.light', color: 'white' }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDelete(todo.id)}
                          size="small"
                          sx={{ 
                            color: 'error.main',
                            '&:hover': { bgcolor: 'error.light', color: 'white' }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                  disablePadding
                >
                  <ListItemButton 
                    onClick={() => handleToggleComplete(todo)}
                    sx={{ py: 2, px: 2 }}
                  >
                    <Checkbox
                      edge="start"
                      checked={false}
                      tabIndex={-1}
                      disableRipple
                      icon={<RadioButtonUncheckedIcon />}
                      checkedIcon={<CheckCircleIcon />}
                      sx={{ mr: 2 }}
                    />
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 500,
                              color: 'text.primary',
                            }}
                          >
                            {todo.title}
                          </Typography>
                          <Chip
                            label={getPriorityLabel(todo.priority)}
                            size="small"
                            color={getPriorityColor(todo.priority)}
                            sx={{ 
                              fontWeight: 600,
                              height: 24,
                              fontSize: '0.7rem'
                            }}
                          />
                          {todo.category && (
                            <Chip 
                              label={todo.category} 
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                height: 24,
                                fontSize: '0.7rem'
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        todo.description && (
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            {todo.description}
                          </Typography>
                        )
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </Fade>
            ))}
          </List>
        </Paper>
      )}

      {/* Completed Todos */}
      {completedTodos.length > 0 && (
        <Paper 
          elevation={2}
          sx={{ 
            borderRadius: 2,
            overflow: 'hidden',
            opacity: 0.9
          }}
        >
          <Box sx={{ p: 2, bgcolor: 'success.light', color: 'white' }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Completed ({completedTodos.length})
            </Typography>
          </Box>
          <List sx={{ p: 0 }}>
            {completedTodos.map((todo) => (
              <ListItem
                key={todo.id}
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  opacity: 0.7,
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(todo.id)}
                    size="small"
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
                disablePadding
              >
                <ListItemButton 
                  onClick={() => handleToggleComplete(todo)}
                  sx={{ py: 1.5, px: 2 }}
                >
                  <Checkbox
                    edge="start"
                    checked={true}
                    tabIndex={-1}
                    disableRipple
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<CheckCircleIcon color="success" />}
                    sx={{ mr: 2 }}
                  />
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          textDecoration: 'line-through',
                          color: 'text.secondary',
                        }}
                      >
                        {todo.title}
                      </Typography>
                    }
                    secondary={
                      todo.description && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            mt: 0.5,
                            textDecoration: 'line-through'
                          }}
                        >
                          {todo.description}
                        </Typography>
                      )
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Empty State */}
      {todos.length === 0 && (
        <Paper 
          elevation={2}
          sx={{ 
            p: 8,
            textAlign: 'center',
            borderRadius: 2,
          }}
        >
          <CheckCircleIcon 
            sx={{ 
              fontSize: 80, 
              color: 'primary.main',
              opacity: 0.3,
              mb: 2
            }} 
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No todos yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first todo to get started!
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Create Your First Todo
          </Button>
        </Paper>
      )}

      {/* Add/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            {editingTodo ? 'Edit Todo' : 'Create New Todo'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              autoFocus
              placeholder="e.g., Buy condiments at Spar"
              variant="outlined"
            />
            <TextField
              label="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
              placeholder="Add more details..."
              variant="outlined"
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                label="Priority"
                onChange={(e) => setPriority(e.target.value as any)}
                variant="outlined"
              >
                <MenuItem value="urgent">🔴 Urgent</MenuItem>
                <MenuItem value="normal">🔵 Normal</MenuItem>
                <MenuItem value="someday">⚪ Someday</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Category (optional)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
              placeholder="e.g., Shopping, Benny, Personal, Self-care"
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={!title.trim()}
            sx={{ 
              textTransform: 'none',
              px: 3,
              fontWeight: 600,
            }}
          >
            {editingTodo ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
