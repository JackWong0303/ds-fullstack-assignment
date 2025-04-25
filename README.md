# Project Architecture and Setup

## Architecture Overview

This full-stack chat application consists of a React frontend and Python backend with real-time message processing capabilities.

### Frontend

- **Framework**: Next.js with React and TypeScript
- **UI**: shadcn/ui components with Tailwind CSS styling
- **State Management**: React Query for API interactions
- **Animations**: Framer Motion for smooth transitions and feedback
- **Testing**: Jest and React Testing Library

### Backend

- **Framework**: FastAPI
- **Services**:
  - Response Service: Generates text/file/image responses
  - Image Processor: Handles image dimension detection

### Key Features

- Text messaging interface
- File/image upload and processing
- Animated UI elements
- Responsive message bubbles
- Chat history management

## Local Development

### Prerequisites

Before you begin, ensure you have the following software installed on your system. It's recommended to use the specified versions to ensure compatibility.

- **Git:** Required for cloning the repository.
  - _Installation Guide:_ [https://git-scm.com/book/en/v2/Getting-Started-Installing-Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- **Docker and Docker Compose:** Required for building and running the application using containers. The latest stable version is generally recommended.
  - _Installation Guide:_ [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)
  - _Docker Compose Installation:_ Often included with Docker Desktop. See [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)
- **Node.js:** Required for the frontend development environment.
  - _Recommended Version:_ v22.14.0 (as specified in `.nvmrc`)
  - _Installation Guide:_ We recommend using a version manager like [nvm](https://github.com/nvm-sh/nvm) to easily switch Node.js versions. Once nvm is installed, you can run `nvm install` in the project root directory to install and use the correct version. Alternatively, download from [https://nodejs.org/](https://nodejs.org/).
- **Python:** Required for the backend development environment.
  - _Recommended Version:_ 3.11.x (as specified in `backend/Dockerfile`)
  - _Installation Guide:_ [https://www.python.org/downloads/](https://www.python.org/downloads/). We recommend using a tool like `pyenv` or managing environments with `venv`.

### Frontend Commands

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Backend Commands

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn main:app --reload

# Run tests
pytest
```

## Docker Setup

For containerized development and deployment:

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# Stop all services
docker-compose down
```

## Message Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant ImageProcessor

    User->>Frontend: Enter text message
    Frontend->>Frontend: Update UI state
    Frontend->>Backend: POST /api/chat (type: "text")
    Backend->>Backend: Process message
    Backend->>Frontend: Return response
    Frontend->>Frontend: Display message bubble with animation

    User->>Frontend: Upload image
    Frontend->>Frontend: Show upload progress animation
    Frontend->>Frontend: Preview image
    Frontend->>Backend: POST /api/chat (type: "image")
    Backend->>ImageProcessor: Get dimensions & analyze
    ImageProcessor->>Backend: Return processed info
    Backend->>Frontend: Return formatted response
    Frontend->>Frontend: Display image message with animation

    User->>Frontend: Click Reset button
    Frontend->>Frontend: Clear message history
    Frontend->>Frontend: Display welcome message
```

![Message Flow Diagram](./sequence_diagram.png)

## Data Flow

1. **User Input**: Text messages or file uploads from the UI
2. **Frontend Processing**: Local state updates and optimistic UI changes
3. **API Communication**: Requests to backend endpoints with appropriate payloads
4. **Backend Processing**: Message/file analysis and response generation
5. **Response Rendering**: Animated display of responses with appropriate formatting
