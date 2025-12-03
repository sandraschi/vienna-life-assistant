import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Grid,
  IconButton,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PetsIcon from '@mui/icons-material/Pets';
import HomeIcon from '@mui/icons-material/Home';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { expensesAPI } from '../../services/api';

interface Expense {
  id: string;
  date: string;
  amount: number;
  currency: string;
  category: string;
  store?: string;
  description?: string;
  tags?: string[];
}

interface ExpenseStats {
  total_expenses: number;
  total_amount: number;
  by_category: Record<string, { amount: number; count: number }>;
  by_store: Record<string, { amount: number; count: number }>;
  recent_total: number;
}

const CategoryIcons: Record<string, React.ReactNode> = {
  groceries: <ShoppingBagIcon />,
  pet: <PetsIcon />,
  personal: <AttachMoneyIcon />,
  household: <HomeIcon />,
  health: <LocalHospitalIcon />,
  transport: <DirectionsBusIcon />,
  other: <MoreHorizIcon />,
};

const CategoryColors: Record<string, string> = {
  groceries: '#4CAF50',
  pet: '#FF9800',
  personal: '#9C27B0',
  household: '#2196F3',
  health: '#F44336',
  transport: '#00BCD4',
  other: '#757575',
};

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<ExpenseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [expensesData, statsData] = await Promise.all([
        expensesAPI.getExpenses(),
        expensesAPI.getStats(),
      ]);
      setExpenses(expensesData.expenses || []);
      setStats(statsData);
    } catch (err) {
      setError('Failed to load expense data');
      console.error('Expense load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-AT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatAmount = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('de-AT', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Loading expenses...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AttachMoneyIcon />
          Expense Tracker
        </Typography>
        <Button variant="outlined" startIcon={<TrendingUpIcon />}>
          Last 30 Days
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Overview */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {formatAmount(stats.total_amount)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Spending
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {formatAmount(stats.recent_total)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Last 30 Days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {stats.total_expenses}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Transactions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {Object.keys(stats.by_category).length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Categories
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Category Breakdown */}
      {stats && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Spending by Category
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {Object.entries(stats.by_category).map(([category, data]) => (
              <Grid item xs={12} sm={6} md={4} key={category}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    borderRadius: 1,
                    bgcolor: 'grey.50',
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: CategoryColors[category] || '#757575',
                      color: 'white',
                      p: 1,
                      borderRadius: 1,
                      display: 'flex',
                    }}
                  >
                    {CategoryIcons[category] || <MoreHorizIcon />}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                      {category}
                    </Typography>
                    <Typography variant="h6">{formatAmount(data.amount)}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {data.count} transactions
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Recent Transactions */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Transactions ({expenses.length})
        </Typography>
        {expenses.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <AttachMoneyIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No expenses yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start tracking your spending!
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Store</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id} hover>
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{expense.description || '-'}</Typography>
                    </TableCell>
                    <TableCell>{expense.store || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={expense.category}
                        size="small"
                        sx={{
                          bgcolor: CategoryColors[expense.category] || '#757575',
                          color: 'white',
                          textTransform: 'capitalize',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" fontWeight="medium">
                        {formatAmount(expense.amount, expense.currency)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Top Stores */}
      {stats && Object.keys(stats.by_store).length > 0 && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Top Stores
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {Object.entries(stats.by_store).slice(0, 6).map(([store, data]) => (
              <Grid item xs={12} sm={6} md={4} key={store}>
                <Box sx={{ p: 2, borderRadius: 1, bgcolor: 'grey.50' }}>
                  <Typography variant="body1" fontWeight="medium" gutterBottom>
                    {store}
                  </Typography>
                  <Typography variant="h6" color="primary.main">
                    {formatAmount(data.amount)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {data.count} visits
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Box>
  );
}

