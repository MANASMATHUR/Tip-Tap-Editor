# OpenSphere Editorial

A premium, paginated rich text editor built for professional document drafting. Combining a distraction-free writing environment with real-time print simulation, OpenSphere Editorial bridges the gap between web editors and traditional word processors.

![OpenSphere Editorial Banner](https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=2000&ixlib=rb-4.0.3)

## ✨ Key Features

- **📄 Real-Time Pagination**: Experience true-to-life US Letter (8.5" x 11") page breaks as you type.
- **🎭 Motion-Rich UI**: Smooth, premium animations powered by **GSAP** for loading states, editor entrance, and interactions.
- **👁️ Focus Mode**: A dedicated distraction-free environment that elegantly fades out UI elements for deep work.
- **📝 Intelligent Outline**: Auto-generated document navigation that tracks headings in real-time.
- **🖨️ Print Fidelity**: What you see is exactly what you print. Pixel-perfect PDF generation.
- **🔧 Rich Formatting**: Full support for tables, task lists, images, highlighting, and typography.

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (React 19, Client Components)
- **Editor Engine**: [Tiptap](https://tiptap.dev/) (Headless ProseMirror wrapper)
- **Animations**: [GSAP](https://gsap.com/) & `@gsap/react`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linting**: ESLint

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/manasmathur/opensphere-editorial.git
    cd opensphere-editorial
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # This will also install gsap and @tiptap packages
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Open the application**
    Visit `http://localhost:3000` to start editing.

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout including fonts and globals
│   ├── page.tsx         # Main entry point with GSAP Loading Screen
│   └── globals.css      # Global styles and Tailwind imports
├── components/
│   ├── Editor.jsx       # Core Tiptap editor instance & GSAP entrance logic
│   └── Toolbar.jsx      # Floating toolbar with 'ToolbarButton' components
└── ...
```

## 🎨 Design Philosophy

OpenSphere Editorial mimics the tactile feel of high-end software:
- **Glassmorphism**: Subtle transluscent backgrounds on floating menus.
- **Micro-Interactions**: Every button press feels responsive with spring physics.
- **Typography**: Uses *EB Garamond* for content to emulate print media, and *Inter* for UI clarity.


