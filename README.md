# Banana Blockchain

The Banana Blockchain is a transparent, immutable ledger system designed to track produce (specifically bananas, but adaptable to any perishable goods) from the farm to the retailer. By recording every transfer and storage event on an append-only, cryptographically secured digital chain, we restore trust and accountability in the agricultural supply chain.

## The Problem

Today's food supply chains are fragmented, leading to a major issue: a lack of trust and traceability. When a product recall occurs or quality issues arise, tracing the exact point of failure is slow, costly, and often impossible. Consumers often demand more information about the origins of their food and desire a source of accountability for the upcharged "organic" or "fair-trade" produce they're purchasing. 

## The Solution: An Immutable, Stateless Ledger

* Immutable Ledger: Every action (Harvest, Transfer, Store) creates a new Ledger Block that is mathematically linked to the previous one via a SHA-256 hash. If any single piece of data is changed, the entire chain is invalidated, instantly flagging tampering.

* Crate-Level Granularity: Batches are broken down by individual crate, allowing for precise tracking and auditing of small units, not just large lots.

* Intuitive Proof for the  User: Each customer is able to easily enter their produce code and view a real, mapped trail of the life of their good, complete with security audits and verification. 

## Audit and Technical Features

### The Process:

* Unique ID creation for each batch, complete with QR code generation with easy downloading at the genesis block when a batch is created. These codes are placed on each crate and get monitored throughout the supply chain. 

* Easy scanning and blockchain updating over each transfer step is encouraged using both the QR codes, natural input parsing, and GPS coordinates. This simultaneously allows for chain verification and forking of the batch. 

* Beautiful and robust customer-focused features. The consumer can easily input their produce's code (e.g. APL2-65T2-CRATE_1) and view a real globe, highlighting each step of the process and giving the much-needed peace of mind for the customer. 

### Auditing Features:

* Chain confirmation: Hashes are computed to be cryptographically secure. That means that when data is altered throughout the chain, the hash will change, too. In this step, we rerun the UNIQUE hashing function to assess the validity of the blockchain, which is maintained to be truthful by creating the blocks using GPS coordinates and the current time, in combination with a QR code scan. 

* Haversine Geo-Auditing: Uses the haversine function to calculate the distance between two points on the globe, and compares that with a reasonable time it should take for produce to travel that distance. This prevents fraudulent "transfers," where items are declared to have arrived when they really haven't. 

### This project is running on a Python backend connected to a React frontend. Flask and Vite used for the respective servers. Now, let's see how to install and run the program

## Getting Started

Follow these steps to set up the project locally. You will need to use **two separate terminal windows**—one for the backend and one for the frontend.

### Prerequisites

Ensure you have the following installed on your system:

1.  **Python 3**
2.  **Node.js & npm** (Node Package Manager)
3.  **git**

### Step 1: Clone the Repository

Clone this repository to your local machine and navigate into the root directory. 

### Step 2: Backend Setup (Terminal Window 1)

This process sets up the Python environment using a virtual environment (`venv`).

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create the Virtual Environment:**
    ```bash
    python -m venv venv
    ```

3.  **Activate the Virtual Environment:**
    * **macOS/Linux:**
        ```bash
        source venv/bin/activate
        ```
    * **Windows (Command Prompt):**
        ```bash
        .\venv\Scripts\activate
        ```

4.  **Install Python Dependencies:**
    This command reads the `requirements.txt` file and installs everything needed to run your backend:
    ```bash
    pip install -r requirements.txt
    ```

5.  **Run the Backend Server:**
    Start your Python server.
    ```bash
    python app.py
    ```
    Leave this terminal window running.

### Step 3: Frontend Setup (Terminal Window 2)

Open a **new terminal window** and follow these steps for the client-side application.

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install Node Dependencies:**
    This command reads your `package.json` file and installs all production and development dependencies:
    ```bash
    npm install
    ```

3.  **Run the Frontend Development Server:**
    This command starts the client-side server prompts you to open the application in your browser at `http://localhost:5173`.
    ```bash
    npm run dev
    ```
    Leave this terminal window running.

Now, you may act as the different players in the supply chain, eventually making it to the customer view and seeing the entire process. 

## Possible Next Steps

Due to time constraints, we were not able to implement the full suite of features we had planned. Here are a few ways we could expand upon this (and maybe we will in the future!):

* Firebase-hosted database functionality to broaden the scope of information storage and blockchain accuracy for customers

* More robust ledger technology using Ethereum to increase the reliability of the blockchain

* Dashboards of information about specific supply chain trends to inform farm management

* More effective QR code scanning beyond producing crate codes

* Specific support for more than just produce. This could highlight the supply chain process for products pertaining to dietary restrictions, religious beliefs, and non-produce items

* And so much more! This is just the beginning of what's possible at the intersection of supply chain transparency and blockchain technology. There are endless opportunities in this ever-changing market

## Authors

This project was authored by Nathan McCormick, Adam Alkawaz, and Ogochuckwu Ibe-Ikechi at the University of Nebraska-Lincoln's Cornhacks hackathon on November 8-9, 2025. The theme was "bananahacks," and our software was brought from ideation to production in less than 24 hours. 