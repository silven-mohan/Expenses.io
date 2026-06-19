# Contributing to ExpenseLedger

Thank you for your interest in contributing! This document provides guidelines for contributing.

## Development Setup

```bash
# Clone the repository
git clone https://github.com/silven-mohan/Expenses.io.git
cd Expenses.io

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Follow the existing code structure
- Write TypeScript for type safety
- Use existing components and utilities
- Update tests if applicable

### 3. Code Standards

- **Formatting**: Prettier (auto-format on save)
- **Linting**: ESLint rules must pass
- **TypeScript**: Strict mode enabled
- **Components**: React functional components with hooks

### 4. Testing

```bash
# Run tests
npm test

# Build check
npm run build
```

### 5. Commit Messages

Follow conventional commits:

```
feat: Add new analytics feature
fix: Correct date calculation bug
docs: Update README
refactor: Improve data service
test: Add unit tests for validation
```

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Create a Pull Request on GitHub with:
- Clear description of changes
- Reference to related issues
- Screenshots for UI changes

## Project Structure

When adding new features:

```
New Feature Example:
- src/services/featureService.ts     # Business logic
- src/hooks/useFeature.ts             # React hook
- src/app/(main)/feature/page.tsx     # Page component
- src/components/Feature.tsx          # Feature component (if needed)
```

## Key Areas for Contribution

### 1. Features to Implement
- Cloud sync support
- Multi-user support
- Advanced budgeting
- Recurring expenses
- Investment tracking
- Bill reminders

### 2. Bug Fixes
- Check GitHub Issues
- Test thoroughly
- Provide reproduction steps

### 3. Documentation
- Improve README
- Add code comments
- Update guides

### 4. Performance
- Optimize bundle size
- Improve database queries
- Reduce re-renders

## Pull Request Process

1. Ensure all tests pass
2. Update documentation
3. Request review from maintainers
4. Address feedback
5. Merge once approved

## Code Review Guidelines

When reviewing PRs:
- Check code quality
- Verify TypeScript types
- Test functionality
- Ensure no breaking changes
- Review performance impact

## Reporting Issues

### Bug Report
Include:
- Clear description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/OS info
- Screenshots if applicable

### Feature Request
Include:
- Clear description
- Use case
- Potential implementation
- Examples from other apps

## Development Tips

1. **Use DevTools**: Browser DevTools for IndexedDB inspection
2. **Debug Mode**: VS Code debugger for Node.js processes
3. **Testing**: Manual testing on different browsers
4. **Performance**: Use Lighthouse for audits

## Questions?

Feel free to:
- Open a discussion on GitHub
- Ask in issues
- Check existing documentation

---

We appreciate your contributions! 🙌
