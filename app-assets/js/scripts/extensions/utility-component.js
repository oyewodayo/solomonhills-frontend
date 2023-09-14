

$(document).ready(function () {

  function logout(){
    var _params = { 
      _token: $('meta[name="csrf-token"]').attr('content'),

  };  


  fetch('/sign-out', {
      method:"POST",
      credentials:"same-origin",
      headers:{
          "Content-Type":"application/json",
          'X-CSRF-TOKEN':$('meta[name="csrf-token"]').attr('content'),
      },
      body: JSON.stringify(_params)
  })
  .then((response)=>response.json())
  .then(response=>{                        
      window.location.reload();
      // console.log(response);

  })
  .catch((error)=>{
      // console.log(error);
  })
  }

  var elementTimeout = 3000;
  /*
  Handle raised idle/active events
   */
  $('.elStatus').on("idle.idleTimer", function (event, elem, obj) {
    //If you dont stop propagation it will bubble up to document event handler
    event.stopPropagation();

    $('.elStatus').val(function (i, v) {
      
      return v + "Idle @ " + moment().format() + " \n";
    }).removeClass("alert-success").addClass("alert-warning");

  });
  
  $('.elStatus').on("active.idleTimer", function (event) {
    //If you dont stop propagation it will bubble up to document event handler
    event.stopPropagation();

    $('.elStatus')
      .val(function (i, v) {
        return v + "Active @ " + moment().format() + " \n";
      }).addClass("alert-success").removeClass("alert-warning");
  });

  /*
  Handle button events
  */
  $(".btReset").click(function () {
    $('.elStatus')
      .idleTimer("reset")
      .val(function (i, v) {
        return v + "Reset @ " + moment().format() + " \n";
      });

    //Apply classes for default state
    if ($(".elStatus").idleTimer("isIdle")) {
      $(".elStatus").removeClass("alert-success").addClass("alert-warning");
    } else {
      $(".elStatus")
        .addClass("alert-success").removeClass("alert-warning");
    }
    $(this).blur();
    return false;
  });
  $(".btRemaining").click(function () {
    $('.elStatus').val(function (i, v) {
      return v + "Remaining: " + $(".elStatus").idleTimer("getRemainingTime") + " \n";
    });
    $(this).blur();
    return false;
  });
  $(".btLastActive").click(function () {
    $('.elStatus')
      .val(function (i, v) {
        return v + "LastActive: " + $(".elStatus").idleTimer("getLastActiveTime") + " \n";
      });
    $(this).blur();
    return false;
  });
  $(".btState").click(function () {
    $('.elStatus').val(function (i, v) {
      return v + "State: " + ($(".elStatus").idleTimer("isIdle") ? "idle" : "active") + " \n";
    });
    $(this).blur();
    return false;
  });

  //Clear value if there was one cached & start time
  $('.elStatus').val('').idleTimer({
    timeout: elementTimeout,
    timerSyncId: "element-timer-demo"
  });


  // Display the actual timeout on the page
  $('.elTimeout').text(elementTimeout / 1000);

  //    documents script idle timer   //
  // ---------------------------------
  var docTimeout = 180000;

  /*
  Handle raised idle/active events
  */
  $(document).on("idle.idleTimer", function (event, elem, obj) {
    document.querySelector('#from-idle-time').innerHTML  = `${docTimeout/60} minutes`;
    $('#idle-modal').modal('show')
    var idleProgressBarWidth = 100;
    var progression = 0;
    const idleProgress = setInterval(() => {
      // console.log(idleProgressBarWidth);
      if (idleProgressBarWidth <= 0) {
        clearInterval(idleProgress);
      }
      else{
        idleProgressBarWidth -=2
        document.querySelector('#idle-progress-bar').style.width = idleProgressBarWidth +'%';
        
        if (idleProgressBarWidth <= 50) {
          document.querySelector('#idle-progress-bar').parentNode.classList.remove('progress-bar-primary')
          document.querySelector('#idle-progress-bar').parentNode.classList.add('progress-bar-warning') 
        }

        if (idleProgressBarWidth <= 30) {
          document.querySelector('#idle-progress-bar').parentNode.classList.remove('progress-bar-warning')
          document.querySelector('#idle-progress-bar').parentNode.classList.add('progress-bar-danger') 
        }
      }

    }, 200);

    const logoutID = setTimeout(() => {
      $('#idle-modal').modal('hide')
      logout();
    }, 10000);

    document.querySelector('#cancel-time-out').addEventListener('click',()=>{
      // console.log('Idle cleared');
      document.querySelector('#idle-progress-bar').parentNode.classList.remove('progress-bar-warning')
      document.querySelector('#idle-progress-bar').parentNode.classList.remove('progress-bar-danger')
      document.querySelector('#idle-progress-bar').parentNode.classList.add('progress-bar-primary')
      clearTimeout(logoutID);
      clearInterval(idleProgress);
    });

    $(".docStatus")
      .val(function (i, v) {
      
        return v + "Idle @ " + moment().format() + " \n";

      }).removeClass("alert-success").addClass("alert-warning");
  });
  $(document).on("active.idleTimer", function (event, elem, obj, e) {
    $('.docStatus')
      .val(function (i, v) {
        return v + "Active [" + e.type + "] [" + e.target.nodeName + "] @ " + moment().format() + " \n";
      }).addClass("alert-success").removeClass("alert-warning");
  });

  /*
  Handle button events
  */
  $(".btPause").click(function () {
    $(document).idleTimer("pause");
    $('.docStatus').val(function (i, v) {
      return v + "Paused @ " + moment().format() + " \n";
    });
    $(this).blur();
    return false;
  });
  $(".btResume").click(function () {
    $(document).idleTimer("resume");
    $('.docStatus').val(function (i, v) {
      return v + "Resumed @ " + moment().format() + " \n";
    });
    $(this).blur();
    return false;
  });
  $(".btElapsed").click(function () {
    $('.docStatus').val(function (i, v) {
      return v + "Elapsed (since becoming active): " + $(document).idleTimer("getElapsedTime") + " \n";
    });
    $(this).blur();
    return false;
  });
  $(".btDestroy").click(function () {
    $(document).idleTimer("destroy");
    $('.docStatus').val(function (i, v) {
      return v + "Destroyed: @ " + moment().format() + " \n";
    }).removeClass("alert-success").removeClass("alert-warning");
    $(this).blur();
    return false;
  });
  $(".btInit").click(function () {
    // for demo purposes show init with just object
    $(document).idleTimer({ timeout: docTimeout });
    $('.docStatus').val(function (i, v) {
      return v + "Init: @ " + moment().format() + " \n";
    })
      ;

    //Apply classes for default state
    if ($(document).idleTimer("isIdle")) {
      $('.docStatus').removeClass("alert-success").addClass("alert-warning");
    } else {
      $('.docStatus').addClass("alert-success").removeClass("alert-warning");
    }
    $(this).blur();
    return false;
  });

  //Clear old statuses
  $('.docStatus').val('');

  //Start timeout, passing no options
  $(document).idleTimer({
    timeout: docTimeout,
    timerSyncId: "document-timer-demo"
  });

  //For demo purposes, style based on initial state
  if ($(document).idleTimer("isIdle")) {
    $(".docStatus")
      .val(function (i, v) {
        return v + "Initial Idle State @ " + moment().format() + " \n";
      }).removeClass("alert-success").addClass("alert-warning");
  } else {
    $('.docStatus')
      .val(function (i, v) {
        return v + "Initial Active State @ " + moment().format() + " \n";
      }).addClass("alert-success").removeClass("alert-warning");
  }

  // display the actual timeout on the page
  $('.docTimeout').text(docTimeout / 1000);

});
