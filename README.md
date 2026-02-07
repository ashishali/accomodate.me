# accomodate.me 

**Accomodate.me** is a modern, student-focused housing platform designed for Jersey City. It helps students find off-campus housing with ease, featuring an interactive map, detailed listings, and roommate compatibility tools.

<img width="1600" height="867" alt="image" src="https://github.com/user-attachments/assets/aabaeddc-d32d-4786-ad17-0d15361879f7" />



##  Features

###  Authentication & Accounts
- **Unified Login/Sign Up**: Secure-feeling entry with a dedicated glass-morphism login page.
- **Local Persistence**: User sessions and accounts are "saved" locally in the browser, allowing you to log out and back in as different users.
- **Ownership Management**: Users can only edit or delete listings they created.

###  Interactive Map Experience
- **Street-Level Precision**: Integrated with OpenStreetMap to render actual street geometry.
- **Dynamic Filtering**: Filter houses by diet (Vegetarian/Non-Veg), gender preference, and more.
- **"Fly To" Navigation**: Clicking a house on the sidebar smoothly zooms the map to its location.

###  Listing Management
- **Easy Listing Creation**: A streamlined form that auto-fills your user details.
- **Resident Tracking**: Specify the number of current residents to automatically generate "housemate" profiles.
- **Edit & Delete**: Full control over your own listings directly from the sidebar.

###  Modern UI/UX
- **Glassmorphism Design**: A sleek, frosted-glass aesthetic using backdrop filters and semi-transparent gradients.
- **Responsive Layout**: A split-screen design with a scrollable sidebar and a full-size map.

##  Tech Stack

- **Frontend Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Map Integration**: [React Leaflet](https://react-leaflet.js.org/) + [OpenStreetMap](https://www.openstreetmap.org/)
- **Styling**: Standard CSS (with CSS Variables for theming) + [Framer Motion](https://www.framer.com/motion/) for animations.
- **Data Handling**: LocalStorage (simulating a backend database).

##  Getting Started

To run this project locally:

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/accomodate-me.git
    cd accomodate-me
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run the Development Server**
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Visit `http://localhost:5173` to see the app in action!

##  Future Improvements

- [ ] **Real Backend Integration**: Replace LocalStorage with a database (PostgreSQL/MongoDB) and Supabase/Firebase Auth.
- [ ] **Image Uploads**: Allow users to upload real photos of their listings (currently using simulated avatars).
- [ ] **AI Features**: Generative AI for room descriptions or lease analysis.

---

Made with ❤️ for Jersey City Students.
