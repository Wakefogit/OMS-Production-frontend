import React from 'react';

function ProfileThumbNailImage(props:any) {
    const {
        profileUrl,
        firstName,
        lastName,
        className,
        thumbnailClass,
        border
    } = props;

    const defaultThumbnail = () => {
      let flName = "";
      flName = firstName ? firstName[0]?.toUpperCase() : "";
      return flName;
    } 

    return (
        <>
            {profileUrl != " " ? 
            <div className={className}>
              {/* <HandleErrorImage image={profileUrl}/> */}
            </div>
            :
            <div className={ thumbnailClass ? thumbnailClass :`default-profile-thumbnail ${border && border}`} >
               {defaultThumbnail()}
            </div>} 
        </>
    );
}

export default ProfileThumbNailImage;