import React, { useState } from 'react'

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import mustangy from '../assets/mustangy.png'
import Order from '../components/Order';
import raptor from '../assets/ford-raptor.jpg'
import ConstructionIcon from '@mui/icons-material/Construction';
import SpeedIcon from '@mui/icons-material/Speed';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import { width } from '@mui/system';
import { useEffect } from 'react';
import Khalti from '../components/Khalti/Khalti';
import { useForm } from "react-hook-form";
import Test from './Test';
import {storage, db } from './../utils/firebaseConfig'

const Checkout = ({ location, history }) => {

    const [data, setData] = useState(window.localStorage.getItem('id') || '')
    const [vehicleData, setvehicleData] = useState('')

    const [image, setImage] = useState(null);
    const [viewFile, setViewFile] = useState(null);

    const { register, handleSubmit, formState: { errors }, watch } = useForm();


    const handleImageChange = (e) => {
        e.preventDefault();
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setViewFile(URL.createObjectURL(e.target.files[0]))
            console.log(image)
        }
    }


    {/** 
   disableDates=()=>
   {
    var today, dd, mm, yyyy;
    today= new Date();
    dd=today.getDate()+1;
    mm=today.getMonth()+1;
    yyyy=today.getFullYear();
    return yyyy+"-"+mm+"-"+dd;
   }
   */}

    function date_to_day(begin, end) {
        var date1 = new Date(begin);
        var date2 = new Date(end);

        // To calculate the time difference of two dates
        var Difference_In_Time = date2.getTime() - date1.getTime();

        // To calculate the no. of days between two dates
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        return Difference_In_Days
    }

    useEffect(() => {
        async function getVehicle() {                                                     //restrict to checkout page when search is null
            if (location.search == "") {
                history.push("/app/cars")
            }
            const response = await fetch(`http://localhost:8080/getVehicle/${location.search.slice(4)}`, {
                method: "GET"
            });
            const vehicleData = await response.json();
            setvehicleData(vehicleData)
        }
        getVehicle();
    }, [])

    console.log(location)


    const [phone, setPhone] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [city, setCity] = useState('')
    const [zip, setZip] = useState('')
    const [from, setFrom] = useState('')
    const [till, setTill] = useState('')

    const handleChange = (evt, placeholder) => {
        switch (placeholder) {
            case 'firstName':
                setFirstName(evt.target.value);
                break;
            case 'lastName':
                setLastName(evt.target.value);
                break;
            case 'email':
                setEmail(evt.target.value);
                break;
            case 'phone':
                setPhone(evt.target.value);
                break;
            case 'city':
                setCity(evt.target.value);
                break;
            case 'zip':
                setZip(evt.target.value);
                break;
            case 'from':
                setFrom(evt.target.value);
                break;
            case 'till':
                setTill(evt.target.value);
                break;

        }
    }
    console.log(vehicleData)
    const createBooking = async (data,evt) => {
        evt.preventDefault();
        console.log(data)
        const uploadTask = storage.ref(`images/`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then((async(url) => {
                        const sendData = {
                            vehicle: parseInt(location.search.slice(4)),
                            firstName: firstName,
                            lastName: lastName,
                            mailAddress: url,
                            phNumber: phone,
                            city: city,
                            zipCode: zip,
                            fromDate: from,
                            toDate: till,
                            vname: vehicleData.vehicleName,
                            vprice: parseInt(vehicleData.vehiclePrice) * date_to_day(from, till),
                            vimage: vehicleData.vehicleImage,
                            vnumber: vehicleData.vehicleNumber,
                            booked: true,
                            bookingDeleted: false,
                            
                        }
                        console.log(sendData)
                
                        const response = await fetch('http://localhost:8080/addBooking', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(sendData)

                        })
                        const bookingData = await response.json()
                        if (bookingData.booked) alert("Booking Successful!! Thank you")
                    }))
            }

        );

       

       
    }



    return (
        <div className='mt-12 w-screen h-full'>
            <div className='grid grid-cols-1 lg:grid-cols-2 '>

                <div className=''>
                    <div className='mb-8 text-3xl px-28'>
                        Contact Information
                    </div>
                    <form id="checkout-form" onSubmit={handleSubmit(createBooking)} class="w-full px-28 py-10 shadow-2xl">

                        <div class="flex flex-wrap -mx-3 mb-6">
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0" >
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    First Name
                                </label>
                                <div className='border-b border-[#f9a826]'>
                                    <input onChange={(evt) => handleChange(evt, 'firstName')}
                                        class="border-none w-full"
                                        type="text"
                                        placeholder="Jane"
                                        {...register("firstName",
                                            { required: true })} />
                                </div>
                                <div className='mb-2'>
                                    {errors.firstName && <p className='text-red-500 italic'>Enter the first name</p>}
                                </div>

                            </div>
                            <div class="w-full md:w-1/2 px-3">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
                                    Last Name
                                </label>
                                <div className='border-b border-[#f9a826]'>
                                    <input
                                        onChange={(evt) => handleChange(evt, 'lastName')}
                                        class="border-none w-full"
                                        type="text"
                                        placeholder="Doe"
                                        {...register("lastName",
                                            { required: true })} />
                                </div>
                                <div className='mb-2'>
                                    {errors.lastName && <p className='text-red-500 italic'>Enter the last name</p>}
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-wrap -mx-3 mb-6">
                            <div class="w-full px-3">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                                    Email address
                                </label>
                                <div className='border-b border-[#f9a826]'>
                                    <input
                                        class="border-none w-full"
                                        type="text"
                                        placeholder="mike@email.com"
                                        onChange={(evt) => handleChange(evt, 'email')}
                                        {...register("email",
                                            {
                                                required: true,
                                                pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                                            })} />
                                </div>
                                {errors.email && <p className='text-red-500 italic'>Please check the Email</p>}
                            </div>
                        </div>
                        <div className='flex flex-wrap -mx-3 mb-6'>


                            <div class="w-full px-3">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                                    Phone Number
                                </label>
                                <div className='border-b border-[#f9a826] '>
                                    <PhoneInput
                                        placeholder="Enter phone number"
                                        country='np'
                                        value={phone}
                                        onChange={setPhone}
                                        {...register("phone",
                                            { required: true })}
                                        inputStyle={{
                                            background: "none",
                                            border: "none"

                                        }}
                                    />
                                </div>
                                <div className='mb-2'>
                                    {errors.phoneNumber && <p className='text-red-500 italic'>Enter the phone number</p>}
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-wrap -mx-3 mb-6">
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-city">
                                    City
                                </label>
                                <div className='border-b border-[#f9a826]'>
                                    <input
                                        onChange={(evt) => handleChange(evt, 'city')}
                                        class="border-none w-full"
                                        type="text"
                                        placeholder="Albekerque"
                                        {...register("city",
                                            { required: true })} />
                                </div>
                                <div className='mb-2'>
                                    {errors.city && <p className='text-red-500 italic'>Enter the city</p>}
                                </div>
                            </div>

                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-zip">
                                    Zip
                                </label>
                                <div className='border-b border-[#f9a826]'>
                                    <input onChange={(evt) => handleChange(evt, 'zip')}
                                        class="border-none w-full "
                                        type="text"
                                        placeholder="90210"
                                        {...register("zip",
                                            { required: true })} />
                                </div>
                                <div className='mb-2'>
                                    {errors.zip && <p className='text-red-500 italic'>Enter the zip</p>}
                                </div>

                            </div>

                        </div>

                        <div class="flex flex-wrap -mx-3 mb-6">
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-city">
                                    From:
                                </label>
                                <div className='border-b border-[#f9a826]'>
                                    <input onChange={(evt) => handleChange(evt, 'from')}
                                        class="border-none w-full"
                                        type="date"
                                    />
                                </div>
                            </div>

                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-zip">
                                    TO:
                                </label>
                                <div className='border-b border-[#f9a826]'>
                                    <input onChange={(evt) => handleChange(evt, 'till')}
                                        class="border-none w-full "
                                        type="date" />
                                </div>

                            </div>


                        </div>
                        <div className='flex flex-col mb-6'>
                            <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'> Attach Citizenship </label>
                            <div className='flex flex-row justify-between'>
                                <div>
                                <input type="file" onChange={handleImageChange}></input>
                                {viewFile&&<img src={viewFile}/>}
                                </div>

                            </div>
                        </div>

                        <div className='flex flex-col mb-6'>
                            <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'> Payment Method </label>
                            <div className='flex flex-row justify-between'>
                                <div>
                                    <Khalti price={vehicleData.vehiclePrice} />
                                </div>
                                <div>
                                    <input type='radio' value="Via Cash" />
                                    <label className='ml-2'>Via Cash</label>

                                </div>
                            </div>
                        </div>


                        <div className='my-10 flex justify justify-center'>
                            <button type="submit" form='checkout-form' className='w-full p-3 rounded-2xl bg-[#f9a826] hover:bg-white hover:text-[#f9a826] border-[#f9a826] '>Confirm Booking</button>
                        </div>
                    </form>
                </div>
                <div className='mx-10'>
                    <div className='mb-8 text-3xl px-28'>
                        Order Summary
                    </div>
                    <div className=''>
                        <Order {...vehicleData} days={date_to_day(from, till)} />
                    </div>

                </div>
            </div>

        </div>
    )
}
export default Checkout