import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Paper,
  Tabs,
  Tab,
  Alert,
  AlertTitle,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  UploadFile as UploadIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingIcon,
  Category as CategoryIcon,
  AccountBalance as BankIcon,
  Insights as InsightsIcon,
  Download as DownloadIcon,
  Analytics as AnalyticsIcon,
  Apple as AppleIcon,
  GetApp as GetAppIcon
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const DataAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3 }}>
        📊 Data Analytics
      </Typography>

      <Typography variant="body1" sx={{ mb: 4 }}>
        Analyze your personal data including banking expenses, spending patterns, and financial insights.
        Import transaction data from Erste Sparkasse George app for comprehensive expense analysis.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>🔐 Read-Only Access to Banking Data</AlertTitle>
        Your banking data remains secure. We only analyze exported CSV files you provide.
        No direct connection to your bank account or George app.
      </Alert>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 48,
              textTransform: 'none'
            }
          }}
        >
          <Tab icon={<UploadIcon />} iconPosition="start" label="Import Data" />
          <Tab icon={<AssessmentIcon />} iconPosition="start" label="Expense Analysis" />
          <Tab icon={<TrendingIcon />} iconPosition="start" label="Spending Trends" />
          <Tab icon={<InsightsIcon />} iconPosition="start" label="Financial Insights" />
        </Tabs>
      </Paper>

      {/* Import Data Tab */}
      <TabPanel value={activeTab} index={0}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          📥 Import Banking Data from George App
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  📱 How to Export Data from George App
                </Typography>

                <Typography variant="body2" sx={{ mb: 3 }}>
                  Export your transaction data from the Erste Sparkasse George app on your iPad
                  and import it here for analysis.
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>Step-by-Step Instructions:</Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon><AppleIcon /></ListItemIcon>
                      <ListItemText
                        primary="1. Open George app on your iPad"
                        secondary="Make sure you're logged into your Erste Sparkasse account"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><GetAppIcon /></ListItemIcon>
                      <ListItemText
                        primary="2. Go to Account Overview"
                        secondary="Tap on your main account to see transaction history"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><DownloadIcon /></ListItemIcon>
                      <ListItemText
                        primary="3. Export Transactions"
                        secondary="Look for 'Export' or 'Download' option (usually ⋯ menu or share icon)"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><UploadIcon /></ListItemIcon>
                      <ListItemText
                        primary="4. Choose CSV Format"
                        secondary="Select CSV format for best compatibility with analysis tools"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><AnalyticsIcon /></ListItemIcon>
                      <ListItemText
                        primary="5. Upload to Vienna Life Assistant"
                        secondary="Use the upload button below to import your CSV file"
                      />
                    </ListItem>
                  </List>
                </Box>

                <Alert severity="warning" sx={{ mb: 2 }}>
                  <AlertTitle>⚠️ Important Notes</AlertTitle>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li>Only export data you want to analyze - typically last 3-12 months</li>
                    <li>CSV files are processed locally on your Windows machine</li>
                    <li>No data is sent to external servers</li>
                    <li>You can delete imported data at any time</li>
                  </ul>
                </Alert>

                <Button
                  variant="contained"
                  startIcon={<UploadIcon />}
                  size="large"
                  fullWidth
                >
                  Upload George App CSV Export
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  🛠️ Technical Details
                </Typography>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  Your CSV data will be imported into a local SQLite database and analyzed using
                  database-operations-mcp for comprehensive insights.
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Supported Formats:</Typography>
                  <Chip label="CSV" size="small" sx={{ mr: 1 }} />
                  <Chip label="Excel" size="small" sx={{ mr: 1 }} />
                  <Chip label="JSON" size="small" />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Analysis Features:</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="• Spending categorization" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="• Monthly trends" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="• Budget analysis" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="• Merchant insights" />
                    </ListItem>
                  </List>
                </Box>

                <Button
                  variant="outlined"
                  startIcon={<AssessmentIcon />}
                  fullWidth
                  disabled
                >
                  Analyze Database
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  🔄 Data Processing Pipeline
                </Typography>

                <Typography variant="body2" sx={{ mb: 3 }}>
                  Your banking data follows this secure, local-only processing pipeline:
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'primary.main', borderRadius: 1 }}>
                      <Typography variant="h4">📱</Typography>
                      <Typography variant="subtitle2">George App</Typography>
                      <Typography variant="caption">Export CSV</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'primary.main', borderRadius: 1 }}>
                      <Typography variant="h4">💾</Typography>
                      <Typography variant="subtitle2">Local SQLite</Typography>
                      <Typography variant="caption">Import & Store</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'primary.main', borderRadius: 1 }}>
                      <Typography variant="h4">🔍</Typography>
                      <Typography variant="subtitle2">Database MCP</Typography>
                      <Typography variant="caption">Analyze & Query</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'primary.main', borderRadius: 1 }}>
                      <Typography variant="h4">📊</Typography>
                      <Typography variant="subtitle2">Visual Insights</Typography>
                      <Typography variant="caption">Charts & Reports</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Expense Analysis Tab */}
      <TabPanel value={activeTab} index={1}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          💸 Expense Analysis
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  📊 Spending by Category
                </Typography>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  Automatic categorization of your expenses using intelligent pattern recognition.
                </Typography>

                <TableContainer component={Paper} sx={{ mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell align="right">Amount (€)</TableCell>
                        <TableCell align="right">Transactions</TableCell>
                        <TableCell align="right">%</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Food & Dining</TableCell>
                        <TableCell align="right">€1,247.50</TableCell>
                        <TableCell align="right">89</TableCell>
                        <TableCell align="right">28.5%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Transportation</TableCell>
                        <TableCell align="right">€892.30</TableCell>
                        <TableCell align="right">45</TableCell>
                        <TableCell align="right">20.3%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Shopping</TableCell>
                        <TableCell align="right">€654.75</TableCell>
                        <TableCell align="right">32</TableCell>
                        <TableCell align="right">14.9%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Entertainment</TableCell>
                        <TableCell align="right">€423.90</TableCell>
                        <TableCell align="right">18</TableCell>
                        <TableCell align="right">9.7%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Button
                  variant="outlined"
                  startIcon={<CategoryIcon />}
                  fullWidth
                >
                  View Detailed Breakdown
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  🏪 Top Merchants
                </Typography>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  Your most frequent spending destinations and average transaction amounts.
                </Typography>

                <List>
                  <ListItem>
                    <ListItemIcon><BankIcon /></ListItemIcon>
                    <ListItemText
                      primary="Billa Supermarket"
                      secondary="€127.45 average • 23 transactions"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><BankIcon /></ListItemIcon>
                    <ListItemText
                      primary="Wiener Linien (Transport)"
                      secondary="€19.80 average • 45 transactions"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><BankIcon /></ListItemIcon>
                    <ListItemText
                      primary="Café Central"
                      secondary="€8.50 average • 12 transactions"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><BankIcon /></ListItemIcon>
                    <ListItemText
                      primary="Amazon"
                      secondary="€67.30 average • 8 transactions"
                    />
                  </ListItem>
                </List>

                <Button
                  variant="outlined"
                  startIcon={<AssessmentIcon />}
                  fullWidth
                >
                  Analyze Merchant Patterns
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  🔍 Database Operations MCP Integration
                </Typography>

                <Typography variant="body2" sx={{ mb: 3 }}>
                  Your banking data is analyzed using advanced database operations with comprehensive
                  querying, analytics, and reporting capabilities.
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4">🔗</Typography>
                      <Typography variant="subtitle2">db_connection</Typography>
                      <Typography variant="caption">Database management</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4">📊</Typography>
                      <Typography variant="subtitle2">db_analyzer</Typography>
                      <Typography variant="caption">Data analysis</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4">🔍</Typography>
                      <Typography variant="subtitle2">db_operations</Typography>
                      <Typography variant="caption">Query execution</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4">📈</Typography>
                      <Typography variant="subtitle2">db_schema</Typography>
                      <Typography variant="caption">Structure analysis</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Spending Trends Tab */}
      <TabPanel value={activeTab} index={2}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          📈 Spending Trends & Patterns
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  📅 Monthly Spending Overview
                </Typography>

                <Typography variant="body2" sx={{ mb: 3 }}>
                  Track your spending patterns over time with detailed monthly breakdowns.
                </Typography>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Month</TableCell>
                        <TableCell align="right">Income (€)</TableCell>
                        <TableCell align="right">Expenses (€)</TableCell>
                        <TableCell align="right">Net (€)</TableCell>
                        <TableCell align="right">Change (%)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>December 2025</TableCell>
                        <TableCell align="right">€2,450.00</TableCell>
                        <TableCell align="right">€1,876.50</TableCell>
                        <TableCell align="right">€573.50</TableCell>
                        <TableCell align="right" sx={{ color: 'success.main' }}>+12.3%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>November 2025</TableCell>
                        <TableCell align="right">€2,450.00</TableCell>
                        <TableCell align="right">€1,672.30</TableCell>
                        <TableCell align="right">€777.70</TableCell>
                        <TableCell align="right" sx={{ color: 'warning.main' }}>-5.2%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>October 2025</TableCell>
                        <TableCell align="right">€2,450.00</TableCell>
                        <TableCell align="right">€1,762.80</TableCell>
                        <TableCell align="right">€687.20</TableCell>
                        <TableCell align="right" sx={{ color: 'success.main' }}>+8.7%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  🎯 Budget Goals
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Monthly Budget: €2,000</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Current spending: €1,876.50 (93.8% of budget)
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Category Limits:</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Food & Dining" secondary="€800 limit • €1,247.50 spent" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Transportation" secondary="€500 limit • €892.30 spent" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Entertainment" secondary="€300 limit • €423.90 spent" />
                    </ListItem>
                  </List>
                </Box>

                <Alert severity="warning">
                  <Typography variant="body2">
                    Food budget exceeded by €447.50 this month
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  📊 Advanced Analytics with Database MCP
                </Typography>

                <Typography variant="body2" sx={{ mb: 3 }}>
                  Leverage database-operations-mcp for sophisticated financial analysis including
                  seasonal trends, correlation analysis, and predictive insights.
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" color="primary">🧮</Typography>
                      <Typography variant="subtitle2">Statistical Analysis</Typography>
                      <Typography variant="caption">Mean, median, standard deviation</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" color="primary">🔄</Typography>
                      <Typography variant="subtitle2">Correlation Analysis</Typography>
                      <Typography variant="caption">Spending pattern relationships</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" color="primary">🔮</Typography>
                      <Typography variant="subtitle2">Predictive Modeling</Typography>
                      <Typography variant="caption">Future spending forecasts</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Financial Insights Tab */}
      <TabPanel value={activeTab} index={3}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          💡 Financial Insights & Recommendations
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  🎯 Smart Recommendations
                </Typography>

                <List>
                  <ListItem>
                    <ListItemIcon><TrendingIcon /></ListItemIcon>
                    <ListItemText
                      primary="Reduce dining out expenses"
                      secondary="€447.50 over budget this month. Consider meal planning for cost savings."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><TrendingIcon /></ListItemIcon>
                    <ListItemText
                      primary="Optimize transportation costs"
                      secondary="Wiener Linien passes could save €245 annually vs single tickets."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><TrendingIcon /></ListItemIcon>
                    <ListItemText
                      primary="Entertainment budget review"
                      secondary="€123.90 under budget. Consider reallocating to savings goals."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><TrendingIcon /></ListItemIcon>
                    <ListItemText
                      primary="Seasonal spending patterns"
                      secondary="December spending 12.3% higher than November. Plan ahead for holidays."
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  🏆 Achievement Unlocks
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Chip label="Budget Master" color="success" sx={{ mr: 1, mb: 1 }} />
                  <Chip label="Expense Tracker" color="primary" sx={{ mr: 1, mb: 1 }} />
                  <Chip label="Savings Goal" color="secondary" />
                </Box>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  Congratulations! You've maintained your budget for 3 consecutive months.
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" sx={{ mb: 1 }}>Next Goals:</Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="• Save €500 emergency fund" secondary="€350 saved so far" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="• Reduce dining expenses by 20%" secondary="Track progress monthly" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="• Plan holiday budget in advance" secondary="Avoid December overspending" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  🔬 Advanced Database Analysis Features
                </Typography>

                <Typography variant="body2" sx={{ mb: 3 }}>
                  Use database-operations-mcp for deep financial analysis with SQL queries,
                  data visualization, and automated reporting.
                </Typography>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>SQL Query Examples</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" component="div">
                      <pre style={{ fontSize: '0.8rem', backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
{`-- Monthly spending by category
SELECT strftime('%Y-%m', date) as month,
       category,
       SUM(amount) as total
FROM transactions
WHERE type = 'expense'
GROUP BY month, category
ORDER BY month DESC, total DESC;

-- Top spending merchants
SELECT merchant,
       COUNT(*) as transactions,
       AVG(amount) as avg_amount,
       SUM(amount) as total_spent
FROM transactions
WHERE type = 'expense'
GROUP BY merchant
ORDER BY total_spent DESC
LIMIT 10;`}
                      </pre>
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Data Export Options</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2">
                      Export your analysis results in multiple formats:
                      <br />• JSON for web applications
                      <br />• CSV for spreadsheet analysis
                      <br />• Excel for advanced reporting
                      <br />• PDF reports for sharing
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default DataAnalytics;

















