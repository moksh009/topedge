import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  Chip,
  CardActions,
  Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import PreviewIcon from '@mui/icons-material/Preview';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TemplatePreviewModal from './TemplatePreviewModal';

// Define email templates
export const templates = [
  {
    id: 1,
    name: 'Save Your Time Template 1',
    subject: '{{name}} see this if you want to save your time',
    content: `{{name}},\n\nI assume your front desk manages all calls, from inquiries to appointment bookings over the phone,\n\n& no one answers the call after hours, and occasionally you miss calls from potential patients.\n\nSee, I've developed something that takes care of all your clinic's calls with its own intelligence. It can communicate live with callers—it's called Conversational AI.\n\nThis handles all your clinic's calls independently, from inquiries to scheduling appointments on your calendar & sending SMS-Email confirmations post-scheduling.\n\nHere's how Conversational AI sounds—watch this 59-second video.\nIf this doesn't interest you, delete this email.\nSend me a reply to learn more.`,
    color: '#2196f3'
  },
  {
    id: 2,
    name: 'Save Your Time Template 2',
    subject: '{{name}} do you want to save your time ?',
    content: `hello {{name}},\n\nI assume your front desk manages all calls, from inquiry to scheduling appointments over calls,\n\n& no one responds to calls after hours, and at times you miss calls from prospective patients.\n\nSee, I've created something that manages all calls for your clinic using its own intelligence. It can converse live with callers—it's called Conversational AI.\n\nThis takes care of all your clinic's calls using its intelligence, from inquiries to booking appointments on your calendar & sending SMS-Email notifications after booking.\n\nHere's how Conversational AI sounds—watch this 59-second video.\nIf this doesn't seem useful to you, delete this email.\nRespond to learn more.`,
    color: '#f50057'
  },
  {
    id: 3,
    name: 'Save Time & Resources Template',
    subject: '{{name}} save your time and resources immediately',
    content: `hey {{name}},\n\nI assume your front desk looks after all calls, from inquiries to booking appointments via phone,\n\n& no one answers calls post-working hours, and sometimes calls from potential patients go unanswered.\n\nSee, I've built something that manages all clinic calls using its intelligence. It can interact live with callers—it's called Conversational AI.\n\nThis manages your clinic's calls entirely, from inquiries to confirming appointments on your calendar & sending SMS-Email follow-ups after scheduling.\n\nHere's how Conversational AI sounds—watch this 59-second video.\nIf this doesn't appeal to you, delete this mail.\nDrop me a response to know more.`,
    color: '#00bcd4'
  },
  {
    id: 4,
    name: 'Stay Ahead Template',
    subject: '{{name}} watch this else you stay behind the world !',
    content: `see this {{name}},\n\nI assume your front desk answers all calls, from handling inquiries to setting appointments over the phone,\n\n& calls after business hours are missed, and sometimes calls from potential patients don't get through.\n\nSee, I've made something that oversees all calls for clinics using its intelligence. It can talk live with callers—it's called Conversational AI.\n\nThis looks after all your clinic's calls independently, from handling inquiries to adding appointments on your calendar & sending SMS-Email confirmations after scheduling.\n\nHere's how Conversational AI sounds—watch this 59-second video.\nIf this doesn't catch your interest, delete this email.\nReply to learn more.`,
    color: '#4caf50'
  },
  {
    id: 5,
    name: 'Future Vision Template',
    subject: '{{name}} do you want to see future ?',
    content: `be ready to see {{name}},\n\nI assume your front desk handles all calls, from inquiry to appointment setting over the call,\n\n& no one picks up the call after hours, and sometimes you miss calls from potential patients.\n\nSee, I've made something that handles all calls of clinic with its own intelligence. It can communicate live with callers—it's called Conversational AI.\n\nthis handles all your clinic's calls on its own intelligence, from inquiries to booking appointments on your calendar & sending SMS-Email confirmations after scheduling.\n\nhere's how Conversational AI sounds—watch this 59-second video.\nif this doesn't excite you, delete this mail\nsend me response to know more`,
    color: '#ff9800'
  }
];

const EmailTemplates = ({ onSelectTemplate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  const handleSelectTemplate = (template) => {
    onSelectTemplate(template);
  };

  const handlePreview = (template, event) => {
    event.stopPropagation();
    setSelectedTemplate(template);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  return (
    <>
      <Grid container spacing={3} sx={{ p: 3 }}>
        {templates.map((template, index) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              style={{ height: '100%' }}
              whileHover={{ scale: 1.02 }}
            >
              <Card
                variant="outlined"
                onMouseEnter={() => setHoveredId(template.id)}
                onMouseLeave={() => setHoveredId(null)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  },
                  transition: 'all 0.3s ease-in-out',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: template.color,
                    opacity: hoveredId === template.id ? 1 : 0.7,
                    transition: 'opacity 0.3s ease-in-out',
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      component="div" 
                      sx={{ 
                        fontWeight: 600,
                        color: hoveredId === template.id ? template.color : 'text.primary',
                        transition: 'color 0.3s ease-in-out'
                      }}
                    >
                      {template.name}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      opacity: 0.9,
                      minHeight: '3em',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {template.subject}
                  </Typography>
                  <Chip 
                    label="AI Template" 
                    size="small" 
                    sx={{ 
                      bgcolor: `${template.color}15`,
                      color: template.color,
                      fontWeight: 500,
                    }} 
                  />
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PreviewIcon />}
                    onClick={(e) => handlePreview(template, e)}
                    sx={{
                      borderColor: template.color,
                      color: template.color,
                      '&:hover': {
                        borderColor: template.color,
                        backgroundColor: `${template.color}10`,
                      }
                    }}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<ContentCopyIcon />}
                    onClick={() => handleSelectTemplate(template)}
                    sx={{
                      ml: 'auto',
                      bgcolor: template.color,
                      '&:hover': {
                        bgcolor: template.color,
                        filter: 'brightness(0.9)',
                      }
                    }}
                  >
                    Use Template
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      <TemplatePreviewModal
        open={previewOpen}
        onClose={handleClosePreview}
        template={selectedTemplate}
      />
    </>
  );
};

export default EmailTemplates;
