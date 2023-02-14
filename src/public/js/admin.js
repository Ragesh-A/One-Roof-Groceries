let confirmBox = document.getElementById('confirm-wrap');
let validateBtn = document.getElementById('validate-btn');
let deleteConfBtn = document.getElementById('deleteConfBtn');
let submitBtn = document.getElementById('submitBtn');
let confirmBoxCloseBtn = document.getElementById('closeBtn');
let confirmBoxMessage = document.getElementById('confirmBox-alert-message');
let messageWrap = document.getElementById('message-wrap');
let errMessage = document.getElementById('messagevalue')

//MESSAGE WRAPPER
confirmBox.style.display = 'none';
messageWrap.style.display = 'none';

//CRATION OF VALIDATION MESSAGE
validateBtn.onclick = ()=>{
    let formFeild = document.querySelectorAll('.form-feild');
    let messages = [];
    formFeild.forEach(inputs=>{
        console.log(inputs.value);
        if(inputs.value == ''){
            messages.push(inputs.labels[0].innerText);
        }
    })
    // console.log(messages);
    sendMessage(messages);  
}



//DISPLAY MESSAGE  FUNCTION
function sendMessage(messages){
    if (messages != '') {
        console.log(messages[0]);
        messageWrap.style.display = 'block';
        errMessage.innerText = messages[0] + " should not be empty";
    } else {
        messageWrap.style.display = 'none';
        errMessage.innerText = '';
        deleteConfBtn.style.display = 'none';
        submitBtn.style.display = 'block';
        submitBtn.type = 'submit';
        confirmBox.style.display = 'flex';
    }
}

//CONFIRM BOX WRAPPER CLOSE
confirmBoxCloseBtn.onclick = ()=>{
    confirmBox.style.display = 'none';
}