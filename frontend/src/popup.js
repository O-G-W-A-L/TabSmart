import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/browser";

import Popup from "./components/Popup";



const root = document.getElementById("root");
ReactDOM.render(<Popup />, root);
