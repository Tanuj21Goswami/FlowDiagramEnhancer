
---

# FlowDiagramEnhancer

## Table of Contents
- [Introduction](#introduction)
- [Setup](#setup)
- [Usage](#usage)
- [Functionalities](#functionalities)

## Introduction
FlowDiagramEnhancer is a React-based application that allows users to create, manage, and visualize flow diagrams with custom node types. This project provides a user-friendly interface for adding, editing, and positioning various nodes within a diagram.

## Setup

### Prerequisites
- Node.js (version 14 or later)
- Git

### Installation
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Tanuj21Goswami/FlowDiagramEnhancer.git
   cd FlowDiagramEnhancer
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`.

## Usage

### Adding Nodes
- **Add Circular Node:** Click on the "Add Circular Node" button to add a new circular node to the diagram.
- **Add ICON Node:** Click on the "Add ICON Node" button to add a new icon node to the diagram.
- **Add Image Node:** Click on the "Add Image Node" button to add a new image node to the diagram.
- **Add Default Node:** Click on the "Add Default Node" button to add a new default node to the diagram.

### Managing Nodes
- **Equispace Nodes:** Click on the "Equispace Nodes" button to automatically arrange nodes in an equidistant manner.
- **Undo:** Click on the "Undo" button to undo the last action.
- **Redo:** Click on the "Redo" button to redo the last undone action.

### Interacting with Nodes
- **Drag and Drop:** Nodes can be dragged and repositioned within the diagram.
- **Connect Nodes:** Click and drag from one node to another to create a connection.

## Functionalities



### History Management
- **Undo/Redo:** The application maintains a history of actions, allowing users to undo and redo changes.

### Node Positioning
- **Equispacing:** Automatically arrange nodes to ensure they are evenly spaced both vertically and horizontally.

### Connection Management
- **Branching:** Nodes can be connected to form branches, with restrictions on connecting nodes from different branches.

- **Parallel End Labeling:** When connecting nodes, if the target node is a circular node, the source node's label will be updated to include "Parallel End," indicating the end of a parallel branch.

