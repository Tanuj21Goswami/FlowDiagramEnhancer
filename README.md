

# Flow Diagram Enhancer Project

This project implements a flow diagram with custom node types, equispacing of nodes, undo/redo functionality, and node addition/deletion. The project is built using React and the `react-flow-renderer` library.

## Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [Running the Application](#running-the-application)
- [Functionality Overview](#functionality-overview)

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Tanuj21Goswami/FlowDiagramEnhancer.git
   ```
2. **Checkout the Master Branch**

3. **Install Dependencies**:
   Make sure you have [Node.js](https://nodejs.org/) installed. Then, run the following command to install the necessary dependencies:
   ```bash
   npm install
   ```

## Setup

1. **Create a `.env` file**:
   Create a `.env` file in the root directory of the project to store any environment variables required. For this project, no specific environment variables are needed.

2. **Start the Development Server**:
   ```bash
   npm start
   ```

   This will start the application and open it in your default web browser at `http://localhost:3000`.

## Running the Application

To run the application locally, use the following command:
```bash
npm start
```

This will start the development server and the application will be accessible at `http://localhost:3000`.

## Functionality Overview

### 1. **Custom Nodes**

The application includes custom nodes such as:
- **Circular Nodes**
- **Icon Nodes**
- **Image Nodes**

Each node type can be added to the diagram using the provided buttons in the UI.

### 2. **Equispacing of Parallel Nodes**

Nodes can be evenly spaced out in the diagram by clicking the "Equispace Parallel Nodes" button. This ensures that nodes are arranged neatly and without overlap.

### 3. **Undo/Redo Functionality**

The application supports undo and redo functionality through the keyboard also:
- **Undo**: Reverts the last change.
- **Redo**: Reapplies the last undone change.

### 4. **Node Addition and Deletion**

Nodes can be added to the diagram using the provided buttons. Each node is assigned a branch number by the user.

Nodes can also be deleted by entering the node ID and clicking the "Delete Node" button.


### 6. **Maintaining Parallel End Tags**

Nodes are labeled with unique IDs and a 'Parallel End' tag to maintain clarity in the flow diagram. This ensures that each branch is distinct and easily identifiable.

### 7. **User-Defined Branch Numbers**

Users can decide the branch number before adding any node. This functionality allows for more control over the organization of nodes within the flow diagram.

### 8. **Branch Restriction**

Nodes of different branches cannot be joined together to maintain clarity in the diagram. This restriction helps in keeping the diagram organized and prevents confusion.



## Conclusion

This project demonstrates a comprehensive flow diagram application with various features for managing nodes and edges. The application is designed to be intuitive and user-friendly, allowing for easy manipulation and visualization of flow diagrams.

