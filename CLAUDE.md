# CLAUDE.md

This file provides guidance for AI assistants (Claude and others) working in this repository.

## Repository Overview

This is a freshly initialized repository. This CLAUDE.md will be updated as the codebase grows to reflect the actual structure, workflows, and conventions of the project.

## General Development Conventions

### Code Style
- Follow the language-specific conventions and linting rules configured in the project.
- Prefer readability over cleverness; write code that is easy to understand and maintain.
- Keep functions small and focused on a single responsibility.
- Avoid unnecessary abstractions — solve the problem at hand without over-engineering.

### Git Workflow
- Branch names should be descriptive and use the format `<type>/<short-description>` (e.g., `feat/add-auth`, `fix/login-bug`).
- Write clear, concise commit messages in the imperative mood (e.g., "Add user authentication", not "Added user authentication").
- Commits should be atomic — one logical change per commit.
- Never force-push to `main` or shared branches.
- Always create a new branch for changes; do not commit directly to `main`.

### Pull Requests
- PRs should be focused and small when possible.
- Include a summary of what changed and why.
- Reference any related issues in the PR description.

## AI Assistant Guidelines

### What to Do
- Read existing code before suggesting changes.
- Prefer editing existing files over creating new ones.
- Keep changes minimal and focused on the task at hand.
- Run tests before and after making changes when a test suite exists.
- Ask for clarification when requirements are ambiguous.

### What to Avoid
- Do not add features, refactors, or "improvements" beyond what was explicitly requested.
- Do not add unnecessary comments, docstrings, or type annotations to code you didn't change.
- Do not introduce security vulnerabilities (SQL injection, XSS, command injection, etc.).
- Do not commit secrets, credentials, or `.env` files.
- Do not push to branches other than the one designated for the current task.

### Security
- Validate all user inputs at system boundaries.
- Never expose secrets in code, logs, or error messages.
- Follow the principle of least privilege for permissions and access.
- Use environment variables for configuration and secrets; never hard-code them.

## Project Setup

> This section will be updated once the project is initialized with source code and dependencies.

When the project is set up, document here:
- How to install dependencies
- How to run the development server / application
- How to run tests
- How to build for production
- Required environment variables (with descriptions, not values)

## Testing

> This section will be updated once a testing strategy is established.

When tests are added, document here:
- Test framework and tooling
- How to run the full test suite
- How to run a single test
- Where tests live relative to source files
- Conventions for test naming and structure

## Project Structure

> This section will be updated once the project structure is established.

When source code is added, document here:
- Directory layout and what each top-level folder contains
- Where the entry point(s) are
- Where configuration lives
- Where shared utilities/helpers live

## CI/CD

> This section will be updated once CI/CD pipelines are configured.

When pipelines are added, document here:
- What checks run on PRs (lint, test, build, etc.)
- Deployment process and environments
- How to monitor pipeline status
