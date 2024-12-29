import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';

const TemplatePreviewModal = ({ open, onClose, template }) => {
  if (!template) return null;

  const handleClose = (event, reason) => {
    if (reason === 'backdropClick') {
      onClose();
    }
    onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: 2,
              bgcolor: '#2A2A2A',
              color: 'white',
              overflow: 'hidden',
            },
            '& .MuiDialogContent-root': {
              bgcolor: '#2A2A2A',
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Box
              sx={{
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: template.color || '#2196f3',
                }
              }}
            >
              <DialogTitle
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 3,
                  color: 'white',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {template.name}
                </Typography>
                <IconButton
                  edge="end"
                  onClick={handleClose}
                  aria-label="close"
                  sx={{
                    color: 'white',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'rotate(90deg)',
                      color: template.color || '#2196f3',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
            </Box>
            
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            
            <DialogContent sx={{ p: 3 }}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 500,
                    mb: 2 
                  }}
                >
                  {template.subject}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: 'white',
                    whiteSpace: 'pre-wrap',
                    fontWeight: 500,
                    lineHeight: 1.6,
                  }}
                >
                  {template.content}
                </Typography>
              </motion.div>
            </DialogContent>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default TemplatePreviewModal;
