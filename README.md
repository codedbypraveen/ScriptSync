# 🔧 ScriptSync

**ScriptSync** is a comprehensive Test Case Management System designed to streamline test case organization, automation tracking, and reporting. Built with Spring Boot and modern web technologies, it provides an intuitive interface for managing test cases across multiple modules and functionalities.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7.x-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 📊 Dashboard Analytics
- **Real-time Metrics**: Total test cases, modules, sub-modules, and automation rate
- **Visual Reports**: Interactive charts showing:
  - Automation status distribution
  - Test case priority breakdown
  - Sub-module automation status
  - Sub-module priority distribution
- **Summary Cards**: Quick overview of key metrics

### 📝 Test Case Management
- **Comprehensive Test Cases**: Track all test information including:
  - Test Case ID and Description
  - Module and Sub-Module mapping
  - Pre-conditions and Test Data
  - Test Scripts and Actions
  - Expected Results
  - Priority and Automation Status
  - Automated By and Comments
  - Clubbed Test Case IDs
  - Tags for categorization
- **Advanced Search**: Column-level filtering across all fields
- **Bulk Operations**: Import test cases from CSV/Excel files
- **Export**: Download test cases as CSV
- **View/Edit/Delete**: Full CRUD operations with modal dialogs

### 📦 Master Data Management
- **Modules**: Organize test cases by application modules
- **Sub-Modules**: Break down modules into functional areas
- **Priorities**: Define test case priority levels
- **Automation Status**: Track automation progress
- **Users**: Manage team members (Automated By)
- **Tags**: Flexible categorization system

### 📤 Import/Export
- **Smart Import**: 
  - Support for CSV and Excel (.xlsx, .xls) files
  - Auto-create missing reference data
  - Default value assignment for empty fields
  - Comprehensive validation with error reporting
  - Success/failure summary after import
- **CSV Export**: Download test cases with all fields

## 🚀 Getting Started

### Prerequisites
- **Java 17** or higher
- **Maven 3.6+**
- **Git** (for cloning the repository)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ScriptSync.git
   cd ScriptSync
   ```

2. **Build the project**
   ```bash
   mvn clean install
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

4. **Access the application**
   - Open your browser and navigate to: `http://localhost:8080`
   - H2 Database Console: `http://localhost:8080/h2-console`

### H2 Database Configuration
```
JDBC URL: jdbc:h2:file:./data/scriptsync
Username: sa
Password: (leave empty)
```

## 📁 Project Structure

```
ScriptSync/
├── src/
│   ├── main/
│   │   ├── java/org/example/
│   │   │   ├── Main.java                      # Application entry point
│   │   │   ├── controller/                    # REST API controllers
│   │   │   │   ├── TestCaseController.java
│   │   │   │   ├── ModuleController.java
│   │   │   │   ├── SubModuleController.java
│   │   │   │   ├── TestCasePriorityController.java
│   │   │   │   ├── AutomationStatusController.java
│   │   │   │   ├── AutomatedByController.java
│   │   │   │   └── TagController.java
│   │   │   ├── service/                       # Business logic layer
│   │   │   ├── repository/                    # Data access layer
│   │   │   ├── model/                         # JPA entities
│   │   │   ├── dto/                           # Data transfer objects
│   │   │   └── exception/                     # Custom exceptions
│   │   └── resources/
│   │       ├── application.properties         # App configuration
│   │       └── static/                        # Frontend files
│   │           ├── index.html
│   │           ├── app.js
│   │           └── styles.css
│   └── test/                                  # Test files
├── data/                                      # H2 database files
├── pom.xml                                    # Maven dependencies
├── ARCHITECTURE.md                            # Detailed architecture doc
└── README.md                                  # This file
```

## 🛠️ Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 17 | Programming language |
| Spring Boot | 2.7.x | Application framework |
| Spring Data JPA | - | Data persistence |
| H2 Database | - | In-memory database |
| Lombok | - | Boilerplate code reduction |
| Maven | 3.6+ | Build tool |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| HTML5 | - | Structure |
| CSS3 | - | Styling |
| JavaScript (ES6+) | - | Interactivity |
| Chart.js | 4.4.1 | Dashboard charts |
| SheetJS (xlsx) | 0.20.1 | Excel import/export |

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Endpoints

#### Test Cases
- `GET /testcases` - Get all test cases
- `GET /testcases/{id}` - Get test case by ID
- `POST /testcases` - Create new test case
- `PUT /testcases/{id}` - Update test case
- `DELETE /testcases/{id}` - Delete test case
- `POST /testcases/import` - Bulk import from CSV/Excel
- `GET /testcases/export` - Export to CSV
- `GET /testcases/stats` - Get dashboard statistics

#### Modules
- `GET /modules` - Get all modules
- `GET /modules/{id}` - Get module by ID
- `POST /modules` - Create new module
- `PUT /modules/{id}` - Update module
- `DELETE /modules/{id}` - Delete module

#### Sub-Modules
- `GET /submodules` - Get all sub-modules
- `GET /submodules/{id}` - Get sub-module by ID
- `POST /submodules` - Create new sub-module
- `PUT /submodules/{id}` - Update sub-module
- `DELETE /submodules/{id}` - Delete sub-module

#### Priorities
- `GET /priorities` - Get all priorities
- `GET /priorities/{id}` - Get priority by ID
- `POST /priorities` - Create new priority
- `PUT /priorities/{id}` - Update priority
- `DELETE /priorities/{id}` - Delete priority

#### Automation Statuses
- `GET /statuses` - Get all statuses
- `GET /statuses/{id}` - Get status by ID
- `POST /statuses` - Create new status
- `PUT /statuses/{id}` - Update status
- `DELETE /statuses/{id}` - Delete status

#### Users (Automated By)
- `GET /users` - Get all users
- `GET /users/{id}` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

#### Tags
- `GET /tags` - Get all tags
- `GET /tags/{id}` - Get tag by ID
- `POST /tags` - Create new tag
- `PUT /tags/{id}` - Update tag
- `DELETE /tags/{id}` - Delete tag

## 📥 Import File Format

### CSV/Excel Column Headers
The import file must contain the following columns in this exact order:

1. Testcase ID
2. Module
3. Sub Module/ Functionality
4. Test Case Description
5. Pre-Conditions/Test Data
6. Test Script / Actions
7. Expected Result
8. Test Case Priority
9. Automation Status
10. Automated By
11. Automation Comments
12. Clubbed TC ID
13. Tags

### Import Rules
- **Required Fields**: Testcase ID, Module, Test Case Description, Expected Result
- **Auto-Creation**: Missing modules, sub-modules, priorities, statuses, users, and tags are automatically created
- **Default Values**: Empty Automation Status defaults to "Yet to Start"
- **Tags**: Separate multiple tags with semicolons (;)

### Example CSV
```csv
Testcase ID,Module,Sub Module/ Functionality,Test Case Description,Pre-Conditions/Test Data,Test Script / Actions,Expected Result,Test Case Priority,Automation Status,Automated By,Automation Comments,Clubbed TC ID,Tags
TC001,Login,User Authentication,Verify login with valid credentials,Valid user account,Enter username and password,User successfully logged in,High,Completed,John Doe,Selenium automated,TC002,Smoke;Regression
```

## 🎨 UI Features

### Modern Design
- **Minimalistic Interface**: Clean and professional design
- **Rounded Corners**: Smooth, modern aesthetics
- **Responsive Layout**: Works on different screen sizes
- **Intuitive Navigation**: Tab-based interface for easy access
- **Modal Dialogs**: Non-intrusive forms for data entry

### User Experience
- **Real-time Feedback**: Success and error messages
- **Loading Indicators**: Visual feedback during operations
- **Column Search**: Filter data without leaving the page
- **Wide Tables**: Reduced horizontal scrolling
- **Color-Coded Charts**: Easy visual differentiation

## 🔧 Configuration

### Application Properties
Edit `src/main/resources/application.properties`:

```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:h2:file:./data/scriptsync
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# H2 Console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

## 🧪 Testing

### Manual Testing
1. Start the application
2. Navigate to `http://localhost:8080`
3. Use the H2 console to verify data: `http://localhost:8080/h2-console`

### Future Testing Enhancements
- Unit tests for service layer
- Integration tests for repositories
- Controller tests with MockMvc
- End-to-end tests with Selenium

## 🚀 Deployment

### Development
```bash
mvn spring-boot:run
```

### Production
```bash
# Build JAR
mvn clean package

# Run JAR
java -jar target/ScriptSync-1.0.0.jar
```

### Docker (Future Enhancement)
```dockerfile
# Dockerfile example
FROM openjdk:17-jdk-slim
COPY target/ScriptSync-1.0.0.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

## 🔒 Security Considerations

⚠️ **Important**: This application is designed for development/internal use. For production deployment, consider:

- **Authentication**: Add Spring Security with user authentication
- **Authorization**: Implement role-based access control
- **HTTPS**: Use SSL/TLS certificates
- **Database**: Migrate from H2 to PostgreSQL/MySQL
- **Input Validation**: Enhanced server-side validation
- **CORS**: Configure Cross-Origin Resource Sharing
- **Rate Limiting**: Prevent API abuse
- **Audit Logging**: Track all data changes

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Your Name** - *Initial work*

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- Chart.js for beautiful charts
- SheetJS for Excel processing capabilities
- Lombok project for reducing boilerplate code

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: your.email@example.com

## 🗺️ Roadmap

### Version 1.1 (Planned)
- [ ] User authentication and authorization
- [ ] Advanced filtering and sorting
- [ ] Test execution tracking
- [ ] Attachment support for test cases
- [ ] Email notifications
- [ ] Audit trail

### Version 2.0 (Future)
- [ ] REST API documentation (Swagger/OpenAPI)
- [ ] Test case versioning
- [ ] Integration with test automation frameworks
- [ ] Advanced reporting with PDF export
- [ ] Mobile responsive design
- [ ] Dark mode theme

---

**Made with ❤️ for QA Engineers**

*Last Updated: December 25, 2025*

