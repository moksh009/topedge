import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Container,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  useTheme,
  alpha,
  Collapse,
  Tooltip,
  Stack,
  Divider,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import SubjectIcon from '@mui/icons-material/Subject';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import TemplateIcon from '@mui/icons-material/AutoAwesome';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import UploadIcon from '@mui/icons-material/Upload';
import PreviewIcon from '@mui/icons-material/Preview';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { templates } from '../EmailTemplates/EmailTemplates';
import TemplatePreviewModal from '../EmailTemplates/TemplatePreviewModal';

function EmailForm({ onEmailGeneration, loading, selectedTemplate, onClose }) {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    subject: selectedTemplate?.subject || '',
    content: selectedTemplate?.content || '',
    attachments: []
  });
  
  const [recipients, setRecipients] = useState([]);
  const [newRecipient, setNewRecipient] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [trackingIds, setTrackingIds] = useState([]);
  const [sending, setSending] = useState(false);
  const [availableSenders, setAvailableSenders] = useState([]);
  const [selectedSenders, setSelectedSenders] = useState([]);

  useEffect(() => {
    // Fetch available senders when component mounts
    fetch('/api/senders')
      .then(res => res.json())
      .then(data => {
        setAvailableSenders(data);
        // By default, select all senders
        setSelectedSenders(data.map(sender => sender.id));
      })
      .catch(error => {
        console.error('Error fetching senders:', error);
        toast.error('Failed to fetch email senders');
      });
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      setFormData(prev => ({
        ...prev,
        subject: selectedTemplate.subject || prev.subject,
        content: selectedTemplate.content || prev.content
      }));
    }
  }, [selectedTemplate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRecipient = () => {
    if (newRecipient) {
      const [name] = newRecipient.split('@');
      if (!recipients.some(r => r.email === newRecipient)) {
        // Store only name without email for personalization
        setRecipients([...recipients, { 
          email: newRecipient, 
          name: name.split(',')[0].trim() // Take only the first part if there's a comma
        }]);
        setNewRecipient('');
      }
    }
  };

  const handleRemoveRecipient = (recipientToRemove) => {
    setRecipients(recipients.filter((recipient) => recipient.email !== recipientToRemove.email));
  };

  const handleCsvUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const emails = text.split(/[\n,]/)
          .map(email => email.trim())
          .filter(email => email)
          .map(email => {
            const [name] = email.split('@');
            return {
              email,
              name: name.split(',')[0].trim() // Take only the first part if there's a comma
            };
          });
        setRecipients(prev => {
          const uniqueEmails = [...prev];
          emails.forEach(newEmail => {
            if (!uniqueEmails.some(existing => existing.email === newEmail.email)) {
              uniqueEmails.push(newEmail);
            }
          });
          return uniqueEmails;
        });
      };
      reader.readAsText(file);
    }
  };

  const handleAttachmentUpload = (event) => {
    const files = Array.from(event.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const handleRemoveAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipients.length || !formData.subject || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (selectedSenders.length === 0) {
      toast.error('Please select at least one sender email');
      return;
    }

    setSending(true);
    try {
      // Generate personalized emails
      const generatedEmails = recipients.map(recipient => {
        return {
          to: recipient.email,
          subject: formData.subject.replace(/{{name}}/g, recipient.name),
          content: formData.content.replace(/{{name}}/g, recipient.name),
          attachments: attachments,
          status: 'generated', // Add status to track email state
          selectedSenders // Add selected senders to each email
        };
      });

      // Call onEmailGeneration with generated emails
      onEmailGeneration(generatedEmails);
      
      // Show success message
      toast.success('Emails generated successfully! Check the generated emails section below.');

      // Don't reset the form to allow for edits and regeneration
    } catch (error) {
      console.error('Error generating emails:', error);
      toast.error('Failed to generate emails');
    } finally {
      setSending(false);
    }
  };

  const handleSendEmail = async (emailData) => {
    try {
      const formData = new FormData();
      formData.append('to', emailData.to);
      formData.append('subject', emailData.subject);
      formData.append('content', emailData.content);
      formData.append('selectedSenders', JSON.stringify(selectedSenders));

      if (emailData.attachments?.length > 0) {
        emailData.attachments.forEach(file => {
          formData.append('attachments', file);
        });
      }

      const response = await fetch('http://localhost:3001/send-email', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };

  const handlePreview = (template) => {
    setShowPreview(true);
    setFormData({
      subject: template.subject,
      content: template.content
    });
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleTemplateSelect = (template) => {
    setFormData({
      subject: template.subject,
      content: template.content
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Paper 
            elevation={3}
            sx={{
              p: 0,
              overflow: 'hidden',
              bgcolor: 'background.paper',
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2,
                }}
              >
                <EmailIcon /> Compose Email
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  Select a Template
                </Typography>
                <Grid container spacing={3}>
                  {templates.map((template, index) => (
                    <Grid item xs={12} sm={6} md={4} key={template.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Card
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
                              background: template.color || '#2196f3',
                              opacity: 1,
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
                                  color: 'text.primary',
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
                                bgcolor: `${template.color || '#2196f3'}15`,
                                color: template.color || '#2196f3',
                                fontWeight: 500,
                              }} 
                            />
                          </CardContent>
                          <CardActions sx={{ p: 2, pt: 0 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<PreviewIcon />}
                              onClick={() => handlePreview(template)}
                              sx={{
                                borderColor: template.color || '#2196f3',
                                color: template.color || '#2196f3',
                                '&:hover': {
                                  borderColor: template.color || '#2196f3',
                                  bgcolor: alpha(template.color || '#2196f3', 0.1),
                                },
                              }}
                            >
                              Preview
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<ContentCopyIcon />}
                              onClick={() => handleTemplateSelect(template)}
                              sx={{
                                ml: 'auto',
                                bgcolor: template.color || '#2196f3',
                                '&:hover': {
                                  bgcolor: template.color || '#2196f3',
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
              </Box>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                    Recipients
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      placeholder="Enter one recipient per line in the format: Name, email@example.com"
                      value={newRecipient}
                      onChange={(e) => setNewRecipient(e.target.value)}
                      multiline
                      rows={3}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'background.paper',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<PersonAddIcon />}
                      onClick={handleAddRecipient}
                      size="small"
                    >
                      Add Recipients
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<UploadIcon />}
                      component="label"
                      size="small"
                    >
                      Upload CSV
                      <input
                        type="file"
                        hidden
                        accept=".csv"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleCsvUpload(e);
                            e.target.value = '';
                          }
                        }}
                      />
                    </Button>
                  </Box>
                  {recipients.length > 0 && (
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 1,
                        bgcolor: 'rgba(0, 0, 0, 0.05)',
                        boxShadow: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle2" color="text.primary">
                          Added Recipients ({recipients.length})
                        </Typography>
                        {recipients.length > 0 && (
                          <Button
                            size="small"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => setRecipients([])}
                          >
                            Clear All
                          </Button>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {recipients.map((recipient, index) => (
                          <Chip
                            key={index}
                            label={recipient.email}
                            onDelete={() => handleRemoveRecipient(recipient)}
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.2),
                              },
                              '& .MuiChip-deleteIcon': {
                                color: theme.palette.primary.main,
                                '&:hover': {
                                  color: theme.palette.error.main,
                                },
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>

                <Divider />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Select Sender Email(s)
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {availableSenders.map((sender) => (
                      <Chip
                        key={sender.id}
                        label={sender.email}
                        onClick={() => {
                          setSelectedSenders(prev =>
                            prev.includes(sender.id)
                              ? prev.filter(id => id !== sender.id)
                              : [...prev, sender.id]
                          );
                        }}
                        color={selectedSenders.includes(sender.id) ? "primary" : "default"}
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </Stack>
                </Box>

                <TextField
                  fullWidth
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: <SubjectIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={6}
                  placeholder="Use {{name}}, {{first_name}}, {{sender_name}}, {{company_name}} for personalization"
                  InputProps={{
                    startAdornment: <DescriptionIcon sx={{ mr: 1, mt: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />

                <Box>
                  <input
                    type="file"
                    multiple
                    onChange={handleAttachmentUpload}
                    style={{ display: 'none' }}
                    id="file-input"
                  />
                  <label htmlFor="file-input">
                    <Button
                      component="span"
                      variant="outlined"
                      startIcon={<AttachFileIcon />}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.2s',
                      }}
                    >
                      Attach Files
                    </Button>
                  </label>

                  {attachments.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
                        Attachments ({attachments.length})
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {attachments.map((file, index) => (
                          <Chip
                            key={index}
                            label={file.name}
                            onDelete={() => handleRemoveAttachment(index)}
                            size="small"
                            variant="outlined"
                            sx={{
                              m: 0.5,
                              borderRadius: 1,
                              bgcolor: alpha(theme.palette.primary.main, 0.05),
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<TemplateIcon />}
                    disabled={sending || !recipients.length || !formData.subject || !formData.content || selectedSenders.length === 0}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: 2,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4,
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    {sending ? 'Generating...' : 'Generate Emails'}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Paper>
        </motion.div>
      </AnimatePresence>
      <TemplatePreviewModal
        open={showPreview}
        onClose={handleClosePreview}
        template={formData}
      />
      {trackingIds.length > 0 && (
        <Box sx={{ mt: 2, borderTop: 1, pt: 2, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Track Sent Emails
          </Typography>
          {trackingIds.map((track, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {track.to}
              </Typography>
              <Button
                startIcon={<TrackChangesIcon />}
                onClick={() => handleTrackEmail(track.id)}
                variant="outlined"
                size="small"
              >
                Track
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default EmailForm;