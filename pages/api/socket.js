import { Server } from 'socket.io';

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('join-conversation', (wa_id) => {
        socket.join(`conversation-${wa_id}`);
        console.log(`Socket ${socket.id} joined conversation-${wa_id}`);
      });

      socket.on('leave-conversation', (wa_id) => {
        socket.leave(`conversation-${wa_id}`);
        console.log(`Socket ${socket.id} left conversation-${wa_id}`);
      });

      socket.on('new-message', (data) => {
        // Broadcast new message to all clients in the conversation
        socket.to(`conversation-${data.wa_id}`).emit('message-received', data);
        console.log('Broadcasting message to conversation:', data.wa_id);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }
  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};
