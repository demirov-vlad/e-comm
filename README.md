# SoftStore

SoftStore is an online store that specializes in selling software products. Users can browse, purchase, and download software products seamlessly. The platform is built using modern web technologies to ensure a smooth and efficient user experience.

## Live Demo

Visit the live site: [SoftStore](https://soft-store.vercel.app)

## Tech Stack

- **Next.js**: Framework for server-rendered React applications.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Prisma**: ORM for database management.
- **TypeScript**: Typed superset of JavaScript.
- **Resend**: Service for sending emails, used for order confirmation and history.
- **Supabase**: Database and storage solution.
- **STRIPE**: Payment processing for handling transactions.
- **shadcn UI**: UI component library.
- **Next.js Caching**: Caching strategy for enhanced performance.

## Features

### Admin Features

- **Admin Page**: Access via [soft-store.vercel.app/admin](https://soft-store.vercel.app/admin) (Login: admin | Password: crocodile)
- **Admin Dashboard**: Overview of store metrics and performance.
- **Admin Authentication**: Secure login for admin users.
- **Admin Customers Page**: Manage customer information.
- **Admin Sales Page**: View and manage sales data.

### Customer Features

- **Home Page**:
    - **Most Popular Products Section**: Highlights top-selling products.
    - **Newest Products Section**: Displays recently added products.
- **Products Page**: Browse all available software products.
- **Product Purchase Page**: Detailed view of a product with purchase options.
- **My Orders Page**:
    - Send order history email.
    - Download purchased product from received order history email.

### Email Features

- **Order Confirmation Email**: Sent to customers after a successful purchase.
  (Includes download links with expiration times for security)
- **Order History Email**: Customers can request their order history via email. (Also includes download links)

### Payment Features
- **Stripe Integration**: Secure payment processing.
- **Test Purchasing**: Use card number 4242 4242 4242 4242 with expiration 04/44 and CVV 444 for test transactions.

## Getting Started

To get a local copy of the project up and running, follow these steps:

### Prerequisites

Ensure you have the following installed:

- Node.js
- npm or yarn
- PostgreSQL (for Supabase)
- Stripe account (for payment processing)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/demirov-vlad/soft-store.git
    cd soft-store
    ```

2. Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3. Set up environment variables:

   Create a `.env` file in the root of the project and add your environment variables. Refer to `.env.example` for the required variables.

4. Set up the database:

   Ensure your PostgreSQL server is running and create a new database for the project. Update your `.env` file with your database connection string.

   Run Prisma migrations to set up the database schema:

    ```bash
    npx prisma migrate dev
    ```

5. Set up Stripe:

- Create a Stripe account and get your API keys.
- Add your Stripe API keys to the .env file.

6. Start the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

   The application should now be running on [http://localhost:3000](http://localhost:3000).

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes.
4. Commit your changes with a descriptive message.
5. Push to your fork and submit a pull request.

---
