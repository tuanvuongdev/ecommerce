# E-Commerce API Project

A robust and scalable e-commerce API built with Node.js, Express, and MongoDB, featuring real-time inventory management, user authentication, and message queue integration.

## 🚀 Features

- **User Authentication & Authorization**

  - JWT-based authentication
  - Role-based access control
  - Secure password hashing with bcrypt

- **Product Management**

  - CRUD operations for products
  - Inventory tracking
  - Product categorization

- **Order Processing**

  - Order creation and management
  - Real-time inventory updates
  - Order status tracking

- **Message Queue Integration**

  - RabbitMQ for asynchronous processing
  - Kafka for event streaming
  - Redis for caching and pub/sub

- **Security Features**
  - Input sanitization
  - Helmet for security headers
  - Rate limiting
  - CORS protection

## 🛠️ Tech Stack

- **Backend Framework**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Message Queue**: RabbitMQ, Kafka
- **Caching**: Redis
- **Authentication**: JWT
- **Security**: Helmet, mongo-sanitize
- **Logging**: Morgan
- **Compression**: Compression middleware

## 📦 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis
- RabbitMQ
- Kafka

## 🔧 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/tuanvuongdev/ecommerce.git
   cd ecommerce
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```env
   PORT=3056
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   REDIS_URI=your_redis_uri
   RABBITMQ_URI=your_rabbitmq_uri
   KAFKA_BROKERS=your_kafka_brokers
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── auth/           # Authentication related files
├── configs/        # Configuration files
├── controllers/    # Route controllers
├── core/          # Core business logic
├── dbs/           # Database configurations
├── helpers/       # Helper functions
├── loggers/       # Logging configurations
├── middlewares/   # Custom middlewares
├── models/        # Database models
├── postman/       # API documentation
├── routes/        # API routes
├── services/      # Business services
├── tests/         # Test files
└── utils/         # Utility functions
```

## 🚀 Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with watch mode
- `npm test`: Run tests (to be implemented)

## 🔒 Security

- Input sanitization using mongo-sanitize
- Helmet for security headers
- JWT for secure authentication
- Password hashing with bcrypt
- Rate limiting to prevent abuse

## 📝 API Documentation

API documentation is available in the `src/postman` directory. Import the Postman collection to test the API endpoints.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Tuan Vuong dev - Fullstack developer

## 🙏 Acknowledgments

- Express.js team for the amazing framework
- MongoDB team for the database
- All other open-source contributors
