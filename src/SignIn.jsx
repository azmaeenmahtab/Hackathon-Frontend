import React from 'react';
import { useState } from 'react';
import './SignIn.css';

import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword 
} from "firebase/auth";

import {app, auth} from "./firebase";


function SignIn() {


  const googleProvider = new GoogleAuthProvider();


  const [mail,setMail] = useState("");
  const [password, setPassword] = useState("");
  const [role,setRole] = useState("");

  const handleCreateUser = async ()=>{
    try{
      await createUserWithEmailAndPassword(auth, mail, password);
      setMail("");
      setPassword("");
    }
    catch(error){
      console.log(error);
    }

  }


  const handleLogIn = async ()=>{
    try{
      await signInWithEmailAndPassword(auth, mail, password);
      console.log("Logged in");
      setMail("");
      setPassword("");
    }
    catch(error){
      console.log(error);
    }

  }

  const handleLogInWithGoogle = ()=>{

    signInWithPopup(auth, googleProvider).then(res=>{
      console.log(res); // TAKE A VIEW OF THE RESPONSE TO EXTRACT USER DATA
      console.log("Logged in");
      setMail("");
      setPassword("");
    }).catch(err=>{console.log(err)});


  }


  return (
    <div>
      <div className="input_field_area">
        <input type="text" placeholder="Enter your E-mail" className="email" value={mail} onChange={(e)=>{setMail(e.target.value)}}/>
        <input type="password" placeholder="Enter your Password" className="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
        
        <input type="text" placeholder="Enter your role" className="role" value={role} onChange={(e)=>{setRole(e.target.value)}}/>
        <div className="sign_in_btn" onClick={()=>{ handleLogIn(); }}>Sign In</div>
        <div className="sign_up_text">Don't have an account? <div className="sing_up_button" onClick={()=>{handleCreateUser()}}> Sign Up </div></div>
        
        <div className="sign_in_with_google_btn">
          
          <div className="google_image"></div>
          <div className="sign_in_with_google_btn_text" onClick={()=>{ handleLogInWithGoogle(); }}>Sign In with Google </div>

        </div>
      
      </div>
    </div>
  );
}

export default SignIn;


/*






*/