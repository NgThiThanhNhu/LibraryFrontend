// SignalRProvider.tsx
import React, { createContext, useEffect, useState } from 'react';
import connection from '../utils/NotificationHub';
import { HubConnectionState } from '@microsoft/signalr';
import type { NotificationToUserResponse } from '../response/NotificationToUserResponse';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

export const SignalRContext = createContext({

});

export const SignalRProvider = ({ children }: { children: React.ReactNode }) => {
    const [notificationsContext, setNotificationsContext] = useState<NotificationToUserResponse>();
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const startConnection = async () => {
            try {
                if (connection.state === HubConnectionState.Disconnected) {
                    await connection.start();
                    console.log("✅ SignalR connected");
                    console.log("State after start:", connection.state);

                    setConnected(true);
                }
            } catch (error) {
                console.error("❌ SignalR connection error:", error);
                setTimeout(startConnection, 5000); // Retry after 5s
            }
        };
        // Bắt đầu kết nối
        startConnection();
        connection.off("ReceiveMessage");

        // Nhận thông báo từ server
        connection.on("ReceiveMessage", (data: NotificationToUserResponse) => {
            console.log("ReceiveMessage", data);
            setNotificationsContext(data);
            toast.info(

                <div style={{ maxWidth: "250px" }}>
                    <strong>{data.title}</strong>
                    <p style={{ margin: "4px 0" }}>{data.message}</p>
                    <small style={{ color: "#888" }}>
                        {dayjs(data.sendTime).fromNow()}
                    </small>
                </div>,
                {
                    icon: <span>🔔</span>,
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    theme: "light",
                }
            );

        });

        // Reconnect logic
        connection.onreconnected(() => {
            console.log("🔄 SignalR reconnected");
            setConnected(true);
        });

        connection.onreconnecting(() => {
            console.warn("⚠️ SignalR reconnecting...");
            setConnected(false);
        });

        connection.onclose(() => {
            console.warn("🛑 SignalR disconnected");
            setConnected(false);
        });

        // Cleanup
        return () => {
            connection.stop();
        };
    }, []);

    return (
        <SignalRContext.Provider value={{}}>
            {children}
        </SignalRContext.Provider>
    );
};
