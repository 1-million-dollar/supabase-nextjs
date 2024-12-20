import { createClient } from "@/utils/supabase/client";
import ProfilePhoto from "@/app/ui/profilephoto";
import LoadingScreen from "@/app/ui/loadingscreen";
import { Suspense } from "react";

import EditProfile from "@/app/ui/editprofile";
import SignOut from "@/app/ui/signout";
import { redirect } from "next/navigation";


type Params = Promise<{ user: string }>




export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const user = params.user;
 

    const supabase = createClient()   
    let url: string | null = null
    let fullname, username, bio, createdAt, points, correct, wrong

    const {data, error} = await supabase
      .from('profiles')
      .select('username, full_name, avatar_url, points, correct, wrong, created_at, bio')
      .eq('id', user)

    if (data) {
        username = data[0].username
        fullname = data[0].full_name
        url = data[0].avatar_url
        points = data[0].points
        correct = data[0].correct
        wrong = data[0].wrong
        createdAt = data[0].created_at
        bio = data[0].bio
    }
    if (error) {
        redirect('/error')
    }
    const date = new Date(createdAt);


// Convert to IST using toLocaleString
const options: Intl.DateTimeFormatOptions = {
  timeZone: 'Asia/Kolkata',
  year: 'numeric', // Use "numeric" instead of a string like "2023"
  month: 'long',   // "long" for full month name
  
  
};

const formattedDate = date.toLocaleString('en-IN', options);



    return (
      
      <div>
        <Suspense fallback={<LoadingScreen />}>
          <div className="absolute flex flex-col justify-center items-start w-full md:w-10/12 h-1/2">
            <div className="relative w-full h-1/2 bg-gray-400">

            </div>
            <div className="absolute flex flex-row justify-center items-start bg-transparent w-max z-10 p-5">
              <ProfilePhoto url={url} size={150} />
              
            </div>
            
            <div className="relative w-full h-1/2 bg-gray-200">
              <p className="absolute left-0 p-5 mt-14 font-extrabold text-2xl w-max">{fullname}</p>
              <p className="absolute left-0 p-5 mt-20 text-md font-mono w-max">{username}</p>
              <p className="absolute left-0 p-5 mt-28 text-md font-bold w-full h-full">{bio}</p>
              <p className="absolute left-0 p-5 mt-48 text-lg bg-gray-200 w-full">Joined {formattedDate}</p>
              <EditProfile id={user} />
             
            </div>
            
          </div>
          <div className="absolute flex flex-col justify-center gap-5 items-center w-full md:w-10/12 h-full mt-72">
            <div className="flex flex-row justify-center items-center p-5 w-max font-extrabold text-green-600 bg-green-200 rounded-full text-4xl">
              {points} 
              <p className="text-3xl">&nbsp;Points Earned</p>
            </div>
            <div className="flex flex-col justify-center p-5 w-full md:w-10/12">
              <div className="flex flex-row justify-between p-1 w-full">
                <p className="font-bold text-lg text-green-600">correct</p>
                <p className="font-bold text-lg text-red-600">wrong</p>
              </div>
            
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-green-500 h-4 rounded-full" 
                  style={{ width: `${Math.round((correct / (correct + wrong))*100)}%` }}></div>
              </div>
              <div className="flex flex-row justify-between p-1 w-full">
                <p className="font-bold text-lg text-green-600">{correct}</p>
                <p className="font-bold text-lg text-red-600">{wrong}</p>
              </div>
              <SignOut id={user} />
               
            </div>
          </div>
          
          
        </Suspense>
      </div>
      
    );
  }