async function generateAccessToken(){
    try{
        const res = await fetch('api/token');
        if(!res.ok){
            console.log("Couldn't get access Token");
            throw error;
        }
        const tokenData = await res.json();
        const accessToken = tokenData.accessToken;
        return accessToken;
    } catch(err){
        console.error("Error generating accessToken");
        window.location.href = '/login';
        return;
    }
};

export { generateAccessToken };