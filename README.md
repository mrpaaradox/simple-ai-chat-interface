# Simple AI Chat Interface 🤖

A modern, high-performance AI chat application built with **Next.js 15**, **Vercel AI SDK**, and **Tailwind CSS 4**. This project provides a seamless chat experience with real-time streaming, message regeneration, and a premium user interface.

## ✨ Features

-   **⚡ Real-time Streaming:** Smooth, low-latency AI responses using Vercel AI SDK.
-   **🔄 Message Regeneration:** Easily regenerate AI responses to find the best answer.
-   **👍 Feedback System:** Like and dislike messages to track response quality.
-   **🎨 Premium UI:** A beautiful, responsive interface built with Tailwind CSS 4 and Lucide icons.
-   **🌓 Dark Mode Support:** Seamless transition between light and dark themes.
-   **📱 Mobile Optimized:** Fully responsive design for a great experience on any device.

## 🛠️ Tech Stack

-   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
-   **AI Integration:** [Vercel AI SDK](https://sdk.vercel.ai/)
-   **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Theme Management:** [next-themes](https://github.com/pacocoursey/next-themes)

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+ and npm/yarn/pnpm.
-   A Groq API Key (or other provider configured in `src/app/api/chat/route.ts`).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/mrpaaradox/ai-chatty.git
    cd ai-chatty
    ```

2.  **Run the setup script:**
    ```bash
    ./setup.sh
    ```
    This script will ask you to paste your `GROQ_API_KEY`, install all necessary dependencies, and start the development server automatically.

### Alternative Manual Installation

If you prefer to set up the project manually, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/mrpaaradox/ai-chatty.git
    cd ai-chatty
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a file named `.env` in the root directory and add your Groq API key:
    ```env
    GROQ_API_KEY=your_groq_api_key_here
    ```
    > [!TIP]
    > You can get your API key from the [Groq Cloud Console](https://console.groq.com/keys).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at [http://localhost:3000](http://localhost:3000).

## 📁 Project Structure

```text
src/
├── app/
│   ├── api/          # Route handlers for AI integration
│   ├── ui/           # Application UI components
│   │   └── chat/     # Main chat page and logic
│   ├── globals.css   # Global styles
│   └── layout.tsx    # Root layout
public/               # Static assets
```

## 📄 License

This project is licensed under the MIT License.
