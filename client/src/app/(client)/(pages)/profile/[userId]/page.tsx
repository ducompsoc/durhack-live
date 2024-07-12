"use client";

import React from "react";
import styled from "styled-components";

import { useHackathon } from "@/app/util/socket";
import Card from "../../components/Card";
import LinkButton from "../../components/LinkButton";

//  REMEMBER: DISABLED LAYOUT.TSX REDIRECTS! (client/pages/layout)

//  The main idea for now is to populate the sample container in the return function with data from the db
//  Not sure if making the container a component is the right move, I'll think about it when populating it with data real-time

function PeopleList({params}:{ //   TODO: connect with db (get request + post request for data + updating attendance)
    params: {userId: string}
}) {
    const hackathon = useHackathon();

    if(hackathon.role === "Admin"){
        console.log("displaying full info");
    }else{
        console.log("displaying partial info");
    }

    return (
        <main className="flex justify-center">

            <Card className="md:w-full lg:w-1/2">
                <div className="grid space-y-6">

                    <div className="grid grid-rows-2 grid-flow-col flex justify-center">
                        <p className="lg:text-4xl md:text-xl break-word">I'm a template hacker {params.userId}</p>
                        <p>Attendance: False</p> 
                    </div>

                    <div className="justify-center break-all">
                        <p>Info 1</p>
                        <p>Info 2</p>
                        <p>Info 3, and so much moreeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee word break works eeeeeeeeeeeeeeeeeee</p>
                    </div>

                    <div className="flex justify-center">
                        <LinkButton className="text-center">Toggle attendance</LinkButton>
                    </div>
                    

                </div>
            </Card>
            
        </main>
    );
}
 
export default PeopleList;