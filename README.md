<div align="center">
    <img src="https://cdn-icons-png.flaticon.com/128/18599/18599300.png" alt="Logo" width="80" height="80">
    <h3>robosocial</h3>
    <p>minimal social media application for sharing images, following your friends and having some fun.</p>
</div>

## Features

✨ Upload images and share your moments with your friends


✨ Engage with friends by liking or commenting on their posts


🔥 Explore and find new people to connect with

## Headshots
<img width="1439" alt="Screenshot 2024-12-22 at 09 20 50" src="https://github.com/user-attachments/assets/20bc84c5-560c-44ce-951e-d7104203cc38" />
<img width="1439" alt="Screenshot 2024-12-22 at 09 21 22" src="https://github.com/user-attachments/assets/1aeb7c93-8651-49f3-9a77-51a0d24f8375" />


## Technologies Used
<img src="https://img.shields.io/badge/react-000000?style=for-the-badge&logo=react&logoColor=blue"/>
<img src="https://img.shields.io/badge/firebase-000000?style=for-the-badge&logo=firebase&logoColor=blue"/>
<img src="https://img.shields.io/badge/tailwind-000000?style=for-the-badge&logo=tailwindcss&logoColor=blue"/>
<img src="https://img.shields.io/badge/node-000000?style=for-the-badge&logo=nodedotjs&logoColor=yellow"/>
<img src="https://img.shields.io/badge/javascript-000000?style=for-the-badge&logo=javascript&logoColor=yellow"/>
<img src="https://img.shields.io/badge/typescript-000000?style=for-the-badge&logo=typescript&logoColor=blue"/>

## Development

To run this project locally, follow these steps:

1. Clone the repository.
   ```bash
   git clone https://github.com/therealrinku/robosocial.git

2. Install the dependencies.
   ```bash
   yarn install
   
3. Setup firebase storage and add firebase config to firebase.js folder


4. Get your postgresql db setup and connection string(I got it from elephantSQL.com) and add it to .env file(name is DB_URL) in backend folder.

5. Create the required db tables by running this inside backend/database folder
   ```bash
   node createTables.js

6. Run the backend from backend folder
   ```bash
   node server.js

6. Run the frontend.
   ```bash
   yarn start
