import React,{useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import loader from "../assets/loader.gif";
import {ToastContainer, toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setAvatarRoute } from '../utils/APIRoutes';
import {Buffer} from 'buffer';

export default function SetAvatar() {
    const api = "https://api.multiavatar.com";

    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);
    const toastOptions = {
        position:"bottom-right",
        autoClose:8000,
        pauseOnHover:true,
        draggable:true,
        theme:"dark",
    };

    useEffect(( )=>{
        const fetchData = async ( )=>{
            if(!localStorage.getItem("chapapp-user")){
            navigate('/login');
            }
        fetchData();
        }
    },[]);

    const setProfilePicture = async () =>{
        if(selectedAvatar === undefined) {
            toast.error("Choisissez un avatar SVP", toastOptions );
        } else {
            const user = await JSON.parse(localStorage.getItem("chapapp-user"));
            const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
                image: avatars[selectedAvatar],
            });
        if(data.isSet){
            user.isAvatarImageSet = true;
            user.avatarImage = data.image;
            localStorage.setItem("chapapp-user", JSON.stringify(user));
            navigate('/');
        } else {
            toast.error("Une erreur s'est produite. Veuillez réessayer SVP", toastOptions);
        }
        }
    };

    useEffect(() => {
        const setAvatar = async () => {
        const data = [];
        const avatarData = ['410b2411314f3476ca',"f7883755dfbeeae966","0e06b87da8161bfffa","560c905f3c36f7ec89","aaad9cfe1e867446de"]
        const apiKey = 'RoIOzx2jZbdUGf';
        for(let i = 0; i < avatarData.length ; i++){
            const image = await axios.get(
            `${api}/${avatarData[i]}.svg?apikey=${apiKey}`
            ); 
            const buffer = new Buffer(image.data);
            data.push(buffer.toString("base64"));
            
        }
        setAvatars(data);
        setIsLoading(false); 
    }
    setAvatar();
    }, []);

        return(
    <>   
    {
        isLoading ? <Container>
            <img src={loader} alt="loader" className='loader'/>
        </Container> : (
            

        <Container>
            <div className='titleContainer'>
                <h1>Choisissez un avatar pour votre photo de profil</h1>
            </div>
            <div className="avatars">{
                
                    avatars.map((avatar,index) => {
                    
                        return(
                            <div 
                                key={index}
                                className={`avatar ${
                                selectedAvatar === index ? "selected" : ""
                            }`}
                            >
                                <img
                                    src={`data:image/svg+xml;base64,${avatar}`}
                                    alt="avatar"
                                    onClick={() => setSelectedAvatar(index)}
                                />
                                
                            </div>
                    )
                    })
            }
            </div>
            <button className='submitBtn' onClick={setProfilePicture}>Valider comme photo de profil</button>
        </Container>
        )}
        <ToastContainer/>
    </> 
    );
}

const Container = styled.div`
    height:100vh;
    width:100vw;
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction:column;
    gap: 30px;
    background-color:#131324;
    .loader{
        max-line-size:100%;
    }
    .titleContainer{
        h1{
            color: #fff;
        }
    }
    .avatars{
        display: flex;
        gap: 2rem;
        .avatar{
            border: 1px solid transparent;
            padding: 5px;
            border-radius: 5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.5s ease-in-out;
            img{
                height: 100px;
                width: 100px;
            }
        }
        .selected{
            border: 1px solid #4e0eff;
        }
    }
    .submitBtn{
        background-color: #997af0;
        color: #fff;
        padding: 1rem 2rem;
        border : none;
        font-weight: bold;
        cursor: pointer;
        border-radius: 5px;
        font-size: 1rem;
        text-transform: uppercase;
        transition:  0.5s ease-in-out;
        &:hover{
            background-color:#4e0eff;
        }
`;
