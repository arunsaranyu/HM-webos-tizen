import React, { useCallback, useEffect, useRef, useState } from "react";

import icon_error from "../../../assets/images/icon_error.png";
import { useNavigate } from "react-router-dom";
import {FocusContext,useFocusable} from "@noriginmedia/norigin-spatial-navigation";
import { useDispatch, useSelector } from "react-redux";
import "./Profile.scss";
import plusIcon from "../../../assets/images/icon_createNew.png";
import ProfileImage from "./profileImage.jsx";
import {
  DefaultProfile,
  ProfileList,
  userProfileImage,
  activeprofile,
} from "../../../redux/reducer/profileReducer.jsx";
import avator1 from "../../../assets/images/avatar1.svg"
// import a_avatar_1 from "../../../assets/images/a_avatar_01.png";
// import a_avatar_2 from "../../../assets/images/a_avatar_02.png";
// import a_avatar_3 from "../../../assets/images/a_avatar_03.png";
// import a_avatar_4 from "../../../assets/images/a_avatar_04.png";
// import a_avatar_5 from "../../../assets/images/a_avatar_05.png";
// import k_avatar_1 from "../../../assets/images/k_avatar_01.png";
// import k_avatar_2 from "../../../assets/images/k_avatar_02.png";
// import k_avatar_3 from "../../../assets/images/k_avatar_03.png";
// import k_avatar_4 from "../../../assets/images/k_avatar_04.png";
import { activeIndexSidebar, onWatchHistoryFalse, sidebarDisable } from "../../../redux/reducer/landingReducer.jsx";
import Button from "./button.jsx";
import icon_success from "../../../assets/images/icon_success.png";
import Alert from "../../../helper/Alert.jsx";
import Loader from '../../../helper/Loader.jsx'
import { onClicked } from "../../../redux/reducer/commonReducer.jsx";
import { setErrorMessageStatus } from "../../../redux/reducer/profileReducer.jsx";
import Popup from "../../../helper/Popup.jsx";
import Toast from "../../../helper/Toasty.jsx";
const Profile = () => {
  const { ref, focusKey, focusSelf } = useFocusable({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [alertotp, setalertpopup] = useState(true)
  const focusedindex = useSelector((state) => state?.profile?.focusState);
  const profileListData = useSelector((state) => state?.profile?.listData);
  const appConfigData=useSelector((state)=>state?.common?.appConfig)
  const firstIndex = useSelector((state) => state?.landing?.firstIndex)
  const createprofileStatus=useSelector((state)=>state?.profile?.createProfileToast)
  const activeIndex = useSelector((state) => state?.landing?.activeIndex)

  const b=window.history.length
  // console.log("lllllllllllllllllllllllllllllllllllll",b)
  
  useEffect(() => {
    dispatch(sidebarDisable());
    dispatch(setErrorMessageStatus(false))
    dispatch(ProfileList());
  }, []);
  

  // const errormessage=useSelector((state)=>state?.profile?.errormessage)
  const errormessagestaus=useSelector((state)=>state?.profile?.errorstatus)
  
  const onRowFocus = useCallback(
    ({ y }) => {
      if (!!ref.current) {
        ref.current.scrollTop = y;
      }
    },
    [ref]
  );
  const handleClickFunc = (each, index) => {
 
    dispatch(activeIndexSidebar(firstIndex))
    if (focusedindex !== null && focusedindex === each.id) {
      if (each.Name !== "create-profile") {
        dispatch(activeprofile(each.id))
        // console.log(each.img_src);
        localStorage.setItem("image_url", `${each.img_src}`);
        dispatch(userProfileImage(each.img_src));
        const link ={
          id:each.id,
          navigate:navigate,
          firstIndex:firstIndex
        }
        localStorage.setItem("sidebarProfileName", `${each.Name}`);
        dispatch(DefaultProfile(link))
        dispatch(onWatchHistoryFalse())
        localStorage.setItem("goback",false)
    
      }
      else {
        // console.log("logging", each);
        navigate("/createprofile")}
    } 
    else if(each.Name !== "create-profile"){
        // console.log("logging", each);
        dispatch(activeprofile(each.id))
        // console.log(each.img_src);
        localStorage.setItem("image_url", `${each.img_src}`);
        dispatch(userProfileImage(each.img_src));
        const link={
          id:each.id,
          navigate:navigate,
          firstIndex:firstIndex
          
        }
        dispatch(DefaultProfile(link));
        localStorage.setItem("goback",false)
        localStorage.setItem("sidebarProfileName", `${each.Name}`);
        
    }
    else if(each.Name == "create-profile"){
        // console.log("logging", each);
        navigate("/createprofile")
    }
  };

  const handleButtonClick = (each) => {
    navigate(`${each.To}`);
    
  };

  // const adultPicArray = [
  //   a_avatar_1,
  //   a_avatar_2,
  //   a_avatar_3,
  //   a_avatar_4,
  //   a_avatar_5,
  // ];
  // const kidsPicArray = [k_avatar_1, k_avatar_2, k_avatar_3, k_avatar_4,k_avatar_1];
  const [toastalert , setToastAlert] = useState(false)
  const successSigntoast = useSelector((state) => state?.login);
  const [buttonarray, setButtonArray] = useState([]);
  const presentProfile=useSelector((state)=>state?.profile?.activeprofile)
 
  
  useEffect(() => {
    const handlePopState = () => {
      if (localStorage.getItem("image_url") == null) {
        localStorage.setItem("goback", true);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  

  const moveActiveProfileToFront = () => {
    setButtonArray((prevButtonArray) => {
      const activeProfileIndex = prevButtonArray.findIndex((button) => button.img_src === localStorage.getItem('image_url')
      );
      // console.log("")
      // If active profile is found, move it to the front
      if (activeProfileIndex !== -1) {
        const activeProfile = prevButtonArray[activeProfileIndex];
  
        // If active profile is not already at the front, reorder the array
        if (activeProfileIndex !== 0) {
          const updatedButtonArray = [
            activeProfile,
            ...prevButtonArray.slice(0, activeProfileIndex),
            ...prevButtonArray.slice(activeProfileIndex + 1),
          ];
  
          return updatedButtonArray;
        }
      }
  
      return prevButtonArray;
    });
  };  
  useEffect(() => {
    if (Array.isArray(profileListData) && profileListData.length > 0) {
      const mappedButtonArray = profileListData.map((each, i) => {
        // const imageArray = each.child ? kidsPicArray : adultPicArray;
        const new_data = {
          Name: each.firstname,
          img_src: each.profile_picture==null?avator1: each.profile_picture,
          button_name: "Edit",
          default:each?.default_profile,
          To: `/editprofile/${each.profile_id}`,
          id:each.profile_id,
        };
        return new_data;
      });

      setButtonArray(mappedButtonArray);
      moveActiveProfileToFront()
    }
  }, [profileListData]);

  const buttonData = {
    Name: "create-profile",
    img_src: plusIcon,
    button_name: "Create",
    To: "/createprofile",
  };

  const renderButtons = [...buttonarray];
  if (renderButtons.length < 5) {
    const isPlusIconAdded = renderButtons.some((button) => button.Name === 'create-profile');
    if (!isPlusIconAdded) {
      renderButtons.push(buttonData);
    }
  }
  // console.log("button array", buttonarray);
  const loading=useSelector((state)=>state?.profile?.loading); 
  const firstIndexValue = useSelector((state) => state?.landing?.firstIndex)

  const onSubmit = (confirm) => {
   
    if(confirm==="Go Back"){
        // console.log("confirm")
        dispatch(onClicked(""))
    }
    else if(confirm === "Login"){
      localStorage.removeItem("session_id")
      localStorage.removeItem("image_url")
      localStorage.removeItem("sidebarProfileName")
      dispatch(setErrorMessageStatus(false))
      navigate('/activate')
  }
  else if(confirm === "Continue without login"){
      dispatch(setErrorMessageStatus(false))
      localStorage.removeItem("session_id")
      localStorage.removeItem("image_url")
      localStorage.removeItem("sidebarProfileNam")
      navigate(`/${firstIndexValue}`)
  }
  }
  useEffect(() => {
    focusSelf();
  }, [buttonarray,focusSelf]);
  // console.log(appConfigData?.params_hash2?.config_params?.tv_login_bg_image,"bg url:")
  const editsuccessToast=useSelector((state)=>state?.profile?.editstatus);
  return (
    loading ==true ? <Loader/> :
    <FocusContext.Provider value={focusKey}>
      <div className="backgroundcolor">
        <div
          className="parent-container-login"
          style={{
            backgroundImage: `url(${appConfigData?.params_hash2?.config_params?.tv_login_bg_image})`,
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="background-signin">
            <div className="login-container" style={{ marginTop: "0px" }}>
              <h3></h3>
              <h1 style={{ fontWeight: "bold" }}>Who’s watching?</h1>
              <h2>You can create upto 5 different profiles</h2>

              <div
                className="phonenumber-container"
                style={{ position: "absolute", top: "25%" }}
                ref={ref}
              >
                {renderButtons.map((each, i) => (
                  <div
                  key={each.id || i}
                  className="marginrightclass"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    <ProfileImage
                      index={i}
                      each={each}
                      onFocus={onRowFocus}
                      handleClickFunc={handleClickFunc}
                      onEnterPress={() => handleClickFunc(each, i)}
                    />
                    {focusedindex===each.id && (
                      <div style={{paddingTop: "10%" ,display:'flex',flexDirection:'column',alignItems:'center'}}>
                        {each.Name !== "create-profile" && (
                          <h3
                            id="profileName"
                            style={{
                              paddingTop: "4%",
                              textAlign: "center",
                            }}
                          >
                            {each.Name}
                          </h3>
                        )}

                        <Button
                          each={each}
                          text={each.button_name}
                          onEnter={handleButtonClick}
                          onEnterPress={() => handleButtonClick(each)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {
          successSigntoast?.alertToast && <Alert imgicon={icon_success} text={"Signed in successfully!"} setalertpopup={setalertpopup} from={"home"} backgroundcolor=" #E6FAEB" bordercolor="#3FC063" />
        }
          {createprofileStatus &&
         <Alert imgicon={icon_success} text={"Profile created successfully!"} setalertpopup={setalertpopup} backgroundcolor=" #E6FAEB" bordercolor="#3FC063" />
        }
        { editsuccessToast && 
          <Alert imgicon={icon_success} text={"Profile updated successfully!"} setalertpopup={setalertpopup} backgroundcolor=" #E6FAEB" bordercolor="#3FC063" />
        }
        {
          localStorage.getItem("goback")=="true" && localStorage.getItem("image_url")==null && <Toast imgicon={icon_error} text={`Please select a profile to continue`} backgroundcolor=" #E6EFFA" bordercolor="#076DE3" />
        }

{
            localStorage.getItem("session_id")!=null && localStorage.getItem("session_id")!=undefined && errormessagestaus == true ?
                            <Popup
                                alert=""
                                alertType="Session Alert"
                                heading="Session Expired"
                                Description="You have logged out from your device,please login again to continue."
                                from={"session"}
                                onSubmit={onSubmit}
                            />:""
                        }
      </div>
    </FocusContext.Provider>
  );
};

export default Profile;
