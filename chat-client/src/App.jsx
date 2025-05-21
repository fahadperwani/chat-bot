import { ChatProvider } from "./context/ChatContext";
import ChatInterface from "./components/ChatInterface";
import { Box, Container, Typography } from "@mui/material";

function App() {
    return (
        <ChatProvider>
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Flight Booking Assistant
                    </Typography>
                </Box>
                <ChatInterface />
            </Container>
        </ChatProvider>
    );
}

export default App;
