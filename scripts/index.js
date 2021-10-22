// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});

//RENDER GUIDES TO THE DOM
//Reference GUIDE LIST
const guideList = document.querySelector('.guides');
//Setup template
const setupGuides =  (data) => {
  let html = '';
  data.forEach(doc => {
    const guide = doc.data();
    const li = `
    <li>
        <div class="collapsible-header grey lighten-4"><h5>${guide.title}</h5></div>
          <div class="collapsible-body white">
            ${guide.content}<br>
            <p>
              <strong>Date created: </strong>${guide.Date}<br><strong>Time: </strong>${guide.Time}
            </p>
         </div>
      </li>
    `;
    html += li;
  });
  guideList.innerHTML = html;
};



//SETUP ACCOUNT DETAILS to display user info
const accountDetails = document.querySelector('.account-details');
//SETUP UI FOR LINKS
const loggedInLinks = document.querySelectorAll('.logged-in');
const loggedOutLinks = document.querySelectorAll('.logged-out');

const setupUI = (user) => {
  if(user){
    //show account info
    DB.collection('users').doc(user.uid).get().then(doc =>{
      const html =`
        <div>Logged in as ${user.email}</div>
        <div>First name: ${doc.data().firstName}</div>
        <div>Lastname: ${doc.data().lastName}</div>
      `;
      accountDetails.innerHTML = html;
    })
    
    //toggle UI links
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  }else{
    //hide account info 
    accountDetails.innerHTML = '';
    //toggle UI links
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }
}