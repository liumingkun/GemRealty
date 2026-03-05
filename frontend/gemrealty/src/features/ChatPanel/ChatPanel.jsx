import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setQuery, performSearch, clearSearch, addMessage } from '../../store/slices/searchSlice';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    IconButton,
    Divider
} from '@mui/material';
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import SendIcon from '@mui/icons-material/Send';

const DeleteOutlineIcon = () => <span>[Clear]</span>;
const SendIcon = () => <span>[Send]</span>;

const ChatPanel = () => {
    const dispatch = useDispatch();
    const { conversationHistory, loading, sessionId } = useSelector((state) => state.search);
    const [inputQuery, setInputQuery] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversationHistory]);

    const handleSearch = () => {
        if (!inputQuery.trim()) return;
        dispatch(addMessage({ role: 'user', parts: inputQuery }));
        dispatch(setQuery(inputQuery));
        dispatch(performSearch({ query: inputQuery, conversationHistory, sessionId }));
        setInputQuery('');
    };

    const handleClear = () => {
        dispatch(clearSearch());
    };

    return (
        <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                <Typography variant="h6">Assistant</Typography>
                <IconButton size="small" onClick={handleClear} sx={{ color: 'inherit' }} title="Clear Chat">
                    <DeleteOutlineIcon />
                </IconButton>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                <List>
                    {conversationHistory.length === 0 && (
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
                            How can I help you find a property today?
                        </Typography>
                    )}
                    {conversationHistory.map((msg, index) => (
                        <ListItem
                            key={index}
                            sx={{
                                flexDirection: 'column',
                                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                mb: 1
                            }}
                        >
                            <Paper
                                elevation={1}
                                sx={{
                                    p: 1.5,
                                    bgcolor: msg.role === 'user' ? 'primary.light' : 'grey.100',
                                    color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                                    maxWidth: '90%',
                                    borderRadius: msg.role === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0'
                                }}
                            >
                                <Typography variant="body2">
                                    {typeof msg.parts === 'string' ? msg.parts : JSON.stringify(msg.parts)}
                                </Typography>
                            </Paper>
                        </ListItem>
                    ))}
                    <div ref={messagesEndRef} />
                </List>
            </Box>

            <Divider />
            <Box sx={{ p: 2, bgcolor: 'background.default' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        placeholder="Type your search here..."
                        variant="outlined"
                        size="small"
                        value={inputQuery}
                        onChange={(e) => setInputQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSearch();
                            }
                        }}
                        disabled={loading}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSearch}
                        disabled={loading || !inputQuery.trim()}
                        sx={{ minWidth: 'auto', px: 2 }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ChatPanel;
