import { createContext, useContext, useReducer, useEffect } from "react";
import { io } from "socket.io-client";

const ChatContext = createContext();

const initialState = {
    messages: [],
    isConnected: false,
    socket: null,
    loading: false,
    error: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "INIT_SOCKET":
            return {
                ...state,
                socket: action.payload,
                isConnected: true,
                loading: false,
            };
        case "ADD_MESSAGE":
            return {
                ...state,
                messages: [...state.messages, action.payload],
                loading: false,
            };
        case "SET_ERROR":
            return { ...state, error: action.payload, loading: false };
        case "SET_LOADING":
            return { ...state, loading: action.payload };
        default:
            return state;
    }
};

/**
 * Provides chat context and state management for the chat application.
 * Initializes a Socket.io connection, handles incoming and outgoing messages,
 * and exposes chat state and sendMessage function to children components.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render within the provider.
 * @returns {JSX.Element} The ChatContext provider with chat state and actions.
 */
export const ChatProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        let socket;
        const initSocket = async () => {
            dispatch({ type: "SET_LOADING", payload: true });
            try {
                const url = import.meta.env.VITE_BACKEND_URL;
                socket = io(url, {
                    transports: ["websocket"],
                });

                socket.on("connect", () => {
                    dispatch({ type: "INIT_SOCKET", payload: socket });
                    dispatch({
                        type: "ADD_MESSAGE",
                        payload: {
                            text: "Connected to chat!",
                            isBot: true,
                            timestamp: new Date().toISOString(),
                        },
                    });
                });

                socket.on("message", (message) => {
                    dispatch({
                        type: "ADD_MESSAGE",
                        payload: {
                            text: message,
                            isBot: true,
                            timestamp: new Date().toISOString(),
                        },
                    });
                });

                socket.on("connect_error", (error) => {
                    dispatch({
                        type: "SET_ERROR",
                        payload: "Connection error",
                    });
                });
            } catch (error) {
                dispatch({
                    type: "SET_ERROR",
                    payload: "Failed to connect to chat server.",
                });
            } finally {
                dispatch({ type: "SET_LOADING", payload: false });
            }
        };

        initSocket();

        return () => {
            if (socket) socket.disconnect();
        };
    }, []);

    const sendMessage = (message) => {
        dispatch({ type: "SET_LOADING", payload: true });
        try {
            if (state.socket?.connected) {
                dispatch({
                    type: "ADD_MESSAGE",
                    payload: {
                        text: message,
                        isBot: false,
                        timestamp: new Date().toISOString(),
                    },
                });
                state.socket.emit("message", message);
            } else {
                dispatch({
                    type: "SET_ERROR",
                    payload: "Socket not connected.",
                });
            }
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: "Failed to send message." });
        } finally {
            dispatch({ type: "SET_LOADING", payload: false });
        }
    };

    return (
        <ChatContext.Provider value={{ ...state, sendMessage }}>
            {state.loading && (
                <div style={{ textAlign: "center", padding: "1rem" }}>
                    <span>Loading...</span>
                </div>
            )}
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
