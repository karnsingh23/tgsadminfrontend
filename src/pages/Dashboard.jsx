import { useEffect, useState } from 'react';
import axios from 'axios';
import SubmissionCard from '../components/SubmissionCard';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Container,
  CssBaseline
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4a6fa5', // Deep blue
    },
    secondary: {
      main: '#ff7e5f', // Coral
    },
    background: {
      default: '#f8f9fa', // Light gray
      paper: '#ffffff', // White
    },
    text: {
      primary: '#2d3436', // Dark gray
      secondary: '#636e72', // Medium gray
    },
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#4a6fa5',
    },
  },
});

export default function Dashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    service: 'all'
  });
  const [sortOption, setSortOption] = useState('newest');
  const navigate = useNavigate();

  // Fetch submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get('https://tgsadminbackend.onrender.com/api/admin/submissions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res.data.submissions)
        setSubmissions(res.data.submissions);
        setLoading(false);
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/');
      }
    };

    fetchSubmissions();
  }, [navigate]);

  // Apply filters and sorting
  useEffect(() => {
    let results = [...submissions];

    // Apply search
    if (searchTerm) {
      results = results.filter(sub =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      results = results.filter(sub => 
        filters.status === 'matched' ? sub.match : !sub.match
      );
    }

    // Apply service filter
    if (filters.service !== 'all') {
      results = results.filter(sub => 
        sub.service.toLowerCase() === filters.service.toLowerCase()
      );
    }

    // Apply sorting
    results.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      
      if (sortOption === 'newest') return dateB - dateA;
      if (sortOption === 'oldest') return dateA - dateB;
      return 0;
    });

    setFilteredSubmissions(results);
  }, [submissions, searchTerm, filters, sortOption]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        p: 3,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%)',
      }}>
        <Container maxWidth="xl">
          {/* Dashboard Header */}
          <Box sx={{ 
            mb: 4,
            p: 3,
            borderRadius: 2,
            background: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          }}>
            <Typography variant="h4" component="h1" fontWeight="700" gutterBottom>
              Client Submissions
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and review all client project submissions
            </Typography>
          </Box>

          {/* Filters and Search Bar */}
          <Paper elevation={0} sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 3,
            bgcolor: 'background.paper',
            border: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            background: 'linear-gradient(to right, #ffffff, #f8f9fa)',
          }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search submissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 2,
                      backgroundColor: 'background.default',
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.light',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  flexWrap: 'wrap',
                }}>
                  <FormControl size="small" sx={{ minWidth: 180, flexGrow: 1 }}>
                    <InputLabel>Service</InputLabel>
                    <Select
                      value={filters.service}
                      onChange={(e) => setFilters({...filters, service: e.target.value})}
                      label="Service"
                      sx={{
                        borderRadius: 2,
                        backgroundColor: 'background.default',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'transparent',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.light',
                        },
                      }}
                    >
                      <MenuItem value="all">All Services</MenuItem>
                      <MenuItem value="Web Development">Web Development</MenuItem>
                      <MenuItem value="Mobile App Development">Mobile App Development</MenuItem>
                      <MenuItem value="UI/UX Design">UI/UX Design</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 160, flexGrow: 1 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      label="Sort By"
                      startAdornment={<SortIcon color="action" sx={{ mr: 1 }} />}
                      sx={{
                        borderRadius: 2,
                        backgroundColor: 'background.default',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'transparent',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.light',
                        },
                      }}
                    >
                      <MenuItem value="newest">Newest First</MenuItem>
                      <MenuItem value="oldest">Oldest First</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Loading State */}
          {loading && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              p: 4,
              borderRadius: 2,
              backgroundColor: 'background.paper',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            }}>
              <CircularProgress color="secondary" />
            </Box>
          )}

          {/* Submissions List */}
          {!loading && (
            <Grid container spacing={3}>
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => (
                 
                    <SubmissionCard 
                      submission={submission}
                      sortOption={sortOption}
                      onSortChange={(e) => setSortOption(e.target.value)}
                    />
                 
                ))
              ) : (
                <Grid item xs={12}>
                  <Paper elevation={0} sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    bgcolor: 'background.paper',
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No submissions found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Try adjusting your search or filters
                    </Typography>
                    <Button 
                      variant="contained"
                      color="primary"
                      sx={{ 
                        mt: 2,
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: '0 2px 10px rgba(74, 111, 165, 0.3)',
                        }
                      }}
                      onClick={() => {
                        setSearchTerm('');
                        setFilters({
                          status: 'all',
                          service: 'all'
                        });
                      }}
                    >
                      Clear Filters
                    </Button>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}