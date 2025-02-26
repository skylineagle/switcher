# Switcher

Switcher is a modern web application built with React, TypeScript, and Vite. It provides a lightweight, high-performance user experience using best practices from Next.js App Router, Shadcn UI, Radix UI, and Tailwind CSS. The project follows functional programming principles, modularizes code effectively, and employs rigorous error handling and validation.

## Features

- **Fast and Responsive:** Leveraging Vite for fast refresh and HMR.
- **Type-Safe Development:** Written entirely in TypeScript with strict type-checking.
- **Modern UI Components:** Uses Shadcn UI, Radix UI, and Tailwind CSS for a responsive design.
- **Modular Architecture:** Functional components and a modular file structure for easy maintenance.
- **Robust Error Handling:** Guards and early returns to ensure a resilient codebase.

## File Structure

Switcher follows a clear and modular layout:

- `src/components/` – Contains React components, organized in subdirectories by feature.
- `src/services/` – Business logic and API service functions.
- `src/types/` – All TypeScript interfaces and types.
- `src/consts.ts` – Static data and configuration values.
- `README.md` – This file.

## Setup Instructions

1. **Install Dependencies**

   Run the following command using bun:

   ```
   bun install
   ```

2. **Development Server**

   To run the development server with hot module replacement (HMR):

   ```
   bun dev
   ```

3. **Building for Production**

   To create an optimized production build:

   ```
   bun build
   ```

## Usage

Switcher provides a fluid and interactive interface. Navigate through various modes and configurations seamlessly. The application handles both light and dark themes with a built-in theme provider and adaptive camera mode selectors for enhanced user experience.

## Contributing

Contributions are welcome! Please follow these guidelines:

- Ensure new code is fully functional and passes linting.
- Follow the modular and functional programming practices outlined above.
- Write tests for any new features or major changes.
- Use descriptive variable names and include appropriate comments to document edge cases.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Cheatsheet

default commands:

add to mediamtx -

```
curl -X POST -H "Content-Type: application/json" -d '$configuration' $mediamtx/v3/config/paths/add/$name
```

remove from mediamtx -

```
curl -X DELETE $mediamtx/v3/config/paths/delete/$name
```
