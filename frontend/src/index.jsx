// import React from "react";
// import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";


// ReactDOM.render(
// 	<CssBaseline>
// 		<App />
// 	</CssBaseline>,
// 	document.getElementById("root")
// );
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <CssBaseline>
    <App />
  </CssBaseline>,
)
// ReactDOM.render(
// 	<React.StrictMode>
// 		<CssBaseline>
// 			<App />
// 		</CssBaseline>,
//   </React.StrictMode>

// 	document.getElementById("root")
// );
