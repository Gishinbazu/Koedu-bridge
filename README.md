# 🌉 KOEDU Bridge

KOEDU Bridge is a comprehensive digital platform designed to support  
**international students applying to universities in South Korea**.

The platform centralizes the **admission process**, **document management**, and  
**communication between students, agents, and universities**.

KOEDU Bridge는 **외국인 학생들의 한국 대학 입학 과정**을 체계적으로 지원하기 위해 개발된 통합 플랫폼입니다.  
입학 절차, 서류 관리, 학생–에이전트–대학 간 소통을 하나의 시스템에서 제공합니다.

---

## 🧱 Technology Stack | 기술 스택

### Backend
- Node.js
- TypeScript
- Express.js
- **MongoDB (Atlas) — Main Database**
- Mongoose (ODM)
- JWT Authentication

### Frontend
- Expo (React Native)
- Expo Router (File-based routing)
- Android / iOS / Web

---

## 🗄️ Database | 데이터베이스

This project uses **MongoDB as the primary backend database**.

- MongoDB Atlas (Cloud)
- Collections for:
  - Users
  - Applications
  - Universities
  - Programs
  - Documents
  - News / Statistics
- Data modeling with **Mongoose**

본 프로젝트는 **MongoDB를 백엔드 메인 데이터베이스로 사용**합니다.

- MongoDB Atlas (클라우드)
- 주요 컬렉션:
  - 사용자 (Users)
  - 지원서 (Applications)
  - 대학 (Universities)
  - 전공 / 프로그램 (Programs)
  - 제출 서류 (Documents)
  - 공지 / 통계 (News / Statistics)
- **Mongoose ODM** 기반 데이터 모델링

---

## 📁 Project Structure | 프로젝트 구조



Koedu-bridge/
│
├── backend/ # Backend API (Node.js + TypeScript)
│ ├── src/
│ │ ├── server.ts
│ │ ├── routes/
│ │ ├── controllers/
│ │ ├── models/ # MongoDB Schemas (Mongoose)
│ │ └── config/
│ └── package.json
│
├── app/ # Expo Frontend (Expo Router)
│ ├── index.js
│ ├── auth/
│ ├── info/
│ ├── dashboard/
│ │ ├── student/
│ │ └── admin/
│ └── _layout.js
│
├── components/
├── services/ # API clients (non-routed)
├── assets/
├── app.json
├── package.json
└── README.md


---

## ⚙️ Prerequisites | 사전 준비 사항

- Node.js (LTS recommended)
- npm
- MongoDB Atlas account (or local MongoDB)
- Expo CLI
- Expo Go (for mobile testing)

---

## 🚀 Run Backend | 백엔드 실행

```bash
cd ~/Documents/Koedu-bridge
cd backend
npm install
npm run dev
