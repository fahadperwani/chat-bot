import { Paper, Typography, Avatar, Box, Fade } from "@mui/material";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

/**
 * Message component displays a single chat message
 * with a timestamp and adjusts its background and
 * text color depending on whether the message is
 * from the user or the bot. The component also
 * adjusts its border radius to make it look like
 * a chat bubble.
 *
 * @param {{ isBot: boolean, text: string, timestamp: string }} message
 * @returns {JSX.Element}
 */
const Message = ({ message }) => {
    return (
        <Fade in={true} timeout={500}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: message.isBot ? "row" : "row-reverse",
                    alignItems: "flex-start",
                    gap: 1.5,
                    width: "100%",
                }}
            >
                {/* Avatar */}
                <Avatar
                    sx={{
                        bgcolor: message.isBot
                            ? "primary.light"
                            : "secondary.main",
                        width: 40,
                        height: 40,
                    }}
                >
                    {message.isBot ? (
                        <SmartToyOutlinedIcon fontSize="small" />
                    ) : (
                        <PersonOutlineOutlinedIcon fontSize="small" />
                    )}
                </Avatar>

                {/* Message Bubble */}
                <Paper
                    elevation={1}
                    sx={{
                        p: 2,
                        bgcolor: message.isBot ? "grey.50" : "primary.main",
                        color: message.isBot ? "text.primary" : "#fff",
                        maxWidth: "70%",
                        minWidth: "100px",
                        borderRadius: message.isBot
                            ? "4px 20px 20px 20px"
                            : "20px 4px 20px 20px",
                        position: "relative",
                        "&::after": message.isBot
                            ? {
                                  content: '""',
                                  position: "absolute",
                                  left: "-8px",
                                  top: "15px",
                                  border: "8px solid transparent",
                                  borderRight: "8px solid",
                                  borderRightColor: "grey.50",
                                  transform: "translateY(-50%)",
                              }
                            : {
                                  content: '""',
                                  position: "absolute",
                                  right: "-8px",
                                  top: "15px",
                                  border: "8px solid transparent",
                                  borderLeft: "8px solid",
                                  borderLeftColor: "primary.main",
                                  transform: "translateY(-50%)",
                              },
                    }}
                >
                    <Typography
                        variant="body1"
                        sx={{
                            wordBreak: "break-word",
                            whiteSpace: "pre-wrap",
                        }}
                    >
                        {message.text}
                    </Typography>

                    <Typography
                        variant="caption"
                        sx={{
                            display: "block",
                            mt: 1,
                            textAlign: message.isBot ? "left" : "right",
                            color: message.isBot
                                ? "text.secondary"
                                : "rgba(255, 255, 255, 0.7)",
                            fontSize: "0.7rem",
                        }}
                    >
                        {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Typography>
                </Paper>
            </Box>
        </Fade>
    );
};

export default Message;
