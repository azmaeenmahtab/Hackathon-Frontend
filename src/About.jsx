import { useState } from 'react';
import './SignIn.css';

import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword 
} from "firebase/auth";

import {app} from "./firebase.js";




function SignIn(){


  const auth = getAuth(app);


  const handleCreateUser = async ()=>{
    try{
      await createUserWithEmailAndPassword(auth,"hossain.ie@gmail.com", "coding");
      console.log("user Created")
    }
    catch(error){
      console.log(error);
    }

  }

  return (
      <div className="text">
        This is the sign in page

      </div>
  )
}


export default SignIn;
/*

<div className="button" onClick={()=>{ handleCreateUser() }}>Create User</div>
*/
