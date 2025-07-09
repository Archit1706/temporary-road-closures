# Temporary Road Closures Database and API

**Google Summer of Code 2025 Project for OpenStreetMap Foundation**

A comprehensive system for collecting and disseminating temporary road closure information, designed to enhance OSM-based navigation applications with real-time closure data.

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![PostGIS](https://img.shields.io/badge/PostGIS-3.5+-blue.svg)](https://postgis.net/)
[![OpenLR](https://img.shields.io/badge/OpenLR-integrated-orange.svg)](https://www.openlr.org/)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

---

## 🎯 Project Overview

OpenStreetMap provides excellent static map data, but temporary road closures (construction, accidents, events) are often not captured quickly enough for navigation apps. This project bridges that gap by creating an open platform where:

-   **Community members** can report temporary road closures in real-time
-   **Navigation applications** can query closure data to improve routing
-   **OpenLR integration** ensures cross-platform compatibility
-   **OSM ecosystem** benefits from enhanced real-time data

### 🌟 Key Features

-   **🗺️ Real-time Closure Reporting**: Submit and query time-bound road closures
-   **📍 OpenLR Integration**: Map-agnostic location references for universal compatibility
-   **🔐 Secure Authentication**: OAuth2 + JWT with Google/GitHub integration
-   **📊 Geospatial Queries**: Advanced spatial filtering and route-based searches
-   **🚀 Navigation Ready**: Designed for OsmAnd integration and other navigation apps
-   **🌐 Open Platform**: Community-driven with moderator oversight

## 📁 Repository Structure

```
temporary-road-closures/
├── backend/                 # FastAPI backend service
│   ├── app/                # Application code
│   ├── docker-compose.yml  # Development environment
│   ├── requirements.txt    # Python dependencies
│   └── README.md          # Detailed backend documentation
├── frontend/               # Web frontend (Coming in Weeks 9-10)
│   └── .gitkeep           # Placeholder for frontend development
├── LICENSE                 # GNU AGPL v3.0 license
└── README.md              # This file
```

### 🛠️ Backend (Weeks 1-8) ✅

**Fully implemented FastAPI backend featuring:**

-   **Database**: PostgreSQL 15 + PostGIS 3.5 for geospatial operations
-   **API**: Comprehensive REST API with OpenAPI documentation
-   **Authentication**: OAuth2 Password Bearer + JWT tokens
-   **OpenLR**: Complete encoding/decoding service integration
-   **Spatial**: Advanced geospatial queries and indexing
-   **Security**: Rate limiting, CORS, input validation

[📖 **View Detailed Backend Documentation**](./backend/README.md)

### 🎨 Frontend (Weeks 9-10) 🚧

**Planned React frontend featuring:**

-   **Interactive Map**: Leaflet-based map for viewing/submitting closures
-   **User Dashboard**: Account management and closure history
-   **Real-time Updates**: Live closure status and notifications
-   **Mobile Responsive**: Optimized for field reporting
<!--

### 📱 OsmAnd Integration (Weeks 11-12) 🚧

**Planned navigation integration:**

-   **Plugin Development**: Custom OsmAnd plugin for closure data
-   **Route Avoidance**: Dynamic routing around active closures
-   **OpenLR Decoding**: Cross-platform location reference support -->

## 🚀 Quick Start

### Prerequisites

-   **Docker & Docker Compose** (recommended)
-   **Python 3.11+** (for local development)
-   **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/Archit1706/temporary-road-closures
cd temporary-road-closures
```

### 2. Start the Backend

```bash
cd backend

# Copy environment configuration
cp .env.example .env

# Start all services with Docker
docker-compose up -d

# Check services are running
docker-compose ps
```

### 3. Access the API

**Services Available:**

-   **🌐 API Server**: http://localhost:8000
-   **📚 API Documentation**: http://localhost:8000/api/v1/docs
-   **🗄️ Database Admin**: http://localhost:8080 (Adminer)

### 4. Test the System

```bash
# Health check
curl http://localhost:8000/health

# View interactive API documentation
open http://localhost:8000/api/v1/docs
```

**For detailed setup instructions, API usage, and development guide:**
👉 **[See Backend README](./backend/README.md)**

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Frontend  │    │   Navigation    │    │   OsmAnd       │
│   (React.js)    │◄──►│   Apps & Tools  │◄──►│   Plugin       │
│   [Weeks 9-10]  │    │                 │    │  [Weeks 11-12] │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                      ┌─────────────────┐
                      │   FastAPI API   │ ← ✅ **Implemented**
                      │   + OpenLR      │
                      │   [Weeks 1-8]   │
                      └─────────────────┘
                              │
                      ┌─────────────────┐
                      │  PostgreSQL +   │ ← ✅ **Implemented**
                      │    PostGIS      │
                      └─────────────────┘
```

### 🔧 Technology Stack

**Backend (✅ Complete)**

-   **API Framework**: FastAPI with async support
-   **Database**: PostgreSQL 15 + PostGIS 3.5
-   **Authentication**: OAuth2 + JWT (Google, GitHub)
-   **Geospatial**: PostGIS + GeoAlchemy2
-   **Location Encoding**: OpenLR integration
-   **Containerization**: Docker + Docker Compose

**Frontend (🚧 Planned)**

-   **Framework**: React.js + TypeScript
-   **Mapping**: Leaflet.js with OpenStreetMap tiles
-   **State Management**: React Context/Redux
-   **UI Components**: Modern responsive design

<!-- **Integration (🚧 Planned)**
- **Navigation**: OsmAnd plugin development
- **OpenLR**: Cross-platform location decoding
- **Real-time**: WebSocket updates for live data -->

## 📈 Development Timeline

**Google Summer of Code 2025 Schedule:**

-   ✅ **Weeks 1-2**: Project setup and database design
-   ✅ **Weeks 3-5**: Core API implementation with authentication
-   ✅ **Weeks 6-7**: OpenLR integration and spatial queries
-   🎯 **Week 8**: Midterm evaluation and API polish
-   🚧 **Weeks 9-10**: Web frontend development
<!-- - 🚧 **Weeks 11-12**: OsmAnd plugin integration -->
-   🚧 **Weeks 13-15**: Testing, documentation, and deployment

## 🌍 Impact & Use Cases

### For the OSM Community

-   **Real-time Data**: Bridge the gap between static OSM data and dynamic road conditions
-   **Community Reporting**: Enable local mappers and users to contribute closure information
-   **Navigation Enhancement**: Improve routing accuracy for OSM-based applications

### For Navigation Apps

-   **Route Optimization**: Avoid closed roads and reduce travel disruptions
-   **User Experience**: Provide up-to-date information about road conditions
-   **Cross-platform**: OpenLR ensures compatibility across different map providers

### For Cities & Organizations

-   **Public Communication**: Share closure information with navigation users
-   **Traffic Management**: Help distribute traffic during planned closures
-   **Data Integration**: API-first approach enables integration with existing systems

## 🔗 Links & Resources

### 📚 Documentation

-   **[Backend API Documentation](./backend/README.md)** - Comprehensive backend guide
-   **[API Interactive Docs](http://localhost:8000/api/v1/docs)** - Swagger UI (when running)
-   **[OpenLR Specification](https://www.openlr.org/)** - Location referencing standard

### 🌐 Project Resources

-   **[GSoC Project Page](https://summerofcode.withgoogle.com/programs/2025/projects/tF4ccCqZ)** - Official GSoC listing
-   **[OSM Diary Updates](https://www.openstreetmap.org/user/Archit%20Rathod/diary/406815)** - Development blog
-   **[GitHub Repository](https://github.com/Archit1706/temporary-road-closures)** - Source code

### 🏛️ Organizations

-   **[OpenStreetMap Foundation](https://osmfoundation.org/)** - Host organization
-   **[Google Summer of Code](https://summerofcode.withgoogle.com/)** - Program sponsor

## 🤝 Contributing

This project welcomes contributions from the OpenStreetMap community!

### 🛠️ Development Setup

1. **Fork** the repository
2. **Clone** your fork locally
3. **Follow** the backend setup instructions in [`./backend/README.md`](./backend/README.md)
4. **Create** a feature branch: `git checkout -b feature/awesome-feature`
5. **Make** your changes and add tests
6. **Submit** a pull request

### 🐛 Reporting Issues

-   **Bug Reports**: [GitHub Issues](https://github.com/Archit1706/temporary-road-closures/issues)
-   **Feature Requests**: [GitHub Discussions](https://github.com/Archit1706/temporary-road-closures/discussions)
-   **Documentation**: Improvements always welcome!

### 💬 Community

-   **OSM Forum**: [community.openstreetmap.org](https://community.openstreetmap.org/)
-   **OSM Mailing Lists**: [lists.openstreetmap.org](https://lists.openstreetmap.org/)
-   **Developer Contact**: architrathod77@gmail.com

## 👥 Team

### 🎓 Google Summer of Code 2025

-   **🧑‍💻 Student Developer**: **Archit Rathod** ([University of Illinois Chicago](https://www.uic.edu/))

    -   Email: architrathod77@gmail.com
    -   GitHub: [@Archit1706](https://github.com/Archit1706)
    -   LinkedIn: [Archit Rathod](https://www.linkedin.com/in/archit-rathod/)

-   **🧭 Primary Mentor**: **Simon Poole** ([OpenStreetMap Foundation](https://osmfoundation.org/))
-   **🗺️ Secondary Mentor**: **Ian Wagner** ([Stadia Maps](https://stadiamaps.com/))

### 🏛️ Host Organization

**[OpenStreetMap Foundation](https://osmfoundation.org/)**

-   Supporting open geographic data and tools
-   Enabling collaborative mapping worldwide
-   Fostering innovation in location-based services

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0** (AGPL-3.0).

**[View Full License](./LICENSE)**

### 🔓 Open Source Commitment

-   **Free Software**: Always free to use, modify, and distribute
-   **Copyleft**: Modifications must be shared under AGPL-3.0
-   **Network Use**: Server-side modifications must be disclosed
-   **Commercial Use**: Permitted with license compliance

## 🙏 Acknowledgments

### 🌟 Special Thanks

-   **[Google Summer of Code](https://summerofcode.withgoogle.com/)** for funding and program support
-   **[OpenStreetMap Foundation](https://osmfoundation.org/)** for hosting and mentorship
-   **[University of Illinois Chicago](https://www.uic.edu/)** for academic support
-   **[PostGIS Team](https://postgis.net/)** for powerful geospatial database capabilities
-   **[FastAPI Team](https://fastapi.tiangolo.com/)** for the excellent web framework
-   **[TomTom](https://www.tomtom.com/)** for OpenLR specification and reference implementations

### 🌍 Community

-   **OSM Community** for feedback, testing, and real-world validation
-   **OsmAnd Developers** for navigation integration collaboration
-   **OpenLR Working Group** for location referencing standards
-   **Chicago Department of Transportation** for testing data and use cases

## 🚀 Getting Started

Ready to explore the Temporary Road Closures system?

### 🔥 For Developers

1. **[Setup the Backend](./backend/README.md)** - Full development environment
2. **[Explore the API](http://localhost:8000/api/v1/docs)** - Interactive documentation
3. **[Join the Community](https://github.com/Archit1706/temporary-road-closures/discussions)** - Connect with other contributors

### 🗺️ For OSM Community

1. **[Learn About the Project](https://www.openstreetmap.org/user/Archit%20Rathod/diary/406815)** - OSM diary updates
2. **[Test the API](http://localhost:8000/api/v1/docs)** - Try real closure submissions
3. **[Provide Feedback](https://github.com/Archit1706/temporary-road-closures/issues)** - Help shape the future

### 🏢 For Organizations

1. **[Review Integration Examples](./backend/README.md#integration-examples)** - See how to connect your systems
2. **[Understand OpenLR](./backend/README.md#openlr-integration)** - Cross-platform compatibility
3. **[Contact the Team](mailto:arath21@uic.edu)** - Discuss your use case

---

**🌟 Star this repository** if you find it useful for the OpenStreetMap ecosystem!

**📢 Follow development progress** in the [OSM diary](https://www.openstreetmap.org/user/Archit%20Rathod/diary/406815) and [GitHub discussions](https://github.com/Archit1706/temporary-road-closures/discussions).

---

_Building the future of open navigation data, one closure at a time. 🗺️✨_
