function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Customer joins their order room to get live updates
    socket.on('join_order_room', (orderId) => {
      socket.join(`order_${orderId}`);
      console.log(`[Socket] Joined order room: order_${orderId}`);
    });

    // Kitchen joins kitchen room
    socket.on('join_kitchen', () => {
      socket.join('kitchen');
      console.log(`[Socket] Kitchen screen connected`);
    });

    // Token display screen joins token room
    socket.on('join_token_display', () => {
      socket.join('token_display');
      console.log(`[Socket] Token display connected`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });
}

module.exports = { setupSocket };
