import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Box,
  Divider,
  Button,
  Stack,
  IconButton,
  Tooltip,
  Badge,
  Dialog,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  FileDownload as DownloadIcon,
  Image as ImageIcon,
  Share as ShareIcon,
  MoreVert as MoreIcon,
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  PictureAsPdf as PdfIcon,
  Sort as SortIcon
} from '@mui/icons-material';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;



export default function SubmissionCard({ submission, sortOption, onSortChange }) {
  const [previewImage, setPreviewImage] = useState(null);
  const [previewPdf, setPreviewPdf] = useState(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);

  const fetchPdfBlob = async (file) => {
  setLoadingPdf(true);
  try {
    
    const response = await fetch(file.path);
    if (!response.ok) throw new Error('Failed to fetch PDF');
    const blob = await response.blob();
    
    const blobUrl = URL.createObjectURL(blob);
    console.log("Bloburl:", blobUrl);
    setPreviewPdf(blobUrl);
    console.log("Blob URL set to:", blobUrl);

    setPageNumber(1);
  } catch (err) {
    console.error('PDF Blob fetch error:', err);
  } finally {
    setLoadingPdf(false);
  }
};

  const handleImageClick = (file) => {
    setPreviewImage(file.path);
    setZoomLevel(1);
  };

 const handlePdfClick = (file) => {
  fetchPdfBlob(file);
};


 const handleClosePreview = () => {
  if (previewPdf?.startsWith('blob:')) {
    URL.revokeObjectURL(previewPdf);
  }
  setPreviewImage(null);
  setPreviewPdf(null);
};


  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <>
      <Card sx={{
        width: '100%',
        borderRadius: '16px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
        position: 'relative',
        overflow: 'visible',
        mb: 3,
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          boxShadow: '0 12px 24px rgba(0,0,0,0.12)'
        },
        maxWidth:'600px'
      }}>
        

        <CardContent sx={{ p: 0 }}>
          {/* Header Section */}
          <Box sx={{
            p: 3,
            pb: 2,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
            position: 'relative'
          }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <BusinessIcon sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  p: 0.5,
                  borderRadius: '50%',
                  fontSize: '16px'
                }} />
              }
            >
              <Avatar sx={{
                width: 56,
                height: 56,
                bgcolor: 'primary.light',
                color: 'primary.dark'
              }}>
                <PersonIcon fontSize="medium" />
              </Avatar>
            </Badge>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5 }}>
                {submission.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmailIcon sx={{ fontSize: 16, mr: 1 }} />
                {submission.email}
              </Typography>
              
              <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                <Chip
                  label={submission.company}
                  size="small"
                  icon={<BusinessIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    bgcolor: 'action.selected',
                    fontWeight: '500'
                  }}
                />
                <Chip
                  label={submission.service}
                  size="small"
                  color="primary"
                  sx={{ fontWeight: '600' }}
                />
              </Stack>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarIcon sx={{ fontSize: 14, mr: 0.5 }} />
                {new Date(submission.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                {new Date(submission.createdAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Typography>
            </Box>
          </Box>

          {/* Divider */}
          <Divider sx={{ borderColor: 'divider' }} />

          {/* Description Section */}
          <Box sx={{ p: 3, pt: 2 }}>
            <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
              Project Details
            </Typography>
            <Typography variant="body2" sx={{
              lineHeight: 1.6,
              color: 'text.secondary',
              mb: 2
            }}>
              {submission.description}
            </Typography>

           
            
          </Box>

          {/* Files Section */}
          {submission.files?.length > 0 && (
            <Box sx={{
              p: 3,
              pt: 0,
              borderTop: '1px dashed',
              borderColor: 'divider'
            }}>
              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2 }}>
                Attachments ({submission.files.length})
              </Typography>
              <Stack spacing={1.5}>
                {submission.files.map((file, idx) => (
                  <Box key={idx} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    borderRadius: '8px',
                    bgcolor: 'action.hover',
                    '&:hover': {
                      bgcolor: 'action.selected'
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '6px',
                        bgcolor: 'background.paper',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {file.mimetype.startsWith('image') ? (
                          <ImageIcon color="primary" sx={{ fontSize: 20 }} />
                        ) : file.mimetype === 'application/pdf' ? (
                          <PdfIcon color="error" sx={{ fontSize: 20 }} />
                        ) : (
                          <DescriptionIcon color="primary" sx={{ fontSize: 20 }} />
                        )}
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight="500">
                          {file.originalname}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {file.mimetype.split('/')[1].toUpperCase()} • {Math.round(file.size / 1024)} KB
                        </Typography>
                      </Box>
                    </Box>
                    <Stack direction="row" spacing={0.5}>
                      {file.mimetype.startsWith('image') ? (
                        <Tooltip title="Preview">
                          <IconButton 
                            size="small" 
                            onClick={() => handleImageClick(file)}
                          >
                            <ZoomInIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      ) : file.mimetype === 'application/pdf' ? (
                        <Tooltip title="Preview PDF">
                          <IconButton 
                            size="small" 
                            onClick={() => handlePdfClick(file)}
                          >
                            <ZoomInIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                      <Tooltip title="Download">
                        <IconButton 
                          size="small" 
                          onClick={() => window.open(file.path)}
                        >
                          <DownloadIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Actions */}
          <Box sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}>
           
            <Button variant="contained" size="small" color="primary" onClick={() => window.location.href = `mailto:${submission.email}?subject=Regarding your project submission&body=Hi ${submission.name},%0D%0A%0D%0AThanks for reaching out. We'd love to discuss your project further.`}>
              Contact Client
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Image Preview Modal */}
      <Dialog
        open={!!previewImage}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 0,
          height: '70vh',
          overflow: 'hidden'
        }}>
          <Box sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <img
              src={previewImage}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                transform: `scale(${zoomLevel})`,
                transition: 'transform 0.2s ease'
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{
          display: 'flex',
          justifyContent: 'space-between',
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Stack direction="row" spacing={1}>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
            >
              Zoom In
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.5}
            >
              Zoom Out
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={handleResetZoom}
              disabled={zoomLevel === 1}
            >
              Reset
            </Button>
          </Stack>
          <Button 
            variant="contained" 
            size="small" 
            onClick={handleClosePreview}
            startIcon={<CloseIcon />}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* PDF Preview Modal */}
      <Dialog
        open={!!previewPdf}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
        sx={{
          '& .react-pdf__Page': {
            backgroundColor: 'background.paper',
            boxShadow: 1,
            marginBottom: 2
          }
        }}
      >
        <DialogContent sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 3,
          overflowY: 'auto'
        }}>
         {loadingPdf ? (
  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
    <Typography>Loading PDF...</Typography>
  </Box>
) : (
<iframe src={previewPdf} width="100%" height="600px" />

)}

        </DialogContent>
        <DialogActions sx={{
          display: 'flex',
          justifyContent: 'space-between',
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          
          <Button 
            variant="contained" 
            size="small" 
            onClick={handleClosePreview}
            startIcon={<CloseIcon />}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}