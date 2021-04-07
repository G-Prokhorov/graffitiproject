import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams
} from "react-router-dom";

import "./resetStyle.css"
import "./globalStyle.css"
import "./style.css"

import Aboutme from "./AboutMe/Aboutme";
import AboutPainter from "./AboutPainter";
import AddForm from "./AddForm";
import Footer from "./HeadFoot/Footer";
import Header from "./HeadFoot/Header";
import Painters from "./Painters";
import PreLogin from "./PreLogin";
import RegisterPage from "./Register"

export default function App() {
  return (
    <Router>
      <div>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/painter/:id" >
            <Painter />
          </Route>
          <Route path="/addmenu">
            <AddMenu />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <Header animation="true" name="Name" />
      <Aboutme />
      <Painters />
      <Footer />
    </div>

  );
}

function About() {
  return <h2>About</h2>;
}

function Painter() {
  let { id } = useParams();
  console.log(id)
  return (<div>

    <Header />
    <AboutPainter id={id} />
    <Footer />
  </div>)
}

function AddMenu() {
  return (<div>
    <Header animation="false" />
    <AddForm />

  </div>)
}

function Login() {
  return (<div>
    <Header animation="false" />
    <PreLogin />

  </div>)
}

function Register() {
  return (<div>
    <RegisterPage />
  </div>)
}


