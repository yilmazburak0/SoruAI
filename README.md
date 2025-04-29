# SoruAI - Artificial intelligence supported YKS preparation platform

SoruAI is an artificial intelligence-supported Turkish essay exam platform developed within the scope of a computer engineering graduation project. This project aims to increase the success of students preparing for the Higher Education Institutions Examination (YKS). By providing students with trial exams suitable for the YKS level, it is ensured that the subjects they are deficient in are determined according to the exam results and that they improve in these areas.

The high cost of existing education platforms makes equal access to education difficult. SoruAI aims to solve this problem by providing free, level-appropriate and sufficient content. The platform offers an inclusive structure for students in rural areas and students with special needs with accessibility features such as screen reader compatibility and audio-visual supports.

OpenAI's GPT-4o model was used in content generation, and with the **prompt engineering** method, it was clearly defined from which subject and at what difficulty content would be generated for artificial intelligence. By giving sample questions to the model, realistic YKS essay questions based on subject and level were produced; exam-like test environments were created with these contents.

## 🖼️ Screenshots

### 📍 Exam Start Page  
The user sees this screen before starting an exam. It shows available exams with a "Start" button.  
![Exam Start](screenshots/exam-start.png)

### 📝 Exam Interface  
This is the interface where the user solves multiple-choice questions under time constraints, similar to the TYT format.  
![Exam Screen](screenshots/exam-screen.png)

### 🔍 Exam Review Page  
After submitting an exam, users can review their answers, see correct options, and read detailed explanations.  
![Exam Review](screenshots/exam-review.png)

## 📋 Features

### For Students:
- *Secure User Authentication*: Register and login system with JWT token-based security
- *Interactive Exam Interface*: Take TYT style Turkish language tests
- *Progress Tracking*: View statistics on correct, incorrect, and unattempted questions
- *Detailed Review System*: Review past exam attempts with detailed explanations for each question
- *Responsive Design*: Seamlessly works on desktop and mobile devices

### Technical Features:
- *JWT Authentication*: Secure user authentication system
- *Real-time Feedback*: Immediate feedback while taking exams
- *Local Storage Support*: Save progress on exams in-progress
- *Redux State Management*: Global state management for consistent user experience
- *REST API Integration*: Communication between frontend and backend services

## 🛠 Technology Stack

### Frontend:
- *Next.js*: React framework for building server-side rendered applications
- *Redux*: State management for maintaining global application state
- *CSS Modules*: Component-level styling with CSS modules
- *React Icons*: Icon components
- *Framer Motion*: Animation library for enhanced user experience
- *JWT Handling*: Secure session management
- *Axios*: HTTP client for API requests
- *Cookies*: For authentication token storage

### Backend:
- *Express.js*: Web application framework for Node.js
- *Prisma*: Next-generation ORM for Node.js and TypeScript
- *PostgreSQL*: Relational database
- *JWT*: Authentication mechanism
- *bcrypt*: Password hashing for security
- *CORS*: Cross-Origin Resource Sharing for secure frontend-backend communication

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL database
- npm or yarn package manager

### Installation

#### Frontend Setup

1. Clone the repository:
bash
git clone https://github.com/yilmazburak0/SoruAI.git
cd SoruAI/SoruAI-frontend


2. Install dependencies:
bash
npm install
# or
yarn install


3. Create a .env.local file:

NEXT_PUBLIC_API_URL=http://localhost:5003


4. Run the development server:
bash
npm run dev
# or
yarn dev


The frontend will be available at http://localhost:3000

#### Backend Setup

1. Navigate to the backend directory:
bash
cd ../SoruAI-backend


2. Install dependencies:
bash
npm install
# or
yarn install


3. Create a .env file:

DATABASE_URL="postgresql://username:password@localhost:5432/soruai?schema=public"
JWT_SECRET="your-secret-jwt-key"
PORT=5003


4. Run database migrations:
bash
npx prisma migrate dev


5. Start the backend server:
bash
npm run start
# or
yarn start


The backend API will be available at http://localhost:5003


## 💡 Usage

### Taking an Exam
1. Register or login to your account
2. Browse available exams on the homepage
3. Click "Sınavı Başlat" (Start Exam) to begin
4. Answer questions and navigate through the exam
5. Submit the exam when finished to see your results

### Reviewing Past Exams
1. Login to your account
2. View the list of completed exams on the homepage
3. Click "Sınavı İncele" (Review Exam) on a completed exam
4. View detailed statistics and explanations for each question

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact

yilmazburak1210@gmail.com
