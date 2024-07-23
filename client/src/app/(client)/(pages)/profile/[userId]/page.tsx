"use client";

import React, { use, useEffect } from "react";
// import styled from "styled-components";

import { useHackathon } from "@/app/util/socket";
import Card from "../../components/Card";
import LinkButton from "../../components/LinkButton";

import { useRouter } from "next/navigation";
import { makeLiveApiRequest } from "@/app/util/api";

interface IProfileDetails{
    email: string,
    preferred_name: string,
    role: string,
    age: number,
    phone_number: string,
    university: string,
    graduation_year: number,
    ethnicity: string,
    gender: string,
    checked_in: boolean
}

const profileListing = React.memo(function PeopleList({params}:{ //   TODO: connect with db (get request + post request for data + updating attendance)
    params: {userId: string}
}) {
    const [error, setError] = React.useState<string>();

    const hackathon = useHackathon();
    const [profileDetails, setProfileDetails] = React.useState<IProfileDetails | null>(null);


    useEffect(() =>{
        var apiTarget;
        
        const getProfileData = async()=>{
            if(hackathon.role === "admin"){
                apiTarget = "/users/" + params.userId; //full detail route
            }else{
                apiTarget = "/users/partial/" + params.userId; //partial detail route
            }

            const request = await makeLiveApiRequest(apiTarget, {
                method: "GET"
              });
            
            let profileDataResponse: Response;

            try{
                profileDataResponse = await fetch(request);
                if(profileDataResponse.status != 200){
                    throw new Error();
                }
            }catch(error){
                return setError("Error fetching profile details.");
            }
            const profileDetails = (await profileDataResponse.json()).data;
            setProfileDetails(profileDetails);
        }
        
        if(hackathon.role != null){
            getProfileData();
        }
    }, [hackathon.role]);
    
    if(!profileDetails){
        if(error === undefined){ // If the error value hasn't been updated, it's all good
            return(<div>Fetching profile info...</div>);
        }else{
            return(<div>Error fetching profile info.</div>)
        }
    }

    const AdminInfo=()=>( // Extra content for the full info drop admins get
        <section>
            <p><b>Email:</b> {profileDetails.email}</p>
            <p><b>Phone:</b> {profileDetails.phone_number}</p>
            <p className="mt-3"><b>University:</b> {profileDetails.university}</p>
            <p><b>Graduation year:</b> {profileDetails.graduation_year}</p>
            <p className="mt-3"><b>Ethnicity:</b> {profileDetails.ethnicity}</p>
            <p><b>Gender:</b> {profileDetails.gender}</p>
            <p><b>Age:</b> {profileDetails.age}</p>
        </section>
    );

    function toggleAttendance(){
        console.log("Attendance toggled :3"); // todo - actually implement
    }

    const AttendanceButton=()=>(
        <div className="flex justify-center">
            <LinkButton onClick={toggleAttendance} className="text-center">Toggle attendance</LinkButton>
        </div>
    );

    return (
        <main className="flex justify-center">
            
            <Card className="xs:w-full sm:w-full md:w-3/4 lg:w-1/2">
                <div className="grid space-y-6">

                    <div className="grid grid-rows-2 grid-flow-col flex justify-center">
                        <p className="lg:text-4xl md:text-2xl break-word"><strong>{profileDetails.preferred_name}</strong></p>
                        <p><strong>Attendance:</strong> {profileDetails.checked_in ? 'True' : 'False'}</p> 
                    </div>

                    <div className="ml-8 justify-center break-all">
                        <p><b>Role:</b> {profileDetails.role}</p>
                        {hackathon.role === "admin" && <AdminInfo/>}
                    </div>

                    {hackathon.role === "admin" && <AttendanceButton/>}
                </div>
            </Card>
            
        </main>
    );
});

export default profileListing;