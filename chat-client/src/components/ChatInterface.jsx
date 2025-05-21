import { useState, useRef, useEffect } from "react";
import { useChat } from "../context/ChatContext";
import {
    Box,
    TextField,
    IconButton,
    Paper,
    List,
    ListItem,
    Typography,
    Divider,
    LinearProgress,
    InputAdornment,
    Slide,
} from "@mui/material";
import Message from "./Message";
import SendIcon from "@mui/icons-material/Send";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";

// ChatInterface component provides a user interface for a chat application
// It utilizes the useChat context to manage messages and sending functionality
// The component handles message input, submission, and automatic scrolling
const ChatInterface = () => {
    // Access messages and sendMessage function from chat context
    const { messages, sendMessage } = useChat();

    // State for managing the current input value and typing status
    const [input, setInput] = useState("");

    // Ref to keep track of the end of the messages list for scrolling
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Function to scroll to the bottom of the messages list
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Trigger scroll to bottom whenever messages update
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle form submission to send a message
    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            // Ensure input is not empty or whitespace
            sendMessage(input.trim());
            setInput(""); // Clear input field after sending
        }
    };

    // Focus input field when component mounts
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <Paper
            elevation={3}
            sx={{
                height: "80vh",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
            }}
        >
            {/* Chat Header */}
            <Box
                sx={{
                    p: 2,
                    bgcolor: "primary.main",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Typography variant="h6" fontWeight="medium">
                    Flight Assistant
                </Typography>
            </Box>

            {/* Messages Container */}
            <Box
                sx={{
                    flexGrow: 1,
                    overflow: "auto",
                    p: 2,
                    bgcolor: "#f5f8fb",
                }}
            >
                {messages.length === 0 ? (
                    <Box
                        sx={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            align="center"
                        >
                            No messages yet. Start a conversation!
                        </Typography>
                    </Box>
                ) : (
                    <List sx={{ py: 0 }}>
                        {messages.map((message, index) => (
                            <ListItem
                                key={index}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    px: 1,
                                    py: 0.5,
                                }}
                            >
                                <Message message={message} />
                            </ListItem>
                        ))}
                        <div ref={messagesEndRef} />
                    </List>
                )}
            </Box>

            <Divider />

            {/* Input Area */}
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    p: 2,
                    bgcolor: "background.paper",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <IconButton size="small" color="primary">
                    <EmojiEmotionsOutlinedIcon />
                </IconButton>

                <IconButton size="small" color="primary">
                    <AttachFileOutlinedIcon />
                </IconButton>

                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    inputRef={inputRef}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 5,
                            bgcolor: "#f5f5f5",
                            "& fieldset": {
                                borderColor: "transparent",
                            },
                            "&:hover fieldset": {
                                borderColor: "primary.light",
                            },
                        },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    color="primary"
                                    sx={{
                                        visibility: input.trim()
                                            ? "visible"
                                            : "hidden",
                                    }}
                                    type="submit"
                                >
                                    <SendIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <IconButton size="medium" color="primary" sx={{ ml: 0.5 }}>
                    <MicNoneOutlinedIcon />
                </IconButton>
            </Box>
        </Paper>
    );
};

export default ChatInterface;
