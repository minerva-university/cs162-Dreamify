import React from "react";

//Flambeau
export default function SignupPage() {
  return <h1>SignupPage!</h1>;
}

// old code for reference below

// import React, { useState, useEffect } from "react";
// import Body from "../components/Body";

// // API
// const backend_api = "/api/parent";

// function SignUpPage() {
//   // Set the title of the page
//   useEffect(() => {
//     document.title = "Dreamify | Sign Up";
//   }, []);

//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const payload = {
//       first_name: firstName,
//       last_name: lastName,
//       password,
//       email,
//     };
//     try {
//       const response = await fetch(backend_api, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         const jsonResponse = await response.json(); // Don't forget to await the json() call
//         console.log("Submission successful", jsonResponse);
//         // Redirect to the login page
//         window.location.href = "/login";
//       } else {
//         // Handle HTTP errors
//         console.error("HTTP Error:", response.statusText);
//       }
//     } catch (error) {
//       // Handle fetch errors
//       console.error("Fetch Error:", error.message);
//     }
//   };

//   return (
//     <Body>
//       <form onSubmit={handleSubmit}>
//         <h2>Sign Up</h2>
//         <div>
//           <input
//             type="text"
//             id="firstname"
//             placeholder="Enter your first name"
//             value={firstName}
//             onChange={(e) => setFirstName(e.target.value)}
//             required
//           />
//           <br />
//           <input
//             type="text"
//             id="lastname"
//             placeholder="Enter your last name"
//             value={lastName}
//             onChange={(e) => setLastName(e.target.value)}
//             required
//           />
//           <br />
//           <input
//             type="text"
//             id="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <br />
//           <input
//             type="password"
//             id="password"
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">Sign Up</button>
//       </form>
//       <div>
//         <p>
//           Already have an account? <a href="/login">Sign in</a>
//         </p>
//       </div>
//     </Body>
//   );
// }

// export default SignUpPage;
