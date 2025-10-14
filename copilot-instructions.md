# GitHub Copilot Instructions

## Project Context

- This repository hosts a personal portfolio built with Astro.
- The portfolio showcases both technical and literary achievements of Lefteris Evangelinos, a full-stack developer and published fantasy author.
- Featured projects include:
  - **NestJS Backend Template** – Production-ready NestJS template with JWT authentication, Swagger documentation, Prometheus metrics, Sentry error tracking, and comprehensive security features demonstrating modern backend architecture patterns.
  - **Share the Ride** – Node.js + Express backend delivering REST and Socket.IO APIs for a carpooling platform.
  - **ERT Game Web** – Full-stack multiplayer game application with Express.js backend and Vue 3 + TypeScript frontend, featuring real-time gameplay and admin controls.
  - **Python Random Scripts** – a grab bag of automation and data-wrangling utilities written in Python.
- The timeline page chronicles professional milestones, literary publications, and educational background from early years in Volos, Greece through present day.

## Coding Style Expectations

- Prefer concise, well-structured sections when generating page content.
- Use clear headings, short paragraphs, and bullet lists to summarise features or architecture.
- Default to ASCII characters and avoid emoji unless already present in the surrounding file.

## Technical Emphasis

- When suggesting code, lean on modern backend best practices including NestJS modular architecture, TypeScript strict mode, dependency injection patterns, and comprehensive error handling.
- For NestJS projects, emphasize decorator-based routing, guard patterns for authentication, middleware layers for cross-cutting concerns, structured logging with Pino, Prometheus metrics, and Swagger/OpenAPI documentation.
- For Express 4 projects, respect conventions around Sequelize for MySQL access, JWT authentication, Socket.IO messaging, and supporting services such as Firebase Cloud Messaging, Redis, and node-schedule.
- Respect the layered architecture: routers → controllers → services → data access helpers → utilities.
- Call out multi-language support (English/Greek), notification flows, and scheduled maintenance jobs when relevant.
- For Vue 3 projects, emphasize TypeScript best practices, Pinia state management, Vite tooling, and modern Sass module patterns.
- For the Python scripts collection, keep descriptions practical and reference automation, data cleanup, and CLI ergonomics.

## Documentation Tone

- Keep explanations high-level enough for a portfolio audience while still sounding authoritative.
- Highlight outcomes and impact instead of exhaustive implementation detail.
