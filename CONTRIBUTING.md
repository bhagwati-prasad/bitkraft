# Contributing to BitKraft Framework

Thank you for considering contributing to BitKraft! This document provides guidelines and processes for contributing.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [How to Contribute](#how-to-contribute)
5. [Pull Request Process](#pull-request-process)
6. [Architecture Decision Process](#architecture-decision-process)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior

- Be respectful and professional
- Accept constructive criticism gracefully
- Focus on what's best for the framework and community
- Show empathy toward other contributors

---

## Getting Started

### Prerequisites

- Node.js ≥18.0.0
- npm, yarn, or pnpm
- Git

### Repository Structure

See [ARCH.md](ARCH.md) for detailed architecture overview.

---

## Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/bhagwati-prasad/bitkraft.git
cd bitkraft
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Tests

```bash
npm test
```

### 4. Start Development Server

```bash
npm run dev
```

---

## How to Contribute

### Reporting Bugs

1. Check if the bug already exists in [Issues](https://github.com/bhagwati-prasad/bitkraft/issues)
2. Create a new issue with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (Node version, OS)

### Suggesting Features

1. Check existing [RFCs and ADRs](docs/adr/)
2. Create an issue tagged `enhancement`
3. Describe:
   - Problem being solved
   - Proposed solution
   - Alternatives considered

### Contributing Code

1. Fork the repository
2. Create a feature branch: `feature/your-feature-name`
3. Follow [Coding Standards](docs/CODING_STANDARDS.md)
4. Write tests
5. Submit a pull request

---

## Pull Request Process

### Before Submitting

- [ ] Code follows [Coding Standards](docs/CODING_STANDARDS.md)
- [ ] Tests pass (`npm test`)
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] No merge conflicts

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #(issue number)

## Testing
Describe testing performed

## Checklist
- [ ] Tests pass
- [ ] Code follows standards
- [ ] Documentation updated
```

### Review Process

1. Automated checks run (tests, linting)
2. Code review by maintainer
3. Address feedback
4. Approval and merge

---

## Architecture Decision Process

### When to Write an ADR

Create an ADR for:
- Changes to core architecture
- New major features
- Breaking changes
- Performance trade-offs

### ADR Template

See [docs/adr/ADR-001-hybrid-rendering-model.md](docs/adr/ADR-001-hybrid-rendering-model.md) for template.

### ADR Process

1. Create ADR draft in `docs/adr/`
2. Open PR with `ADR` label
3. Discuss in PR comments
4. Update based on feedback
5. Merge when approved

---

## Development Guidelines

### Coding Standards

See [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md) for complete guidelines.

### Testing

- Write unit tests for utilities
- Write integration tests for features
- Write E2E tests for critical flows

### Documentation

- Update README if user-facing changes
- Add JSDoc comments for public APIs
- Update relevant specs in `docs/specs/`

---

## Communication

### Issues

Use GitHub Issues for:
- Bug reports
- Feature requests
- Questions

### Discussions

Use GitHub Discussions for:
- General questions
- Design discussions
- RFC proposals

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Questions?

Contact the maintainers via:
- GitHub Issues
- GitHub Discussions
- Email: [maintainer email]

---

Thank you for contributing to BitKraft! 🚀
