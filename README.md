# RippleSim — See the Ripple Before It Spreads

**An AI-powered warehouse digital twin for simulating disruptions, tracing cascading effects, and exploring safer operational decisions before they are implemented in the real world.**

\<p align="center">
&#x20; \<strong>Simulate. Understand. Decide.\</strong>
\</p>

---

## Overview

Modern warehouses are interconnected environments where robots, storage aisles, delivery routes, and operational tasks depend on one another. A seemingly small disruption—such as a blocked aisle or an unavailable route—can trigger a chain of consequences, including robot rerouting, congestion, delayed deliveries, and reduced operational efficiency.

These effects are often difficult to anticipate until a disruption occurs.

**RippleSim aims to address this challenge by creating a virtual warehouse environment where operational changes can be tested before they are applied in reality.**

Users will be able to explore warehouse scenarios, simulate disruptions, compare normal and disrupted operations, visualize how consequences propagate through the system, and receive AI-assisted explanations and recommendations.

Rather than focusing only on identifying a problem, RippleSim aims to help users understand how a disruption affects the wider system and what alternative actions may reduce its impact.

## The Problem

Warehouse operations depend on multiple interconnected components. A change in one part of the environment can influence several others.

For example:

- A blocked aisle forces autonomous robots to find alternative routes.
- Alternative routes increase traffic at nearby intersections.
- Increased traffic creates congestion and longer travel times.
- Longer travel times delay pickup and delivery tasks.
- Accumulated delays can affect overall warehouse throughput.

Without an accessible way to test such scenarios in advance, operators may struggle to understand the wider consequences of a seemingly minor operational decision.

## Our Solution

RippleSim is being designed as an interactive warehouse digital twin that allows users to experiment with operational scenarios in a controlled virtual environment.

The platform will combine warehouse modeling, simulation, visualization, and AI-assisted analysis to make the consequences of operational changes easier to understand.

### Core capabilities

- **Virtual warehouse visualization:** Explore a modeled warehouse containing aisles, storage racks, robots, destinations, and movement routes.
- **Disruption simulation:** Introduce scenarios such as blocked aisles and examine their effects on warehouse operations.
- **Impact comparison:** Compare baseline operations with disrupted scenarios using relevant operational metrics.
- **Ripple-effect tracing:** Visualize how a local disruption can propagate through robot routes, intersections, and delivery tasks.
- **AI-assisted analysis:** Translate simulation results into understandable explanations and potential mitigation strategies.
- **Scenario exploration:** Experiment with alternative decisions and compare their potential outcomes.

These capabilities describe the intended product direction. Features will be marked as implemented as development progresses.

## How RippleSim Works

A typical simulation workflow will follow these steps:

1. **Load the warehouse:** Start with a predefined warehouse layout containing storage areas, aisles, robots, and delivery tasks.
2. **Establish a baseline:** Calculate or load the expected operational metrics for normal conditions.
3. **Introduce a disruption:** Select an aisle or another supported component and simulate a change, such as an aisle closure.
4. **Run the simulation:** Recalculate routes and operational outcomes under the disrupted conditions.
5. **Trace the ripple effects:** Identify affected robots, changed routes, potential congestion, and impacted tasks.
6. **Compare scenarios:** Examine the differences between baseline and disrupted operations.
7. **Explore recommendations:** Use AI-assisted analysis to explain the results and suggest alternative actions.

The simulation engine will be responsible for calculating operational outcomes. The AI layer will interpret those results rather than inventing metrics or replacing the underlying simulation.

## Example Scenario: A Blocked Warehouse Aisle

Imagine that a frequently used warehouse aisle becomes unavailable.

Under normal conditions, robots follow their planned routes to complete assigned tasks. When the aisle is blocked, the system must adapt.

RippleSim will aim to demonstrate the following chain:

**Aisle Closure → Robot Rerouting → Increased Congestion → Longer Travel Times → Potential Delivery Delays**

The user can compare the disrupted scenario with the baseline, inspect affected areas, and explore whether an alternative route or operational change could reduce the impact.

This example represents the initial scope of the project.

## Technology Stack

The planned technology stack is organized into the following layers.

| Layer               | Technology                                          | Purpose                                                |
| ------------------- | --------------------------------------------------- | ------------------------------------------------------ |
| Frontend            | React, TypeScript                                   | Interactive user interface and application logic       |
| Development tooling | Node.js, Vite                                       | Frontend development and production builds             |
| Styling             | Tailwind CSS                                        | Responsive layouts and consistent styling              |
| Visualization       | SVG, Recharts                                       | Warehouse maps, routes, metrics, and comparisons       |
| Backend             | Python, FastAPI                                     | API endpoints and coordination of application services |
| Simulation          | NetworkX and Python                                 | Modeling warehouse connectivity and route calculations |
| AI integration      | NVIDIA model accessed through Nebius infrastructure | AI-assisted interpretation and recommendations         |
| Version control     | Git and GitHub                                      | Source control and team collaboration                  |

The technologies listed above represent the planned stack and will be confirmed against the actual implementation as development progresses.

## System Architecture

RippleSim is intended to separate the user interface, simulation logic, and AI analysis into distinct components.

```text
                  ┌─────────────────────────┐
                  │     RippleSim UI        │
                  │ React + TypeScript      │
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │      FastAPI Backend    │
                  │ Request Coordination    │
                  └────────────┬────────────┘
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
          ┌─────────────────┐   ┌─────────────────┐
          │ Simulation      │   │ AI Analysis     │
          │ Engine          │   │ Nebius + NVIDIA │
          └────────┬────────┘   └────────┬────────┘
                   │                     │
                   └──────────┬──────────┘
                              ▼
                  ┌─────────────────────────┐
                  │ Results and Insights    │
                  │ Maps, Metrics, Actions  │
                  └─────────────────────────┘
```

The simulation engine will calculate routes and measurable outcomes. The AI service will receive relevant simulation results and provide contextual explanations and recommendations.

The frontend will initially use clearly identified demo data so that interface development can proceed independently of backend and AI integration.

## API Design

The backend is planned around a small set of endpoints.

| Method | Endpoint         | Intended purpose                                   |
| ------ | ---------------- | -------------------------------------------------- |
| GET    | `/api/health`    | Check backend availability                         |
| GET    | `/api/warehouse` | Retrieve the sample warehouse layout               |
| POST   | `/api/simulate`  | Run a disruption simulation                        |
| POST   | `/api/analyze`   | Request AI-assisted analysis of simulation results |

These endpoints describe the intended API contract. Their behavior and request/response schemas will be documented as they are implemented.

## Project Roadmap

Development will proceed incrementally, with each stage tested before moving to the next.

- [ ] **Phase 1 — Project foundation:** Initialize the repository, frontend, development environment, and shared coding conventions.
- [ ] **Phase 2 — Dashboard interface:** Build the navigation, layout, metric cards, and reusable UI components.
- [ ] **Phase 3 — Warehouse visualization:** Create the interactive 2D warehouse map with aisles, robots, and routes.
- [ ] **Phase 4 — Simulation controls:** Add disruption selection, simulation execution, and reset behavior.
- [ ] **Phase 5 — Simulation engine:** Implement baseline and disrupted route calculations and measurable operational outcomes.
- [ ] **Phase 6 — Impact visualization:** Display before-and-after comparisons and trace the effects of disruptions.
- [ ] **Phase 7 — AI integration:** Connect an eligible NVIDIA model through Nebius infrastructure to explain simulation results and suggest mitigation strategies.
- [ ] **Phase 8 — Testing and refinement:** Validate the simulation logic, improve usability, handle errors, and prepare the demonstration.
- [ ] **Phase 9 — Documentation and release:** Update the README, record setup instructions, and prepare the final hackathon presentation.

## Future Scope

The initial version will focus on a single warehouse and a limited set of disruptions. The broader vision is to explore how the same modeling approach could be extended to increasingly complex operational environments.

Potential future directions include:

- **Multiple warehouse zones:** Model interactions between different areas within a facility.
- **Multi-level warehouse layouts:** Represent supported warehouse levels and the connections between them.
- **Multiple warehouses:** Explore operational dependencies across several facilities.
- **More disruption types:** Introduce robot failures, unavailable routes, task-priority changes, and other operational constraints.
- **Scenario comparison:** Compare several possible responses to the same disruption.
- **Improved optimization:** Explore route allocation, task scheduling, and congestion-reduction strategies.
- **Real-world integration:** Investigate connections to warehouse management systems and robotics platforms where feasible.

These are potential extensions, not claims about current functionality.

## Security and Configuration

RippleSim is being developed with API key security and safe configuration practices in mind.

- API keys and credentials must remain on the backend.
- Secret values must never be committed to GitHub.
- Local environment files must be excluded through `.gitignore`.
- A `.env.example` file may document required variable names using placeholder values only.
- Frontend code must never contain private AI provider credentials.
- Logs and error messages must not expose secrets.

For local development, credentials will be supplied through environment variables or a local backend environment file. The backend will read these values at runtime.

## Team Collaboration

RippleSim is maintained in a shared GitHub repository.

The team will use feature branches and pull requests to coordinate work, review changes, and reduce integration conflicts.

Suggested collaboration practices:

- Keep changes focused on a single feature.
- Avoid modifying another teammate's files without coordination.
- Test changes locally before opening a pull request.
- Never commit API keys, passwords, tokens, or other secrets.
- Keep documentation updated as the implementation changes.
- Merge only changes that have been reviewed and tested.

## Getting Started

The project setup is currently being established. Installation and execution instructions will be added here as the frontend and backend structure is finalized.

The intended development environment includes:

- Node.js and npm for the frontend.
- Python for the backend and simulation engine.
- Git for version control.
- A compatible environment configuration for the Nebius AI integration.

Refer to the project documentation for the verified installation commands and configuration required by the implemented version.

## Contributing

Contributions from authorized team members are welcome.

1. Create a feature branch from the agreed-upon base branch.
2. Implement one focused change.
3. Test the change locally.
4. Commit the changes with a descriptive message.
5. Open a pull request for review.
6. Address feedback before merging.

Please coordinate changes to shared interfaces, API schemas, and simulation data structures with the team.

## Project Status

**Status:** In active development.

RippleSim is being developed as a hackathon prototype. Planned features and future extensions should not be interpreted as completed or production-ready capabilities.

The initial objective is to deliver a working demonstration that shows how a warehouse disruption can be modeled, how its effects can be measured and visualized, and how AI can help explain the resulting outcomes.

---

## Acknowledgements

RippleSim is being developed with the goal of exploring practical applications of AI, simulation, and digital twin technology for operational decision-making.

**Built for the NVIDIA × Nebius Global AI Hackathon.**
