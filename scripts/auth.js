//START SIGN UP USER
    const signupForm = document.querySelector('#signup-form');
    signupForm.addEventListener('submit', (e)=> {
    e.preventDefault();

    //get user info
    const email = signupForm['signup-email'].value; //finds an element with the id of 'signup-email', .value, gets the value of that element
    const password = signupForm['signup-password'].value;

    // console.log(email, password); //confirm & if it works, sign up the user

    //sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred =>{
        // console.log(cred);
        //SAVE USER INFO ON FIRESTORE using user ID as the collection ID
        //eg. Name, bio, etc. USE: .doc(cred.user.uid) to get reference to the user ID who signed up
        return DB.collection('users').doc(cred.user.uid).set({
            //put in the objects such as first name, email, etc. here 
            firstName: signupForm['first-name'].value,
            lastName: signupForm['last-name'].value,
            email: cred.user.email
        })
    }).then(()=>{
        signupForm.reset(); //clear the form
        //Close the modal
        const modal = document.querySelector("#modal-signup");
        M.Modal.getInstance(modal).close();
    })

})
//END AUTHENTICATION FOR SIGNING UP USER

//START LOGIN
const login = document.querySelector("#login-form");
login.addEventListener('submit', (e) => {
    e.preventDefault();
    let email = login["login-email"].value;
    let password = login["login-password"].value;
    auth.signInWithEmailAndPassword(email, password).then((cred) => {
        console.log("user logged-in");
        // console.log(cred);
        const modal = document.querySelector("#modal-login");
        //close login modal
        M.Modal.getInstance(modal).close();
    }).catch(err => { //catch and echo error
        M.toast({html: err.message}); 
    })
})


// START LOGOUT
const logout = document.querySelector("#logout");
logout.addEventListener('click', (e)=> {
    e.preventDefault();
    auth.signOut().then( () => { //the user signing out can be tracked on AUTH STATE CHANGE, wo we don't need to fire anything here
        // console.log('user signed out..')
    })
})

//LISTEN FOR AUTH STATE CHANGE
auth.onAuthStateChanged(user =>{
    if(user){
        M.toast({html: `You're logged in..`});
        console.log(user.email);    
        //GET GUIDES DATA FROM THE DATABASE and Outputting them if user is logged in
        DB.collection('guides').get().then(data => {
            setupGuides(data.docs); //call the setup guide function found in the index.js file
        })

        //Setup UI
        setupUI(user);
    }else {
        console.log('user logged out')
        //Passing in empty array into setupGuides to hide data if user is not logged in
        setupGuides([]);
        setupUI();
        guideList.innerHTML = `<h5 class="center-align">Login to view your guides</h5>`;
    }
})

//DATE FUNCTION TO TRACK EVENTS DATE 
function currentDate(){
    let date = new Date();
    let year = date.getFullYear().toString();
    let month = date.getMonth().toString();
    let day = date.getDay();

    let months = ["Jan","Feb","Mar","Apr","May","Jun","Juy","Aug","Sep","Oct","Nov","Dec"];
    // let days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
    if(day <= 9){
        day = "0" + day;
    }
    day = day.toString();
    //finish setup date template
    const currentDate = `${day}/${months[month]}/${year}`;
    return currentDate;
}

//TIME FUNCTION TO TRACK EVENTS     TIME
function currentTime(){
    let date = new Date();
    let hours = date.getHours();
    let seconds = date.getMinutes();
    let session = ['AM', 'PM'];

    //checks to see if its AM or PM
    if(hours <= 12){
        if(seconds <= 9){
            seconds = "0" + seconds.toString();
         }

         seconds = seconds.toString()+session[0];

    }else{
        seconds =+ seconds.toString()+session[1];
    }
    //finish setup time template
    const currentTime = `${hours}:${seconds}`;
    return currentTime;
}

//CREATE GUIDES
const createGuideForm = document.querySelector("#create-form");
createGuideForm.addEventListener('submit', (e) => {
    e.preventDefault();
        M.toast({html: `Please wait...`}); //processing notice

        DB.collection('guides').add({ //adding content...
        title: createGuideForm['title'].value,
        content: createGuideForm['content'].value,
        Date: currentDate(),
        Time: currentTime()
    }).then( ()=> { //after successfully added below runs
        M.toast({html: `Successfully Added!`});
        
        //close modal
        modal = document.querySelector('#modal-create');
        M.Modal.getInstance(modal).close();
        //reset form
        createGuideForm.reset();
    }).catch(err => {  //if adding failed catch error
        M.toast({html: err.message}); //NOTE: errors are caught last after the .then() method.
    }); 
})