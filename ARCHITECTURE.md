# ScriptSync - Architecture Documentation

## Overview
ScriptSync is a production-level Test Case Management System built with Spring Boot backend and vanilla JavaScript frontend. It provides comprehensive test case tracking, automation status monitoring, and dashboard analytics.

## Technology Stack

### Backend
- **Framework**: Spring Boot 2.7.x
- **Language**: Java 17
- **Database**: H2 (In-Memory/File-based)
- **ORM**: Spring Data JPA
- **Build Tool**: Maven
- **Key Dependencies**:
  - Lombok (Code generation)
  - Spring Web (REST APIs)
  - Spring Data JPA (Data persistence)
  - H2 Database (Runtime database)

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Vanilla JS for interactivity
- **External Libraries**:
  - Chart.js 4.4.1 (Dashboard visualizations)
  - SheetJS (xlsx) 0.20.1 (Excel import/export)

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                   │
│              (HTML/CSS/JS - Static Resources)            │
│  - index.html: Main UI structure                        │
│  - styles.css: Styling and layout                       │
│  - app.js: Client-side logic and API calls              │
└─────────────────────────────────────────────────────────┘
                            ↕ REST API (JSON)
┌─────────────────────────────────────────────────────────┐
│                     CONTROLLER LAYER                     │
│              (@RestController, @RequestMapping)          │
│  - TestCaseController                                   │
│  - ModuleController                                     │
│  - SubModuleController                                  │
│  - TestCasePriorityController                          │
│  - AutomationStatusController                          │
│  - AutomatedByController                               │
│  - TagController                                       │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                       │
│                   (@Service, Business Logic)             │
│  - TestCaseService                                      │
│  - ModuleService                                        │
│  - SubModuleService                                     │
│  - TestCasePriorityService                             │
│  - AutomationStatusService                             │
│  - AutomatedByService                                  │
│  - TagService                                          │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                    REPOSITORY LAYER                      │
│              (Spring Data JPA Repositories)              │
│  - TestCaseRepository                                   │
│  - ModuleRepository                                     │
│  - SubModuleRepository                                  │
│  - TestCasePriorityRepository                          │
│  - AutomationStatusRepository                          │
│  - AutomatedByRepository                               │
│  - TagRepository                                       │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                       DATA LAYER                         │
│                  (H2 Database - JPA Entities)            │
│  - TestCase, Module, SubModule, TestCasePriority        │
│  - AutomationStatus, AutomatedBy, Tag                   │
└─────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Model Layer (Domain Entities)
All entities use Lombok annotations (`@Data`, `@Entity`, `@Table`) for boilerplate reduction.

- **Module**: Top-level organization unit
  - Fields: id, name, description
  
- **SubModule**: Second-level organization under Module
  - Fields: id, name, description, module (ManyToOne)
  
- **TestCasePriority**: Priority levels for test cases
  - Fields: id, name, description
  
- **AutomationStatus**: Automation progress tracking
  - Fields: id, name, description
  
- **AutomatedBy**: User/Developer information
  - Fields: id, name
  
- **Tag**: Flexible categorization
  - Fields: id, name
  
- **TestCase**: Core entity with complete test information
  - Fields: id, testCaseId, module, subModule, description, preConditions, testScript, expectedResult, priority, automationStatus, automatedBy, automationComments, clubbedTcId, tags (ManyToMany)

### 2. DTO Layer (Data Transfer Objects)
DTOs separate internal entity representation from API contracts:
- Prevent over-fetching of data
- Avoid circular reference issues in JSON serialization
- Provide clean API contracts

Each entity has a corresponding DTO with similar fields.

### 3. Controller Layer (REST API)
All controllers follow RESTful conventions:
- `GET /{resource}` - List all
- `GET /{resource}/{id}` - Get by ID
- `POST /{resource}` - Create
- `PUT /{resource}/{id}` - Update
- `DELETE /{resource}/{id}` - Delete

Special endpoints:
- `POST /api/testcases/import` - Bulk CSV/Excel import
- `GET /api/testcases/export` - CSV export
- `GET /api/testcases/stats` - Dashboard statistics

### 4. Service Layer (Business Logic)
Services contain business logic and orchestrate repository calls:
- Validation logic
- Entity ↔ DTO conversion
- Duplicate checking
- Complex queries and aggregations

### 5. Repository Layer (Data Access)
Spring Data JPA repositories with custom query methods:
- `findByNameIgnoreCase` - Case-insensitive lookup
- `existsByNameIgnoreCase` - Duplicate checking
- Custom `@Query` annotations for complex queries

### 6. Exception Handling
Global exception handler (`@ControllerAdvice`) provides consistent error responses:
- `ResourceNotFoundException` - 404 responses
- `DuplicateResourceException` - 409 conflict responses
- Generic exception handling - 500 responses

## Database Schema

### Tables
1. **module** (id, name, description)
2. **sub_module** (id, name, description, module_id)
3. **test_case_priority** (id, name, description)
4. **automation_status** (id, name, description)
5. **automated_by** (id, name)
6. **tag** (id, name)
7. **test_case** (id, test_case_id, module_id, sub_module_id, description, pre_conditions, test_script, expected_result, priority_id, automation_status_id, automated_by_id, automation_comments, clubbed_tc_id)
8. **test_case_tags** (test_case_id, tag_id) - Join table for ManyToMany

### Relationships
- TestCase → Module (ManyToOne)
- TestCase → SubModule (ManyToOne)
- TestCase → TestCasePriority (ManyToOne)
- TestCase → AutomationStatus (ManyToOne)
- TestCase → AutomatedBy (ManyToOne)
- TestCase ↔ Tag (ManyToMany)
- SubModule → Module (ManyToOne)

## Frontend Architecture

### Single Page Application (SPA) Pattern
- Tab-based navigation without page reloads
- Dynamic content loading via AJAX
- Modal dialogs for forms

### Key Features
1. **Dashboard**
   - Summary cards with key metrics
   - Chart.js visualizations (pie, bar, horizontal bar charts)
   - Real-time data aggregation

2. **Test Case Management**
   - Searchable/filterable table
   - Column-level search
   - CSV/Excel import with validation
   - CSV export functionality
   - View/Edit/Delete operations

3. **Master Data Management**
   - CRUD operations for all reference data
   - Card-based grid layout
   - Inline editing

### API Communication
- Fetch API for HTTP requests
- JSON data format
- Error handling with user-friendly messages

## Key Design Decisions

### 1. Lombok Usage
- Reduces boilerplate code (getters, setters, constructors)
- `@Data` for DTOs
- `@Entity` with Lombok for entities

### 2. H2 Database
- Zero configuration
- Fast in-memory operations
- File-based persistence option
- Web console for debugging

### 3. Import Validation
- Row-by-row processing
- Collects all errors before failing
- Auto-creates missing reference data
- Default value for empty Automation Status ("Yet to Start")

### 4. Exception Strategy
- Custom exceptions for business rules
- Global exception handler for consistency
- Meaningful HTTP status codes
- Structured error responses

### 5. Frontend Libraries
- Chart.js: Professional charts without heavyweight frameworks
- SheetJS: Robust Excel parsing
- Vanilla JS: No framework lock-in, better performance

## Configuration

### application.properties
```properties
# Database
spring.datasource.url=jdbc:h2:file:./data/scriptsync
spring.jpa.hibernate.ddl-auto=update

# H2 Console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# Server
server.port=8080
```

## Security Considerations
⚠️ **Current Implementation**: Development mode
- H2 console publicly accessible
- No authentication/authorization
- CORS not configured

🔒 **Production Recommendations**:
- Add Spring Security
- Implement JWT authentication
- Secure H2 console or disable it
- Configure CORS policies
- Add input validation/sanitization
- Use HTTPS

## Scalability Considerations

### Current Limitations
- Single server deployment
- In-memory/file-based database
- No caching layer

### Future Enhancements
- Migrate to PostgreSQL/MySQL for production
- Add Redis caching
- Implement pagination for large datasets
- Add async processing for bulk imports
- Add audit logging
- Implement full-text search

## Development Workflow

### Build and Run
```bash
# Build
mvn clean install

# Run
mvn spring-boot:run

# Access
http://localhost:8080
```

### H2 Console Access
```
URL: http://localhost:8080/h2-console
JDBC URL: jdbc:h2:file:./data/scriptsync
Username: sa
Password: (empty)
```

## API Documentation

### Base URL
`http://localhost:8080/api`

### Endpoints Summary
- `/modules` - Module management
- `/submodules` - Sub-module management
- `/priorities` - Priority management
- `/statuses` - Automation status management
- `/users` - User management
- `/tags` - Tag management
- `/testcases` - Test case management
  - `/import` - Bulk import
  - `/export` - CSV export
  - `/stats` - Dashboard statistics

## Testing Strategy
(Not yet implemented)

### Recommended Tests
- Unit tests for service layer
- Integration tests for repositories
- Controller tests with MockMvc
- End-to-end tests with Selenium

## Maintenance and Monitoring

### Logs
Spring Boot default logging to console

### Health Check
Spring Boot Actuator (if enabled)

### Database Backup
H2 file: `./data/scriptsync.mv.db`

## Version History
- v1.0.0 - Initial release with full CRUD and dashboard features

