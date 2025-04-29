# Use Node.js LTS base image
FROM node:18

# Set working directory
WORKDIR /app

# ----------------------
# Install backend deps
# ----------------------
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# ----------------------
# Install frontend deps & build
# ----------------------
WORKDIR /app
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install
COPY frontend ./frontend
RUN npm run build

# ----------------------
# Copy React build to backend/public
# ----------------------
WORKDIR /app
COPY backend ./backend
RUN cp -r frontend/build backend/public

# ----------------------
# Run backend
# ----------------------
WORKDIR /app/backend
EXPOSE 5000
CMD ["node", "server.js"]
