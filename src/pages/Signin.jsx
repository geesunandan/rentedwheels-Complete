import abstract from '../assets/abstract.jpg';
import wave from '../assets/wave.png'
import avatar from '../assets/avatar.svg'
import unlock from '../assets/unlock.svg'
import { useState } from 'react';
import { useForm } from "react-hook-form";


const Signin = (args) => {
  const [email,setEmail]=useState('')
  const { register, handleSubmit, formState: { errors },watch} = useForm();
  const [password,setPassword]=useState('')
  const [userPresent, setUserPresent]=useState(false)
  const handleChange = (evt, placeholder) => {
    switch (placeholder) {
        case 'email':
            setEmail(evt.target.value);
            break;
        case 'password':
            setPassword(evt.target.value);
            break;
        default: break;
        }
}
async function setuser(usersData){
  var ret=false
  var person={}
  usersData.forEach(element => {
    if(element.emailAddress===email && element.password===password){
      person=element
      ret = true
    }else{
      console.log('No such user')
    }
  });
  return {ret,person}
}

const checkSignIn=async(data,evt)=>{
  evt.preventDefault()
  console.log(email,password,data)
  if(data.email!=='' && data.password!==''){
    const response= await fetch('http://localhost:8080/getUsers',{
      method:'GET'
    })
    const result= await response.json()
    const {ret,person}=await setuser(result)
    console.log(result)
    if(ret){ 
      window.localStorage.setItem('signedIn',userPresent)
      window.localStorage.setItem('email',email)
      window.localStorage.setItem('id',person.id)
      window.dispatchEvent(new Event('storage'))
      args.history.push('/app/home')   
      console.log('user found')   
    }else{
      console.log('No such user')
    }
  }else{
    alert('Fieldnames Incomplete')
  }
}

  return (
    <div className=''>
      

      <div className='w-full h-screen  flex flex-col justify-center items-center lg:grid lg:grid-cols-2'>
        <img className='fixed hidden lg:block inset-0 h-screen object-cover  z-[-1]' src={wave} alt="wave"/>
        <img className='hidden lg:block w-1/2 hover:scale-150 transition-all duration-500 transform mx-auto ' src={unlock} alt="unlock" />

        <div className="w-1/2 h-screen flex flex-col justify-center items-center" >
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-4'>Log In</h1>
          <h2 className='mb-20 text-gray-500 text-sm md:text-lg lg:text-lg'>Don't have an account? <a className='text-[#f9a826]' href='/app/signup'>Signup</a></h2>
          <form id="sign-in-form" onSubmit={handleSubmit(checkSignIn)} className='flex flex-col justify-center items-center'>
            <div className='flex justify-center'>
              <img className='w-md h-[125px] mb-5' src={avatar} alt="avatar"/>
            </div>

            <div class="mb-6 border-b border-[#f9a826]">

              <label class="block text-gray-700 text-sm font-bold mb-2 relative" for="username">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mt-3 absolute text-[#f9a826]" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
                </svg>
              </label>

              <input 
              class=" appearance-none bg-transparent border-none rounded w-full py-2 px-7 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username" 
              type="text" 
              onChange={(evt)=> handleChange(evt,'email')}
              {...register("email",
              {
                required: true,
                pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              })} />
            </div>
            <div className='mb-6'>
              {errors.email && <p className='text-red-500 italic'>Please check the Email</p>}
            </div>
            
            
            <div class="mb-6 border-b border-[#f9a826]">

              <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mt-3 absolute text-[#f9a826]" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clip-rule="evenodd" />
                </svg>
              </label>
              
              <input 
              class=" appearance-none bg-transparent border-none rounded w-full py-2 px-7 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              id="password" 
              onChange={(evt)=> handleChange(evt,'password')}
              type="password" 
              placeholder="****************" 
              {...register("password",
                  { required: true,
                    pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/
                  })}
            />

            </div>
            <div className='mb-6'>
            {errors.password && <p className='text-red-500 italic'>Enter your password</p>}
            </div>

            <div class="flex items-center justify-between relative flex flex-col">
              <button form='sign-in-form' class="bg-[#f9a826] hover:bg-white hover:text-[#f9a826] font-bold w-full  py-2 mr-5 mb-4 rounded-full focus:outline-none focus:shadow-outline border-[#f9a826] text-xl lg:px-20" type="submit">
                Sign In
              </button>
              <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                Forgot Password?
              </a>
            </div>


          </form>
          <p class="text-center text-gray-500 text-xs mt-5">
            &copy;2020 Acme Corp. All rights reserved.
          </p>
        </div>

      </div>
    </div>

  )
}
export default Signin;