# Live Demo
https://imdb-clone-vkbl.onrender.com/

---

# Architecture

- **UI:** HTML / CSS  
- **Frontend:** TypeScript  
- **Protocol:** HTTP  
- **Backend:** Go  
- **Database:** PostgreSQL  
- **ORM / Migrations:** Goose + SQLC  

![Architecture Diagram](public/images/imdb-architecture.png)

---


How to Run
-----------

Development Mode:
1. Install Air (for live reloading):
   go install github.com/air-verse/air@latest

2. Run the server:
   air
   or
   go run .


Database Setup:
1. Navigate to the /db-dump-&-populate-script directory.

2. Open the install script and update it with your PostgreSQL connection URL.

3. Run the script to populate the database:
   go run install

