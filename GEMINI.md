# MathALÉA Project Guide

## Project Overview

MathALÉA is a French mathematics exercise generator designed to support the French national curriculum. It is a client-side Single Page Application (SPA) that allows teachers and students to:

- Generate random math exercises with solutions.
- Export exercises to HTML, LaTeX, PDF, and other formats.
- Create interactive exercises with immediate feedback.
- Share custom exercise sets via URLs.

## Technology Stack

- **Framework:** Svelte 5 (Client-side)
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Boxicons
- **Math Engines:** MathJS, KaTeX (rendering), MathLive (input), Algebrite (CAS)
- **Testing:** Vitest (Unit), Playwright (E2E)
- **Package Manager:** pnpm

## Setup & Development

### Prerequisites

- Node.js (recent version)
- pnpm

### Key Commands

| Command           | Description                                      |
| :---------------- | :----------------------------------------------- |
| `pnpm install`    | Install dependencies                             |
| `pnpm dev`        | Start development server (http://localhost:5173) |
| `pnpm build`      | Build for production (output to `dist/`)         |
| `pnpm check`      | Run Svelte check / TypeScript validation         |
| `pnpm lint`       | Lint JS/TS files in `src/exercices`              |
| `pnpm lintSvelte` | Lint Svelte components                           |
| `pnpm format`     | Format code with Prettier                        |
| `pnpm test:unit`  | Run unit tests                                   |
| `pnpm test:e2e`   | Run end-to-end tests                             |

## Architecture & Code Structure

### Directory Layout

- **`src/main.ts`**: Application entry point. Mounts `App.svelte` to `#appMathalea`.
- **`src/components/`**: Svelte UI components.
  - `App.svelte`: Main layout and routing logic.
  - `display/`: Components for displaying exercises to students/users.
  - `setup/`: Components for teacher configuration/menus.
- **`src/exercices/`**: The core content. Contains exercise definitions organized by grade level (e.g., `6e`, `5e`, `4e`) and type.
- **`src/lib/`**: Core engine libraries.
  - `mathalea.ts`: Main engine for loading/rendering.
  - `2d/`: 2D geometry primitives and rendering logic.
  - `interactif/`: Logic for interactive answers and correction.
  - `stores/`: Svelte stores for global state (e.g., `exercicesParams`, `globalOptions`).
- **`src/modules/`**: Math utilities and helper functions (fractions, operations, etc.).
- **`tasks/`**: Build scripts and maintenance tasks (e.g., reference generation).

### Core Concepts

#### 1. The `Exercice` Class

Every exercise is a class extending `Exercice` (defined in `src/exercices/Exercice.ts`).

- **`uuid`**: Unique identifier.
- **`titre`**: French title.
- **`nouvelleVersion()`**: The main method called to generate questions and answers. It populates `this.listeQuestions` and `this.listeCorrections`.

#### 2. Randomization

Use the helpers in `src/modules/outils.ts`:

- `randint(min, max)`: Random integer.
- `choice(list)`: Random element from a list.
- `combinaisonListes(list, length)`: Shuffled list for generating multiple variants.
- **Important:** Uses `seedrandom` to ensure reproducibility via the `seed` URL parameter.

#### 3. Interactivity

Interactive exercises handle user input directly.

- Use `this.interactif = true` in the exercise class.
- Use helpers from `src/lib/interactif/` (e.g., `handleAnswers`) to validate inputs.
- Supports specialized inputs like MathLive fields and drag-and-drop.

#### 4. Output Formats

The engine generates:

- **HTML**: For the web interface.
- **LaTeX**: Logic often includes checks like `if (context.isHtml) { ... } else { ... }` to generate appropriate strings for LaTeX exports.

## Conventions

- **Language**: The codebase, comments, and exercise content are primarily in **French**.
- **Naming**: camelCase for variables/functions. Exercise files often follow a code pattern (e.g., `6N10.js`).
- **Svelte 5**: The project uses Svelte 5 syntax (Runes like `$state`, `$derived` might be present, or migration in progress).
- **Imports**: Use explicit extensions where possible.

## Migration Note

The project is using Svelte 5. Refer to `svelte5-migration-plan.md` (if available) or `package.json` versions to understand specific patterns used.

## From Svelte MCP documentation

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

### Available MCP Tools:

#### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

#### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

#### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

#### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
