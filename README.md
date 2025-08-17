# DevTools Hub 🛠️

**Professional Development Tools & Utilities**

DevTools Hub is your comprehensive suite of development tools built with cutting-edge technology. Features advanced regex testing, code validation, and developer utilities - all in a beautiful, responsive interface powered by Next.js 15 and modern web standards.

🔗 **Live Demo**: [Visit DevTools Hub](https://devtools-hub.vercel.app)
📚 **Documentation**: [Read the Docs](https://github.com/kiron0/devtools-hub)

## ✨ Key Features

### 🔍 Advanced Regex Tester
- **Real-time Pattern Matching**: Test regex patterns with instant feedback
- **Detailed Explanations**: Understand what each part of your regex does
- **Performance Metrics**: Monitor execution time and optimization suggestions
- **Export & Share**: Generate code snippets in multiple languages (JS, Python, Java, C#)
- **History Management**: Save and reload previous patterns
- **URL Sharing**: Share regex patterns via URL parameters

### 🎨 Modern Interface
- **Responsive Design**: Perfect experience on mobile, tablet, and desktop
- **Dark/Light Mode**: Built-in theme switching with system preference detection
- **Glass Morphism**: Modern UI with backdrop blur effects
- **Accessibility**: WCAG compliant with screen reader support
- **Touch Friendly**: Optimized for mobile and tablet interactions

### ⚡ Performance Optimized
- **Web Workers**: Heavy regex computations run in background threads
- **Debounced Updates**: Efficient state management to prevent excessive re-renders
- **Lazy Loading**: Components load only when needed
- **Optimized Bundling**: Tree-shaking and code splitting for minimal bundle size

### 🛠️ Developer Experience
- **TypeScript**: Full type safety across the entire codebase
- **ESLint + Prettier**: Consistent code formatting and linting
- **Component Architecture**: Modular, reusable React components
- **Custom Hooks**: Encapsulated logic for state management and side effects

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** (or Bun for faster package management)
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kironix/glow-next.git
   cd glow-next
   ```

2. **Install dependencies**
   ```bash
   # Using Bun (recommended)
   bun install

   # Or using npm
   npm install

   # Or using yarn
   yarn install
   ```

3. **Start development server**
   ```bash
   # Using Bun
   bun dev

   # Or using npm
   npm run dev

   # Or using yarn
   yarn dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 📱 Responsive Breakpoints

DevTools Hub is designed with a mobile-first approach:

| Device | Width | Features |
|--------|-------|----------|
| 📱 **Mobile** | 320px - 639px | Single column, touch-optimized |
| 📱 **Tablet** | 640px - 1023px | 2-3 columns, adaptive navigation |
| 💻 **Laptop** | 1024px - 1279px | Multi-column, full features |
| 🖥️ **Desktop** | 1280px+ | Maximum width, enhanced typography |

## 🎯 Usage Examples

### Basic Regex Testing
```javascript
// Email validation
const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
const testString = "Contact us at hello@example.com or support@test.org"
// Returns: ["hello@example.com", "support@test.org"]
```

### URL Sharing
Share your regex patterns with others:
```
https://your-domain.com/regex-tester?pattern=%5Cd%2B&test=I%20have%205%20apples&flags=g
```

### Export Code Snippets
Generate ready-to-use code in your preferred language:

**JavaScript**
```javascript
const pattern = /\d+/g;
const matches = "I have 5 apples".match(pattern);
console.log(matches); // ["5"]
```

**Python**
```python
import re
pattern = r'\d+'
matches = re.findall(pattern, "I have 5 apples")
print(matches)  # ['5']
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (routes)/          # Route groups
│   │   ├── tools/         # Tools dashboard and individual tools
│   │   │   ├── page.tsx   # Dashboard home (/tools)
│   │   │   ├── layout.tsx # Dashboard layout
│   │   │   └── [tool]/    # Dynamic tool pages (/tools/*)
│   │   └── dev/           # Development routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── regex/            # Regex tester components
│   ├── shared/           # Shared components
│   │   ├── tools-layout/ # Dashboard layout with sidebar
│   │   ├── tools-sidebar/ # Tools navigation sidebar
│   │   └── */            # Individual tool components
│   └── common/           # Common utility components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
├── workers/              # Web Workers
└── config/               # Configuration files
```

## 🎯 Dashboard Structure

The application now features a modern dashboard layout:

- **`/tools`** - Dashboard home with tools overview, stats, and categorized tool listings
- **`/tools/[tool]`** - Individual tool pages with sidebar navigation
- **Sidebar Navigation** - Collapsible sidebar with search, categories, and tool selection
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop

## 🔧 Tech Stack

### Core Technologies
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

### UI Components
- **[Shadcn/ui](https://ui.shadcn.com/)** - High-quality React components
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library

### Development Tools
- **[ESLint](https://eslint.org/)** - JavaScript/TypeScript linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Bun](https://bun.sh/)** - Fast JavaScript runtime and package manager

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   bun run lint
   bun run type-check
   ```
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style
- Add TypeScript types for new features
- Ensure responsive design on all devices
- Test regex functionality thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the incredible React framework
- **Shadcn** for the beautiful UI component library
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for the utility-first CSS framework
- **Open Source Community** for continuous inspiration and contributions

## 📧 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/kironix/glow-next/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/kironix/glow-next/discussions)
- 📧 **Email**: [Contact Us](mailto:support@example.com)

---

**Built with ❤️ using Next.js and TypeScript**
