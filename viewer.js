let token = '';
let tuid = '';

const twitch = window.Twitch.ext;

// create the request options for our Twitch API calls
const requests = {
  
  //get: createRequest('GET', 'query')
};

function createRequest (type, method, content) {
  return {
    type: type,
    url: location.protocol + '//localhost:8081/comment/' + method,
    success: updateBlock,
    error: logError,
    data: { comment: content}
  };
}

function setAuth (token) {
  Object.keys(requests).forEach((req) => {
    twitch.rig.log('Setting auth headers');
    requests[req].headers = { 'Authorization': 'Bearer ' + token };
  });
}

twitch.onContext(function (context) {
  twitch.rig.log(context);
});

twitch.onAuthorized(function (auth) {
  // save our credentials
  token = auth.token;
  tuid = auth.userId;

  // enable the button
  $('#submit_comment').removeAttr('disabled');

  setAuth(token);
  $.ajax(requests.get);
});

function updateBlock (hex) {
  twitch.rig.log('Updating block color');
  $('#color').css('background-color', hex);
}

function logError(_, error, status) {
  twitch.rig.log('EBS request returned '+status+' ('+error+')');
}

function logSuccess(hex, status) {
  twitch.rig.log('EBS request returned '+hex+' ('+status+')');
}

$(function () {
  // when we click the sumbit button
  $('#submit_comment').click(function () {
  if(!token) { return twitch.rig.log('Not authorized'); }
    twitch.rig.log('Requesting a color cycle');
  
    var something = $('#comment_input').val();
    var request = createRequest('POST', 'submit', something );
    request.headers = { 'Authorization': 'Bearer ' + token };
    $.ajax(request).done(function( data ) {
        console.log( "Sample of data:",data );
        $('#lang_response').val(data)
      }
    );
    
  });
});